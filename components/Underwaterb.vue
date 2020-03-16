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
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
// import * as Materials from 'babylonjs-materials';
// import Boids from '@corollarium/babylon-boids';

const underwater_fragment = require('!!raw-loader!./underwater_fragmentb.glsl');
const underwater_vertex = require('!!raw-loader!./underwater_vertexb.glsl');
const sea_fragment = require('!!raw-loader!./sea_fragment.glsl');
const sea2_fragment = require('!!raw-loader!./sea2_fragment.glsl');
const sea_vertex = require('!!raw-loader!./sea_vertex.glsl');
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

      renderTargetCaustic: null,
      causticMaterial: null,
      causticBlackMaterial: null,
      waterMaterial: null,
      rttMaterials: [],

      mantas: [],

      // simulation / GUI
      ascentSpeed: 0,
      depth: 0,
      lastDepth: 0,
      time: 0,
      air: 100,
      fps: 0
    };
  },

  computed: {
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

    // this.loadSky();
    this.loadOcean();
    const promises = [];
    promises.push(this.loadTerrain());
    // promises.push(this.loadMantas());
    // const fish = this.loadFishFlock('/models/fish/', 'scene.gltf', 3);
    // promises.push(fish.promise);
    Promise.all(promises).then(() => {
      console.log('all loaded');
    });

    this.assetsManager.load();
    // this.sceneOptimizer();
    this.debugUtils();

    // Register a render loop to repeatedly render the scene
    const startTime = new Date();
    this.engine.runRenderLoop(() => {
      const endTime = new Date();
      const timeElapsed = (endTime - startTime) / 1000.0; // in s
      const deltaTime = this.engine.getDeltaTime() / 1000.0; // in s

      // update UI
      this.depth = (this.camera.position.y <= 0 ? (-this.camera.position.y).toFixed(1) : 0.0);
      this.time = timeElapsed;
      this.ascentSpeed = (this.camera.position.y - this.lastDepth) / deltaTime;
      this.lastDepth = this.camera.position.y;

      // inspector
      const t = document.getElementById('inspector-host');
      if (t) {
        t.style.position = 'absolute';
      }

      // update shaders
      if (this.causticMaterial) {
        this.causticMaterial.setFloat('time', timeElapsed);
      }
      if (this.waterMaterial) {
        this.waterMaterial.setFloat('time', timeElapsed);
        this.waterMaterial.setVector3('cameraPosition', this.camera.position);
        this.waterMesh.position.x = this.camera.x;
        this.waterMesh.position.z = this.camera.z;
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
    document.querySelector('footer.footer').style.display = 'inherit';
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

      this.engine = new BABYLON.Engine(container, true); // Generate the BABYLON 3D engine
      this.engine.loadingUIText = 'Mergulho na Laje de Santos';
      this.scene = new BABYLON.Scene(this.engine);
      this.scene.clearColor = BABYLON.Color3.FromHexString('#2963CF');

      // Add a camera to the scene and attach it to the canvas
      this.camera = new BABYLON.UniversalCamera(
        'Camera',
        new BABYLON.Vector3(-16.12, -6, 28),
        this.scene
      );
      this.camera.applyGravity = false;
      this.camera.speed = 0.05;
      // Set the ellipsoid around the camera (e.g. your player's size)
      this.camera.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
      window.camera = this.camera;

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
      this.camera.maxZ = 50;
      this.camera.setTarget(new BABYLON.Vector3(-15.2, -6.36, 27.62));
      this.camera.attachControl(container, true);

      // Enable Collisions
      this.scene.collisionsEnabled = true;
      this.camera.checkCollisions = true;

      this.assetsManager = new BABYLON.AssetsManager(this.scene);
      this.assetsManager.onTaskErrorObservable.add(function (task) {
        console.error('task failed', task.errorObject.message, task.errorObject.exception);
      });
    },

    sceneOptimizer () {
      const optimizer = BABYLON.SceneOptimizer.OptimizeAsync(this.scene);
      return optimizer;
    },

    debugUtils () {
      this.scene.debugLayer.show();
      document.querySelector('footer.footer').style.display = 'none';
    },

    resize () {
      this.engine.resize();
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

      BABYLON.Effect.ShadersStore.seaVertexShader = sea_vertex.default;
      BABYLON.Effect.ShadersStore.seaFragmentShader = sea_fragment.default;
      BABYLON.Effect.ShadersStore.sea2VertexShader = sea_vertex.default;
      BABYLON.Effect.ShadersStore.sea2FragmentShader = sea2_fragment.default;
    },

    composer () {
      BABYLON.Effect.ShadersStore.underwaterVertexShader = underwater_vertex.default;
      BABYLON.Effect.ShadersStore.underwaterFragmentShader = underwater_fragment.default;

      const depthPass = this.scene.enableDepthRenderer();

      const renderSceneBase = new BABYLON.PassPostProcess('imagePass', 1.0, null, BABYLON.Texture.NEAREST_SAMPLINGMODE, this.engine);

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
          'depthTexture',
          'causticTexture'
        ],
        1.0,
        this.camera,
        0,
        this.engine
      );

      const startTime = new Date();
      underwaterPass.onApply = (effect) => {
        const endTime = new Date();
        const timeDiff = (endTime - startTime) / 1000.0; // in s
        effect.setColor3('fogColor', this.scene.clearColor);
        effect.setFloat2('cameraMinMaxZ', this.camera.minZ, this.camera.maxZ);
        effect.setFloat('time', timeDiff);
        effect.setTexture('causticTexture', this.renderTargetCaustic);
        effect.setTexture('depthTexture', depthPass.getDepthMap());
        effect.setVector3('cameraPosition', this.camera.position);
      };

      const renderLayer = new BABYLON.PostProcessRenderEffect(
        this.engine,
        'renderLayer',
        function () { return [renderSceneBase]; }//, renderCausticPass, underwaterPass]; }
      );
      const pipeline = new BABYLON.PostProcessRenderPipeline(this.engine, 'pipeline');
      pipeline.addEffect(renderLayer);
      pipeline.samples = 4;
      pipeline.fxaaEnabled = true;
      this.scene.postProcessRenderPipelineManager.addPipeline(pipeline);
      this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline('pipeline', this.camera);
    },

    loadSky () {
      const skybox = BABYLON.Mesh.CreateBox('skyBox', 5000.0, this.scene);
      const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', this.scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('textures/TropicalSunnyday/TropicalSunnyDay', this.scene);
      skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
      skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.disableLighting = true;
      skybox.material = skyboxMaterial;
    },

    loadOcean () {
      const channel2 = new BABYLON.Texture('/textures/sea/channel2.jpg', this.scene);
      const channel3 = new BABYLON.Texture('/textures/sea/channel3.jpg', this.scene);
      const waterMaterial = new BABYLON.ShaderMaterial(
        'water material',
        this.scene,
        'sea2',
        {
          attributes: ['position', 'normal', 'uv'],
          uniforms: [
            'world', 'worldView', 'worldViewProjection', 'view', 'projection',
            'time', 'color', 'channel2', 'channel3', 'cameraPosition'
          ]
        }
      );
      waterMaterial.setColor3('waterColor', this.scene.clearColor);
      waterMaterial.setFloat('time', 0);
      waterMaterial.setVector3('cameraPosition', this.camera.position);
      waterMaterial.setTexture('channel2', channel2);
      waterMaterial.setTexture('channel3', channel3);
      waterMaterial.backFaceCulling = false;
      waterMaterial.freeze();

      this.waterMesh = BABYLON.Mesh.CreateGround('waterMesh', 128, 128, 16, this.scene, false);
      // this.waterMesh = BABYLON.Mesh.CreatePlane('waterMesh', { width: 32, height: 32, updatable: false, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, this.scene);
      this.waterMesh.flipFaces();
      this.waterMesh.material = this.waterMaterial = waterMaterial;

      const c = this.getCausticBlackMaterial();
      this.waterMesh.rttMaterial = c;
      this.renderTargetCaustic.renderList.push(this.waterMesh);
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
        this.assetsManager.addMeshTask('terrain', null, '/models/', 'island.glb').onSuccess = (task) => {
          /* task.loadedMeshes[1].simplify(
            [{ quality: 0.9, distance: 25 }, { quality: 0.3, distance: 50 }],
            false,
            BABYLON.SimplificationType.QUADRATIC,
            function () {
              alert('LOD finished');
            }
          ); */
          task.loadedMeshes.forEach((mesh) => {
            if (mesh.freeze) {
              mesh.freeze();
              mesh.freezeWorldMatrix();
              mesh.convertToUnIndexedMesh();
              if (mesh.material) {
                mesh.material.freeze();
              }
            }
          });
          const material = this.addToSceneAndCaustic(task.loadedMeshes);
          material.backFaceCulling = false; // cause model seems inverted
          resolve();
        };
      });
      return p;
    },

    loadBoat () {

    },

    loadFishFlock (modelpath, modelfile, total) {
      /*
      const boids = new Boids(total, new BABYLON.Vector3(0.0, 10.0, 0.0), 10.0);
      boids.cohesion = 0.05;
      boids.separationMinDistance = 10.0;
      const models = [];
      const p = new Promise((resolve, reject) => {
        BABYLON.SceneLoader.LoadAssetContainer(
          modelpath, modelfile, this.scene,
          (container) => {
            container.addAllToScene();
            const c = this.getCausticMaterial();

            container.meshes.forEach((mesh) => {
              mesh.position.y = 10;
              mesh.setEnabled(false);
              if (mesh.material) {
                mesh.material.freeze();
              }
              mesh.rttMaterial = c;
              this.renderTargetCaustic.renderList.push(mesh);
            });

            for (let i = 0; i < total; i++) {
              const entries = container.instantiateModelsToScene(p => 'fish' + p + i);
              for (const node of entries.rootNodes) {
                node.position.x += (i + 1) * 10;
              }
              entries.bird = boids.birds[i];
              models.push(entries);
            }
            resolve();
          }
        );
      });
      return {
        models,
        boids,
        promise: p,
        update: ((_boids, _models) => {
          return (deltaTime) => {
            _boids.update(deltaTime);
            _models.forEach((m) => {
              for (const node of m.rootNodes) {
                node.position.copyFrom(m.bird.position);
                // node.setDirection(m.bird.velocity);
              }
            });
          };
        })(boids, models)
      };
      */
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
            console.log('mantas loaded');
          }
        );
        resolve();
      });
      return p;
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
  height: 150px;
  z-index: 1000;
  border-radius: 10px;
  background: #000;
  font-family: monospace;
  color: #fff;
  text-align: right;

  span {
    display: inline-block;
  }

  #underwater-hud-time {
    margin-top: 10px;
  }

  #underwater-hud-depth-value,
  #underwater-hud-time-value {
    line-height: 0.9;
    font-size: 42px;
    font-family: monospace;
  }

  #underwater-hud-depth-ascent {
    writing-mode: vertical-rl;
  }

  #underwater-hud-depth-name,
  #underwater-hud-time-name {
    color: #4c70ff;
  }

  #underwater-hud-depth-unit,
  #underwater-hud-time-unit {
    vertical-align: top;
  }
}

#sceneExplorer, #inspector-host {
  .label {
    color: white;
    font-weight: normal;
    font-size: 14px;
  }
  .title {
    color: white;
    font-weight: normal;
    font-size: 14px;
    line-height: normal;
    font-family: "Arial";
    line-height: 1;
  }
}
</style>
