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
      <p v-if="!isTouch">
        <i18n>
          Torne-se um mergulhador e explore a Laje de Santos.
        </i18n>
        <br>
        <i18n>
          Clique Com o Botão Esquerdo do Mouse e Arraste para Olhar ao Redor.
        </i18n>
        <br>
        <i18n>
          Aperte 'W' para nadar.
        </i18n>
      </p>
      <p v-else>
        <i18n>
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

const maxY = 0.6;

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
  debugState = false;
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
      this.debugState = true;
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

      // Keep the Camera limited to near the water level. Does not fly.
      if (this.camera.position.y > maxY) {
        this.camera.position.y = maxY;
      }

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
    this.scene.clearColor = new BABYLON.Color4(0.0, 0.5, 0.85, 0.0);

    // Add a camera to the scene and attach it to the canvas
    const cameraInitPoint = new BABYLON.Vector3(-15.51978616737642, maxY, 29.13296827068854);
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
    // set an object to be inspected in the console
    Window.underw = this;
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
    const depthPass = this.scene.enableDepthRenderer();

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
    this.oceanPostProcess.skyTexture = skyTexture;

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

        resolve();
      };
    });
    return p;
  }

  buildTourCurve (smooth = 1) {
    let curve = BABYLON.Curve3.CreateCubicBezier( // B
      v3(-14.000991821289062, 0.6574481725692749, 32.9548454284668),
      v3(-13.996825218200684, 0.6574481725692749, 32.940956115722656),
      v3(-14.024413108825684, 0.6509860754013062, 32.55100631713867),
      v3(-14.265217781066895, 0.6574481725692749, 32.1165657043457),
      2 * smooth
    );
    curve = curve.continue( // A
      BABYLON.Curve3.CreateCubicBezier(
        v3(-14.265217781066895, 0.6574481725692749, 32.1165657043457),
        v3(-14.617867469787598, 0.6669116616249084, 31.480342864990234),
        v3(-14.76079273223877, 0.6602444648742676, 31.185121536254883),
        v3(-15.39233112335205, 0.6574481725692749, 30.998979568481445),
        2 * smooth
      )
    );
    curve = curve.continue( // R
      BABYLON.Curve3.CreateCubicBezier(
        v3(-15.39233112335205, 0.6574481725692749, 30.998979568481445),
        v3(-16.32655906677246, 0.6533116698265076, 30.723621368408203),
        v3(-15.986363410949707, 0.6559959650039673, 30.843740463256836),
        v3(-17.039472579956055, 0.6574481725692749, 30.793241500854492),
        2 * smooth
      )
    );
    curve = curve.continue( // G
      BABYLON.Curve3.CreateCubicBezier(
        v3(-17.039472579956055, 0.6574481725692749, 30.793241500854492),
        v3(-17.613088607788086, 0.6582391858100891, 30.765735626220703),
        v3(-18.787918090820312, 0.7090924382209778, 31.120275497436523),
        v3(-19.45874786376953, 0.6574481725692749, 31.953659057617188),
        2 * smooth
      )
    );
    curve = curve.continue( // B
      BABYLON.Curve3.CreateCubicBezier(
        v3(-19.45874786376953, 0.6574481725692749, 31.953659057617188),
        v3(-20.582807540893555, 0.570911705493927, 33.35009765625),
        v3(-20.595529556274414, 0.5830461978912354, 33.503726959228516),
        v3(-20.97544288635254, 0.5849096775054932, 34.53799819946289),
        2 * smooth
      )
    );
    curve = curve.continue( // A
      BABYLON.Curve3.CreateCubicBezier(
        v3(-20.97544288635254, 0.5849096775054932, 34.53799819946289),
        v3(-21.649211883544922, 0.5882145166397095, 36.37226104736328),
        v3(-23.628690719604492, -6.161035537719727, 36.41096115112305),
        v3(-24.54960060119629, -8.274001121520996, 36.62228775024414),
        10 * smooth
      )
    );
    curve = curve.continue( // R
      BABYLON.Curve3.CreateCubicBezier(
        v3(-24.54960060119629, -8.274001121520996, 36.62228775024414),
        v3(-25.451812744140625, -10.344067573547363, 36.829322814941406),
        v3(-27.573389053344727, -14.756925582885742, 37.26560592651367),
        v3(-28.528148651123047, -15.673060417175293, 37.828033447265625),
        10 * smooth
      )
    );
    curve = curve.continue( // G
      BABYLON.Curve3.CreateCubicBezier(
        v3(-28.528148651123047, -15.673060417175293, 37.828033447265625),
        v3(-29.777053833007812, -16.871440887451172, 38.56373596191406),
        v3(-32.11470413208008, -25.681499481201172, 40.03419876098633),
        v3(-32.840545654296875, -25.814899444580078, 43.99205780029297),
        10 * smooth
      )
    );
    curve = curve.continue( // B
      BABYLON.Curve3.CreateCubicBezier(
        v3(-32.840545654296875, -25.814899444580078, 43.99205780029297),
        v3(-33.69413375854492, -25.971776962280273, 48.64649963378906),
        v3(-28.42091941833496, -24.62757110595703, 48.84748840332031),
        v3(-24.238296508789062, -24.533470153808594, 49.35893249511719),
        10 * smooth
      )
    );
    curve = curve.continue( // A
      BABYLON.Curve3.CreateCubicBezier(
        v3(-24.238296508789062, -24.533470153808594, 49.35893249511719),
        v3(-21.416982650756836, -24.469995498657227, 49.70391845703125),
        v3(-19.669851303100586, -28.618223190307617, 51.122745513916016),
        v3(-15.405399322509766, -28.663742065429688, 51.464935302734375),
        10 * smooth
      )
    );
    curve = curve.continue( // R
      BABYLON.Curve3.CreateCubicBezier(
        v3(-15.405399322509766, -28.663742065429688, 51.464935302734375),
        v3(-11.700185775756836, -28.703290939331055, 51.76224899291992),
        v3(4.163280963897705, -29.118030548095703, 53.839454650878906),
        v3(9.77834415435791, -29.24734115600586, 53.75956344604492),
        10 * smooth
      )
    );
    curve = curve.continue( // G
      BABYLON.Curve3.CreateCubicBezier(
        v3(9.77834415435791, -29.24734115600586, 53.75956344604492),
        v3(12.323244094848633, -29.30594825744629, 53.72335433959961),
        v3(34.324214935302734, -28.774940490722656, 53.16682434082031),
        v3(35.215423583984375, -28.626699447631836, 52.58649444580078),
        10 * smooth
      )
    );
    curve = curve.continue( // B
      BABYLON.Curve3.CreateCubicBezier(
        v3(35.215423583984375, -28.626699447631836, 52.58649444580078),
        v3(37.8231315612793, -28.192941665649414, 50.888427734375),
        v3(34.41352844238281, -29.60319709777832, 47.74901580810547),
        v3(32.4602165222168, -29.006301879882812, 47.55818557739258),
        12 * smooth
      )
    );
    curve = curve.continue( // A
      BABYLON.Curve3.CreateCubicBezier(
        v3(32.4602165222168, -29.006301879882812, 47.55818557739258),
        v3(30.66159439086914, -28.456676483154297, 47.382469177246094),
        v3(27.096359252929688, -22.143463134765625, 46.32563400268555),
        v3(25.767629623413086, -22.49676513671875, 46.324798583984375),
        35 * smooth
      )
    );
    curve = curve.continue( // R
      BABYLON.Curve3.CreateCubicBezier(
        v3(25.767629623413086, -22.49676513671875, 46.324798583984375),
        v3(24.790449142456055, -22.756591796875, 46.32418441772461),
        v3(25.13022804260254, -22.687040328979492, 46.32514953613281),
        v3(24.48270606994629, -22.862226486206055, 46.324798583984375),
        12 * smooth
      )
    );
    curve = curve.continue( // G
      BABYLON.Curve3.CreateCubicBezier(
        v3(24.48270606994629, -22.862226486206055, 46.324798583984375),
        v3(23.835824966430664, -23.03723907470703, 46.32444763183594),
        v3(23.69356918334961, -23.088525772094727, 46.30103302001953),
        v3(23.530864715576172, -23.132951736450195, 46.28840255737305),
        12 * smooth
      )
    );
    curve = curve.continue( // B
      BABYLON.Curve3.CreateCubicBezier(
        v3(23.530864715576172, -23.132951736450195, 46.28840255737305),
        v3(23.2147159576416, -23.219274520874023, 46.263858795166016),
        v3(22.348297119140625, -23.454551696777344, 46.024391174316406),
        v3(22.190568923950195, -23.514163970947266, 45.969688415527344),
        12 * smooth
      )
    );
    curve = curve.continue( // A
      BABYLON.Curve3.CreateCubicBezier(
        v3(22.190568923950195, -23.514163970947266, 45.969688415527344),
        v3(21.83151626586914, -23.649866104125977, 45.84516143798828),
        v3(21.54167938232422, -23.722084045410156, 45.64944076538086),
        v3(21.29722023010254, -23.768253326416016, 45.215946197509766),
        12 * smooth
      )
    );
    curve = curve.continue( // R
      BABYLON.Curve3.CreateCubicBezier(
        v3(21.29722023010254, -23.768253326416016, 45.215946197509766),
        v3(20.75515365600586, -23.870630264282227, 44.25471115112305),
        v3(21.91973876953125, -20.524686813354492, 44.111183166503906),
        v3(21.654382705688477, -20.24751091003418, 43.035552978515625),
        25 * smooth
      )
    );
    curve = curve.continue( // G
      BABYLON.Curve3.CreateCubicBezier(
        v3(21.654382705688477, -20.24751091003418, 43.035552978515625),
        v3(21.36979866027832, -19.95025062561035, 41.881980895996094),
        v3(22.352222442626953, -19.41952133178711, 37.2213020324707),
        v3(19.967266082763672, -19.586599349975586, 36.990013122558594),
        12 * smooth
      )
    );
    curve = curve.continue( // B
      BABYLON.Curve3.CreateCubicBezier(
        v3(19.967266082763672, -19.586599349975586, 36.990013122558594),
        v3(19.027652740478516, -19.652423858642578, 36.89889144897461),
        v3(18.879961013793945, -19.715564727783203, 37.3553581237793),
        v3(18.84793472290039, -19.586599349975586, 37.765037536621094),
        12 * smooth
      )
    );
    curve = curve.continue( // A
      BABYLON.Curve3.CreateCubicBezier(
        v3(18.84793472290039, -19.586599349975586, 37.765037536621094),
        v3(18.710838317871094, -19.034528732299805, 39.51877975463867),
        v3(18.392507553100586, -16.224327087402344, 45.301544189453125),
        v3(18.567825317382812, -16.186500549316406, 47.885353088378906),
        20 * smooth
      )
    );
    curve = curve.continue( // R
      BABYLON.Curve3.CreateCubicBezier(
        v3(18.567825317382812, -16.186500549316406, 47.885353088378906),
        v3(18.62300682067871, -16.17459487915039, 48.6986083984375),
        v3(18.189916610717773, -16.184980392456055, 49.76185607910156),
        v3(17.739166259765625, -16.186500549316406, 49.763301849365234),
        12 * smooth
      )
    );
    curve = curve.continue( // G
      BABYLON.Curve3.CreateCubicBezier(
        v3(17.739166259765625, -16.186500549316406, 49.763301849365234),
        v3(16.58254051208496, -16.190401077270508, 49.76701354980469),
        v3(16.68396759033203, -16.162899017333984, 49.7675895690918),
        v3(15.579561233520508, -16.186500549316406, 49.763301849365234),
        10 * smooth
      )
    );
    curve = curve.continue( // B
      BABYLON.Curve3.CreateCubicBezier(
        v3(15.579561233520508, -16.186500549316406, 49.763301849365234),
        v3(14.60368537902832, -16.207355499267578, 49.75951385498047),
        v3(13.634191513061523, -18.864173889160156, 49.7774658203125),
        v3(13.331958770751953, -19.70728302001953, 49.78619384765625),
        12 * smooth
      )
    );
    curve = curve.continue( // A
      BABYLON.Curve3.CreateCubicBezier(
        v3(13.331958770751953, -19.70728302001953, 49.78619384765625),
        v3(13.154287338256836, -20.20291519165039, 49.791324615478516),
        v3(12.666264533996582, -22.241924285888672, 49.71502685546875),
        v3(11.681337356567383, -22.338699340820312, 49.763301849365234),
        10 * smooth
      )
    );
    curve = curve.continue( // R
      BABYLON.Curve3.CreateCubicBezier(
        v3(11.681337356567383, -22.338699340820312, 49.763301849365234),
        v3(10.767630577087402, -22.428476333618164, 49.80808639526367),
        v3(9.653884887695312, -22.32814598083496, 49.167022705078125),
        v3(8.721243858337402, -22.338699340820312, 48.86186981201172),
        12 * smooth
      )
    );
    curve = curve.continue( // G
      BABYLON.Curve3.CreateCubicBezier(
        v3(8.721243858337402, -22.338699340820312, 48.86186981201172),
        v3(7.542423248291016, -22.35203742980957, 48.47616958618164),
        v3(6.642915725708008, -22.440385818481445, 47.85281753540039),
        v3(4.561910629272461, -22.338699340820312, 46.823883056640625),
        12 * smooth
      )
    );
    curve = curve.continue( // B
      BABYLON.Curve3.CreateCubicBezier(
        v3(4.561910629272461, -22.338699340820312, 46.823883056640625),
        v3(3.463308334350586, -22.285017013549805, 46.28068923950195),
        v3(-5.716817855834961, -21.53879737854004, 44.55055236816406),
        v3(-9.495468139648438, -21.54129981994629, 44.76640319824219),
        10 * smooth
      )
    );
    curve = curve.continue( // A
      BABYLON.Curve3.CreateCubicBezier(
        v3(-9.495468139648438, -21.54129981994629, 44.76640319824219),
        v3(-10.935624122619629, -21.542253494262695, 44.848670959472656),
        v3(-11.790102005004883, -21.538429260253906, 44.75456237792969),
        v3(-12.089763641357422, -21.54129981994629, 44.4488525390625),
        10 * smooth
      )
    );
    curve = curve.continue( // R
      BABYLON.Curve3.CreateCubicBezier(
        v3(-12.089763641357422, -21.54129981994629, 44.4488525390625),
        v3(-12.822487831115723, -21.54831886291504, 43.70133972167969),
        v3(-12.75212574005127, -21.536161422729492, 43.70689010620117),
        v3(-12.931273460388184, -21.54129981994629, 42.8768310546875),
        10 * smooth
      )
    );
    curve = curve.continue( // G
      BABYLON.Curve3.CreateCubicBezier(
        v3(-12.931273460388184, -21.54129981994629, 42.8768310546875),
        v3(-13.29143238067627, -21.5516300201416, 41.20808029174805),
        v3(-12.23647689819336, -21.32982063293457, 40.1552848815918),
        v3(-12.932861328125, -20.70451545715332, 39.73333740234375),
        12 * smooth
      )
    );
    curve = curve.continue( // B
      BABYLON.Curve3.CreateCubicBezier(
        v3(-12.932861328125, -20.70451545715332, 39.73333740234375),
        v3(-15.162277221679688, -18.702653884887695, 38.38250732421875),
        v3(-13.46361255645752, -5.522161960601807, 36.02260208129883),
        v3(-13.783821105957031, -0.4981536865234375, 35.190345764160156),
        75 * smooth
      )
    );
    curve = curve.continue( // A
      BABYLON.Curve3.CreateCubicBezier(
        v3(-13.783821105957031, -0.4981536865234375, 35.190345764160156),
        v3(-13.845514297485352, 0.46980082988739014, 35.029998779296875),
        v3(-14.010433197021484, 0.5489194393157959, 33.86442565917969),
        v3(-14.010494232177734, 0.6567957401275635, 32.98194885253906),
        5 * smooth
      )
    );

    if (this.debugState) {
      const sp0 = BABYLON.Mesh.CreateSphere('cPoint0', 16, 0.01, this.scene); // B
      sp0.position = v3(-14.000991821289062, 0.6574481725692749, 32.9548454284668);
      const sp0Material = new BABYLON.StandardMaterial('sp0Material', this.scene);
      sp0Material.diffuseColor = new BABYLON.Color3(1, 1, 1);
      sp0Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp0.material = sp0Material;
      const sp00 = BABYLON.Mesh.CreateSphere('cPoint00', 16, 0.01, this.scene); // B
      sp00.position = v3(-14.265217781066895, 0.6574481725692749, 32.1165657043457);
      const sp00Material = new BABYLON.StandardMaterial('sp00Material', this.scene);
      sp00Material.diffuseColor = new BABYLON.Color3(1, 1, 1);
      sp00Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp00.material = sp0Material;
      const sp1 = BABYLON.Mesh.CreateSphere('cPoint1', 16, 0.01, this.scene); // A
      sp1.position = v3(-15.39233112335205, 0.6574481725692749, 30.998979568481445);
      const sp1Material = new BABYLON.StandardMaterial('sp1Material', this.scene);
      sp1Material.diffuseColor = new BABYLON.Color3(1, 1, 0);
      sp1Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp1.material = sp1Material;
      const sp2 = BABYLON.Mesh.CreateSphere('cPoint2', 16, 0.01, this.scene); // R
      sp2.position = v3(-17.039472579956055, 0.6574481725692749, 30.793241500854492);
      const sp2Material = new BABYLON.StandardMaterial('sp2Material', this.scene);
      sp2Material.diffuseColor = new BABYLON.Color3(1, 0, 0);
      sp2Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp2.material = sp2Material;
      const sp3 = BABYLON.Mesh.CreateSphere('cPoint3', 16, 0.01, this.scene); // G
      sp3.position = v3(-19.45874786376953, 0.6574481725692749, 31.953659057617188);
      const sp3Material = new BABYLON.StandardMaterial('sp3Material', this.scene);
      sp3Material.diffuseColor = new BABYLON.Color3(0, 1, 0);
      sp3Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp3.material = sp3Material;
      const sp4 = BABYLON.Mesh.CreateSphere('cPoint4', 16, 0.01, this.scene); // B
      sp4.position = v3(-20.97544288635254, 0.5849096775054932, 34.53799819946289);
      const sp4Material = new BABYLON.StandardMaterial('sp4Material', this.scene);
      sp4Material.diffuseColor = new BABYLON.Color3(1, 1, 1);
      sp4Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp4.material = sp4Material;
      const sp5 = BABYLON.Mesh.CreateSphere('cPoint5', 16, 0.01, this.scene); // A
      sp5.position = v3(-24.54960060119629, -8.274001121520996, 36.62228775024414);
      const sp5Material = new BABYLON.StandardMaterial('sp5Material', this.scene);
      sp5Material.diffuseColor = new BABYLON.Color3(1, 1, 0);
      sp5Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp5.material = sp5Material;
      const sp6 = BABYLON.Mesh.CreateSphere('cPoint6', 16, 0.01, this.scene); // R
      sp6.position = v3(-28.528148651123047, -15.673060417175293, 37.828033447265625);
      const sp6Material = new BABYLON.StandardMaterial('sp6Material', this.scene);
      sp6Material.diffuseColor = new BABYLON.Color3(1, 0, 0);
      sp6Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp6.material = sp6Material;
      const sp7 = BABYLON.Mesh.CreateSphere('cPoint7', 16, 0.01, this.scene); // G
      sp7.position = v3(-32.840545654296875, -25.814899444580078, 43.99205780029297);
      const sp7Material = new BABYLON.StandardMaterial('sp7Material', this.scene);
      sp7Material.diffuseColor = new BABYLON.Color3(0, 1, 0);
      sp7Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp7.material = sp7Material;
      const sp8 = BABYLON.Mesh.CreateSphere('cPoint8', 16, 0.01, this.scene); // B
      sp8.position = v3(-24.238296508789062, -24.533470153808594, 49.35893249511719);
      const sp8Material = new BABYLON.StandardMaterial('sp8Material', this.scene);
      sp8Material.diffuseColor = new BABYLON.Color3(1, 1, 1);
      sp8Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp8.material = sp8Material;
      const sp9 = BABYLON.Mesh.CreateSphere('cPoint9', 16, 0.01, this.scene); // A
      sp9.position = v3(-15.405399322509766, -28.663742065429688, 51.464935302734375);
      const sp9Material = new BABYLON.StandardMaterial('sp9Material', this.scene);
      sp9Material.diffuseColor = new BABYLON.Color3(1, 1, 0);
      sp9Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp9.material = sp9Material;
      const sp10 = BABYLON.Mesh.CreateSphere('cPoint10', 16, 0.01, this.scene); // R
      sp10.position = v3(9.77834415435791, -29.24734115600586, 53.75956344604492);
      const sp10Material = new BABYLON.StandardMaterial('sp10Material', this.scene);
      sp10Material.diffuseColor = new BABYLON.Color3(1, 0, 0);
      sp10Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp10.material = sp10Material;
      const sp11 = BABYLON.Mesh.CreateSphere('cPoint11', 16, 0.01, this.scene); // G
      sp11.position = v3(35.215423583984375, -28.626699447631836, 52.58649444580078);
      const sp11Material = new BABYLON.StandardMaterial('sp11Material', this.scene);
      sp11Material.diffuseColor = new BABYLON.Color3(0, 1, 0);
      sp11Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp11.material = sp11Material;
      const sp12 = BABYLON.Mesh.CreateSphere('cPoint12', 16, 0.01, this.scene); // B
      sp12.position = v3(32.4602165222168, -29.006301879882812, 47.55818557739258);
      const sp12Material = new BABYLON.StandardMaterial('sp12Material', this.scene);
      sp12Material.diffuseColor = new BABYLON.Color3(1, 1, 1);
      sp12Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp12.material = sp12Material;
      const sp13 = BABYLON.Mesh.CreateSphere('cPoint13', 16, 0.01, this.scene); // A
      sp13.position = v3(25.767629623413086, -22.49676513671875, 46.324798583984375);
      const sp13Material = new BABYLON.StandardMaterial('sp13Material', this.scene);
      sp13Material.diffuseColor = new BABYLON.Color3(1, 1, 0);
      sp13Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp13.material = sp13Material;
      const sp14 = BABYLON.Mesh.CreateSphere('cPoint14', 16, 0.01, this.scene); // R
      sp14.position = v3(24.48270606994629, -22.862226486206055, 46.324798583984375);
      const sp14Material = new BABYLON.StandardMaterial('sp14Material', this.scene);
      sp14Material.diffuseColor = new BABYLON.Color3(1, 0, 0);
      sp14Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp14.material = sp14Material;
      const sp15 = BABYLON.Mesh.CreateSphere('cPoint15', 16, 0.01, this.scene); // G
      sp15.position = v3(23.530864715576172, -23.132951736450195, 46.28840255737305);
      const sp15Material = new BABYLON.StandardMaterial('sp15Material', this.scene);
      sp15Material.diffuseColor = new BABYLON.Color3(0, 1, 0);
      sp15Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp15.material = sp15Material;
      const sp16 = BABYLON.Mesh.CreateSphere('cPoint16', 16, 0.01, this.scene); // B
      sp16.position = v3(22.190568923950195, -23.514163970947266, 45.969688415527344);
      const sp16Material = new BABYLON.StandardMaterial('sp16Material', this.scene);
      sp16Material.diffuseColor = new BABYLON.Color3(1, 1, 1);
      sp16Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp16.material = sp16Material;
      const sp17 = BABYLON.Mesh.CreateSphere('cPoint17', 16, 0.01, this.scene); // A
      sp17.position = v3(21.29722023010254, -23.768253326416016, 45.215946197509766);
      const sp17Material = new BABYLON.StandardMaterial('sp17Material', this.scene);
      sp17Material.diffuseColor = new BABYLON.Color3(1, 1, 0);
      sp17Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp17.material = sp17Material;
      const sp18 = BABYLON.Mesh.CreateSphere('cPoint18', 16, 0.01, this.scene); // R
      sp18.position = v3(21.654382705688477, -20.24751091003418, 43.035552978515625);
      const sp18Material = new BABYLON.StandardMaterial('sp18Material', this.scene);
      sp18Material.diffuseColor = new BABYLON.Color3(1, 0, 0);
      sp18Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp18.material = sp18Material;
      const sp19 = BABYLON.Mesh.CreateSphere('cPoint19', 16, 0.01, this.scene); // G
      sp19.position = v3(19.967266082763672, -19.586599349975586, 36.990013122558594);
      const sp19Material = new BABYLON.StandardMaterial('sp19Material', this.scene);
      sp19Material.diffuseColor = new BABYLON.Color3(0, 1, 0);
      sp19Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp19.material = sp19Material;
      const sp20 = BABYLON.Mesh.CreateSphere('cPoint20', 16, 0.01, this.scene); // B
      sp20.position = v3(18.84793472290039, -19.586599349975586, 37.765037536621094);
      const sp20Material = new BABYLON.StandardMaterial('sp20Material', this.scene);
      sp20Material.diffuseColor = new BABYLON.Color3(1, 1, 1);
      sp20Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp20.material = sp20Material;
      const sp21 = BABYLON.Mesh.CreateSphere('cPoint21', 16, 0.01, this.scene); // A
      sp21.position = v3(18.567825317382812, -16.186500549316406, 47.885353088378906);
      const sp21Material = new BABYLON.StandardMaterial('sp21Material', this.scene);
      sp21Material.diffuseColor = new BABYLON.Color3(1, 1, 0);
      sp21Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp21.material = sp21Material;
      const sp22 = BABYLON.Mesh.CreateSphere('cPoint22', 16, 0.01, this.scene); // R
      sp22.position = v3(17.739166259765625, -16.186500549316406, 49.763301849365234);
      const sp22Material = new BABYLON.StandardMaterial('sp22Material', this.scene);
      sp22Material.diffuseColor = new BABYLON.Color3(1, 0, 0);
      sp22Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp22.material = sp22Material;
      const sp23 = BABYLON.Mesh.CreateSphere('cPoint23', 16, 0.01, this.scene); // G
      sp23.position = v3(15.579561233520508, -16.186500549316406, 49.763301849365234);
      const sp23Material = new BABYLON.StandardMaterial('sp23Material', this.scene);
      sp23Material.diffuseColor = new BABYLON.Color3(0, 1, 0);
      sp23Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp23.material = sp23Material;
      const sp24 = BABYLON.Mesh.CreateSphere('cPoint24', 16, 0.01, this.scene); // B
      sp24.position = v3(13.331958770751953, -19.70728302001953, 49.78619384765625);
      const sp24Material = new BABYLON.StandardMaterial('sp24Material', this.scene);
      sp24Material.diffuseColor = new BABYLON.Color3(1, 1, 1);
      sp24Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp24.material = sp24Material;
      const sp25 = BABYLON.Mesh.CreateSphere('cPoint25', 16, 0.01, this.scene); // A
      sp25.position = v3(11.681337356567383, -22.338699340820312, 49.763301849365234);
      const sp25Material = new BABYLON.StandardMaterial('sp25Material', this.scene);
      sp25Material.diffuseColor = new BABYLON.Color3(1, 1, 0);
      sp25Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp25.material = sp25Material;
      const sp26 = BABYLON.Mesh.CreateSphere('cPoint26', 16, 0.01, this.scene); // R
      sp26.position = v3(8.721243858337402, -22.338699340820312, 48.86186981201172);
      const sp26Material = new BABYLON.StandardMaterial('sp26Material', this.scene);
      sp26Material.diffuseColor = new BABYLON.Color3(1, 0, 0);
      sp26Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp26.material = sp26Material;
      const sp27 = BABYLON.Mesh.CreateSphere('cPoint27', 16, 0.01, this.scene); // G
      sp27.position = v3(4.561910629272461, -22.338699340820312, 46.823883056640625);
      const sp27Material = new BABYLON.StandardMaterial('sp27Material', this.scene);
      sp27Material.diffuseColor = new BABYLON.Color3(0, 1, 0);
      sp27Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp27.material = sp27Material;
      const sp28 = BABYLON.Mesh.CreateSphere('cPoint28', 16, 0.01, this.scene); // B
      sp28.position = v3(-9.495468139648438, -21.54129981994629, 44.76640319824219);
      const sp28Material = new BABYLON.StandardMaterial('sp28Material', this.scene);
      sp28Material.diffuseColor = new BABYLON.Color3(1, 1, 1);
      sp28Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp28.material = sp28Material;
      const sp29 = BABYLON.Mesh.CreateSphere('cPoint29', 16, 0.01, this.scene); // A
      sp29.position = v3(-12.089763641357422, -21.54129981994629, 44.4488525390625);
      const sp29Material = new BABYLON.StandardMaterial('sp29Material', this.scene);
      sp29Material.diffuseColor = new BABYLON.Color3(1, 1, 0);
      sp29Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp29.material = sp29Material;
      const sp30 = BABYLON.Mesh.CreateSphere('cPoint30', 16, 0.01, this.scene); // R
      sp30.position = v3(-12.931273460388184, -21.54129981994629, 42.8768310546875);
      const sp30Material = new BABYLON.StandardMaterial('sp30Material', this.scene);
      sp30Material.diffuseColor = new BABYLON.Color3(1, 0, 0);
      sp30Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp30.material = sp30Material;
      const sp31 = BABYLON.Mesh.CreateSphere('cPoint31', 16, 0.01, this.scene); // G
      sp31.position = v3(-12.932861328125, -20.70451545715332, 39.73333740234375);
      const sp31Material = new BABYLON.StandardMaterial('sp31Material', this.scene);
      sp31Material.diffuseColor = new BABYLON.Color3(0, 1, 0);
      sp31Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp31.material = sp31Material;
      const sp32 = BABYLON.Mesh.CreateSphere('cPoint32', 16, 0.01, this.scene); // B
      sp32.position = v3(-13.783821105957031, -0.4981536865234375, 35.190345764160156);
      const sp32Material = new BABYLON.StandardMaterial('sp32Material', this.scene);
      sp32Material.diffuseColor = new BABYLON.Color3(1, 1, 1);
      sp32Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp32.material = sp32Material;
      const sp33 = BABYLON.Mesh.CreateSphere('cPoint33', 16, 0.01, this.scene); // A
      sp33.position = v3(-14.010494232177734, 0.6567957401275635, 32.98194885253906);
      const sp33Material = new BABYLON.StandardMaterial('sp33Material', this.scene);
      sp33Material.diffuseColor = new BABYLON.Color3(1, 1, 0);
      sp33Material.specularColor = new BABYLON.Color3(0, 0, 0);
      sp33.material = sp33Material;

      const curveMesh = BABYLON.Mesh.CreateLines(
        'bezier', curve.getPoints(), this.scene, false
      );
      curveMesh.color.r = 1;
      curveMesh.color.g = 1;
    }
    return curve;
  }

  guidedTour () {
    const tourCurve = this.buildTourCurve();
    this.camera.updateUpVectorFromRotation = true;
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
  text-align: center;
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
