<template>
  <div class="object-embed-3d">
    <canvas class="object-3d" touch-action="none" />
  </div>
</template>

<script>
/* eslint-disable */
import * as BABYLON from 'babylonjs';
import OceanPostProcess from './OceanPostProcess';
/* eslint-enable */

export default {
  data () {
    return {
      // 3D
      shouldRender: true,
      engine: null,
      scene: null,
      camera: null,
      container: null,
      plane: null
    };
  },

  mounted () {
    this.container = this.$el.querySelector('.object-3d');

    this.engine = new BABYLON.Engine(this.container, true); // Generate the BABYLON 3D engine
    this.engine.loadingUIText = 'Mergulho na Laje de Santos';

    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = BABYLON.Color3.FromHexString('0x002141');
    this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this.scene);
    this.camera.setTarget(new BABYLON.Vector3(0, 5, 0));

    // background
    this.layer = new BABYLON.Layer('', './textures/ocean/ceu_laje_512.jpg', this.scene, true);

    // Add lights to the scene
    this.light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), this.scene);

    // island
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

    // ocean
    const pp = new OceanPostProcess('myOcean', this.camera);
    pp.reflectionEnabled = false;

    // temp test
    // const optOptions = BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed();
    // this.optimizer = new BABYLON.SceneOptimizer(this.scene, optOptions);

    this.shouldRender = true;
    this.engine.runRenderLoop(() => {
      if (this.shouldRender) {
        this.scene.render();
      }
    });

    // don't render when not visible
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

    // Watch for browser/canvas resize events
    window.addEventListener('resize', this.resize);
    window.addEventListener('scroll', this.scroll);
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('scroll', this.scroll);
    this.observer.unobserve(this.container);
    this.observer = null;
    this.engine.stopRenderLoop();
    this.scene.dispose();
    this.scene = null;
    this.engine = null;
  },

  methods: {
    planeSize () {
      const w = window.innerWidth;
      const s = w * 1.5 / 1920;
      this.plane.scaling = new BABYLON.Vector3(s, s, s);
      const y = (w - 1920) * (3.2 - 14.2) / (320 - 1920) + 14.2; // TODO 1920 / 14.2 = 320 / 4.2
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
