<template>
  <div id="underwater">
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
import { showBoidsDebug } from './boids';
import BoidsWorker from 'worker-loader!./boidsw';

const debugBoids = false;
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
    // this.markAllAsDirty();
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
  vueComponent = null;
  engine = null;
  scene = null;
  camera = null;
  assetsManager = null;
  sunLight = null;

  oceanPostProcess = null;

  rebuildOceanTexture = true;

  audioDiver = null;
  audioOcean = null;
  debugState = false;

  animTour = null;

  constructor (vueComponent) {
    BABYLON.GUI = GUI;
    const container = document.getElementById('underwater-3d');
    document.onfullscreenchange = (event) => {
      vueComponent.isFullscreen = !!document.fullscreenElement;
    };
    this.vueComponent = vueComponent;
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
      this.loadMantas(),
      this.loadTurtle(),
      this.loadAudio()
    ];

    const sargentinho = this.loadBoidsModel(
      this.base + 'models/', 'sargentinho.glb',
      300,
      new BABYLON.Vector3(-33.12, -21.2, 12.19),
      new BABYLON.Vector3(-2.12, -11.2, 42.19),
      new BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(1, 0, 0), Math.PI),
      [{ from: 1, to: 30, name: 'swim' }]
    );
    promises.push(sargentinho.promise);

    const salema = this.loadBoidsModel(
      this.base + 'models/', 'salema.glb',
      1000,
      new BABYLON.Vector3(-2.12, -23.2, 32.19),
      new BABYLON.Vector3(32.12, -10.2, 62.19),
      new BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(-1, 0, 0), Math.PI / 2),
      [{ from: 1, to: 30, name: 'swim' }]
    );
    promises.push(salema.promise);

    Promise.all(promises).then(() => {
      console.log('all loaded');
    });

    this.assetsManager.load();

    // this.sceneOptimizer();
    if (vueComponent.$route.query.debug) {
      this.debugState = true;
      this.camera.speed = 0.5;
      this.debugUtils();
      vueComponent.toggleVolume();
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
        if (this.audioDiver) {
          this.audioDiver.pause();
          if (isUnderwater) {
            this.audioDiver.play();
          }
        }
        if (this.audioOcean) {
          this.audioOcean.pause();
          if (!isUnderwater) {
            this.audioOcean.play();
          }
        }
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

      sargentinho.update(deltaTime);
      salema.update(deltaTime);

      this.scene.render();

      if (vueComponent.snapshotRequested) {
        vueComponent.snapshotRequested = false;
        this.share();
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
    if (this.audioDiver) {
      this.audioDiver.pause();
      this.audioDiver = null;
    }
    if (this.audioOcean) {
      this.audioOcean.pause();
      this.audioOcean = null;
    }
    this.engine.stopRenderLoop();
    this.scene.dispose();
    this.scene = null;
    this.engine = null;
  }

  createPathForAnimation (mesh, curve, frameRate = 60) {
    // Transform the curves into a proper Path3D object and get its orientation information
    const path3d = new BABYLON.Path3D(curve.getPoints(), v3(0, -1.0, 0.0), false, true);
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

    /* uncomment to debug paths

    // visualisation
    const pathGroup = new BABYLON.Mesh('pathGroup' + mesh.name);
    const curveMesh = BABYLON.Mesh.CreateLines(
      'bezier', curve.getPoints(), this.scene, false
    );
    curveMesh.color = new BABYLON.Color3(1, 1, 0.5);
    curveMesh.parent = pathGroup;

    const pointMaterial = new BABYLON.StandardMaterial('pointMaterial', this.scene);
    pointMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    pointMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

    for (let p = 0; p < curvePath.length; p++) {
      binormals[p].y = 0;
      binormals[p].normalize();
      BABYLON.Vector3.CrossToRef(tangents[p], binormals[p], normals[p]);
      normals[p].y = Math.abs(normals[p].y);
      BABYLON.Vector3.CrossToRef(normals[p], tangents[p], binormals[p]);

      const sp = BABYLON.Mesh.CreateSphere('cPoint' + p, 16, 0.02, this.scene);
      sp.material = pointMaterial;
      sp.position = curvePath[p];
      sp.parent = pathGroup;
      const tg = BABYLON.Mesh.CreateLines('tg', [ curvePath[p], curvePath[p].add(tangents[p]) ], this.scene, false);
      tg.color = BABYLON.Color3.Red();
      tg.parent = pathGroup;
      const no = BABYLON.Mesh.CreateLines('no', [ curvePath[p], curvePath[p].add(normals[p]) ], this.scene, false);
      no.color = BABYLON.Color3.Blue();
      no.parent = pathGroup;
      const bi = BABYLON.Mesh.CreateLines('bi', [ curvePath[p], curvePath[p].add(binormals[p]) ], this.scene, false);
      bi.color = BABYLON.Color3.Green();
      bi.parent = pathGroup;
    }
    */

    for (let i = 0; i < curvePath.length; i++) {
      const position = curvePath[i];
      const tangent = tangents[i];
      const binormal = binormals[i];

      const rotation = BABYLON.Quaternion.FromLookDirectionRH(tangent, normals[i]);

      // // cross the direction with a fixed "up" vector and we get the side direction.
      // BABYLON.Vector3.CrossToRef(tangent, yDirection, sideDirection);
      // // and cross it again to get the actual up direction
      // BABYLON.Vector3.CrossToRef(sideDirection, direction, topDirection);
      // // build the quaternion
      // BABYLON.Quaternion.RotationQuaternionFromAxisToRef(sideDirection, direction, topDirection, orientation);

      posKeys.push({ frame: i * frameRate, value: position });
      rotKeys.push({ frame: i * frameRate, value: rotation });
    }

    posAnim.setKeys(posKeys);
    rotAnim.setKeys(rotKeys);

    mesh.animations.push(posAnim);
    mesh.animations.push(rotAnim);
    const animReturn = this.scene.beginAnimation(mesh, 0, frameRate * curvePath.length, true);
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

    this.guidedTour();
    this.animTour.pause();

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
        if (kbInfo.event.key === ' ') {
          this.togglePauseTour();
        }
        if (kbInfo.event.key === 'p') {
          console.log(JSON.stringify({
            rotationQuaternion: this.camera.rotationQuaternion,
            position: this.camera.position,
            cameraDirection: this.camera.cameraDirection,
            cameraRotation: this.camera.cameraRotation
          }));
        } else if (kbInfo.event.key === 'n') {
          const animation = new BABYLON.Animation(
            'slideIn', 'position', 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE, true
          );
          const keys = [{
            frame: 0,
            value: new BABYLON.Vector3(-15.51978616737642, maxY, 29.13296827068854)
          }, {
            frame: 240,
            value: new BABYLON.Vector3(-20, -15, 22)
          },
          {
            frame: 480,
            value: new BABYLON.Vector3(-14.12, -17.2, 27.19)
          }
          ];
          animation.setKeys(keys);

          // Creating an easing function
          const easingFunction = new BABYLON.CubicEase();
          easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
          // animation.setEasingFunction(easingFunction);

          this.camera.animations = [animation];

          this.scene.beginAnimation(this.camera, 0, keys[keys.length - 1].frame, true);
        }
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
    // Window.underw = this;
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
      material.caustic.isEnabled = true;
      return material.caustic;
    });
  }

  composer () {
    // composes the actual texture with our underwater shader pass.
    // const depthPass = this.scene.enableDepthRenderer();

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

  addToSceneAndCaustic (meshes) {
    meshes.forEach((mesh) => {
      if (mesh.material && mesh.material.pluginManager.getPlugin('Caustic')) {
        mesh.material.pluginManager.getPlugin('Caustic').isEnabled = true;
      }
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
        this.addToSceneAndCaustic([rocks[1]]);

        resolve();
      };

      // load the rocks
      this.assetsManager.addMeshTask('rocks', null, this.base + 'models/ilha/', 'rocks.glb').onSuccess = (task) => {
        task.loadedMeshes.forEach((mesh) => {
          if (mesh.name === 'rockLow1' || mesh.name === 'rockLow1.001' || mesh.name === 'rockLow1.002') {
            // store the first rock model.
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

  _fixLoadedModelsOrientation (loadedMeshes, resetQuaternion = true) {
    const baseMesh = loadedMeshes[0]; // assumes __root__ is zero
    const mainMesh = loadedMeshes[1];

    // reset weird scaling
    baseMesh.scaling.z = 1;
    baseMesh.scaling.y = 1;
    baseMesh.scaling.x = 1;
    baseMesh.rotationQuaternion.y = 0;

    // reset base quaternion
    if (resetQuaternion) {
      mainMesh.parent.rotationQuaternion.x = 1.0;
      mainMesh.parent.rotationQuaternion.y = 0.0;
      mainMesh.parent.rotationQuaternion.z = 0.0;
      mainMesh.parent.rotationQuaternion.w = 0.0;
    }
  }

  loadTurtle () {
    const p = new Promise((resolve, reject) => {
      const points = [
        v3(-22, -10, 27),
        v3(-20, -12, 31),
        v3(-18, -11, 33),
        v3(-14, -10, 35),
        v3(-12, -11, 33),
        v3(-10, -12, 31),
        v3(-6, -10, 27)
      ];
      const curve = this.buildTourCurveDecent(points, 100);

      this.assetsManager.addMeshTask('tartaruga', null, this.base + 'models/tartaruga/', 'tartaruga.glb').onSuccess = (task) => {
        const meshesWithMaterials = [];
        this._fixLoadedModelsOrientation(task.loadedMeshes);

        for (const mesh of task.loadedMeshes) {
          mesh.position = new BABYLON.Vector3(-14.12, -12.2, 36.19);
          if (mesh.material) {
            mesh.material.backFaceCulling = false;
            mesh.material.freeze();
            meshesWithMaterials.push(mesh);
          } else {
            this.createPathForAnimation(mesh, curve, 30);
          }
        }
        this.addToSceneAndCaustic(meshesWithMaterials);

        resolve();
      };
    });
    return p;
  }

  loadMantas () {
    const p = new Promise((resolve, reject) => {
      const points = [
        v3(-4, -19, 23),
        v3(8, -17, 30),
        v3(22, -14, 39),
        v3(32, -13, 43),
        v3(28, -15, 50),
        v3(16, -18, 44),
        v3(2, -19, 32),
        v3(-9, -21, 28)
      ];
      const curve = this.buildTourCurveDecent(points, 40);

      this.assetsManager.addMeshTask('manta', null, this.base + 'models/', 'raiaManta.glb').onSuccess = (task) => {
        const meshesWithMaterials = [];
        this._fixLoadedModelsOrientation(task.loadedMeshes);

        for (const mesh of task.loadedMeshes) {
          mesh.position = new BABYLON.Vector3(-19.12, -12.2, 46);
          if (mesh.material) {
            mesh.material.backFaceCulling = false;
            mesh.material.freeze();
            meshesWithMaterials.push(mesh);
          } else {
            this.createPathForAnimation(mesh, curve, 10);
          }
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
        end();
      };
      this.assetsManager.addBinaryFileTask(
        'sound_ocean',
        this.base + 'audio/435668__byjoshberry__ocean-waves-hitting-bow-of-moving-boat.mp3'
      ).onSuccess = (task) => {
        this.audioOcean = new BABYLON.Sound(
          'sound_ocean',
          task.data,
          this.scene,
          () => {
            this.audioOcean.play();
          },
          {
            autoplay: false,
            loop: true
          });
        end();
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

  buildTourCurveDecent (points, interpolatedPoints = 10) {
    const curve = BABYLON.Curve3.CreateCatmullRomSpline(points, interpolatedPoints, true);
    return curve;
  }

  /**
   * Start the guided tour.
   */
  guidedTour () {
    const tourCurve = this.buildTourCurveDecent(
      [
        new BABYLON.Vector3(-15.51978616737642, maxY, 29.13296827068854),
        new BABYLON.Vector3(-15, -5, 26),
        new BABYLON.Vector3(-14.5, -10, 24),
        new BABYLON.Vector3(-14.3, -13, 22),
        new BABYLON.Vector3(-14.12, -14.2, 27.19),
        new BABYLON.Vector3(-16.12, -11.2, 28.19),
        new BABYLON.Vector3(-18.12, -9.2, 30.19)
      ]
    );
    this.camera.updateUpVectorFromRotation = true;
    this.animTour = this.createPathForAnimation(this.camera, tourCurve, 60);
  }

  /**
   * Toggle pause/unpause the tour if the animation started.
   */
  togglePauseTour () {
    if (!this.animTour._paused) {
      this.animTour.pause();
    } else {
      this.animTour.restart();
    }
    this.vueComponent.playing = !this.animTour._paused;
  }

  /**
   * Stop the tour, reset the camera position and remove the animation reference.
   */
  quitTour () {
    this.animTour.stop();
    this.animTour.goToFrame(0);
  }

  /**
   *
   * @param {string} modelpath
   * @param {string} modelfile
   * @param {int} total
   * @param {BABYLON.Vector3} boundsMin
   * @param {BABYLON.Vector3} boundsMax
   * @param {BABYLON.Quaternion} fixDirection
   *
   */
  loadBoidsModel (modelpath, modelfile, total, boundsMin, boundsMax, fixDirection, animationRanges, fpsDelta = 6) {
    let boids = [];
    let debugData = {};
    const cohesion = 0.0005;
    const alignment = 0.03;
    const separation = 0.2;
    const separationMinDistance = 0.5;
    const maxSpeed = 0.2;
    const initialRadius = Math.min(
      Math.abs(boundsMax.x - boundsMin.x),
      Math.abs(boundsMax.y - boundsMin.y),
      Math.abs(boundsMax.z - boundsMin.z)
    ) / 2.8;

    // run the boid simulation in a separate thread
    const boidsWorkerThread = new BoidsWorker();
    boidsWorkerThread.onmessage = (e) => {
      const now = performance.now();
      if (e.data.command === 'started') {
        // IF DEBUG
        if (debugBoids) {
          debugData = showBoidsDebug(
            modelfile,
            this.scene,
            e.data.boids,
            new BABYLON.Vector3().copyFrom(e.data.boundsMin),
            new BABYLON.Vector3().copyFrom(e.data.boundsMax),
            separationMinDistance
          );
        }
      } else {
        boids = e.data.boids;

        // IF DEBUG
        if (debugBoids) {
          debugData.center.position.copyFrom(e.data.center);
        }
      }
    };

    // start the simulation and set parameters
    boidsWorkerThread.postMessage(
      { command: 'bundle',
        list: [
          {
            command: 'construct',
            total,
            center: boundsMin.add(boundsMax.subtract(boundsMin).scale(0.5)),
            initialRadius,
            boundRadiusScale: 30.0
          },
          { command: 'set', name: 'boundsMin', value: boundsMin },
          { command: 'set', name: 'boundsMax', value: boundsMax },
          { command: 'calculateBounds' },
          { command: 'set', name: 'cohesion', value: cohesion },
          { command: 'set', name: 'alignment', value: alignment },
          { command: 'set', name: 'separation', value: separation },
          { command: 'set', name: 'separationMinDistance', value: separationMinDistance },
          { command: 'set', name: 'maxSpeed', value: maxSpeed },
          { command: 'reset', total, initialRadius },
          { command: 'start' }
        ]
      });

    let mainMesh = null;
    const bufferMatrices = new Float32Array(16 * total);
    const m = BABYLON.Matrix.Identity();
    for (let i = 0; i < total; i++) {
      m.copyToArray(bufferMatrices, i * 16);
    }
    const animParameters = new Float32Array(4 * total);

    // const p = BABYLON.SceneLoader.LoadAssetContainerAsync(modelpath, modelfile, this.scene)
    const p = BABYLON.SceneLoader.ImportMeshAsync(
      '',
      modelpath,
      modelfile,
      this.scene,
      undefined
    ).then((container) => {
      const loadedMeshes = container.meshes;
      for (const mesh of loadedMeshes) {
        if (mesh.material) {
          mesh.material.freeze();
        }
        // mesh.freezeWorldMatrix();
        this.scene.stopAnimation(mesh);
      }

      const baseMesh = loadedMeshes[0]; // assumes __root__ is zero

      const matrix = BABYLON.Matrix.Identity();
      baseMesh.rotationQuaternion.toRotationMatrix(matrix);
      baseMesh.bakeTransformIntoVertices(matrix);

      this._fixLoadedModelsOrientation(loadedMeshes, false);

      baseMesh.name += modelfile;
      mainMesh = loadedMeshes[1];

      mainMesh.computeWorldMatrix();
      mainMesh.thinInstanceSetBuffer('matrix', bufferMatrices, 16);
      this.addToSceneAndCaustic(loadedMeshes);

      // const baker = new BABYLON.VertexAnimationBaker(this.scene, mainMesh);
      // baker.bakeVertexData(animationRanges).then((vertexData) => {
      //   const vertexTexture = baker.textureFromBakedVertexData(vertexData);
      //   const bakedVertexAnimationManager = new BABYLON.BakedVertexAnimationManager(this.scene);
      //   bakedVertexAnimationManager.texture = vertexTexture;

      //   mainMesh.bakedVertexAnimationManager = bakedVertexAnimationManager;
      //   //        this.scene.stopAnimation(mainMesh);

      //   // set animation parameters
      //   for (let i = 0; i < total; i++) {
      //     const anim = new BABYLON.Vector4(
      //       animationRanges[0].from,
      //       animationRanges[0].to,
      //       Math.floor(Math.random() * (animationRanges[0].from - animationRanges[0].to)),
      //       30 + (Math.random() - 0.5) * fpsDelta
      //     );
      //     animParameters.set(anim.asArray(), i * 4);
      //   }
      //   // container.animationGroups.map(g => g.pause());
      // });

      // mainMesh.thinInstanceSetBuffer('bakedVertexAnimationSettingsInstanced', animParameters, 4);
    }).catch((e) => { console.error(e); });

    // uncomment to get the direction axes for debugging
    // const debugAxes = boidsManager.boids.map(
    //   i => new BABYLON.AxesViewer(this.scene, 1.0)
    // );

    return {
      models: [mainMesh],
      boidsWorkerThread,
      promise: p,
      update: ((_boids, _models, total) => {
        // these are fixed
        const one = new BABYLON.Vector3(1, 1, 1);
        const direction = new BABYLON.Vector3(1, 1, 1);
        const yDirection = new BABYLON.Vector3(0, -1, 0);

        // pre declare variables to avoid GC
        const m = BABYLON.Matrix.Identity();
        const orientation = BABYLON.Quaternion.Zero();
        const topDirection = new BABYLON.Vector3(1, 1, 1);
        const sideDirection = new BABYLON.Vector3(1, 1, 1);
        const boidPosition = new BABYLON.Vector3(1, 1, 1);
        const boidVelocity = new BABYLON.Vector3(1, 1, 1);

        return (deltaTime) => {
          const now = performance.now();
          if (mainMesh) {
            // mainMesh.bakedVertexAnimationManager.time += deltaTime;
            for (let i = 0; i < boids.length; i++) {
              const boid = boids[i];
              boidPosition.copyFrom(boid.position);
              boidVelocity.copyFrom(boid.velocity);

              // compute our quaternion from the direction to point to it

              // where we are going to
              boidVelocity.normalizeToRef(direction);
              // cross the direction with a fixed "up" vector and we get the side direction.
              BABYLON.Vector3.CrossToRef(direction, yDirection, sideDirection);
              // and cross it again to get the actual up direction
              BABYLON.Vector3.CrossToRef(sideDirection, direction, topDirection);
              // build the quaternion
              BABYLON.Quaternion.RotationQuaternionFromAxisToRef(sideDirection, direction, topDirection, orientation);
              orientation.multiplyInPlace(fixDirection);

              // debug axes
              // debugAxes[i].update(boidPosition, sideDirection, direction, topDirection);

              // update position and orientation
              BABYLON.Matrix.ComposeToRef(
                one,
                orientation,
                boidPosition,
                m
              );
              m.copyToArray(bufferMatrices, i * 16);

              // visual debug
              if (debugData.boids) {
                // const debug = debugData.boids[i];
                // const path = [boidPosition.add(boidVelocity.scale(10.0)), boidPosition.clone()];
                // debug.force = BABYLON.MeshBuilder.CreateTube(debug.force.name, { path, radius: 0.01, instance: debug.force });
                m.copyToArray(debugData.influenceMatrices, 16 * i);
              }
            }
            mainMesh.thinInstanceSetBuffer('matrix', bufferMatrices, 16);
            if (debugData.influenceMesh) {
              debugData.influenceMesh.thinInstanceSetBuffer('matrix', debugData.influenceMatrices, 16);
            }
          }
        };
      })(mainMesh, total)
    };
  }

  /*
  setupDiver () {
    this.diver = this.scene.getNodeByName('global_movement');
    this.diver.parent = this.camera;
    // Set the initial position to place the diver again when above the threshold for diver to follow
    // This Y position places the diver properly sitting on the boat
    this.diver.position.y = -0.28;
    this.diverInitPos = this.diver.position;
    this.diverAnim = this.scene.getAnimationGroupByName('Take 001.002');
    // start the sitting animation
    this.diverAnim.start(true, 1, this.diverAnims.sitting.init, this.diverAnims.sitting.end, false);
  } */

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
      /** The camera orientation as a compass */
      orientationDegrees: 0.0,
      playing: false
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
    // Window.underw = this.underwater;
  },

  beforeDestroy () {
    console.log('before destroy', this.underwater);
    if (this.underwater) {
      this.underwater.beforeDestroy();
    }
    this.underwater = null;
  },

  methods: {
    fullscreen () {
      document.getElementById('underwater').requestFullscreen();
    },
    start () {
      this.started = true;
      this.fullscreen();
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
      this.underwater.togglePauseTour();
    },
    stopGuidedTour () {
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
