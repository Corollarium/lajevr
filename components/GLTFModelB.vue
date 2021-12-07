<template>
  <div class="object-embed-3d">
    <button @click="requestFullscreen()" class="object-fullscreen" touch-action="none">
      <i18n>Ver 3D em tela cheia</i18n>
    </button>
    <div v-show="!touching" class="object-embed-icon" touch-action="none" />
    <transition name="fade" touch-action="none">
      <div v-show="showZoomHelp" touch-action="none">
        <div class="object-scroll-message object-scroll-message-mouse">
          <i18n>use ctrl+scroll para zoom,</i18n><br>
          <i18n>arraste para girar</i18n>
        </div>
        <div class="object-scroll-message object-scroll-message-touch" touch-action="none">
          <i18n>apertar com dedos para zoom,</i18n><br>
          <i18n>arraste para girar</i18n>
        </div>
      </div>
    </transition>
    <canvas class="object-3d" />
    <p
      v-if="attribution"
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
    babylonEngine: {
      type: Object,
      default: null
    },
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
      container: null,
      //
      pointerIds: new Set(),
      // if true, shows the help text overlay
      showZoomHelp: true,
      showTouchHelp: true
    };
  },

  computed: {
    touching () {
      return this.pointerIds.size !== 0;
    }
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
    // this.hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches ? 'got mouse' : 'no mouse';
    // if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
    //   this.jsDetect = 'touch';
    // }
    this.container = this.$el.querySelector('.object-3d');

    // setting height: 100% somehow grows the div every frame. So just wait a bit for all the redraws
    // and resize it properly.
    setTimeout(() => {
      this.container.style.height = this.container.parentElement.offsetHeight + 'px';
    }, 500);

    if (!this.babylonEngine) {
      this.engine = new BABYLON.Engine(this.container, true); // Generate the BABYLON 3D engine
      this.engine.loadingUIText = 'Mergulho na Laje de Santos';
    } else {
      this.engine = this.babylonEngine;
    }

    this.scene = new BABYLON.Scene(this.engine);

    this.scene.clearColor = (this.backgroundColor === 'transparent'
      ? new BABYLON.Color4(0, 0.0, 0, 0.1)
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

    let view = null;
    if (this.babylonEngine) {
      view = this.engine.registerView(this.container, this.camera, true);
    }

    // ctrl+scroll
    this.camera.inputs.remove(this.camera.inputs.attached.mousewheel);
    this.container.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        this.showZoomHelp = false;
        this.camera.radius += Math.sign(e.deltaY) * this.camera.radius * 0.1;
        e.preventDefault();
      } else {
        this.showZoomHelp = true;
      }
    });

    // scroll hijacking on mobile
    this.container.addEventListener('pointerdown', (e) => {
      this.pointerIds.add(e.pointerId);
      this.showZoomHelp = false;
    });
    this.container.addEventListener('pointerleave', (e) => {
      this.pointerIds.delete(e.pointerId);
    });
    // Pointers
    if (this.camera.inputs.attached.pointers) {
      this.camera.inputs.attached.pointers.pinchPrecision = 1000;
    }

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
      let radius = 0.01;
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
      this.camera.radius = radius * 2.0 / Math.tan(this.camera.fov / 2.0) * aspect;
      this.camera.lowerRadiusLimit = radius / 10.0;
      this.setScrollHijacking(false);
    };
    loader.load();

    // don't render when not visible
    let shouldRender = true;
    this.observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          shouldRender = (entry.intersectionRatio >= 0.05);
          view.enabled = shouldRender;

          if (shouldRender) {
            this.scene.detachControl();
            this.engine.inputElement = this.container;
            this.scene.attachControl();
          }
        });
      },
      {
        threshold: [0, 0.05]
      });
    this.observer.observe(this.container);
    const renderScene = () => {
      if (!shouldRender) {
        return;
      }
      const deltaTime = this.engine.getDeltaTime() / 1000.0; // in s

      if (loaded && this.autoRotate) {
        this.camera.alpha = (this.camera.alpha + deltaTime * 0.2) % (2 * Math.PI);
      }

      this.scene.render();
    };
    if (!this.babylonEngine) {
      this.engine.runRenderLoop(renderScene);
    } else {
      this.babylonEngine.sceneList[this.model] = { container: this.container, renderScene };
    }

    // Watch for browser/canvas resize events
    window.addEventListener('resize', this.resize.bind(this));
    this.container.onfullscreenchange = (event) => {
      // TODO this.setScrollHijacking(!!document.fullscreenElement);
    };
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.resize.bind(this));
    if (!this.babylonEngine) {
      this.engine.stopRenderLoop();
    } else {
      this.engine.unRegisterView(this.container);
      delete this.babylonEngine.sceneList[this.model];
    }
    this.scene.dispose();
    this.scene = null;
    this.engine = null;
  },

  methods: {
    resize () {
      this.engine.resize();
    },
    requestFullscreen () {
      this.container.requestFullscreen();
    },
    setScrollHijacking (b) {
      if (b) {
        // if true, hijack and allow rotations on y
        this.container.setAttribute('touch-action', 'initial');
        this.container.style.touchAction = 'initial';
      } else {
        // block y events and allow scrolling
        this.container.setAttribute('touch-action', 'pan-y');
        this.container.style.touchAction = 'pan-y';
      }
    }
  }
};
</script>
<style lang="less" scoped>
.object-embed-3d {
  position: relative;
  cursor: move;
  width: 100%;

  .object-3d {
    width: 100%;
  }

  &:hover .object-embed-icon {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }

  .object-scroll-message {
    z-index: 11;
    top: 0;
    right: 0;
    left: 0;
    right: 0;
    position: absolute;
    pointer-events: none;
    transition: opacity 0.5s ease-in-out;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.0);
    padding: 0.25rem 0.5rem;
    font-size: 250%;
    line-height: 250%;
    height: 100%;
    opacity: 0.5;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    text-align: center;
  }

  /* smartphones, touchscreens */
  @media (hover: none), (hover: hover) and (pointer: coarse), (hover: hover) and (pointer: none) {
    .object-scroll-message-mouse {
      display: none !important;
    }
  }
  @media (hover: hover) and (pointer: fine) {
    .object-scroll-message-touch {
      display: none !important;
    }
  }

  .object-fullscreen {
    position: absolute;
    top: 10px;
    left: 0;
    padding: 10px;
    margin: 0px;
    z-index: 1;
    max-width: 80%;
    line-height: 1.2em;
    border-radius: 10px;
    background: #004;
    color: #fff;
    text-align: center;
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
