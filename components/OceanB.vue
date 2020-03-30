<template>
  <div class="object-embed-3d">
    <canvas v-show="!blocked" class="object-3d" touch-action="none" />
    <div id="underwater-debug">
      {{ fps }} fps
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as BABYLON from 'babylonjs';
import OceanPostProcess from './OceanPostProcess';
import Bowser from "bowser";
/* eslint-enable */

export default {
  props: {
    forceLoad: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 3D
      shouldRender: true,
      engine: null,
      scene: null,
      camera: null,
      container: null,
      plane: null,
      fps: 0,
      blocked: false
    };
  },

  mounted () {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const isSafari = browser.satisfies({
      // declare browsers per OS
      macos: {
        safari: '>10.1'
      },

      // per platform (mobile, desktop or tablet)
      mobile: {
        safari: '>=9'
      }
    });
    if (this.forceLoad) {
      this.blocked = false;
    } else if (isSafari) {
      this.blocked = true;
      return;
    }
    this.container = this.$el.querySelector('.object-3d');
    const params = new URLSearchParams(document.location.search);

    this.engine = new BABYLON.Engine(this.container, true); // Generate the BABYLON 3D engine
    this.engine.loadingUIText = 'Mergulho na Laje de Santos';

    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = BABYLON.Color3.FromHexString('0x002141');
    this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this.scene);
    this.camera.setTarget(new BABYLON.Vector3(0, 5, 0));

    // Add lights to the scene
    this.light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), this.scene);

    // background
    if (params.get('layer') !== 'false') {
      this.layer = new BABYLON.Layer('', './textures/ocean/ceu_laje_512.jpg', this.scene, true);
    }

    // island
    if (params.get('island') !== 'false') {
      const aspectLaje = 1024 / 128;
      const planeWidth = 250;
      this.plane = BABYLON.MeshBuilder.CreatePlane('myPlane', { width: planeWidth, height: planeWidth / aspectLaje }, this.scene);
      this.plane.position.x = 0;
      this.plane.position.y = 14.2;
      this.plane.position.z = 251;
      const lajeMaterial = new BABYLON.StandardMaterial('lajeMaterial', this.scene);
      lajeMaterial.diffuseTexture = new BABYLON.Texture('./textures/ocean/Laje_de_Santos_transp_1024x128.png', this.scene, true);
      lajeMaterial.diffuseTexture.hasAlpha = true;
      lajeMaterial.useAlphaFromDiffuseTexture = true;
      this.plane.material = lajeMaterial;
      this.planeSize();
    }

    // ocean
    if (params.get('ocean') !== 'false') {
      const nearestPOT = x => 2 ** Math.ceil(Math.log(x) / Math.log(2));
      const options = {
        width: nearestPOT(this.camera.getEngine().getRenderWidth()),
        height: nearestPOT(this.camera.getEngine().getRenderHeight())
      };

      if (options.width > 2048) {
        options.width = 2048;
      }
      if (options.height > 2048) {
        options.height = 2048;
      }
      if (this.isSafari) { // safari requires square textures for mipmap
        const t = Math.min(options.width, options.height);
        options.width = options.height = t;
      }

      const pp = new OceanPostProcess('myOcean', this.camera, options);
      pp.reflectionEnabled = false;
      pp.refractionEnabled = false;
    }

    if (params.get('opt') !== 'false') {
      const optOptions = BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed();
      this.optimizer = new BABYLON.SceneOptimizer(this.scene, optOptions);
    }

    this.shouldRender = true;
    this.engine.runRenderLoop(() => {
      if (this.shouldRender) {
        this.fps = this.engine.getFps().toFixed();
        this.scene.render();
      }
    });

    // don't render when not visible
    if (params.get('observer') !== 'false') {
      this.observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            this.shouldRender = (entry.intersectionRatio >= 0.05);
          });
        },
        {
          threshold: [0, 0.05]
        });
      this.observer.observe(this.container);
    }

    // Watch for browser/canvas resize events
    if (params.get('callbacks') !== 'false') {
      window.addEventListener('resize', this.resize);
      window.addEventListener('scroll', this.scroll);
    }
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('scroll', this.scroll);
    if (this.observer) {
      this.observer.unobserve(this.container);
      this.observer = null;
      this.engine.stopRenderLoop();
      this.scene.dispose();
      this.scene = null;
      this.engine = null;
    }
  },

  methods: {
    planeSize () {
      const w = window.innerWidth;
      const s = w * 1.5 / 1920;
      this.plane.scaling = new BABYLON.Vector3(s, s, s);
      const basey = 22.2;
      const y = (w - 1920) * (3.2 - basey) / (320 - 1920) + basey; // TODO 1920 / 14.2 = 320 / 4.2
      this.plane.position.y = y;
    },

    resize () {
      this.planeSize();
      this.engine.resize();
    },

    scroll (x, y) {
      if (this.shouldRender) {
        const bbox = this.container.getBoundingClientRect();
        const offset = (window.scrollY - bbox.top) / bbox.height;
        this.camera.position.y = 6 - offset * 3;
      }
    }
  }
};
</script>
<style lang="less" scoped>

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

.object-embed-3d {
  height: 100%;
  width: 100%;
  position: absolute;
  right: 0;
  top: 0;

  .object-3d {
    width: 100%;
    height: 100%;
    touch-action: none;
    pointer-events: none;
  }
}

</style>
