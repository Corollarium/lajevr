<template>
  <div class="object-embed-3d">
    <div class="object-embed-icon" touch-action="none" />
    <canvas class="object-3d" />
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
      default: 'transparent'
    },
    autoRotate: {
      type: Boolean,
      required: false,
      default: true
    },
    initialAlpha: {
      type: [Number, String],
      required: false,
      default: 'random'
    },
    initialBeta: {
      type: [Number, String],
      required: false,
      default: Math.PI / 2
    },
    inputEnabled: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data () {
    return {
      // 3D
      engine: null,
      scene: null,
      camera: null,
      container: null
    };
  },

  watch: {
    inputEnabled (newV) {
      if (newV) {
        this.camera.detachControl(this.container);
      } else {
        this.camera.attachControl(this.container);
      }
    }
  },

  mounted () {
    this.container = this.$el.querySelector('.object-3d');

    this.engine = new BABYLON.Engine(this.container, true); // Generate the BABYLON 3D engine
    this.engine.loadingUIText = 'Mergulho na Laje de Santos';

    this.scene = new BABYLON.Scene(this.engine);

    this.scene.clearColor = (this.backgroundColor === 'transparent'
      ? new BABYLON.Color4(0, 0, 0, 0.1)
      : BABYLON.Color3.FromHexString(this.backgroundColor));

    // Add a camera to the scene and attach it to the canvas
    this.camera = new BABYLON.ArcRotateCamera(
      'Camera',
      isNaN(parseFloat(this.initialAlpha)) ? (Math.random() * 6) % (2 * Math.PI) : this.initialAlpha, // alpha
      this.initialBeta, // beta
      0.5,
      new BABYLON.Vector3(0, 0, 0), // target
      this.scene
    );
    this.camera.minZ = 0.0001;
    this.camera.useFramingBehavior = true;
    this.camera.applyGravity = false;
    this.camera.speed = 0.1;

    // update keys
    this.camera.keysUp.push('w'.charCodeAt(0));
    this.camera.keysUp.push('W'.charCodeAt(0));

    if (this.inputEnabled) {
      this.camera.attachControl(this.container, false);
    }

    // Add lights to the scene
    this.light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), this.scene);
    this.light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(0, 1, -1), this.scene);

    // Append glTF model to scene.
    const path = this.model.slice(0, this.model.lastIndexOf('/') + 1);
    const filename = this.model.slice(this.model.lastIndexOf('/') + 1);

    // loader
    let loaded = false;
    const loader = new BABYLON.AssetsManager(this.scene);
    loader.addMeshTask('box', '', path, filename);

    loader.onFinish = (task) => {
      loaded = true;
      let radius = 1;
      let lockedTarget = null;
      for (const o of task[0].loadedMeshes) {
        if (o) {
          const s = o.getBoundingInfo().boundingBox.extendSize;
          if (radius < s.x / 2.0) {
            radius = s.x / 2.0;
          }
          if (radius < s.y / 2.0) {
            radius = s.y / 2.0;
          }
          if (radius < s.z / 2.0) {
            radius = s.z / 2.0;
          }
          if (!lockedTarget) {
            lockedTarget = o;
          }
          // possible overlay
          // if (o.name === 'Mesh_0') {
          //   o.renderOverlay = true;
          //   o.overlayColor = new BABYLON.Color3(0.8, 0.0, 0.0);
          //   o.overlayAlpha = 0.2;
          // }
        }
      }
      this.camera.lockedTarget = lockedTarget;

      let aspect = this.container.width / this.container.height;
      if (aspect < 1.0) {
        aspect = 1.0 / aspect;
      }
      this.camera.radius = radius * 2.5 * aspect;
      this.camera.lowerRadiusLimit = radius / 10.0;
    };
    loader.load();

    this.engine.runRenderLoop(() => {
      const deltaTime = this.engine.getDeltaTime() / 1000.0; // in s

      if (loaded && this.autoRotate) {
        this.camera.alpha = (this.camera.alpha + deltaTime * 0.2) % (2 * Math.PI);
      }

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
  width: 100%;
  height: 100vh;

  .object-3d {
    width: 100%;
    height: 100%;
  }

  &:hover .object-embed-icon {
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
}
</style>
