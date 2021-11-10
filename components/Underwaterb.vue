<template>
  <div id="underwater">
    <canvas id="underwater-3d" touch-action="none" />
    <div id="underwater-debug">
      {{ fps }} fps
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
  </div>
</template>

<script>
/* eslint-disable */
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import OceanPostProcess from './OceanPostProcess';
// import * as Materials from 'babylonjs-materials';
import BoidsManager from '@corollarium/babylon-boids';

const underwater_vertex = require('!!raw-loader!./underwater_vertexb.glsl');
const underwater_fragment = require('!!raw-loader!./underwater_fragmentb.glsl');
const caustic_fragment = require('!!raw-loader!./caustic_fragmentb.glsl');
const causticblack_fragment = require('!!raw-loader!./causticblack_fragmentb.glsl');
const caustic_vertex = require('!!raw-loader!./caustic_vertexb.glsl');
const causticblack_vertex = require('!!raw-loader!./caustic_vertexb.glsl');
/* eslint-enable */

/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

export default {
  props: {
  },

  data () {
    return {
      // 3D
      engine: null,
      scene: null,
      camera: null,
      assetsManager: null,

      oceanPostProcess: null,
      renderTargetCaustic: null,
      causticMaterial: null,
      causticBlackMaterial: null,
      rttMaterials: [],

      mantas: [],
      turtles: [],

      // simulation / GUI
      ascentSpeed: 0,
      depth: 0,
      lastDepth: 0,
      time: 0,
      air: 100,
      fps: 0,
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
      if (this.ascentSpeed < 1.0 / 60.0) {
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
    const container = document.getElementById('underwater-3d');

    /*
     * boot renderer, scene, camera
     */

    // Create the scene space
    this.bootScene(container);
    this.lights();
    this.materials();
    this.composer();

    const promises = [
      this.loadTerrain(),
      this.loadMoreiaBarco(),
      this.loadDiverBoat()
      // this.loadMantas(),
      // this.loadTurtle(),
    ];
    // const fish = this.loadFishFlock('/models/fish/', 'scene.gltf', 3);
    // promises.push(fish.promise);
    Promise.all(promises).then(() => {
      console.log('all loaded');
    });

    this.assetsManager.load();
    // this.sceneOptimizer();
    if (this.$route.query.debug) {
      this.camera.speed = 0.5;
      this.debugUtils();
    }
    window.ccc = this.camera;

    // Register a render loop to repeatedly render the scene
    const startTime = new Date();
    let isUnderwater = false;
    this.engine.runRenderLoop(() => {
      const endTime = new Date();
      const timeElapsed = (endTime - startTime) / 1000.0; // in s
      const deltaTime = this.engine.getDeltaTime() / 1000.0; // in s

      // update UI
      const isUnderwaterNow = this.camera.position.y <= 0;
      if (isUnderwater !== isUnderwaterNow) {
        isUnderwater = isUnderwaterNow;
      }
      this.depth = (isUnderwater ? (-this.camera.position.y).toFixed(1) : 0.0);
      this.time = timeElapsed;
      this.ascentSpeed = (this.camera.position.y - this.lastDepth) / deltaTime;
      this.lastDepth = this.camera.position.y;
      this.orientationDegrees = this.camera.rotation.y * 180.0 / Math.PI;

      // inspector
      const t = document.getElementById('inspector-host');
      if (t) {
        t.style.position = 'absolute';
      }

      // update shaders
      if (this.causticMaterial) {
        this.causticMaterial.setFloat('time', timeElapsed);
      }
      this.rttMaterials.forEach(
        (c) => {
          c.setFloat('time', timeElapsed);
        }
      );

      // animate objects
      let d = 0;
      const mantaT = endTime / 10000.0;
      const mantaDirection = new BABYLON.Vector3(Math.sin(mantaT + Math.PI / 2), 0, Math.cos(mantaT + Math.PI / 2));
      const xdelta = 10 * Math.sin(mantaT);
      const zdelta = 10 * Math.cos(mantaT);
      this.mantas.forEach((manta) => {
        for (const node of manta.rootNodes) {
          node.position.x = xdelta + d * 2;
          node.position.y = 10 - d * 1.5;
          node.position.z = zdelta + d * 2;
          node.setDirection(mantaDirection);
        }
        d++;
      });

      // fish.update(deltaTime);

      this.fps = this.engine.getFps().toFixed();
      this.scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener('resize', this.resize);
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.resize);
    this.engine.stopRenderLoop();
    this.scene.dispose();
    this.scene = null;
    this.engine = null;
  },

  methods: {
    bootScene (container) {
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
      this.camera = new BABYLON.UniversalCamera(
        'Camera',
        // new BABYLON.Vector3(-16.12, 1.0, 28),
        new BABYLON.Vector3(-14.12, 25.2, 27.19),
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
      this.camera.setTarget(new BABYLON.Vector3(-16.12, 5.2, 27.19));
      this.camera.attachControl(container, true);

      // Enable Collisions
      this.scene.collisionsEnabled = true;
      this.camera.checkCollisions = true;
      this.scene.freezeActiveMeshes();

      // avoid clearing the scene to optimize
      this.scene.autoClear = false; // Color buffer
      this.scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously

      this.assetsManager = new BABYLON.AssetsManager(this.scene);
      this.assetsManager.onTaskErrorObservable.add(function (task) {
        console.error('task failed', task.name, task.errorObject.message, task.errorObject.exception);
      });
    },

    sceneOptimizer () {
      const optimizer = BABYLON.SceneOptimizer.OptimizeAsync(this.scene);
      return optimizer;
    },

    debugUtils () {
      this.scene.debugLayer.show();
    },

    resize () {
      // this.engine.resize();
    },

    lights () {
      // Add lights to the scene
      const ambientLight = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), this.scene);
      ambientLight.diffuse = BABYLON.Color3.FromHexString('#CCCCCC');
      ambientLight.intensity = 0.4;
      const sunLight = new BABYLON.DirectionalLight('DirectionalLight', new BABYLON.Vector3(0.2, -1, 0), this.scene);
      sunLight.diffuse = BABYLON.Color3.FromHexString('#FFFFFF');
      ambientLight.intensity = 0.8;
    },

    getCausticMaterial () {
      const c = this.causticMaterial.clone();
      c.freeze(); // freeze because we'll only update uniforms
      this.rttMaterials.push(c);
      return c;
    },

    getCausticBlackMaterial () {
      const c = this.causticBlackMaterial.clone();
      c.freeze(); // freeze because we'll only update uniforms
      this.rttMaterials.push(c);
      return c;
    },

    materials () {
      BABYLON.Effect.ShadersStore.causticVertexShader = caustic_vertex.default;
      BABYLON.Effect.ShadersStore.causticFragmentShader = caustic_fragment.default;
      BABYLON.Effect.ShadersStore.causticblackVertexShader = causticblack_vertex.default;
      BABYLON.Effect.ShadersStore.causticblackFragmentShader = causticblack_fragment.default;
      this.causticMaterial = new BABYLON.ShaderMaterial(
        'caustic material',
        this.scene,
        'caustic',
        {
          attributes: ['position', 'normal', 'uv'],
          uniforms: ['world', 'worldView', 'worldViewProjection', 'view', 'projection', 'time', 'direction']
        }
      );
      this.causticMaterial.freeze();

      this.causticBlackMaterial = new BABYLON.ShaderMaterial(
        'caustic black material',
        this.scene,
        'causticblack',
        {
          attributes: ['position', 'normal', 'uv'],
          uniforms: ['world', 'worldView', 'worldViewProjection', 'view', 'projection', 'time', 'direction']
        }
      );
      this.causticBlackMaterial.freeze();
    },

    composer () {
      // composes the actual texture with our underwater shader pass.
      BABYLON.Effect.ShadersStore.underwaterVertexShader = underwater_vertex.default;
      BABYLON.Effect.ShadersStore.underwaterFragmentShader = underwater_fragment.default;

      const depthPass = this.scene.enableDepthRenderer();

      const renderSceneBase = new BABYLON.PassPostProcess('imagePass', 1.0, null, BABYLON.Texture.NEAREST_SAMPLINGMODE, this.engine);
      renderSceneBase.clearColor = new BABYLON.Color4(0.0, 0.0, 0.0, 0.0);
      // renderSceneBase.alphaMode = BABYLON.Engine.ALPHA_COMBINE;

      this.renderTargetCaustic = new BABYLON.RenderTargetTexture('caustic', 1024, this.scene);
      this.scene.customRenderTargets.push(this.renderTargetCaustic);
      this.setRTTMaterials();

      const underwaterPass = new BABYLON.PostProcess(
        'Underwater pass',
        'underwater',
        [
          'fogColor',
          'cameraMinMaxZ',
          'cameraPosition',
          'time'
        ],
        [
          'skyTexture',
          'depthTexture',
          'causticTexture',
          'oceanDepthTexture'
        ],
        1.0,
        null, // this.camera,
        0,
        this.engine
      );

      const pipeline = new BABYLON.PostProcessRenderPipeline(this.engine, 'pipeline');

      // create the ocean pp
      const oceanPP = this.loadOceanPP();
      this.oceanPostProcess = oceanPP;

      // we need to update the depth texture from the ocean pass to mix it with the underwater depth
      let firstOceanPPCall = true;
      let oceanDepthTexture = null;
      oceanPP.onApplyObservable.add((effect) => {
        if (firstOceanPPCall) {
          firstOceanPPCall = false;
          const rtWrapper = underwaterPass.inputTexture;
          oceanDepthTexture = rtWrapper.createDepthStencilTexture(undefined, undefined, this.engine.isStencilEnable);
          oceanDepthTexture.name = 'underwaterDepthStencil';
        }
        this.engine.setDepthBuffer(true);
        this.engine.setDepthWrite(true);
        this.engine.clear(null, false, true, false);
      });

      // bind the depth from the ocean
      underwaterPass.onApplyObservable.add((effect) => {
        effect._bindTexture('oceanDepthTexture', oceanDepthTexture);
      });
      const skyTexture = new BABYLON.Texture(
        this.base + 'textures/half_kloofendal_48d_partly_cloudy_4k.jpg',
        this.scene,
        false,
        true, // invert y
        BABYLON.Texture.NEAREST_NEAREST
      );
      this.oceanPostProcess.skyTexture = skyTexture;

      // bind undertware stuff
      const startTime = new Date();
      underwaterPass.onApply = (effect) => {
        const endTime = new Date();
        const timeDiff = (endTime - startTime) / 1000.0; // in s
        effect.setColor3('fogColor', new BABYLON.Color3(0, 0.5, 0.85));
        effect.setFloat2('cameraMinMaxZ', this.camera.minZ, this.camera.maxZ);
        effect.setFloat('time', timeDiff);
        effect.setTexture('causticTexture', this.renderTargetCaustic);
        effect.setTexture('depthTexture', depthPass.getDepthMap());
        effect.setTexture('skyTexture', skyTexture);
        effect.setVector3('cameraPosition', this.camera.position); // scale so water is in meters
      };

      // make it puuuurtier
      const fxaa = new BABYLON.FxaaPostProcess('fxaa', 1.0, null, null, this.engine);

      const renderLayer = new BABYLON.PostProcessRenderEffect(
        this.engine,
        'renderLayer',
        function () { return [renderSceneBase, oceanPP, underwaterPass, fxaa]; }
      );

      pipeline.addEffect(renderLayer);
      pipeline.samples = 4;
      pipeline.fxaaEnabled = true;
      this.scene.postProcessRenderPipelineManager.addPipeline(pipeline);
      this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline('pipeline', this.camera);
    },

    loadOceanPP () {
      const nearestPOT = x => 2 ** Math.ceil(Math.log(x) / Math.log(2));
      const oceanOptions = {
        width: nearestPOT(this.camera.getEngine().getRenderWidth()),
        height: nearestPOT(this.camera.getEngine().getRenderHeight())
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
      pp.autoClear = false;
      pp.worldScale = 0.2;

      return pp;
    },

    /**
     * Slow version of RTT exchange material but easier to debug
     */
    setRTTMaterialsSlow () {
      this.renderTargetCaustic.onBeforeRender = () => {
        // Apply the shader on all meshes
        for (const i in this.renderTargetCaustic.renderList) {
          // this.renderTargetCaustic.renderList[i].overrideMaterialSideOrientation = true;
          this.renderTargetCaustic.renderList[i]._saved = this.renderTargetCaustic.renderList[i].material;
          this.renderTargetCaustic.renderList[i].material = this.renderTargetCaustic.renderList[i].rttMaterial;
        }
      };
      this.renderTargetCaustic.onAfterRender = () => {
        // Apply the shader on all meshes
        for (const i in this.renderTargetCaustic.renderList) {
          this.renderTargetCaustic.renderList[i].material = this.renderTargetCaustic.renderList[i]._saved;
        }
      };
    },

    setRTTMaterials () {
      // before we render the target, swap materials.
      this.renderTargetCaustic.onBeforeRender = (e) => {
        // Apply the shader on all meshes
        this.renderTargetCaustic.renderList.forEach((mesh) => {
          if (mesh.getClassName() === 'InstancedMesh') {
            return;
          }
          // the PBR material takes some time to be loaded, it's possible that in the first few frames mesh.material is null...
          if (mesh.material && !mesh.isFrozen && ('isReady' in mesh) && mesh.isReady(true)) {
            // backup effects
            const _origSubMeshEffects = [];
            mesh.subMeshes.forEach((submesh) => {
              _origSubMeshEffects.push([submesh.effect, submesh._materialDefines]);
            });
            mesh.isFrozen = true;
            mesh.material.freeze(); // freeze material so it won't be recomputed onAfter
            // store old material/effects
            mesh._saved_orig_material = mesh.material;
            mesh._origSubMeshEffects = _origSubMeshEffects;
          }
          if (!mesh._origSubMeshEffects) {
            return;
          }
          // swap the material
          mesh.material = mesh.rttMaterial;
          // and swap the effects
          if (mesh._rtt_subMeshEffects) {
            for (let s = 0; s < mesh.subMeshes.length; ++s) {
              mesh.subMeshes[s].setEffect(...mesh._rtt_subMeshEffects[s]);
            }
          }
        });
      };
      this.renderTargetCaustic.onAfterRender = () => {
        // Set the original shader on all meshes
        this.renderTargetCaustic.renderList.forEach((mesh) => {
          if (mesh.getClassName() === 'InstancedMesh') {
            return;
          }
          // nothing to do, early bail
          if (!mesh._origSubMeshEffects) {
            return;
          }
          // backup sub effects on the rtt shader
          if (!mesh._rtt_subMeshEffects) {
            mesh._rtt_subMeshEffects = [];
            mesh.subMeshes.forEach((submesh) => {
              mesh._rtt_subMeshEffects.push([submesh.effect, submesh._materialDefines]);
            });
          }
          // swap back to original material
          mesh.material = mesh._saved_orig_material;
          for (let s = 0; s < mesh.subMeshes.length; ++s) {
            mesh.subMeshes[s].setEffect(...mesh._origSubMeshEffects[s]);
          }
        });
      };
    },

    /**
     * @return the caustic material
     */
    addToSceneAndCaustic (meshes) {
      const c = this.getCausticMaterial();
      meshes.forEach((mesh) => {
        mesh.rttMaterial = c;
        this.renderTargetCaustic.renderList.push(mesh);
      });
      return c;
    },

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
          material.backFaceCulling = false; // cause model seems inverted

          resolve();
        };

        // load the rocks
        this.assetsManager.addMeshTask('rocks', null, this.base + 'models/ilha/', 'rocks.glb').onSuccess = (task) => {
          console.log('rocks glb start');
          task.loadedMeshes.forEach((mesh) => {
            if (mesh.name === 'rockLow1' || mesh.name === 'rockLow1.001' || mesh.name === 'rockLow1.002') {
              // store the first rock model.
              mesh.freezeNormals();
              mesh.freezeWorldMatrix();
              if (mesh.material) {
                mesh.material.freeze();
              }
              rocks.push(mesh);
            }
          });
          console.log('rocks glb end');
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
          task.loadedMeshes.forEach((mesh) => {
            if (mesh.name.includes('rock')) {
              // store information from rocks
              mesh.computeWorldMatrix();
              positions.push(mesh.getAbsolutePivotPoint());
              rotations.push(mesh.rotationQuaternion);
              scalings.push(mesh.absoluteScaling);
              mesh.dispose();
              return;
            } else if (mesh.freeze) {
              mesh.doNotSyncBoundingInfo = true;
              if (mesh.material) {
                mesh.material.freeze();
              }
              mesh.alwaysSelectAsActiveMesh = true;
              mesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;
              mesh.convertToUnIndexedMesh();
              mesh.freezeNormals();
              mesh.freezeWorldMatrix();
              mesh.freeze();
              mesh.bakeCurrentTransformIntoVertices();
            }
            actualLoaded.push(mesh);
          });
          // to generate the

          const material = this.addToSceneAndCaustic(actualLoaded);
          material.backFaceCulling = false; // cause model seems inverted
          terrainLoaded = true;
          processRocks();
        };
      });
      return p;
    },

    loadMoreiaBarco () {
      const p = new Promise((resolve, reject) => {
        this.assetsManager.addMeshTask('barcoMoreia', null, this.base + 'models/', 'barcoMoreia.glb').onSuccess = (task) => {
          console.log(task);
          for (const mesh of task.loadedMeshes) {
            mesh.position = new BABYLON.Vector3(-14.12, -15.2, 27.19);
            if (mesh.material) {
              mesh.material.freeze();
            }
            mesh.alwaysSelectAsActiveMesh = true;
            mesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;
            // mesh.convertToUnIndexedMesh();
            mesh.freezeNormals();
            mesh.freezeWorldMatrix();
            this.addToSceneAndCaustic([mesh]);
          }
          resolve();
        };
      });
      return p;
    },

    loadDiverBoat () {
      const p = new Promise((resolve, reject) => {
        this.assetsManager.addMeshTask('diver_with_boat', null, this.base + 'models/', 'diver_with_boat.glb').onSuccess = (task) => {
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
    },

    loadTurtle () {
      const p = new Promise((resolve, reject) => {
        this.assetsManager.addMeshTask('tartaruga', null, this.base + 'models/tartaruga/', 'tartaruga.glb').onSuccess = (task) => {
          for (const mesh of task.loadedMeshes) {
            mesh.position = this.camera.position.clone();
            mesh.position.x += 10;
            for (const a in mesh.animationGroups) {
              a.start(true);
            }
            if (mesh.material) {
              mesh.material.freeze();
            }
            mesh.alwaysSelectAsActiveMesh = true;
            mesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;
            mesh.convertToUnIndexedMesh();
            mesh.freezeNormals();
            mesh.freezeWorldMatrix();
            this.turtles.push(mesh);
          }
          // freeze all active meshes disables animation, so prepare the skeleton.
          this.scene.onBeforeRenderObservable.add(() => {
            task.loadedSkeletons.forEach(skeleton => skeleton.prepare());
          });

          resolve();
        };
      });
      return p;
    },

    /**
     *
     */
    loadFlock (modelpath, modelfile, total, initialCenterPosition, withCaustic = false) {
      // eslint-disable-next-line no-undef
      const boidsManager = new BoidsManager(
        total,
        initialCenterPosition,
        10.0,
        20.0
      );
      boidsManager.cohesion = 0.05;
      boidsManager.separationMinDistance = 1.0;
      boidsManager.maxSpeed = 0.2;

      let mesh = null;
      const bufferMatrices = new Float32Array(16 * total);

      const p = new Promise((resolve, reject) => {
        this.assetsManager.addMeshTask('tartaruga', null, this.base + modelpath, modelfile).onSuccess = (task) => {
          const causticMaterial = withCaustic ? this.getCausticMaterial() : null;
          if (task.loadedMeshes.length !== 0) {
            throw new Error('Invalid number of meshes for loadFlock: ' + modelfile);
          }

          mesh = task.loadedMeshes[0];
          mesh.position = initialCenterPosition;
          for (const a in mesh.animationGroups) {
            a.start(true);
          }

          if (causticMaterial) {
            mesh.rttMaterial = causticMaterial;
            this.renderTargetCaustic.renderList.push(mesh);
          }
          if (mesh.material) {
            mesh.material.freeze();
          }

          mesh.alwaysSelectAsActiveMesh = true;
          mesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;
          mesh.convertToUnIndexedMesh();
          mesh.freezeNormals();
          mesh.freezeWorldMatrix();

          // thin instance version
          const bufferMatrices = new Float32Array(16 * total);
          for (let i = 0; i < total; i++) {
            const m = BABYLON.Matrix.Compose(
              new BABYLON.Vector3(1.0, 1.0, 1.0),
              new BABYLON.Quaternion(1.0, 0, 0, 0),
              initialCenterPosition + new BABYLON.Vector3(this.random(-1, 1), this.random(-1, 1), this.random(-1, 1))
            );
            m.copyToArray(bufferMatrices, i * 16);
          }
          // TODO: baked vat
          mesh.thinInstanceSetBuffer('matrix', bufferMatrices, 16);
          // freeze all active meshes disables animation, so prepare the skeleton.
          // this.scene.onBeforeRenderObservable.add(() => {
          //   task.loadedSkeletons.forEach(skeleton => skeleton.prepare());
          // });

          resolve();
        };
      });

      return {
        models: [mesh],
        boidsManager,
        promise: p,
        update: ((_boids, _models, total) => {
          return (deltaTime) => {
            _boids.update(deltaTime);
            for (let i = 0; i < total; i++) {
              const matrix = BABYLON.Matrix.Compose(
                boidsManager.boid.position,
                new BABYLON.Quaternion(
                  boidsManager.boid.velocity.x,
                  boidsManager.boid.velocity.y,
                  boidsManager.boid.velocity.z,
                  0.0
                ),
                initialCenterPosition
              );
              matrix.copyToArray(bufferMatrices, i * 16);
            }
            mesh.thinInstanceSetBuffer('matrix', bufferMatrices, 16);
          };
        })(boidsManager, mesh, total)
      };
    },

    loadMantas (total = 2) {
      const p = new Promise((resolve, reject) => {
        BABYLON.SceneLoader.LoadAssetContainer(
          '/models/manta/', 'scene.gltf', this.scene,
          (container) => {
            container.addAllToScene();
            const c = this.getCausticMaterial();

            container.meshes.forEach((mesh) => {
              mesh.scaling = new BABYLON.Vector3(0.02, 0.02, 0.02); // TODO
              mesh.position.y = 10;
              mesh.setEnabled(false);
              if (mesh.material) {
                mesh.material.freeze();
              }
              mesh.rttMaterial = c;
              this.renderTargetCaustic.renderList.push(mesh);
            });

            for (let i = 0; i < total; i++) {
              const entries = container.instantiateModelsToScene(p => 'manta' + p + i);
              for (const node of entries.rootNodes) {
                node.position.x += (i + 1) * 10;
                this.mantas.push(entries);
                this.renderTargetCaustic.renderList.push(node);
                this.renderTargetCaustic.renderList = this.renderTargetCaustic.renderList.concat(node.getChildMeshes());
              }
              for (const group of entries.animationGroups) {
                group.speedRatio = 1.0 - 0.1 * i;
                group.play(true);
              }
            }
          }
        );
        resolve();
      });
      return p;
    },

    random (min, max) {
      return Math.random() * (max - min) + min;
    },

    clamp (t, min, max) {
      return Math.min(Math.max(t, min), max);
    }
  }
};
</script>

<style lang="less" scoped>
#underwater {
  height: 100vh;
  width: 100vw;
  position: relative;
}

#underwater-3d {
  height: 100vh;
  width: 100vw;
}

#underwater-debug {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  z-index: 1000;
  border-radius: 10px;
  background: #000;
  color: #fff;
  text-align: right;
}

#underwater-hud {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px;
  width: 160px;
  height: 220px;
  z-index: 1000;
  border-radius: 10px;
  background: #000;
  font-family: monospace;
  color: #fff;
  text-align: right;

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

</style>
