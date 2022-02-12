<template>
  <div id="underwater" v-on:keyup.space="toggleGuidedTour">
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
import BoidsManager from './boids';
/* eslint-enable */

/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const v3 = (x, y, z) => new BABYLON.Vector3(x, y, z);

const maxY = 0.6;

class Underwater {
  base = ''; // base url

  // babylon basis
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
  turtles = [];

  animTour = null;

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
    // this.composer();

    const geometryRenderer = this.camera.getScene().enableGeometryBufferRenderer(1.0);
    geometryRenderer.enablePosition = true;

    const promises = [
      // this.loadTerrain(), // 38 draw calls
      // this.loadMoreiaBarco(), // 4 draw calls
      // this.loadDiverBoat(),
      // // this.loadDiverBoatBig(),
      // // this.loadMantas(),
      // this.loadTurtle()
      // this.loadAudio()
    ];

    const fish = this.loadBoidsModel(
      this.base + 'models/', 'sargentinho.glb',
      30,
      new BABYLON.Vector3(-33.12, -17.2, 12.19),
      new BABYLON.Vector3(-2.12, -7.2, 42.19),
      [{ from: 1, to: 30, name: 'swim' }]
    );
    promises.push(fish.promise);
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

      fish.update(deltaTime);

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

  debugUtils () {
    this.scene.debugLayer.show();
    // set an object to be inspected in the console
    // Window.underw = this;
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

  addToSceneAndCaustic (meshes) {
    // meshes.forEach((mesh) => {
    //   if (mesh.material && mesh.material.pluginManager.getPlugin('Caustic')) {
    //     mesh.material.pluginManager.getPlugin('Caustic').isEnabled = true;
    //   }
    // });
  }

  loadBoidsModel (modelpath, modelfile, total, boundsMin, boundsMax, animationRanges, fpsDelta = 6) {
    const boidsManager = new BoidsManager(
      total,
      boundsMin.add(boundsMax.subtract(boundsMin).scale(0.5)),
      1.0,
      30.0
    );
    boidsManager.boundsMin = boundsMin;
    boidsManager.boundsMax = boundsMax;
    boidsManager.calculateBounds();
    boidsManager.reset(30.0, 1.0);
    boidsManager.cohesion = 0.001;
    boidsManager.alignment = 0.03;
    boidsManager.separationMinDistance = 0.5;
    boidsManager.maxSpeed = 1.0;

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
        // uncomment this and the it works
        // mesh.freezeWorldMatrix();
      }
      const baseMesh = loadedMeshes[0]; // assumes __root__ is zero
      mainMesh = loadedMeshes[1];

      // reset weird scaling
      baseMesh.scaling.z = 1;
      baseMesh.scaling.y = 1;
      baseMesh.scaling.x = 1;
      baseMesh.rotationQuaternion.y = 0;

      // reset base quaternion
      mainMesh.parent.rotationQuaternion.x = 1.0;
      mainMesh.parent.rotationQuaternion.y = 0.0;
      mainMesh.parent.rotationQuaternion.z = 0.0;
      mainMesh.parent.rotationQuaternion.w = 0.0;
      mainMesh.parent.rotationQuaternion.normalize();
      mainMesh.computeWorldMatrix();
      mainMesh.thinInstanceSetBuffer('matrix', bufferMatrices, 16);
      this.addToSceneAndCaustic(loadedMeshes);
    }).catch((e) => { console.error(e); });

    // uncomment to get the direction axes for debugging
    // const debugAxes = boidsManager.boids.map(
    //   i => new BABYLON.AxesViewer(this.scene, 1.0)
    // );
    return {
      models: [mainMesh],
      boidsManager,
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

        return (deltaTime) => {
          if (mainMesh) {
            // mainMesh.bakedVertexAnimationManager.time += deltaTime;
            _boids.update(deltaTime);
            for (let i = 0; i < total; i++) {
              const boid = _boids.boids[i];

              // compute our quaternion from the direction to point to it

              // where we are going to
              boid.velocity.normalizeToRef(direction);
              // cross the direction with a fixed "up" vector and we get the side direction.
              BABYLON.Vector3.CrossToRef(direction, yDirection, sideDirection);
              // and cross it again to get the actual up direction
              BABYLON.Vector3.CrossToRef(sideDirection, direction, topDirection);
              // build the quaternion
              BABYLON.Quaternion.RotationQuaternionFromAxisToRef(sideDirection, direction, topDirection, orientation);

              // debug axes
              // debugAxes[i].update(boid.position, sideDirection, direction, topDirection);

              // update position and orientation
              BABYLON.Matrix.ComposeToRef(
                one,
                orientation,
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
    },
    playing () {
      if (!this.underwater) { return false; }
      if (!this.underwater.animTour) { return false; }
      return !this.underwater.animTour._paused;
    }
  },

  mounted () {
    this.underwater = new Underwater(this);
    // Window.underw = this.underwater;
  },

  beforeDestroy () {
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
