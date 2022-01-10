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

    this.turtle = this.loadTurtle();

    const promises = [
      this.loadTerrain(), // 38 draw calls
      this.loadMoreiaBarco(), // 4 draw calls
      this.loadDiverBoat(),
      // this.loadDiverBoatBig(),
      // this.loadMantas(),
      this.turtle.promise
      // this.loadAudio()
    ];

    this.assembleShoals(promises);

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

      this.loadedFishes.forEach((school) => { school.update(deltaTime); });
      this.turtle.update(deltaTime);

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

  assembleShoals (promises) {
    // Vetor de configuração dos cardumes:
    // Nome do cardume (nome do modelo sem a extensão)
    // Posição central do cardume
    // Quantidade de peixes no cardume
    // Quadro inicial da animação do peixe do cardume
    // Quadro final da animação do peixe do cardume
    // Raio de movimentação do cardume em cada eixo
    const fishes = [
      { nome: 'frade', position: v3(-36.96, -21.60, 38.64), qtd: 6, initFrame: 1, endFrame: 102.8, shoalVolume: v3(5, 2, 4) },
      { nome: 'frade', position: v3(48.23, -26.51, 50.41), qtd: 8, initFrame: 1, endFrame: 102.8, shoalVolume: v3(4, 2, 3) },
      { nome: 'sargentinho', position: v3(-15.29, -25.51, 42.16), qtd: 75, initFrame: 1, endFrame: 100, shoalVolume: v3(3, 3, 5) },
      { nome: 'sargentinho', position: v3(5.38, -11.96, 14.92), qtd: 80, initFrame: 1, endFrame: 100, shoalVolume: v3(5, 3, 2) },
      { nome: 'enxada', position: v3(1.97, -12.46, 63.85), qtd: 30, initFrame: 1, endFrame: 102.8, shoalVolume: v3(2, 3, 4) },
      { nome: 'enxada', position: v3(-8.54, -11.72, 26.03), qtd: 30, initFrame: 1, endFrame: 102.8, shoalVolume: v3(4, 3, 2) },
      { nome: 'anjoReal', position: v3(-5.56, -25.28, 44.23), qtd: 30, initFrame: 1, endFrame: 66, shoalVolume: v3(4, 6, 2) }];

    this.loadedFishes = [];

    for (let currShoal = 0; currShoal < fishes.length; currShoal++) {
      const shoal = this.loadShoal(
        this.base + 'models/', fishes[currShoal].nome + '.glb',
        30,
        fishes[currShoal].position,
        [{ from: fishes[currShoal].initFrame, to: fishes[currShoal].endFrame, name: fishes[currShoal].nome + '_' + currShoal + 'swim' }],
        fishes[currShoal].shoalMoveVolume
      );
      this.loadedFishes.push(shoal);
      promises.push(shoal.promise);
    }
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
    this.scene.beginAnimation(mesh, 0, frameRate * curvePath.length, true);
    console.log(curvePath, posAnim, rotAnim, mesh);
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
    let mainMesh = null;
    const animationRanges = [{ from: 1, to: 194, name: 'tartaruga_Animation' }];
    const animParameters = new Float32Array(4);

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
      const meshesWithMaterials = [];

      this.assetsManager.addMeshTask('tartaruga', null, this.base + 'models/tartaruga/', 'tartaruga.glb').onSuccess = (task) => {
        for (const mesh of task.loadedMeshes) {
          mesh.position = new BABYLON.Vector3(-14.12, -12.2, 36.19);
          if (mesh.material) {
            mesh.material.backFaceCulling = false;
            mesh.material.freeze();
            meshesWithMaterials.push(mesh);
            mainMesh = mesh;
            // Load Baked Animation
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
    }).then((mainMesh) => {
      const fileToFetch = '/bakedAnim/tartaruga.json';
      console.log('Fetching Turtle: ' + fileToFetch);
      return fetch(fileToFetch);
    }).then((response) => {
      if (!response.ok) {
        console.error('Error loading serialized VAT');
        throw new Error('Error loading VAT JSon');
      }
      return response.text();
    }).then((json) => {
      // console.log('Json Loaded!<<<<<<<<<<<<<<<<<<<');
      const baker = new BABYLON.VertexAnimationBaker(this.scene, mainMesh);
      const vertexData = baker.loadBakedVertexDataFromJSON(json);
      const vertexTexture = baker.textureFromBakedVertexData(vertexData);
      const bakedVertexAnimationManager = new BABYLON.BakedVertexAnimationManager(this.scene);
      bakedVertexAnimationManager.texture = vertexTexture;

      // set animation parameters
      const anim = new BABYLON.Vector4(
        animationRanges[0].from,
        animationRanges[0].to,
        0,
        30
      );
      animParameters.set(anim.asArray(), 0);

      bakedVertexAnimationManager.setAnimationParameters(
        anim.x,
        anim.y,
        anim.z,
        anim.w
      );

      mainMesh.bakedVertexAnimationManager = bakedVertexAnimationManager;
      //        this.scene.stopAnimation(mainMesh);

      mainMesh.thinInstanceSetBuffer('bakedVertexAnimationSettingsInstanced', animParameters, 4);
    }).catch((e) => { console.error(e); });
    return {
      models: [mainMesh],
      promise: p,
      update: (deltaTime) => {
        if (mainMesh && mainMesh.bakedVertexAnimationManager) {
          mainMesh.bakedVertexAnimationManager.time += deltaTime;
          // mainMesh.thinInstanceSetBuffer('matrix', bufferMatrices, 16);
        }
      }
    };
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

  /**
   * @return Promise
   */
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

  loadShoal (modelpath, modelfile, total, initialCenterPosition, animationRanges, schoolVolume = null, withCaustic = false, fpsDelta = 6) {
    const zero = new BABYLON.Vector3(0, 0, 0);
    const boidsManager = new BoidsManager(
      total,
      initialCenterPosition,
      1.0,
      3.0
    );

    if (schoolVolume != null) {
      boidsManager.boundsMin.y = initialCenterPosition.y - schoolVolume.y;
      boidsManager.boundsMax.y = initialCenterPosition.y + schoolVolume.y;
      boidsManager.boundsMin.x = initialCenterPosition.x - schoolVolume.x;
      boidsManager.boundsMax.x = initialCenterPosition.x + schoolVolume.x;
      boidsManager.boundsMin.z = initialCenterPosition.z - schoolVolume.z;
      boidsManager.boundsMax.z = initialCenterPosition.z + schoolVolume.z;
    }
    boidsManager.cohesion = 0.01;
    boidsManager.alignment = 0.03;
    boidsManager.separationMinDistance = 0.5;
    boidsManager.maxSpeed = 1.0;
    // boidsManager.showDebug(this.scene);

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
    ).then((container) => {
      const loadedMeshes = container.meshes;

      /*
      for (const mesh of loadedMeshes) {
        mesh.position = initialCenterPosition;
        mesh.scaling = new BABYLON.Vector3(10, 10, 10);
        if (mesh.material) {
          mesh.material.freeze();
        }
        mesh.alwaysSelectAsActiveMesh = true;
        mesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;
        // mesh.convertToUnIndexedMesh();
        mesh.freezeNormals();
        mesh.freezeWorldMatrix();
      }
      */

      mainMesh = loadedMeshes[1]; // assumes __root__ is zero
      // mainMesh.position = initialCenterPosition;

      // Carregando o JSon do Baking
      const fileToFetch = '/bakedAnim/' + modelfile.replace(/\.[^/.]+$/, '.json');
      console.log('Fetching: ' + fileToFetch);
      return fetch(fileToFetch);
    }).then((response) => {
      if (!response.ok) {
        console.error('Error loading serialized VAT');
        throw new Error('Error loading VAT JSon');
      }
      return response.text();
    }).then((json) => {
      // console.log('Json Loaded!<<<<<<<<<<<<<<<<<<<');
      const baker = new BABYLON.VertexAnimationBaker(this.scene, mainMesh);
      const vertexData = baker.loadBakedVertexDataFromJSON(json);
      const vertexTexture = baker.textureFromBakedVertexData(vertexData);
      const bakedVertexAnimationManager = new BABYLON.BakedVertexAnimationManager(this.scene);
      bakedVertexAnimationManager.texture = vertexTexture;

      mainMesh.bakedVertexAnimationManager = bakedVertexAnimationManager;
      //        this.scene.stopAnimation(mainMesh);

      // set animation parameters
      for (let i = 0; i < total; i++) {
        const anim = new BABYLON.Vector4(
          animationRanges[0].from,
          animationRanges[0].to,
          Math.floor(Math.random() * (animationRanges[0].from - animationRanges[0].to)),
          30 + (Math.random() - 0.5) * fpsDelta
        );
        animParameters.set(anim.asArray(), i * 4);
      }
      mainMesh.thinInstanceSetBuffer('bakedVertexAnimationSettingsInstanced', animParameters, 4);
    }).catch((e) => { console.error(e); });
    return {
      models: [mainMesh],
      boidsManager,
      promise: p,
      update: ((_boids, _models, total) => {
        const one = new BABYLON.Vector3(1, 1, 1);
        const m = BABYLON.Matrix.Identity();
        const q = BABYLON.Quaternion.Identity();

        return (deltaTime) => {
          if (mainMesh && mainMesh.bakedVertexAnimationManager) {
            mainMesh.bakedVertexAnimationManager.time += deltaTime;
            _boids.update(deltaTime);
            for (let i = 0; i < total; i++) {
              const boid = _boids.boids[i];

              q.x = boid.velocity.x;
              q.y = boid.velocity.y;
              q.z = boid.velocity.z;
              q.w = Math.PI;
              q.normalize();

              BABYLON.Matrix.ComposeToRef(
                one,
                q,
                boid.position,
                m
              );
              m.copyToArray(bufferMatrices, i * 16);
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
