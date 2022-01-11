<template>
  <div id="underwater">
    <canvas id="underwater-3d" touch-action="none" />
  </div>
</template>

<script>
/* eslint-disable */
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
// import * as Materials from 'babylonjs-materials';
import BoidsManager from '@corollarium/babylon-boids';
/* eslint-enable */

/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

class BoidsTest {
  base = ''; // base url

  // babylon basis
  engine = null;
  scene = null;
  camera = null;
  assetsManager = null;
  sunLight = null;

  constructor (vueComponent) {
    const container = document.getElementById('underwater-3d');
    document.onfullscreenchange = (event) => {
      vueComponent.isFullscreen = !!document.fullscreenElement;
    };
    this.base = vueComponent.base;

    /*
     * boot renderer, scene, camera
     */

    // Create the scene space
    this.bootScene(container);
    this.lights();

    const promises = [
      // this.loadTerrain() // 38 draw calls
    ];
    const fish = this.loadBoids(
      this.base + 'models/', 'frade.glb',
      50,
      new BABYLON.Vector3(-12.12, -13.2, 27.19),
      [{ from: 1, to: 90, name: 'swim' }]
    );
    promises.push(fish.promise);
    Promise.all(promises).then(() => {
      console.log('all loaded');
    });

    this.assetsManager.load();

    this.camera.speed = 0.5;
    if (vueComponent.$route.query.debug) {
      this.debugUtils();
    }
    // this.instrumentation();

    // Register a render loop to repeatedly render the scene
    const startTime = new Date();
    this.engine.runRenderLoop(() => {
      const endTime = new Date();
      const timeElapsed = (endTime - startTime) / 1000.0; // in s
      const deltaTime = this.engine.getDeltaTime() / 1000.0; // in s

      if (vueComponent.$route.query.debug) {
        // inspector
        const t = document.getElementById('inspector-host');
        if (t) {
          t.style.position = 'absolute';
        }
      }

      fish.update(deltaTime);

      this.scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener('resize', this.resize.bind(this));
  }

  beforeDestroy () {
    window.removeEventListener('resize', this.resize.bind(this));
    document.onfullscreenchange = null;
    this.engine.stopRenderLoop();
    this.scene.dispose();
    this.scene = null;
    this.engine = null;
  }

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
    const cameraInitPoint = new BABYLON.Vector3(-15.51978616737642, 1.3786253122458585, 29.13296827068854);
    if (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0)) {
      /* browser with either Touch Events of Pointer Events
      running on touch-capable device */
      this.camera = new BABYLON.VirtualJoysticksCamera(
        'Camera',
        cameraInitPoint,
        this.scene
      );
    } else {
      this.camera = new BABYLON.UniversalCamera(
        'Camera',
        cameraInitPoint,
        this.scene
      );
    }
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
    this.camera.setTarget(new BABYLON.Vector3(-12.89001753167552, 1.708562384403646, 25.710433418293825));
    this.camera.attachControl(container, true);
    if (this.camera.inputs.attached.virtualJoystick) {
      this.camera.inputs.attached.virtualJoystick._rightjoystick.setJoystickSensibility(0.01);
    }

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

  resize () {
    this.engine.resize();
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

    p.then((_container) => {
      container = _container;
      const loadedMeshes = container.meshes;
      // this.assetsManager.addMeshTask('mesh' + modelfile, null, modelpath, modelfile).onSuccess = (task) => {
      // const loadedMeshes = task.loadedMeshes;

      const causticMaterial = withCaustic ? this.getCausticMaterial() : null;
      // if (loadedMeshes.length !== 1) {
      //   throw new Error('Invalid number of meshes for loadFlock: ' + modelfile);
      // }
      for (const mesh of loadedMeshes) {
        // mesh.position = initialCenterPosition;
        // mesh.scaling = new BABYLON.Vector3(10, 10, 10);
        if (mesh.material) {
          // mesh.material.freeze();
        }
        mesh.alwaysSelectAsActiveMesh = true;
        // mesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;
        // mesh.convertToUnIndexedMesh();
        // mesh.freezeNormals();
        // mesh.freezeWorldMatrix();
      }
      mainMesh = BABYLON.Mesh.CreateBox('tmp', 1.0, this.scene);
      //  loadedMeshes[1];

      if (causticMaterial) {
        mainMesh.rttMaterial = causticMaterial;
        this.renderTargetCaustic.renderList.push(mainMesh);
      }

      baker = new BABYLON.VertexAnimationBaker(this.scene, mainMesh);
      return baker.bakeVertexData(animationRanges);
    }).then((vertexData) => {
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
        // this.scene.stopAnimation(mainMesh);
        // container.animationGroups.map(g => g.pause());

        return {
          container,
          mainMesh,
          bufferMatrices,
          animParameters
        };
      }).catch((e) => { console.error(e); });
  }

  loadBoids (modelpath, modelfile, total, initialCenterPosition, animationRanges, withCaustic = false, fpsDelta = 6) {
    const zero = new BABYLON.Vector3(0, 0, 0);
    const boidsManager = new BoidsManager(
      total,
      zero,
      1.0,
      30.0
    );
    boidsManager.boundsMin.y = -15;
    boidsManager.boundsMax.y = 0;
    boidsManager.cohesion = 0.001;
    boidsManager.alignment = 0.03;
    boidsManager.separationMinDistance = 0.5;
    boidsManager.maxSpeed = 1.0;
    boidsManager.showDebug(this.scene);

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
      const causticMaterial = withCaustic ? this.getCausticMaterial() : null;
      // for (const mesh of loadedMeshes) {
      //   // mesh.position = initialCenterPosition;
      //   //  mesh.scaling = new BABYLON.Vector3(10, 10, 10);
      //   if (mesh.material) {
      //     // mesh.material.freeze();
      //   }
      //   mesh.alwaysSelectAsActiveMesh = true;
      //   // mesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;
      //   // mesh.convertToUnIndexedMesh();
      //   //  mesh.freezeNormals();
      //   // mesh.freezeWorldMatrix();
      // }
      mainMesh = loadedMeshes[1]; // assumes __root__ is zero

      if (causticMaterial) {
        mainMesh.rttMaterial = causticMaterial;
        this.renderTargetCaustic.renderList.push(mainMesh);
      }

      // Carregando o JSon do Baking
      const fileToFetch = '/bakedAnim/' + modelfile.replace(/\.[^/.]+$/, '.json');
      console.log('Fetching: ' + fileToFetch);
      return fetch(fileToFetch);
    }).then((response) => {
      if (!response.ok) {
        // Constroi o Baking porque não existe
        const baker = new BABYLON.VertexAnimationBaker(this.scene, mainMesh);
        baker.bakeVertexData(animationRanges).then((vertexData) => {
          console.log('Serializando Baking');
          const vertexDataJSON = baker.serializeBakedVertexDataToJSON(vertexData);
          window.createdJsonFile = vertexDataJSON;
          const a = document.createElement('a');

          a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(vertexDataJSON));
          a.setAttribute('download', modelfile.replace(/\.[^/.]+$/, '.json'));
          a.click();

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
          // container.animationGroups.map(g => g.pause());
        });
        throw new Error('Error loading JSon');
      }
      return response.text();
    }).then((json) => {
      window.loadedJsonFile = json;
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
        const up = new BABYLON.Vector3(0, 1, 0);
        const m = BABYLON.Matrix.Identity();
        const q = BABYLON.Quaternion.Identity();

        return (deltaTime) => {
          if (mainMesh && mainMesh.bakedVertexAnimationManager) {
            mainMesh.bakedVertexAnimationManager.time += deltaTime;
            _boids.update(deltaTime);
            for (let i = 0; i < total; i++) {
              const boid = _boids.boids[i];

              // q.x = boid.velocity.x;
              // q.y = boid.velocity.y;
              // q.z = boid.velocity.z;
              // q.w = 0; // Math.PI;
              // q.normalize();

              const axis3 = BABYLON.Vector3.Cross(up, boid.velocity);
              const axis2 = BABYLON.Vector3.Cross(axis3, boid.velocity);

              BABYLON.Matrix.ComposeToRef(
                one,
                new BABYLON.Quaternion.RotationQuaternionFromAxis(axis2, axis3, boid.velocity),
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
      isFullscreen: false
    };
  },

  computed: {
    base () {
      return this.$router.options.base;
    }
  },

  mounted () {
    this.underwater = new BoidsTest(this);
    window.underwater = this.underwater;
  },

  methods: {
    fullscreen () {
      document.getElementById('underwater').requestFullscreen();
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
  z-index: 10;
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

#underwater-fullscreen {
  position: absolute;
  top: 20px;
  left: 0;
  padding: 20px;
  margin: 0px;
  z-index: 1;
  max-width: 80%;
  line-height: 1.2em;
  border-radius: 10px;
  font-size: 42px;
  background: #004;
  color: #fff;
  text-align: center;
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
