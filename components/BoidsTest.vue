<template>
  <div id="underwater">
    <canvas id="underwater-3d" touch-action="none" />
  </div>
</template>

<script>
/* eslint-disable */
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import * as Materials from 'babylonjs-materials';
import BoidsManager from '@corollarium/babylon-boids';

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
      assetsManager: null
    };
  },

  mounted () {
    const container = document.getElementById('underwater-3d');

    /*
     * boot renderer, scene, camera
     */

    // Create the scene space
    this.bootScene(container);
    this.lights();

    const fish = this.loadFishFlock('./models/borboleta/', 'borboleta.glb', 20);
    // const boxes = this.loadCubes(30);
    // this.debugUtils();

    // Register a render loop to repeatedly render the scene
    this.engine.runRenderLoop(() => {
      const timeDiff = this.engine.getDeltaTime() / 1000.0;

      // inspector
      const t = document.getElementById('inspector-host');
      if (t) {
        t.style.position = 'absolute';
      }

      fish.update(timeDiff);
      // boxes.update(timeDiff);

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

      this.engine = new BABYLON.Engine(container, true); // Generate the BABYLON 3D engine
      this.engine.loadingUIText = 'BoidsTest';
      this.scene = new BABYLON.Scene(this.engine);

      // Add a camera to the scene and attach it to the canvas
      this.camera = new BABYLON.UniversalCamera(
        'Camera',
        new BABYLON.Vector3(10, 10, 10),
        this.scene
      );
      this.camera.setTarget(new BABYLON.Vector3(0, 0, 0));
      this.camera.applyGravity = false;
      this.camera.speed = 0.1;
      // Set the ellipsoid around the camera (e.g. your player's size)
      this.camera.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);

      // update keys
      this.camera.keysUp.push('w'.charCodeAt(0));
      this.camera.keysUp.push('W'.charCodeAt(0));

      // near/far
      this.camera.minZ = 0.1;
      this.camera.maxZ = 1000;
      this.camera.attachControl(container, true);

      // Enable Collisions
      this.scene.collisionsEnabled = true;
      this.camera.checkCollisions = true;
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

    loadCubes (total) {
      const boids = new BoidsManager(total, new BABYLON.Vector3(0.0, 0.0, 0.0), 10.0, 10.0);
      const models = [];
      const brickMaterial = new BABYLON.StandardMaterial('brickMaterial', this.scene);
      brickMaterial.diffuseTexture = new BABYLON.Texture('/brick_diffuse.jpg', this.scene);
      for (let i = 0; i < total; i++) {
        const box = BABYLON.MeshBuilder.CreateBox(
          'box' + i,
          {
            width: 0.3, height: 0.5, depth: 1.0
          }
        );
        box.boid = boids.boids[i];
        box.material = brickMaterial;
        models.push(box);
      }
      boids.showDebug();
      boids.gui(this.scene);

      // brickMaterial.wireframe = true;
      return {
        models,
        boids,
        update: ((_boids, _models) => {
          return (deltaTime) => {
            _boids.update(deltaTime);
            _models.forEach((m) => {
              m.position.copyFrom(m.boid.position);
              m.setDirection(m.boid.orientation);
            });
          };
        })(boids, models)
      };
      // TODO
    },

    loadFishFlock (modelpath, modelfile, total) {
      const boids = new BoidsManager(total, new BABYLON.Vector3(0.0, 10.0, 0.0), 50.0);
      const models = [];
      total = 3;
      BABYLON.SceneLoader.LoadAssetContainer(
        modelpath, modelfile, this.scene,
        (container) => {
          container.addAllToScene();

          container.meshes.forEach((mesh) => {
            mesh.scaling.set(5, 5, 5);
            mesh.setEnabled(false);
            if (mesh.material) {
              mesh.material.freeze();
            }
          });

          for (let i = 0; i < total; i++) {
            const entries = container.instantiateModelsToScene(p => 'fish' + p + i);
            for (const node of entries.rootNodes) {
              node.position.set(boids.boids[i].position);
            }
            if (entries.animationGroups) {
              entries.animationGroups[0].speedRatio = 1.0 + (0.1 * (Math.random() - 0.5));
              entries.animationGroups[0].play(true);
            }
            entries.boid = boids.boids[i];
            models.push(entries);
          }
        }
      );
      // boids.showDebug();

      return {
        models,
        boids,
        update: ((_boids, _models) => {
          return (deltaTime) => {
            _boids.update(deltaTime);
            _models.forEach((m) => {
              for (const node of m.rootNodes) {
                node.position.copyFrom(m.boid.position);
                node.setDirection(m.boid.orientation);
              }
            });
          };
        })(boids, models)
      };
      // TODO
    },

    clamp (t, min, max) {
      return Math.min(Math.max(t, min), max);
    }
  },

  head () {
    return {
      link: [
      ]
    };
  }
};
</script>

<style lang="less">
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
  font-family: 'Oxygen', monospace;
  color: #fff;
  text-align: right;
}

#underwater-hud {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px;
  width: 160px;
  height: 200px;
  z-index: 1000;
  border-radius: 10px;
  background: #000;
  font-family: 'Oxygen', monospace;
  font-size: 64px;
  color: #fff;
  text-align: right;
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
