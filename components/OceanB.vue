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
      container: null
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
    // this.camera.attachControl(this.container, false);

    // background
    this.layer = new BABYLON.Layer('', './textures/ocean/ceu_laje.jpg', this.scene, true);

    // Add lights to the scene
    this.light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), this.scene);

    // island
    const aspectLaje = 1920 / 1272;
    const planeWidth = 150;
    const plane = BABYLON.MeshBuilder.CreatePlane('myPlane', { width: planeWidth, height: planeWidth / aspectLaje }, this.scene);
    plane.position.x = 0;
    plane.position.y = 21.2;
    plane.position.z = 151;
    const lajeMaterial = new BABYLON.StandardMaterial('lajeMaterial', this.scene);
    lajeMaterial.diffuseTexture = new BABYLON.Texture('./Laje_de_Santos_transp.png', this.scene);
    lajeMaterial.diffuseTexture.hasAlpha = true;
    lajeMaterial.useAlphaFromDiffuseTexture = true;
    plane.material = lajeMaterial;

    // ocean
    const pp = new OceanPostProcess('myOcean', this.camera);
    pp.reflectionEnabled = false;

    const optOptions = BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed();
    this.optimizer = new BABYLON.SceneOptimizer(this.scene, optOptions);

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
    resize () {
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
