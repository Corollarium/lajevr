<template>
  <div id="underwater" v-on:keyup.32="toggleGuidedTour">
    <canvas id="underwater-3d" touch-action="none" />
    <div id="underwater-debug">
      {{ fps }} fps
    </div>
    <button id="underwater-fullscreen" @click="fullscreen" v-show="!isFullscreen && started" class="button-giant">
      <i18n>Ficar em tela cheia</i18n>
    </button>
    <div id="underwater-instructions" v-show="!started">
      <p>
        <i18n v-if="!isTouch">
          Use a tecla 'W' para nadar para frente e clique e arraste o mouse para girar a direção.
        </i18n>
        <i18n v-else>
          Use os joysticks azul e vermelho para girar e nadar.
        </i18n>
      </p>
      <button id="underwater-start" @click="start" class="button-giant">
        <i18n>Iniciar</i18n>
      </button>
    </div>
    <div id="underwater-hud">
      <div id="underwater-hud-depth">
        <span id="underwater-hud-depth-name"><i18n>Profundidade</i18n></span><br>
        <span id="underwater-hud-depth-ascent" :style="{color: ascentSpeedColor}">{{ ascentSpeedGraph }}</span>
        <span id="underwater-hud-depth-value">{{ depth }}</span>
        <span id="underwater-hud-depth-unit">m</span>
      </div>
      <div id="underwater-hud-time">
        <span id="underwater-hud-time-name"><i18n>Tempo</i18n></span><br>
        <span id="underwater-hud-time-value">{{ parseInt(time/60, 10) }}:{{ parseInt(time%60, 10).toString().padStart(2, '0') }}</span>
      </div>
      <div id="underwater-hud-compass">
        <span id="underwater-hud-compass-name"><i18n>Compasso</i18n></span><br>
        <span id="underwater-hud-compass-value">{{ ((parseInt(orientationDegrees) % 360) + 360) % 360 }}</span>
      </div>
    </div>
    <div id="underwater-settings">
      <font-awesome-icon :icon="['fas', 'camera']" @click="snapshotRequested = true" size="2x" />
      <font-awesome-layers @click="toggleVolume" class="fa-2x">
        <font-awesome-icon :icon="['fas', 'volume-up']" transform="shrink-6" />
        <font-awesome-icon v-show="mute" icon="ban" style="color:Tomato" />
      </font-awesome-layers>
      <font-awesome-layers @click="toggleGuidedTour" class="fa-2x">
        <font-awesome-icon v-show="!playing" :icon="['fas', 'play']" transform="shrink-6" />
        <font-awesome-icon v-show="playing" :icon="['fas', 'pause']" transform="shrink-6" />
      </font-awesome-layers>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import * as GUI from 'babylonjs-gui';
import OceanPostProcess from './OceanPostProcess';
// import * as Materials from 'babylonjs-materials';
import BoidsManager from '@corollarium/babylon-boids';

const underwater_vertex = require('!!raw-loader!./underwater_vertexb.glsl');
const underwater_fragment = require('!!raw-loader!./underwater_fragmentb.glsl');

const causticPluginFragmentDefinitions = require('!!raw-loader!./underwater_fragment_definitions.glsl');
const causticPluginFragmentMainEnd = require('!!raw-loader!./underwater_fragment_main_end.glsl');
const causticPluginVertexDefinitions = require('!!raw-loader!./underwater_vertex_definitions.glsl');
const causticPluginVertexMainEnd = require('!!raw-loader!./underwater_vertex_main_end.glsl');
/* eslint-enable */

/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const v3 = (x, y, z) => new BABYLON.Vector3(x, y, z);

/**
 * Extend from MaterialPluginBase to create your plugin.
 */
class CausticPluginMaterial extends BABYLON.MaterialPluginBase {
  static time = 0.0;

  constructor (material) {
    // last parameter is a priority, which lets you define the order multiple plugins are run.
    super(material, 'Caustic', 200, { 'CAUSTIC': true, 'NORMAL': true });
    // we need to mark the material
    this.markAllAsDirty = material._dirtyCallbacks[BABYLON.Constants.MATERIAL_AllDirtyFlag];
  }

  get isEnabled () {
    return this._isEnabled;
  }

  set isEnabled (enabled) {
    if (this._isEnabled === enabled) {
      return;
    }
    this._isEnabled = enabled;
    this.markAllAsDirty();
    this._enable(this._isEnabled);
  }

  _isEnabled = false;

  prepareDefines (defines, scene, mesh) {
    defines.CAUSTIC = this._isEnabled;
    defines.NORMAL |= this._isEnabled;
  }

  getClassName () {
    return 'CausticPluginMaterial';
  }

  getUniforms () {
    return {
      'ubo': [
        { name: 'time', size: 1, type: 'float' }
      ],
      'fragment':
        `#ifdef CAUSTIC
            uniform float time;
        #endif`
    };
  }

  bindForSubMesh (uniformBuffer, scene, engine, subMesh) {
    if (this._isEnabled) {
      uniformBuffer.updateFloat('time', CausticPluginMaterial.time);
    }
  }

  getCustomCode (shaderType) {
    if (shaderType === 'fragment') {
      // we're adding this specific code at the end of the main() function
      return {
        'CUSTOM_FRAGMENT_DEFINITIONS': causticPluginFragmentDefinitions.default,
        'CUSTOM_FRAGMENT_MAIN_END': causticPluginFragmentMainEnd.default
      };
    } else if (shaderType === 'vertex') {
      // we're adding this specific code at the end of the main() function
      return {
        'CUSTOM_VERTEX_DEFINITIONS': causticPluginVertexDefinitions.default,
        'CUSTOM_VERTEX_MAIN_END': causticPluginVertexMainEnd.default
      };
    }
    // for other shader types we're not doing anything, return null
    return null;
  }
}

class Underwater {
  base = ''; // base url

  // babylon basis
  engine = null;
  scene = null;
  camera = null;
  assetsManager = null;
  sunLight = null;

  oceanPostProcess = null;
  renderTargetCaustic = null;
  causticMaterial = null;
  causticBlackMaterial = null;
  rttMaterials = [];

  rebuildOceanTexture = true;

  audioDiver = null;
  audioOcean = null;

  turtles = [];

  constructor (vueComponent) {
    BABYLON.GUI = GUI;
    const container = document.getElementById('underwater-3d');
    document.onfullscreenchange = (event) => {
      vueComponent.isFullscreen = !!document.fullscreenElement;
    };
    this.base = vueComponent.base;

    /*
      * boot renderer, scene, camera
          */

    // Create the scene space
    this.bootScene(container, vueComponent);
    this.lights();
    this.materials();
    this.composer();

    const promises = [
      this.loadTerrain(), // 38 draw calls
      this.loadMoreiaBarco(), // 4 draw calls
      this.loadDiverBoat(),
      // this.loadDiverBoatBig(),
      // this.loadMantas(),
      this.loadTurtle()
      // this.loadAudio()
    ];
    // const fish = this.loadFlock(
    //   this.base + 'models/', 'salema.glb',
    //   50,
    //   new BABYLON.Vector3(-12.12, -13.2, 27.19),
    //   [{ from: 1, to: 92, name: 'swim' }]
    // );
    // promises.push(fish.promise);
    Promise.all(promises).then(() => {
      console.log('all loaded');
    });

    this.assetsManager.load();

    // this.sceneOptimizer();
    if (vueComponent.$route.query.debug) {
      this.camera.speed = 0.5;
      this.debugUtils();
      BABYLON.Engine.audioEngine.setGlobalVolume(0);
    }
    // this.instrumentation();

    // Register a render loop to repeatedly render the scene
    const startTime = new Date();
    let isUnderwater = false;
    let uiUpdateCounter = 0;
    this.engine.runRenderLoop(() => {
      const endTime = new Date();
      const timeElapsed = (endTime - startTime) / 1000.0; // in s
      const deltaTime = this.engine.getDeltaTime() / 1000.0; // in s

      const isUnderwaterNow = this.camera.position.y <= 0;
      if (isUnderwater !== isUnderwaterNow) {
        isUnderwater = isUnderwaterNow;
      //   if (this.audioDiver) {
      //     this.audioDiver.pause();
      //     if (isUnderwater) {
      //       this.audioDiver.play();
      //     }
      //   }
      //   if (this.audioOcean) {
      //     this.audioOcean.pause();
      //     if (!isUnderwater) {
      //       this.audioOcean.play();
      //     }
      //   }
      }
      if (uiUpdateCounter++ % 8) {
        // update UI. Only every 8 frames to avoid wasting time with Vue
        vueComponent.depth = (isUnderwater ? (-this.camera.position.y).toFixed(1) : 0.0);
        vueComponent.time = timeElapsed;
        vueComponent.ascentSpeed = (this.camera.position.y - this.lastDepth) / deltaTime;
        vueComponent.orientationDegrees = this.camera.rotation.y * 180.0 / Math.PI;
        vueComponent.fps = this.engine.getFps().toFixed();
      }
      this.lastDepth = this.camera.position.y;

      if (vueComponent.$route.query.debug) {
        // inspector
        const t = document.getElementById('inspector-host');
        if (t) {
          t.style.position = 'absolute';
        }
      }
      CausticPluginMaterial.time = timeElapsed;

      // fish.update(deltaTime);

      this.scene.render();

      if (vueComponent.snapshotRequested) {
        vueComponent.snapshotRequested = false;
      }
    });

    // Watch for browser/canvas resize events
    window.addEventListener('resize', () => this.resize());
  }

  async share () {
    const imageData = document.getElementById('underwater-3d').toDataURL();
    const download = () => {
      const a = document.createElement('a');
      const date = new Date().toJSON().slice(0, 19).replaceAll(':', '-');
      a.setAttribute('download', 'LajeDeSantos-' + date + '.png');
      a.setAttribute('href', imageData.replace('image/png', 'application/octet-stream'));
      a.click();
    };
    if (navigator.canShare) {
      const blob = await (await fetch(imageData)).blob();
      const file = new File([blob], 'lajedesantos.png', { type: blob.type });
      const shareData = {
        title: 'Laje de Santos',
        url: 'https://lajedesantos.net',
        files: [file]
      };
      try {
        await navigator.share(shareData);
      } catch (e) {
        download();
      }
    } else {
      download();
    }
  }

  beforeDestroy () {
    // TODO window.removeEventListener('resize', this.resize.bind(this));
    document.onfullscreenchange = null;
    this.engine.stopRenderLoop();
    if (this.audioDiver) {
      this.audioDiver.pause();
      this.audioDiver = null;
    }
    if (this.audioOcean) {
      this.audioOcean.pause();
      this.audioOcean = null;
    }
    this.scene.dispose();
    this.scene = null;
    this.engine = null;
  }

  createPathForAnimation (mesh, curve, frameRate = 60) {
    // Transform the curves into a proper Path3D object and get its orientation information
    const path3d = new BABYLON.Path3D(curve.getPoints());
    const tangents = path3d.getTangents();
    const normals = path3d.getNormals();
    const binormals = path3d.getBinormals();
    const curvePath = path3d.getCurve();

    // Define the position and orientation animations that will be populated
    // according to the Path3D properties
    const posAnim = new BABYLON.Animation('cameraPos', 'position', frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3);
    const posKeys = [];
    const rotAnim = new BABYLON.Animation('cameraRot', 'rotationQuaternion', frameRate, BABYLON.Animation.ANIMATIONTYPE_QUATERNION);
    const rotKeys = [];

    for (let i = 0; i < curvePath.length; i++) {
      const position = curvePath[i];
      const tangent = tangents[i];
      const binormal = binormals[i];

      const rotation = BABYLON.Quaternion.FromLookDirectionRH(tangent, binormal);

      posKeys.push({ frame: i * frameRate, value: position });
      rotKeys.push({ frame: i * frameRate, value: rotation });
    }

    posAnim.setKeys(posKeys);
    rotAnim.setKeys(rotKeys);

    mesh.animations.push(posAnim);
    mesh.animations.push(rotAnim);
    const animReturn = this.scene.beginAnimation(mesh, 0, frameRate * curvePath.length, true);
    console.log(curvePath, posAnim, rotAnim, mesh);
    return animReturn;
  }

  bootScene (container, vueComponent) {
    vueComponent.isTouch = ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0);

    // TODO https://doc.babylonjs.com/how_to/creating_a_custom_loading_screen
    // https://playground.babylonjs.com/#P3XLK9
    // https://forum.babylonjs.com/t/get-progression-of-loading-screen/6820/2
    function CustomLoadingScreen () {
      // init the loader
      this.loadingUIText = 'Mergulho na Laje de Santos';
    }
    CustomLoadingScreen.prototype.displayLoadingUI = function () {
      alert(this.loadingUIText);
    };
    CustomLoadingScreen.prototype.hideLoadingUI = function () {
      alert('Loaded!');
    };

    // Generate the BABYLON 3D engine
    this.engine = new BABYLON.Engine(container, true);
    this.engine.loadingUIText = 'Mergulho na Laje de Santos';
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color3(0, 0, 0);

    // Add a camera to the scene and attach it to the canvas
    const cameraInitPoint = new BABYLON.Vector3(-15.51978616737642, 1.3786253122458585, 29.13296827068854);
    this.camera = new BABYLON.UniversalCamera(
      'Camera',
      cameraInitPoint,
      this.scene
    );

    if (vueComponent.isTouch) {
      /* browser with either Touch Events of Pointer Events  running on touch-capable device */
      // doesn't work well this.camera = new BABYLON.VirtualJoysticksCamera(
      this.joystick();
    } else {
      // DEBUG this.joystick();
    }
    this.camera.applyGravity = false;
    this.camera.speed = 0.05;

    // Set the ellipsoid around the camera (e.g. your player's size)
    this.camera.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);

    // update keys
    this.camera.keysUp.push('w'.charCodeAt(0));
    this.camera.keysUp.push('W'.charCodeAt(0));

    this.scene.onKeyboardObservable.add((kbInfo) => {
      if (BABYLON.Engine.audioEngine.audioContext) {
        BABYLON.Engine.audioEngine.audioContext.resume();
      }
      switch (kbInfo.type) {
      case BABYLON.KeyboardEventTypes.KEYDOWN:
        console.log('KEY DOWN: ', kbInfo.event.key);
        break;
      case BABYLON.KeyboardEventTypes.KEYUP:
        console.log('KEY UP: ', kbInfo.event.keyCode);
        break;
      }
    });

    // near/far
    this.camera.minZ = 0.1;
    this.camera.maxZ = 700.0;
    this.camera.setTarget(new BABYLON.Vector3(-12.89001753167552, 1.708562384403646, 25.710433418293825));
    this.camera.attachControl(container, true);

    // Enable Collisions
    this.scene.collisionsEnabled = true;
    this.camera.checkCollisions = true;

    // avoid clearing the scene to optimize
    this.scene.autoClear = false; // Color buffer
    this.scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously

    this.assetsManager = new BABYLON.AssetsManager(this.scene);
    this.assetsManager.onTaskErrorObservable.add(function (task) {
      console.error('task failed', task.name, task.errorObject.message, task.errorObject.exception);
    });
    this.assetsManager.onTaskSuccessObservable.add(function (task) {
      console.log('task successful', task.name);
    });
    this.assetsManager.onProgress = (remainingCount, totalCount, lastFinishedTask) => {
      this.engine.loadingUIText = 'We are loading the scene. ' + remainingCount + ' out of ' + totalCount + ' items still need to be loaded.';
    };
  }

  sceneOptimizer () {
    const options = BABYLON.SceneOptimizerOptions.HighDegradationAllowed();
    options.optimizations = options.optimizations.filter(e => !e.getDescription().includes('Merging similar meshes'));
    const optimizer = BABYLON.SceneOptimizer.OptimizeAsync(
      this.scene,
      options
    );
  }

  debugUtils () {
    this.scene.debugLayer.show();
  }

  instrumentation () {
    // for this to work you need to enable EXT_disjoint_timer_query_webgl2
    const instrumentation = new BABYLON.EngineInstrumentation(this.engine);
    instrumentation.captureGPUFrameTime = true;
    instrumentation.captureShaderCompilationTime = true;

    let i = 0;
    this.scene.registerBeforeRender(() => {
      if (i % 30 === 0) {
        console.log(
          'current frame time (GPU): ' + (instrumentation.gpuFrameTimeCounter.current * 0.000001).toFixed(2) + 'ms\n' +
      'average frame time (GPU): ' + (instrumentation.gpuFrameTimeCounter.average * 0.000001).toFixed(2) + 'ms\n' +
      'total shader compilation time: ' + (instrumentation.shaderCompilationTimeCounter.total).toFixed(2) + 'ms\n' +
      'average shader compilation time: ' + (instrumentation.shaderCompilationTimeCounter.average).toFixed(2) + 'ms\n' +
      'compiler shaders count: ' + instrumentation.shaderCompilationTimeCounter.count
        );
      }
      i++;
    });
  }

  joystick () {
    const bgCamera = new BABYLON.ArcRotateCamera(
      'BGCamera',
      Math.PI / 2 + Math.PI / 7,
      Math.PI / 2, 100,
      new BABYLON.Vector3(0, 20, 0),
      this.scene
    );
    this.scene.activeCameras = [this.camera, bgCamera];
    bgCamera.layerMask = 0x10000000;

    const adt = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, this.scene);
    adt.layer.layerMask = 0x10000000;

    let xAddPos = 0;
    let yAddPos = 0;
    let xAddRot = 0;
    let yAddRot = 0;
    const sideJoystickOffset = 5;
    const bottomJoystickOffset = -5;
    let translateTransform;

    const leftThumbContainer = makeThumbArea('leftThumb', 2, 'blue', null);
    leftThumbContainer.height = '200px';
    leftThumbContainer.width = '200px';
    leftThumbContainer.isPointerBlocker = true;
    leftThumbContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    leftThumbContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    leftThumbContainer.alpha = 0.4;
    leftThumbContainer.left = sideJoystickOffset;
    leftThumbContainer.top = bottomJoystickOffset;

    const leftInnerThumbContainer = makeThumbArea('leftInnerThumb', 4, 'blue', null);
    leftInnerThumbContainer.height = '80px';
    leftInnerThumbContainer.width = '80px';
    leftInnerThumbContainer.isPointerBlocker = true;
    leftInnerThumbContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    leftInnerThumbContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    const leftPuck = makeThumbArea('leftPuck', 0, 'blue', 'blue');
    leftPuck.height = '60px';
    leftPuck.width = '60px';
    leftPuck.isPointerBlocker = true;
    leftPuck.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    leftPuck.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    leftThumbContainer.onPointerDownObservable.add(function (coordinates) {
      leftPuck.isVisible = true;
      leftPuck.floatLeft = coordinates.x - (leftThumbContainer._currentMeasure.width * 0.5) - sideJoystickOffset;
      leftPuck.left = leftPuck.floatLeft;
      leftPuck.floatTop = adt._canvas.height - coordinates.y - (leftThumbContainer._currentMeasure.height * 0.5) + bottomJoystickOffset;
      leftPuck.top = leftPuck.floatTop * -1;
      leftPuck.isDown = true;
      leftThumbContainer.alpha = 0.9;
    });

    leftThumbContainer.onPointerUpObservable.add(function (coordinates) {
      xAddPos = 0;
      yAddPos = 0;
      leftPuck.isDown = false;
      leftPuck.isVisible = false;
      leftThumbContainer.alpha = 0.4;
    });

    leftThumbContainer.onPointerMoveObservable.add(function (coordinates) {
      if (leftPuck.isDown) {
        xAddPos = coordinates.x - (leftThumbContainer._currentMeasure.width * 0.5) - sideJoystickOffset;
        yAddPos = adt._canvas.height - coordinates.y - (leftThumbContainer._currentMeasure.height * 0.5) + bottomJoystickOffset;
        leftPuck.floatLeft = xAddPos;
        leftPuck.floatTop = yAddPos * -1;
        leftPuck.left = leftPuck.floatLeft;
        leftPuck.top = leftPuck.floatTop;
      }
    });

    adt.addControl(leftThumbContainer);
    leftThumbContainer.addControl(leftInnerThumbContainer);
    leftThumbContainer.addControl(leftPuck);
    leftPuck.isVisible = false;

    const rightThumbContainer = makeThumbArea('rightThumb', 2, 'red', null);
    rightThumbContainer.height = '200px';
    rightThumbContainer.width = '200px';
    rightThumbContainer.isPointerBlocker = true;
    rightThumbContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    rightThumbContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    rightThumbContainer.alpha = 0.4;
    rightThumbContainer.left = -sideJoystickOffset;
    rightThumbContainer.top = bottomJoystickOffset;

    const rightInnerThumbContainer = makeThumbArea('rightInnerThumb', 4, 'red', null);
    rightInnerThumbContainer.height = '80px';
    rightInnerThumbContainer.width = '80px';
    rightInnerThumbContainer.isPointerBlocker = true;
    rightInnerThumbContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    rightInnerThumbContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    const rightPuck = makeThumbArea('rightPuck', 0, 'red', 'red');
    rightPuck.height = '60px';
    rightPuck.width = '60px';
    rightPuck.isPointerBlocker = true;
    rightPuck.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    rightPuck.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    rightThumbContainer.onPointerDownObservable.add(function (coordinates) {
      rightPuck.isVisible = true;
      rightPuck.floatLeft = adt._canvas.width - coordinates.x - (rightThumbContainer._currentMeasure.width * 0.5) - sideJoystickOffset;
      rightPuck.left = rightPuck.floatLeft * -1;
      rightPuck.floatTop = adt._canvas.height - coordinates.y - (rightThumbContainer._currentMeasure.height * 0.5) + bottomJoystickOffset;
      rightPuck.top = rightPuck.floatTop * -1;
      rightPuck.isDown = true;
      rightThumbContainer.alpha = 0.9;
    });

    rightThumbContainer.onPointerUpObservable.add(function (coordinates) {
      xAddRot = 0;
      yAddRot = 0;
      rightPuck.isDown = false;
      rightPuck.isVisible = false;
      rightThumbContainer.alpha = 0.4;
    });

    rightThumbContainer.onPointerMoveObservable.add(function (coordinates) {
      if (rightPuck.isDown) {
        xAddRot = adt._canvas.width - coordinates.x - (rightThumbContainer._currentMeasure.width * 0.5) - sideJoystickOffset;
        yAddRot = adt._canvas.height - coordinates.y - (rightThumbContainer._currentMeasure.height * 0.5) + bottomJoystickOffset;
        rightPuck.floatLeft = xAddRot * -1;
        rightPuck.floatTop = yAddRot * -1;
        rightPuck.left = rightPuck.floatLeft;
        rightPuck.top = rightPuck.floatTop;
      }
    });

    // leftThumbContainer.left = 50;
    adt.addControl(rightThumbContainer);
    rightThumbContainer.addControl(rightInnerThumbContainer);
    rightThumbContainer.addControl(rightPuck);
    rightPuck.isVisible = false;

    // this.camera.attachControl(canvas, true);

    this.scene.registerBeforeRender(() => {
      // translateTransform = BABYLON.Vector3.TransformCoordinates(
      //   new BABYLON.Vector3(xAddPos / 3000, 0, yAddPos / 3000),
      //   BABYLON.Matrix.RotationY(this.camera.rotation.y)
      // );
      // translateTransform = this.camera.cameraDirection.scale(xAddPos / 10.0);
      // this.camera.cameraDirection.addInPlace(translateTransform);
      if (xAddPos >= 0.0) {
        this.camera.position.addInPlace(this.camera.getDirection(BABYLON.Vector3.Forward()).scale(xAddPos / 1000.0));
      }
      this.camera.cameraRotation.y += xAddRot / 25000 * -1;
      this.camera.cameraRotation.x += yAddRot / 25000 * -1;
    });

    function makeThumbArea (name, thickness, color, background, curves) {
      const rect = new BABYLON.GUI.Ellipse();
      rect.name = name;
      rect.thickness = thickness;
      rect.color = color;
      rect.background = background;
      rect.paddingLeft = '0px';
      rect.paddingRight = '0px';
      rect.paddingTop = '0px';
      rect.paddingBottom = '0px';

      return rect;
    }
  }

  resize () {
    if (this.engine) {
      this.engine.resize();
    }
    this.rebuildOceanTexture = true;
  }

  lights () {
    // Add lights to the scene
    const ambientLight = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
    ambientLight.diffuse = BABYLON.Color3.FromHexString('#CCCCCC');
    ambientLight.intensity = 0.4;
    this.sunLight = new BABYLON.DirectionalLight('DirectionalLight', new BABYLON.Vector3(-0.5, -1.0, 0.6).normalize(), this.scene);
    this.sunLight.diffuse = BABYLON.Color3.FromHexString('#FFFFFF');
    this.sunLight.intensity = 0.8;
  }

  materials () {
    BABYLON.RegisterMaterialPlugin('Caustic', (material) => {
      material.caustic = new CausticPluginMaterial(material);
      return material.caustic;
    });
  }

  composer () {
    // composes the actual texture with our underwater shader pass.
    // BABYLON.Effect.ShadersStore.underwaterVertexShader = underwater_vertex.default;
    // BABYLON.Effect.ShadersStore.underwaterFragmentShader = underwater_fragment.default;

    const depthPass = this.scene.enableDepthRenderer();

    // const renderSceneBase = new BABYLON.PassPostProcess('imagePass', 1.0, null, BABYLON.Texture.NEAREST_SAMPLINGMODE, this.engine);
    // renderSceneBase.clearColor = new BABYLON.Color4(0.0, 0.0, 0.0, 0.0);

    // const underwaterPass = new BABYLON.PostProcess(
    //   'Underwater pass',
    //   'underwater',
    //   [
    //     'fogColor',
    //     'cameraMinMaxZ',
    //     'cameraPosition',
    //     'time'
    //   ],
    //   [
    //     'skyTexture',
    //     'depthTexture',
    //     'causticTexture',
    //     'oceanDepthTexture'
    //   ],
    //   1.0,
    //   null, // this.camera,
    //   0,
    //   this.engine
    // );

    const pipeline = new BABYLON.PostProcessRenderPipeline(this.engine, 'pipeline');

    const skyTexture = new BABYLON.Texture(
      this.base + 'textures/half_kloofendal_48d_partly_cloudy_4k.jpg',
      this.scene,
      false,
      true, // invert y
      BABYLON.Texture.NEAREST_NEAREST
    );

    // // create the ocean pp
    const oceanPP = this.loadOceanPP();
    this.oceanPostProcess = oceanPP;

    // // we need to update the depth texture from the ocean pass to mix it with the underwater depth
    // const oceanDepthTexture = null;
    // oceanPP.onApplyObservable.add((effect) => {
    //   // if (this.rebuildOceanTexture) {
    //   //   this.rebuildOceanTexture = false;
    //   //   const rtWrapper = underwaterPass.inputTexture;
    //   //   if (oceanDepthTexture) {
    //   //     oceanDepthTexture.dispose();
    //   //   }
    //   //   oceanDepthTexture = rtWrapper.createDepthStencilTexture(undefined, undefined, this.engine.isStencilEnable);
    //   //   oceanDepthTexture.name = 'underwaterDepthStencil';
    //   // }
    //   this.engine.setDepthBuffer(true);
    //   this.engine.setDepthWrite(true);
    //   this.engine.clear(null, false, true, false);
    // });

    // bind the depth from the ocean
    // underwaterPass.onApplyObservable.add((effect) => {
    //   effect._bindTexture('oceanDepthTexture', oceanDepthTexture);
    // });

    this.oceanPostProcess.skyTexture = skyTexture;

    // bind undertware stuff
    // const startTime = new Date();
    // underwaterPass.onApply = (effect) => {
    //   const endTime = new Date();
    //   const timeDiff = (endTime - startTime) / 1000.0; // in s
    //   effect.setColor3('fogColor', new BABYLON.Color3(0, 0.5, 0.85));
    //   effect.setFloat2('cameraMinMaxZ', this.camera.minZ, this.camera.maxZ);
    //   effect.setFloat('time', timeDiff);
    //   effect.setTexture('depthTexture', depthPass.getDepthMap());
    //   effect.setTexture('skyTexture', skyTexture);
    //   effect.setVector3('cameraPosition', this.camera.position); // scale so water is in meters
    // };

    // make it puuuurtier
    const fxaa = new BABYLON.FxaaPostProcess('fxaa', 1.0, null, null, this.engine);

    const effects = [this.oceanPostProcess, fxaa];
    const renderLayer = new BABYLON.PostProcessRenderEffect(
      this.engine,
      'renderLayer',
      () => { return effects; }
    );

    pipeline.addEffect(renderLayer);
    // pipeline.samples = 4;
    // pipeline.fxaaEnabled = true;
    this.scene.postProcessRenderPipelineManager.addPipeline(pipeline);
    this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline('pipeline', this.camera);
  }

  loadOceanPP () {
    const nearestPOT = x => 2 ** Math.ceil(Math.log(x) / Math.log(2));
    const oceanOptions = {
      width: nearestPOT(this.camera.getEngine().getRenderWidth()),
      height: nearestPOT(this.camera.getEngine().getRenderHeight()),
      light: this.sunLight
    };

    if (oceanOptions.width > 2048) {
      oceanOptions.width = 2048;
    }
    if (oceanOptions.height > 2048) {
      oceanOptions.height = 2048;
    }
    // const t = Math.min(oceanOptions.width, oceanOptions.height);
    // oceanOptions.width = oceanOptions.height = t;
    oceanOptions.isPipeline = true;

    const pp = new OceanPostProcess('myOcean', this.camera, oceanOptions);
    pp.reflectionEnabled = false;
    pp.refractionEnabled = false;
    // pp.autoClear = false;
    pp.worldScale = 0.2;

    return pp;
  }

  /**
   * @return the caustic material
   */
  addToSceneAndCaustic (meshes) {
    meshes.forEach((mesh) => {
      mesh.material.pluginManager.getPlugin('Caustic').isEnabled = true;
    });
  }

  loadTerrain () {
    const p = new Promise((resolve, reject) => {
      // we'll store rock data here to convert it all to an optimized version later.
      const rocks = [];
      const positions = [];
      const rotations = [];
      const scalings = [];
      let bufferMatrices = null;
      let terrainLoaded = false;

      const processRocks = () => {
        if (!bufferMatrices || !terrainLoaded || !rocks.length) {
          return;
        }

        // const box = BABYLON.BoxBuilder.CreateBox('root', { size: 1 });

        // babylon has three modes to clone meshes, SPS, instance and thin instances.
        // all three are implemented below, but they have very different performances.

        // SPS version
        // const SPS = new BABYLON.SolidParticleSystem('rocks', this.scene, { updatable: false });
        // SPS.addShape(rocks[0], positions.length,
        //   { positionFunction: (particle, i) => {
        //     particle.position = positions[i];
        //     particle.rotationQuaternion = rotations[i];
        //     particle.scaling = scalings[i];
        //   } }
        // );
        // const spsMesh = SPS.buildMesh();

        // instance version: much slower.
        // const total = positions.length;
        // for (let i = 0; i < total; i++) {
        //   const particle = rocks[0].createInstance('rock' + i);
        //   particle.isPickable = false;
        //   particle.position = positions[i];
        //   particle.rotationQuaternion = rotations[i];
        //   particle.scaling = scalings[i];
        // }

        // thin instance version
        // const total = positions.length;
        // bufferMatrices = new Float32Array(16 * total);
        // for (let i = 0; i < positions.length; i++) {
        //   const m = BABYLON.Matrix.Compose(
        //     scalings[i],
        //     rotations[i],
        //     positions[i]
        //   );
        //   m.copyToArray(bufferMatrices, i * 16);
        // }
        // to serialize this to base64: BABYLON.EncodeArrayBufferToBase64(bufferMatrices);

        rocks[1].thinInstanceSetBuffer('matrix', bufferMatrices, 16);
        const material = this.addToSceneAndCaustic([rocks[1]]);
        // material.backFaceCulling = false; // cause model seems inverted

        resolve();
      };

      // load the rocks
      this.assetsManager.addMeshTask('rocks', null, this.base + 'models/ilha/', 'rocks.glb').onSuccess = (task) => {
        task.loadedMeshes.forEach((mesh) => {
          if (mesh.name === 'rockLow1' || mesh.name === 'rockLow1.001' || mesh.name === 'rockLow1.002') {
            // store the first rock model.
            mesh.freezeNormals();
            mesh.freezeWorldMatrix();
            if (mesh.material) {
              // mesh.material.freeze();
            }
            rocks.push(mesh);
          }
        });
        processRocks();
      };

      // load the rock positions
      this.assetsManager.addTextFileTask('rocksMatrices', this.base + 'models/ilha/rocks.base64').onSuccess = (task) => {
        bufferMatrices = new Float32Array(BABYLON.DecodeBase64ToBinary(task.text));
        processRocks();
      };

      // load the terrain and rock positions.
      this.assetsManager.addMeshTask('terrain', null, this.base + 'models/ilha/', 'ilha03.glb').onSuccess = (task) => {
        const actualLoaded = []; // these are the meshes actually loaded that will have a shader.

        // get the rocks, man. the rocks.
        for (const mesh of task.loadedMeshes) {
          if (mesh.name.includes('rock')) {
            // store information from rocks
            mesh.computeWorldMatrix();
            positions.push(mesh.getAbsolutePivotPoint());
            rotations.push(mesh.rotationQuaternion);
            scalings.push(mesh.absoluteScaling);
            mesh.dispose();
          } else if (mesh.freezeWorldNormals) {
            mesh.doNotSyncBoundingInfo = true;
            if (mesh.material) {
              mesh.material.freeze();
            }
            mesh.alwaysSelectAsActiveMesh = true;
            mesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;
            mesh.convertToUnIndexedMesh();
            mesh.freezeNormals();
            mesh.freezeWorldMatrix();
            console.log(mesh.name);
            actualLoaded.push(mesh);
            this.sunLight.includedOnlyMeshes.push(mesh);
          } else if (mesh.material) {
            actualLoaded.push(mesh);
          }
        }
        this.addToSceneAndCaustic(actualLoaded);

        // merge everything so we have fewer draw calls
        const terrain = BABYLON.Mesh.MergeMeshes(
          actualLoaded,
          true,
          true,
          undefined,
          false,
          true
        );

        terrainLoaded = true;
        processRocks();
      };
    });
    return p;
  }

  loadMoreiaBarco () {
    const p = new Promise((resolve, reject) => {
      this.assetsManager.addMeshTask('barcoMoreia', null, this.base + 'models/', 'moreia-20210912.glb').onSuccess = (task) => {
        const meshesWithMaterials = [];

        for (const mesh of task.loadedMeshes) {
          mesh.position = new BABYLON.Vector3(-14.12, -17.2, 27.19);
          if (mesh.material) {
            mesh.material.backFaceCulling = false;
            mesh.material.freeze();
            meshesWithMaterials.push(mesh);
          }
          mesh.alwaysSelectAsActiveMesh = true;
          mesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;
          // mesh.convertToUnIndexedMesh();
          mesh.freezeNormals();
          mesh.freezeWorldMatrix();
        }
        this.addToSceneAndCaustic(meshesWithMaterials);

        // merge everything so we have fewer draw calls
        // TODO
        // const terrain = BABYLON.Mesh.MergeMeshes(
        //   task.loadedMeshes,
        //   true,
        //   true,
        //   undefined,
        //   false,
        //   true
        // );

        resolve();
      };
    });
    return p;
  }

  loadTurtle () {
    const p = new Promise((resolve, reject) => {
      let curve = BABYLON.Curve3.CreateCubicBezier(
        v3(-22, -10, 27),
        v3(-20, -12, 31),
        v3(-18, -11, 33),
        v3(-14, -10, 35),
        100
      );
      curve = curve.continue(
        BABYLON.Curve3.CreateCubicBezier(
          v3(-14, -10, 35),
          v3(-12, -11, 33),
          v3(-10, -12, 31),
          v3(-6, -10, 27),
          100
        )
      );
      curve = curve.continue(
        BABYLON.Curve3.CreateCubicBezier(
          v3(-22, -10, 27),
          v3(-20, -12, 31),
          v3(-18, -11, 33),
          v3(-14, -10, 35),
          100
        )
      );

      this.assetsManager.addMeshTask('tartaruga', null, this.base + 'models/tartaruga/', 'tartaruga.glb').onSuccess = (task) => {
        const meshesWithMaterials = [];

        for (const mesh of task.loadedMeshes) {
          mesh.position = new BABYLON.Vector3(-14.12, -12.2, 36.19);
          if (mesh.material) {
            mesh.material.backFaceCulling = false;
            mesh.material.freeze();
            meshesWithMaterials.push(mesh);
          } else {
            // this.turtles.push(mesh);
            this.createPathForAnimation(mesh, curve, 30);
          }
          // mesh.alwaysSelectAsActiveMesh = true;
          // mesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;
        }
        this.addToSceneAndCaustic(meshesWithMaterials);

        resolve();
      };
    });
    return p;
  }

  loadAudio () {
    const p = new Promise((resolve, reject) => {
      const end = () => {
        if (this.audioDiver && this.audioOcean) {
          resolve();
        }
      };
      this.assetsManager.addBinaryFileTask(
        'sound_diver',
        this.base + 'audio/156011__hdvideoguy__scubadiving-01.mp3'
      ).onSuccess = (task) => {
        end();
        this.audioDiver = new BABYLON.Sound(
          'sound_diver',
          task.data,
          this.scene,
          () => {
          },
          {
            autoplay: false,
            loop: true
          });
      };
      this.assetsManager.addBinaryFileTask(
        'sound_ocean',
        this.base + 'audio/435668__byjoshberry__ocean-waves-hitting-bow-of-moving-boat.mp3'
      ).onSuccess = (task) => {
        end();
        this.audioOcean = new BABYLON.Sound(
          'sound_ocean',
          task.data,
          this.scene,
          () => {
            // this.audioOcean.play();
          },
          {
            autoplay: false,
            loop: true
          });
      };
    });
    return p;
  }

  loadDiverBoat () {
    const p = new Promise((resolve, reject) => {
      this.assetsManager.addMeshTask('diver_with_boat', null, this.base + 'models/licensed/', 'diver_with_boat.glb').onSuccess = (task) => {
        for (const mesh of task.loadedMeshes) {
          mesh.position = new BABYLON.Vector3(-14.12, 0.5, 27.19);
          if (mesh.material) {
            mesh.material.freeze();
          }
          mesh.alwaysSelectAsActiveMesh = true;
          // mesh.convertToUnIndexedMesh();
          // mesh.freezeNormals();
        }
        // TODO this.addToSceneAndCaustic([]);
        resolve();
      };
    });
    return p;
  }
  loadDiverBoatBig () {
    const p = new Promise((resolve, reject) => {
      this.assetsManager.addMeshTask('diver_boatBig', null, this.base + 'models/licensed/', 'dive_boat.glb').onSuccess = (task) => {
        const meshes = [];
        for (const mesh of task.loadedMeshes) {
          mesh.position = new BABYLON.Vector3(-12.12, 0.5, 27.19);
          if (mesh.material) {
            meshes.push(mesh);
            mesh.material.freeze();
          }
          // mesh.convertToUnIndexedMesh();
          // mesh.freezeNormals();
        }
        // TODO this.addToSceneAndCaustic([]);
        const terrain = BABYLON.Mesh.MergeMeshes(
          meshes,
          true,
          true,
          undefined,
          false,
          true
        );
        console.log(terrain);

        resolve();
      };
    });
    return p;
  }

  buildTourCurve () {
    let curve = BABYLON.Curve3.CreateCubicBezier(
      v3(-14.000991821289062, 0.6453587412834167, 32.9548454284668),
      v3(-13.996827125549316, 0.6453587412834167, 32.94095993041992),
      v3(-14.024413108825684, 0.6463698744773865, 32.55100631713867),
      v3(-14.265217781066895, 0.6528319716453552, 32.1165657043457),
      4 // Quanto mais segmentos na seção da curva, mais devagar a câmera vai! Podemos pensar nisso como um slow factor! Includive para subidas
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-14.265217781066895, 0.6528319716453552, 32.1165657043457),
        v3(-14.617867469787598, 0.6622954607009888, 31.480342864990234),
        v3(-14.765084266662598, 0.6118729710578918, 31.246652603149414),
        v3(-15.396888732910156, 0.5504350662231445, 31.071901321411133),
        4
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-15.396888732910156, 0.5504350662231445, 31.071901321411133),
        v3(-16.004499435424805, 0.4913497865200043, 30.903841018676758),
        v3(-16.786575317382812, 0.5353935956954956, 30.909061431884766),
        v3(-17.072134017944336, 0.5112030506134033, 30.874895095825195),
        4
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-17.072134017944336, 0.5112030506134033, 30.874895095825195),
        v3(-17.640342712402344, 0.4630683660507202, 30.806909561157227),
        v3(-20.581701278686523, -0.36765825748443604, 31.248517990112305),
        v3(-20.732559204101562, -0.40358734130859375, 31.30042266845703),
        4
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-20.732559204101562, -0.40358734130859375, 31.30042266845703),
        v3(-23.112300872802734, -0.970358669757843, 32.119205474853516),
        v3(-24.61052703857422, -4.0646443367004395, 31.9935359954834),
        v3(-25.339210510253906, -4.999363899230957, 32.78083801269531),
        4
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-25.339210510253906, -4.999363899230957, 32.78083801269531),
        v3(-25.860973358154297, -5.668655872344971, 33.344573974609375),
        v3(-24.575355529785156, -6.108067035675049, 35.16100311279297),
        v3(-24.41375160217285, -8.274001121520996, 35.58077621459961),
        6
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-24.41375160217285, -8.274001121520996, 35.58077621459961),
        v3(-24.252147674560547, -10.439936637878418, 36.00054931640625),
        v3(-25.726940155029297, -14.756924629211426, 36.709232330322266),
        v3(-26.364717483520508, -15.673060417175293, 37.3773193359375),
        6
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-26.364717483520508, -15.673060417175293, 37.3773193359375),
        v3(-27.2867431640625, -16.99750518798828, 38.343162536621094),
        v3(-32.11470413208008, -25.681474685668945, 40.03419876098633),
        v3(-32.840545654296875, -25.81487464904785, 43.99205780029297),
        8
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-32.840545654296875, -25.81487464904785, 43.99205780029297),
        v3(-33.69413375854492, -25.971752166748047, 48.64649963378906),
        v3(-25.505264282226562, -28.817989349365234, 45.23334884643555),
        v3(-24.048566818237305, -28.723888397216797, 47.562076568603516),
        8
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-24.048566818237305, -28.723888397216797, 47.562076568603516),
        v3(-22.541715621948242, -28.62654685974121, 49.97098159790039),
        v3(-19.124666213989258, -28.628828048706055, 49.72084045410156),
        v3(-15.405399322509766, -28.868043899536133, 51.464935302734375),
        10
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-15.405399322509766, -28.868043899536133, 51.464935302734375),
        v3(-12.045440673828125, -29.084150314331055, 53.0405387878418),
        v3(4.215830326080322, -27.14112663269043, 53.838706970214844),
        v3(9.77834415435791, -27.14112663269043, 53.75956344604492),
        10
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(9.77834415435791, -27.14112663269043, 53.75956344604492),
        v3(12.347976684570312, -27.14112663269043, 53.72300338745117),
        v3(30.79064178466797, -28.774911880493164, 53.15131759643555),
        v3(31.68185043334961, -28.626670837402344, 52.570987701416016),
        15
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(31.68185043334961, -28.626670837402344, 52.570987701416016),
        v3(34.28955841064453, -28.192913055419922, 50.8729248046875),
        v3(29.658910751342773, -26.974706649780273, 48.50830841064453),
        v3(29.137771606445312, -26.5289363861084, 48.273380279541016),
        15
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(29.137771606445312, -26.5289363861084, 48.273380279541016),
        v3(28.745380401611328, -26.193294525146484, 48.096492767333984),
        v3(28.064945220947266, -25.306177139282227, 47.872650146484375),
        v3(27.440235137939453, -24.779478073120117, 47.675201416015625),
        10
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(27.440235137939453, -24.779478073120117, 47.675201416015625),
        v3(26.54833984375, -24.02751350402832, 47.393306732177734),
        v3(26.44908905029297, -22.66607666015625, 46.15645980834961),
        v3(26.104351043701172, -22.66607666015625, 46.3248291015625),
        10
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(26.104351043701172, -22.66607666015625, 46.3248291015625),
        v3(26.066211700439453, -22.66607666015625, 46.34345626831055),
        v3(25.283355712890625, -22.67770767211914, 46.29490661621094),
        v3(25.114757537841797, -22.66607666015625, 46.28840255737305),
        20
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(25.114757537841797, -22.66607666015625, 46.28840255737305),
        v3(24.792388916015625, -22.643836975097656, 46.27596664428711),
        v3(23.872879028320312, -22.228286743164062, 46.019039154052734),
        v3(23.721302032470703, -22.15073585510254, 45.969688415527344),
        20
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(23.721302032470703, -22.15073585510254, 45.969688415527344),
        v3(22.95633888244629, -21.75935935974121, 45.72063064575195),
        v3(22.93798065185547, -22.115009307861328, 44.16796875),
        v3(22.168357849121094, -20.28685188293457, 43.035552978515625),
        15
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(22.168357849121094, -20.28685188293457, 43.035552978515625),
        v3(21.9759521484375, -19.82981300354004, 42.75244903564453),
        v3(20.305618286132812, -20.480005264282227, 37.246124267578125),
        v3(18.85028076171875, -19.58658790588379, 37.20133590698242),
        20
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(18.85028076171875, -19.58658790588379, 37.20133590698242),
        v3(16.757570266723633, -18.30189323425293, 37.136932373046875),
        v3(20.364774703979492, -17.114723205566406, 49.18492126464844),
        v3(17.739166259765625, -16.1865177154541, 48.94398498535156),
        20
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(17.739166259765625, -16.1865177154541, 48.94398498535156),
        v3(17.131275177001953, -15.9716157913208, 48.88820266723633),
        v3(14.02699089050293, -18.021066665649414, 48.070560455322266),
        v3(13.422525405883789, -19.70728302001953, 49.17836380004883),
        20
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(13.422525405883789, -19.70728302001953, 49.17836380004883),
        v3(13.120292663574219, -20.550390243530273, 49.73226547241211),
        v3(10.701026916503906, -21.753780364990234, 49.46256637573242),
        v3(8.721243858337402, -22.338668823242188, 49.76333236694336),
        15
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(8.721243858337402, -22.338668823242188, 49.76333236694336),
        v3(7.731352806091309, -22.631113052368164, 49.91371536254883),
        v3(1.3360390663146973, -21.31017303466797, 44.07411193847656),
        v3(0.5718628168106079, -20.27959632873535, 42.86423873901367),
        15
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(0.5718628168106079, -20.27959632873535, 42.86423873901367),
        v3(0.18977373838424683, -19.764307022094727, 42.259300231933594),
        v3(-0.4998084306716919, -18.97073745727539, 40.472694396972656),
        v3(-1.0938702821731567, -18.305986404418945, 38.83732223510742),
        20
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-1.0938702821731567, -18.305986404418945, 38.83732223510742),
        v3(-1.3909004926681519, -17.97361183166504, 38.01963806152344),
        v3(-2.141352891921997, -15.85184383392334, 34.22507095336914),
        v3(-2.4543118476867676, -15.389281272888184, 33.27366638183594),
        20
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-2.4543118476867676, -15.389281272888184, 33.27366638183594),
        v3(-2.6107919216156006, -15.157999038696289, 32.7979621887207),
        v3(-1.5071595907211304, -13.962703704833984, 32.594871520996094),
        v3(-2.6148290634155273, -13.925714492797852, 31.36355972290039),
        20
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-2.6148290634155273, -13.925714492797852, 31.36355972290039),
        v3(-3.063199043273926, -13.910741806030273, 30.865140914916992),
        v3(-5.7725300788879395, -13.00989818572998, 33.10860061645508),
        v3(-6.204699516296387, -11.971428871154785, 33.90509033203125),
        25
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-6.204699516296387, -11.971428871154785, 33.90509033203125),
        v3(-6.6162428855896, -10.982522964477539, 34.66356658935547),
        v3(-5.901260852813721, -11.199590682983398, 34.75407028198242),
        v3(-7.255730628967285, -10.3027982711792, 35.564422607421875),
        20
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-7.255730628967285, -10.3027982711792, 35.564422607421875),
        v3(-7.761164665222168, -9.968151092529297, 35.86681365966797),
        v3(-8.197510719299316, -8.158544540405273, 38.52354049682617),
        v3(-8.921348571777344, -6.794588088989258, 41.258697509765625),
        15
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-8.921348571777344, -6.794588088989258, 41.258697509765625),
        v3(-9.2832670211792, -6.112610816955566, 42.62627410888672),
        v3(-11.077244758605957, -5.859180927276611, 43.483768463134766),
        v3(-12.78091049194336, -5.773738384246826, 44.00212478637695),
        20
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-12.78091049194336, -5.773738384246826, 44.00212478637695),
        v3(-13.632743835449219, -5.731017112731934, 44.26130294799805),
        v3(-13.939895629882812, -4.123109817504883, 41.509971618652344),
        v3(-14.034211158752441, -2.52601957321167, 38.691986083984375),
        20
      )
    );
    curve = curve.continue(
      BABYLON.Curve3.CreateCubicBezier(
        v3(-14.034211158752441, -2.52601957321167, 38.691986083984375),
        v3(-14.12852668762207, -0.928929328918457, 35.874000549316406),
        v3(-14.010005950927734, 0.6573438048362732, 32.9893684387207),
        v3(-14.010494232177734, 0.6567957401275635, 32.98194885253906),
        20
      )
    );
    return curve;
  }

  guidedTour () {
    const tourCurve = this.buildTourCurve();
    this.animTour = this.createPathForAnimation(this.camera, tourCurve, 60);
  }

  pauseTour () {
    if (this.animTour) {
      if (!this.animTour._paused) {
        this.animTour.pause();
      } else {
        this.animTour.restart();
      }
    }
  }

  quitTour () {
    this.animTour.stop();
    this.animTour.goToFrame(0);
    this.animTour = null;
  }

  /**
   * @return Promise
   */
  _importMeshVAT (modelpath, modelfile, initialCenterPosition, animationRanges, withCaustic = false) {
    // const p = BABYLON.SceneLoader.LoadAssetContainerAsync(modelpath, modelfile, this.scene)
    const p = BABYLON.SceneLoader.ImportMeshAsync(
      '',
      modelpath,
      modelfile,
      this.scene,
      undefined
    );

    let mainMesh = null;
    let baker = null;
    let container = null;

    return p.then((_container) => {
      container = _container;
      const loadedMeshes = container.meshes;
      // this.assetsManager.addMeshTask('mesh' + modelfile, null, modelpath, modelfile).onSuccess = (task) => {
      // const loadedMeshes = task.loadedMeshes;

      const causticMaterial = withCaustic ? this.getCausticMaterial() : null;
      // if (loadedMeshes.length !== 1) {
      //   throw new Error('Invalid number of meshes for loadFlock: ' + modelfile);
      // }
      for (const mesh of loadedMeshes) {
        mesh.position = initialCenterPosition;
        mesh.scaling = new BABYLON.Vector3(10, 10, 10);
        if (mesh.material) {
          // mesh.material.freeze();
        }
        mesh.alwaysSelectAsActiveMesh = true;
        // mesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;
        // mesh.convertToUnIndexedMesh();
        mesh.freezeNormals();
        // mesh.freezeWorldMatrix();
      }
      mainMesh = loadedMeshes[1];

      if (causticMaterial) {
        mainMesh.rttMaterial = causticMaterial;
        this.renderTargetCaustic.renderList.push(mainMesh);
      }

      baker = new BABYLON.VertexAnimationBaker(this.scene, mainMesh);
      return baker.bakeVertexData(animationRanges);
    }).then((vertexData) => {
      const boneCount = this._mesh.skeleton.bones.length;
      const totalRows = 0;
      const totalCols = 0;
      let lastNewOne = 0;
      const lines = [];
      for (let i = 1; i < totalRows; i++) {
        for (let j = 0; j < totalCols; j++) {
          if (vertexData[lastNewOne * totalCols + j] !== vertexData[i * totalCols + j]) {
            lines.push(i);
            lastNewOne = i;
            break;
          }
        }
      }
      const actualVertexData = new Float32Array((boneCount + 1) * 4 * 4 * lines.length);
      for (const i of lines) {
        // copy
      }

      const vertexTexture = baker.textureFromBakedVertexData(vertexData);
      const bakedVertexAnimationManager = new BABYLON.BakedVertexAnimationManager(this.scene);
      bakedVertexAnimationManager.texture = vertexTexture;

      return {
        container,
        mainMesh
      };
    });
  }

  _importMeshVATThin (modelpath, modelfile, total, initialCenterPosition, animationRanges, withCaustic = false) {
    const bufferMatrices = new Float32Array(16 * total);
    const animParameters = new Float32Array(4 * total);

    this._importMeshVAT(modelpath, modelfile, initialCenterPosition, animationRanges, withCaustic)
      .then(({ container, mainMesh }) => {
        for (let i = 0; i < total; i++) {
          const matrix = BABYLON.Matrix.Translation(
            this.random(-1, 1), this.random(-1, 1), this.random(-1, 1)
          );
          bufferMatrices.set(matrix.toArray(), i * 16);
          const anim = new BABYLON.Vector4(
            animationRanges[0].from,
            animationRanges[0].to,
            Math.floor(Math.random() * (animationRanges[0].from - animationRanges[0].to)),
            30
          );
          animParameters.set(anim.asArray(), i * 4);
        }
        mainMesh.thinInstanceSetBuffer('matrix', bufferMatrices, 16);
        mainMesh.thinInstanceSetBuffer('bakedVertexAnimationSettingsInstanced', animParameters, 4);
        this.scene.stopAnimation(mainMesh);
        container.animationGroups.map(g => g.pause());

        return {
          container,
          mainMesh,
          bufferMatrices,
          animParameters
        };
      }).catch((e) => { console.error(e); });
  }

  loadFlock (modelpath, modelfile, total, initialCenterPosition, animationRanges, withCaustic = false) {
    // eslint-disable-next-line no-undef
    const zero = new BABYLON.Vector3(0, 0, 0);
    const boidsManager = new BoidsManager(
      total,
      zero,
      1.0,
      30.0
    );
    boidsManager.cohesion = 0.01;
    boidsManager.alignment = 0.3;
    boidsManager.separationMinDistance = 0.1;
    boidsManager.maxSpeed = 1.0;
    // keep them around the center
    boidsManager.addForce(
      (_manager, boid) => {
        return initialCenterPosition.subtract(boid.position).scale(-5000.4);
      }
    );
    // // TODO away from diver
    // boidsManager.addForce(
    //   (_manager, boid) => {
    //     const MIN_DISTANCE = 3.0;
    //     const d = this.camera.position.subtract(boid.position);
    //     if (d.lengthSquared < MIN_DISTANCE * MIN_DISTANCE) {
    //       const f = new BABYLON.Vector3(MIN_DISTANCE, MIN_DISTANCE, MIN_DISTANCE).subtract(d).scale(100.0);
    //       console.log(f);
    //       return f;
    //     }
    //     return zero;
    //   }
    // );

    let mainMesh = null;
    let bufferMatrices = null;
    let animParameters = null;
    const p = this._importMeshVAT()
      .then(({
        _container,
        _mainMesh,
        _bufferMatrices,
        _animParameters
      }) => {
        mainMesh = _mainMesh;
        bufferMatrices = _bufferMatrices;
        animParameters = _animParameters;
      });

    return {
      models: [mainMesh],
      boidsManager,
      promise: p,
      update: ((_boids, _models, total) => {
        return (deltaTime) => {
          // console.log(mainMesh);
          if (mainMesh && mainMesh.bakedVertexAnimationManager) {
            mainMesh.bakedVertexAnimationManager.time += deltaTime;
            _boids.update(deltaTime);
            for (let i = 0; i < total; i++) {
              const boid = _boids.boids[i];
              // const matrix = BABYLON.Matrix.Translation(
              //   boid.position.x, boid.position.y, boid.position.z
              // );

              const matrix = BABYLON.Matrix.Compose(
                new BABYLON.Vector3(1, 1, 1),
                new BABYLON.Quaternion(
                  boid.velocity.x,
                  boid.velocity.y,
                  boid.velocity.z,
                  0.0
                ),
                boid.position
              );
              bufferMatrices.set(matrix.toArray(), i * 16);
            }
            mainMesh.thinInstanceSetBuffer('matrix', bufferMatrices, 16);
          }
        };
      })(boidsManager, mainMesh, total)
    };
  }

  loadBoids (modelpath, modelfile, total, initialCenterPosition, animationRanges, withCaustic = false) {
    // eslint-disable-next-line no-undef
    const zero = new BABYLON.Vector3(0, 0, 0);
    const boidsManager = new BoidsManager(
      total,
      zero,
      1.0,
      30.0
    );
    boidsManager.cohesion = 0.01;
    boidsManager.alignment = 0.3;
    boidsManager.separationMinDistance = 0.1;
    boidsManager.maxSpeed = 1.0;
    // keep them around the center
    boidsManager.addForce(
      (_manager, boid) => {
        return initialCenterPosition.subtract(boid.position).scale(-5000.4);
      }
    );
    // // TODO away from diver
    // boidsManager.addForce(
    //   (_manager, boid) => {
    //     const MIN_DISTANCE = 3.0;
    //     const d = this.camera.position.subtract(boid.position);
    //     if (d.lengthSquared < MIN_DISTANCE * MIN_DISTANCE) {
    //       const f = new BABYLON.Vector3(MIN_DISTANCE, MIN_DISTANCE, MIN_DISTANCE).subtract(d).scale(100.0);
    //       console.log(f);
    //       return f;
    //     }
    //     return zero;
    //   }
    // );

    let mainMesh = null;
    const bufferMatrices = new Float32Array(16 * total);
    const animParameters = new Float32Array(4 * total);

    // const p = BABYLON.SceneLoader.LoadAssetContainerAsync(modelpath, modelfile, this.scene)
    const p = BABYLON.SceneLoader.ImportMeshAsync(
      '',
      modelpath,
      modelfile,
      this.scene,
      undefined
    );

    p.then((container) => {
      const loadedMeshes = container.meshes;
      // this.assetsManager.addMeshTask('mesh' + modelfile, null, modelpath, modelfile).onSuccess = (task) => {
      // const loadedMeshes = task.loadedMeshes;

      const causticMaterial = withCaustic ? this.getCausticMaterial() : null;
      // if (loadedMeshes.length !== 1) {
      //   throw new Error('Invalid number of meshes for loadFlock: ' + modelfile);
      // }
      for (const mesh of loadedMeshes) {
        mesh.position = initialCenterPosition;
        mesh.scaling = new BABYLON.Vector3(10, 10, 10);
        if (mesh.material) {
          // mesh.material.freeze();
        }
        mesh.alwaysSelectAsActiveMesh = true;
        // mesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;
        // mesh.convertToUnIndexedMesh();
        mesh.freezeNormals();
        // mesh.freezeWorldMatrix();
      }
      mainMesh = loadedMeshes[1];

      if (causticMaterial) {
        mainMesh.rttMaterial = causticMaterial;
        this.renderTargetCaustic.renderList.push(mainMesh);
      }

      // thin instance version
      for (let i = 0; i < total; i++) {
        const matrix = BABYLON.Matrix.Translation(
          this.random(-1, 1), 0, 0
        );
        bufferMatrices.set(matrix.toArray(), i * 16);
      }
      mainMesh.thinInstanceSetBuffer('matrix', bufferMatrices, 16);

      const baker = new BABYLON.VertexAnimationBaker(this.scene, mainMesh);
      baker.bakeVertexData(animationRanges).then((vertexData) => {
        const vertexTexture = baker.textureFromBakedVertexData(vertexData);
        const bakedVertexAnimationManager = new BABYLON.BakedVertexAnimationManager(this.scene);
        bakedVertexAnimationManager.texture = vertexTexture;
        // bakedVertexAnimationManager.animationParameters = new BABYLON.Vector4(
        //   animationRanges[0].from,
        //   animationRanges[0].to,
        //   0,
        //   24
        // );

        mainMesh.bakedVertexAnimationManager = bakedVertexAnimationManager;
        console.log(mainMesh, mainMesh.bakedVertexAnimationManager);
        this.scene.stopAnimation(mainMesh);

        // mainMesh.skeleton.dispose();
        // mainMesh.skeleton = null;

        for (let i = 0; i < total; i++) {
          const matrix = BABYLON.Matrix.Translation(
            this.random(-1, 1), this.random(-1, 1), this.random(-1, 1)
          );
          bufferMatrices.set(matrix.toArray(), i * 16);
          const anim = new BABYLON.Vector4(
            animationRanges[0].from,
            animationRanges[0].to,
            Math.floor(Math.random() * (animationRanges[0].from - animationRanges[0].to)),
            30
          );
          animParameters.set(anim.asArray(), i * 4);
        }
        mainMesh.thinInstanceSetBuffer('matrix', bufferMatrices, 16);
        mainMesh.thinInstanceSetBuffer('bakedVertexAnimationSettingsInstanced', animParameters, 4);
        container.animationGroups.map(g => g.pause());
      });
    }).catch((e) => { console.error(e); });

    return {
      models: [mainMesh],
      boidsManager,
      promise: p,
      update: ((_boids, _models, total) => {
        return (deltaTime) => {
          // console.log(mainMesh);
          if (mainMesh && mainMesh.bakedVertexAnimationManager) {
            mainMesh.bakedVertexAnimationManager.time += deltaTime;
            _boids.update(deltaTime);
            for (let i = 0; i < total; i++) {
              const boid = _boids.boids[i];
              // const matrix = BABYLON.Matrix.Translation(
              //   boid.position.x, boid.position.y, boid.position.z
              // );

              const matrix = BABYLON.Matrix.Compose(
                new BABYLON.Vector3(1, 1, 1),
                new BABYLON.Quaternion(
                  boid.velocity.x,
                  boid.velocity.y,
                  boid.velocity.z,
                  0.0
                ),
                boid.position
              );
              bufferMatrices.set(matrix.toArray(), i * 16);
            }
            mainMesh.thinInstanceSetBuffer('matrix', bufferMatrices, 16);
          }
        };
      })(boidsManager, mainMesh, total)
    };
  }

  random (min, max) {
    return Math.random() * (max - min) + min;
  }

  clamp (t, min, max) {
    return Math.min(Math.max(t, min), max);
  }
}

export default {
  props: {
  },

  data () {
    return {
      isFullscreen: false,
      isTouch: false,
      started: false,
      snapshotRequested: false,

      // simulation / GUI
      ascentSpeed: 0,
      depth: 0,
      time: 0,
      air: 100,
      fps: 0,
      volume: 0,
      mute: false,
      playing: false,
      /** The camera orientation as a compass */
      orientationDegrees: 0.0
    };
  },

  computed: {
    base () {
      return this.$router.options.base;
    },

    ascentSpeedColor () {
      if (this.ascentSpeed < 1.0 / 60.0) {
        return '#000';
      } else if (this.ascentSpeed < 6.0 / 60.0) {
        return '#0f0';
      } else if (this.ascentSpeed < 12.0 / 60.0) {
        return '#0f0';
      } else if (this.ascentSpeed < 18.0 / 60.0) {
        return '#ff0';
      } else {
        return '#f00';
      }
    },
    ascentSpeedGraph () {
      if (this.depth === 0) {
        return '';
      } else if (this.ascentSpeed < 1.0 / 60.0) {
        return '<';
      } else if (this.ascentSpeed < 6.0 / 60.0) {
        return '<';
      } else if (this.ascentSpeed < 12.0 / 60.0) {
        return '<<';
      } else if (this.ascentSpeed < 18.0 / 60.0) {
        return '<<<';
      } else {
        return '<<<<';
      }
    }
  },

  mounted () {
    this.underwater = new Underwater(this);
    Window.underw = this.underwater;
  },

  beforeDestroy () {
    this.underwater.beforeDestroy();
    this.underwater = null;
  },

  methods: {
    fullscreen () {
      document.getElementById('underwater').requestFullscreen();
    },
    start () {
      this.started = true;
      this.fullscreen();
      // this.audioOcean.play();
    },
    toggleVolume () {
      this.mute = !this.mute;
      if (this.mute) {
        this.volume = BABYLON.Engine.audioEngine.getGlobalVolume();
        BABYLON.Engine.audioEngine.setGlobalVolume(0);
      } else {
        BABYLON.Engine.audioEngine.setGlobalVolume(this.volume);
      }
    },
    toggleGuidedTour () {
      this.playing = !this.playing;
      if (!this.underwater.animTour) {
        this.playing = true;
      }
      if (this.playing) {
        console.log('Guided Tour Requested');
        if (!this.underwater.animTour) {
          this.underwater.guidedTour();
        } else {
          this.underwater.pauseTour();
        }
      } else {
        console.log('Guided Tour Paused');
        this.underwater.pauseTour();
      }
    },
    stopGuidedTour () {
      this.playing = false;
      this.underwater.quitTour();
    }
  }
};
</script>

<style lang="less" scoped>
#underwater {
  height: 100vh;
  width: 100%;
  position: relative;
}

#underwater-3d {
  height: 100vh;
  width: 100vw;
}

#underwater-debug {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
  z-index: 1000;
  border-radius: 10px;
  background: #000;
  color: #fff;
  text-align: right;
}

#underwater-hud {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  width: 160px;
  height: 220px;
  z-index: 10;
  border-radius: 10px;
  background: #000;
  font-family: monospace;
  color: #fff;
  text-align: right;

  @media (max-width: 640px) {
    width: 120px;
    height: 160px;
  }

  span {
    display: inline-block;
  }

  #underwater-hud-time,
  #underwater-hud-compass {
    margin-top: 10px;
  }

  #underwater-hud-depth-value,
  #underwater-hud-time-value,
  #underwater-hud-compass-value {
    line-height: 0.9;
    font-size: 42px;
    font-family: monospace;
    @media (max-width: 640px) {
      font-size: 24px;
    }
  }

  #underwater-hud-depth-ascent {
    writing-mode: vertical-rl;
  }

  #underwater-hud-compass-name,
  #underwater-hud-depth-name,
  #underwater-hud-time-name {
    color: #4c70ff;
  }

  #underwater-hud-depth-unit,
  #underwater-hud-time-unit {
    vertical-align: top;
  }
}

.button-giant {
  line-height: 1.2em;
  border-radius: 10px;
  font-size: 32px;
  background: #004;
  color: #fff;
  text-align: center;
  padding: 14px;
}

#underwater-fullscreen {
  position: absolute;
  top: 20px;
  left: 0;
  margin: 0px;
  z-index: 1;
  max-width: 80%;
}

#underwater-instructions {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0.0, 0.0, 0.0, 0.4);
  flex-direction: column;
  text-align: right;
  padding: 20px;

  p {
    font-size: 200%;
  }
}

#underwater-settings {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 10px;
  z-index: 1000;
  color: #fff;
  text-align: right;

  svg {
    cursor: pointer
  }
}
</style>
