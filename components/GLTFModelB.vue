<template>
  <div class="object-embed-3d">
    <div class="object-embed-icon" />
    <canvas class="object-3d" touch-action="none" />
    <p
      class="attribution"
    >
      <a :href="link" v-if="link" target="_blank">
        {{ attribution }}
      </a>
      <span v-else>
        {{ attribution }}
      </span>
    </p>
  </div>
</template>

<script>
/* eslint-disable */
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
/* eslint-enable */

export default {
  props: {
    model: {
      type: String,
      required: true
    },
    attribution: {
      type: String,
      required: false,
      default: ''
    },
    link: {
      type: String,
      required: false,
      default: null
    },
    backgroundColor: {
      type: String,
      required: false,
      default: '0x000000'
    }
  },

  data () {
    return {
      // 3D
      engine: null,
      scene: null,
      camera: null
    };
  },

  mounted () {
    const container = this.$el.querySelector('.object-3d');

    this.engine = new BABYLON.Engine(container, true); // Generate the BABYLON 3D engine
    this.engine.loadingUIText = 'Mergulho na Laje de Santos';

    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = BABYLON.Color3.FromHexString(this.backgroundColor);

    // Add a camera to the scene and attach it to the canvas
    this.camera = new BABYLON.ArcRotateCamera(
      'Camera',
      0, // alpha
      0, // beta
      20, // radius
      new BABYLON.Vector3(0, 0, 0), // target
      this.scene
    );
    this.camera.applyGravity = false;
    this.camera.speed = 0.1;

    // update keys
    this.camera.keysUp.push('w'.charCodeAt(0));
    this.camera.keysUp.push('W'.charCodeAt(0));

    // near/far
    this.camera.minZ = 0.1;
    this.camera.maxZ = 120;
    this.camera.attachControl(container, true);

    // Append glTF model to scene.
    const path = 'https://playground.babylonjs.com/scenes/'; // this.model.slice(0, this.model.lastIndexOf('/') + 1);
    const filename = 'Rabbit.babylon'; // this.model.slice(this.model.lastIndexOf('/') + 1);

    // loader
    // const loader = new BABYLON.AssetsManager(this.scene);
    // loader.addMeshTask('box', '', path, 'filename');
    // loader.onFinish = (task) => {
    //   this.camera.setTarget(task[0].loadedMeshes[0].position);
    // };
    // loader.load();

    BABYLON.SceneLoader.Append(path, filename, this.scene, function (scene) {
      console.log('loaded');
    });

    this.engine.runRenderLoop(() => {
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

    resize () {
      this.engine.resize();
    }

  }
};
</script>
<style lang="less" scoped>
.object-embed-3d {
  position: relative;
  cursor: move;

  .object-3d {
    width: 100%;
    height: 100%;
  }
}

.object-embed-3d:hover .object-embed-icon {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.object-embed-icon {
  background-image: url('~assets/images/icons/arrows3d.svg');
  width: 100%;
  height: 100%;
  z-index: 10;
  position: absolute;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  pointer-events: none;
  transition: opacity 0.5s ease-in-out;

  &:hover {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }
}
</style>
