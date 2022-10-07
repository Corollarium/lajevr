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
import BoidsWorker from 'worker-loader!./boidsw';
/* eslint-enable */

const v3 = (x, y, z) => new BABYLON.Vector3(x, y, z);

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

    const sp0 = BABYLON.Mesh.CreateSphere('cPoint0', 16, 0.1, this.scene);
    sp0.position = v3(0, 0, 0);
    const sp0Material = new BABYLON.StandardMaterial('sp0Material', this.scene);
    sp0Material.emissiveColor = new BABYLON.Color3(1, 0, 0);
    sp0Material.disableLighting = true;
    sp0.material = sp0Material;
    const sp1 = BABYLON.Mesh.CreateSphere('cPoint1', 16, 0.1, this.scene);
    sp1.position = v3(20, 10, 10);
    const sp1Material = new BABYLON.StandardMaterial('sp1Material', this.scene);
    sp1Material.emissiveColor = new BABYLON.Color3(0, 0, 1);
    sp1Material.disableLighting = true;
    sp1.material = sp1Material;

    const promises = [
      // this.loadTerrain() // 38 draw calls
    ];
    const fish = this.loadBoidsModel(
      this.base + 'models/', 'sargentinho.glb',
      1000, // TODO: less on mobile?
      sp0.position,
      sp1.position,
      [{ from: 1, to: 30, name: 'swim' }]
    );
    promises.push(fish.promise);
    // Promise.all(promises).then(() => {
    //   console.log('all loaded');
    // });

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
    const cameraInitPoint = new BABYLON.Vector3(5, 5, 5);
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

    const params = (new URL(document.location)).searchParams;
    if (params.has('debug')) {
      this.scene.debugLayer.show();
    }

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
    this.camera.setTarget(new BABYLON.Vector3(12.89001753167552, 1.708562384403646, 25.710433418293825));
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

  loadBoidsModel (modelpath, modelfile, total, boundsMin, boundsMax, animationRanges, fpsDelta = 6) {
    let boids = [];
    let debugData = {};

    // run the boid simulation in a separate thread
    const boidsWorkerThread = new BoidsWorker();
    boidsWorkerThread.onmessage = (e) => {
      if (e.data.command === 'started') {
        // IF DEBUG
        debugData = this.showBoidsDebug(
          this.scene,
          e.data.boids,
          new BABYLON.Vector3().copyFrom(e.data.boundsMin),
          new BABYLON.Vector3().copyFrom(e.data.boundsMax)
        );
      } else {
        boids = e.data.boids;

        // IF DEBUG
        debugData.center.position.copyFrom(e.data.center);
      }
    };

    // start the simulation and set parameters
    boidsWorkerThread.postMessage(
      { command: 'bundle',
        list: [
          {
            command: 'start',
            total,
            center: boundsMin.add(boundsMax.subtract(boundsMin).scale(0.5)),
            initialRadius: 1.0,
            boundRadiusScale: 30.0
          },
          { command: 'set', name: 'boundsMin', value: boundsMin },
          { command: 'set', name: 'boundsMax', value: boundsMax },
          { command: 'calculateBounds' },
          { command: 'set', name: 'cohesion', value: 0.001 },
          { command: 'set', name: 'alignment', value: 0.03 },
          { command: 'set', name: 'separationMinDistance', value: 0.5 },
          { command: 'set', name: 'maxSpeed', value: 1.0 }
        ]
      });

    // keep them around the center
    // boidsManager.addForce(
    //   (_manager, boid) => {
    //     return initialCenterPosition.subtract(boid.position).scale(-5000.4);
    //   }
    // );
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
        this.scene.stopAnimation(mesh);
        // mesh.alwaysSelectAsActiveMesh = true;
        // mesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;
        // mesh.convertToUnIndexedMesh();
      }
      const box = BABYLON.BoxBuilder.CreateBox('rooxxt', { size: 1 }, this.scene);
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

    return {
      models: [mainMesh],
      boidsWorkerThread,
      promise: p,
      update: ((_models, total) => {
        // pre declare variables to avoid GC
        const one = new BABYLON.Vector3(1, 1, 1);
        const direction = new BABYLON.Vector3(1, 1, 1);
        const m = BABYLON.Matrix.Identity();
        const orientation = BABYLON.Quaternion.Zero();
        const lastDirection = Array.from({ length: total }, (_, i) => new BABYLON.Vector3(0, 0, 0));
        const boidPosition = new BABYLON.Vector3(1, 1, 1);
        const boidVelocity = new BABYLON.Vector3(1, 1, 1);

        return (deltaTime) => {
          if (mainMesh) {
            // mainMesh.bakedVertexAnimationManager.time += deltaTime;
            for (let i = 0; i < boids.length; i++) {
              const boid = boids[i];
              boidPosition.copyFrom(boid.position);
              boidVelocity.copyFrom(boid.velocity);

              // visual debug
              if (debugData.boids) {
                const debug = debugData.boids[i];
                const path = [boidPosition.add(boidVelocity.scale(10.0)), boidPosition.clone()];
                // debug.force = BABYLON.MeshBuilder.CreateTube(debug.force.name, { path, radius: 0.01, instance: debug.force });

                BABYLON.Matrix.Translation(
                  boidPosition.x,
                  boidPosition.y,
                  boidPosition.z
                ).copyToArray(debugData.influenceMatrices, 16 * i);
                // old  debug.influence.position.copyFrom(boidPosition);
              }

              // compute our quaternion from the direction to point to it
              boidVelocity.normalizeToRef(direction);
              const fin = BABYLON.Vector3.Cross(lastDirection[i], direction);
              // should never be upside down.
              fin.y = -Math.abs(fin.y);
              lastDirection[i].copyFrom(direction);
              const side = BABYLON.Vector3.Cross(lastDirection[i], fin);
              // BABYLON.Quaternion.RotationQuaternionFromAxisToRef(side, lastDirection[i], fin, orientation);

              // update position and orientation
              BABYLON.Matrix.ComposeToRef(
                one,
                orientation,
                boidPosition,
                m
              );
              m.copyToArray(bufferMatrices, i * 16);
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

  /**
     * Turns on debug menu and helpers.
     * @param {BABYLON.Scene} scene
     */
  showBoidsDebug (scene, boids, boundsMin, boundsMax) {
    const name = 'xxx';
    const debugData = {
      boids: []
    };

    // build a material
    const centerMaterial = new BABYLON.StandardMaterial('debug_center', scene);
    centerMaterial.diffuseColor = BABYLON.Color3.FromHexString('#FF00FF');
    debugData.center = BABYLON.MeshBuilder.CreateSphere(
      'center',
      {
        diameter: 0.1,
        segments: 8
      }
    );
    debugData.center.material = centerMaterial;

    // build bbox
    const bboxMaterial = new BABYLON.StandardMaterial('debug_bbox', scene);
    bboxMaterial.emissiveColor = BABYLON.Color3.FromHexString('#00FF00');
    bboxMaterial.disableLighting = true;
    bboxMaterial.wireframe = true;

    debugData.bbox = BABYLON.MeshBuilder.CreateBox(
      'boids_bbox',
      {},
      scene
    );
    debugData.bbox.scaling.x = Math.abs(boundsMax.x - boundsMin.x);
    debugData.bbox.scaling.y = Math.abs(boundsMax.y - boundsMin.y);
    debugData.bbox.scaling.z = Math.abs(boundsMax.z - boundsMin.z);
    debugData.bbox.position = boundsMin.add(boundsMax.subtract(boundsMin).scale(0.5));
    debugData.bbox.material = bboxMaterial;

    const wireframeMaterial = new BABYLON.StandardMaterial('debug_wireframe', scene);
    wireframeMaterial.diffuseColor = BABYLON.Color3.FromHexString('#FFFFFF');
    wireframeMaterial.wireframe = true;
    let i = 0;

    debugData.influenceMesh = BABYLON.MeshBuilder.CreateSphere(
        `boid_influence_${name}`,
        {
          diameter: 1.0,
          segments: 8
        }
    );
    debugData.influenceMesh.scaling.setAll(0.5); // TODO, should be separationMinDistance
    debugData.influenceMesh.material = wireframeMaterial;

    debugData.influenceMatrices = new Float32Array(16 * boids.length);

    for (const boid of boids) {
      const debug = {};
      // TODO thin instances
      // debug.force = BABYLON.MeshBuilder.CreateTube(
      //   `boid_arrow_${i}`,
      //   {
      //     path: [new BABYLON.Vector3().copyFrom(boid.position).add(new BABYLON.Vector3().copyFrom(boid.velocity)), new BABYLON.Vector3().copyFrom(boid.position)],
      //     radius: 0.01,
      //     updatable: true
      //   }, scene
      // );
      BABYLON.Matrix.IdentityReadOnly.copyToArray(debugData.influenceMatrices, 16 * i);
      i++;
      debugData.boids.push(debug);
    }
    debugData.influenceMesh.thinInstanceSetBuffer('matrix', debugData.influenceMatrices, 16);
    return debugData;
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
