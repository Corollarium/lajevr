<template>
  <div class="object-embed-3d">
    <canvas class="object-3d" />
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
    this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this.scene);
    this.camera.setTarget(new BABYLON.Vector3(0, 5, 0));
    this.camera.attachControl(container, false);

    // background
    this.layer = new BABYLON.Layer('', '/textures/ocean/ceu_laje.jpg', this.scene, true);

    // Create a sprite manager
    const spriteManager = new BABYLON.SpriteManager('lajeManager', '/Laje_de_Santos_transp.png', 1, { width: 1920, height: 1272 }, this.scene);
    this.laje = new BABYLON.Sprite('laje', spriteManager);
    const SCALE = 1.6 * 1920 / window.innerWidth;
    this.laje.width = 19.20 / SCALE;
    this.laje.height = 12.72 / SCALE;
    this.laje.position.x = 0;
    this.laje.position.y = 6.3;
    this.laje.position.z = -1;

    // Add lights to the scene
    this.light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), this.scene);
    this.light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(0, 1, -1), this.scene);

    const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene);
    sphere.position.y = 1;

    // const aspectLaje = 1920 / 1272;
    // const plane = BABYLON.MeshBuilder.CreatePlane('myPlane', { width: 10, height: 10 / aspectLaje }, this.scene);
    // plane.position.x = 0;
    // plane.position.y = 6;
    // plane.position.z = -1;
    // const lajeMaterial = new BABYLON.StandardMaterial('lajeMaterial', this.scene);
    // lajeMaterial.diffuseTexture = new BABYLON.Texture('/Laje_de_Santos_transp.png', this.scene);
    // lajeMaterial.diffuseTexture.hasAlpha = true;
    // plane.material = lajeMaterial;

    const pp = new OceanPostProcess('myOcean', this.camera);
    pp.reflectionEnabled = false;

    this.engine.runRenderLoop(() => {
      // const deltaTime = this.engine.getDeltaTime() / 1000.0; // in s

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
      const SCALE = 1.6 * 1920 / window.innerWidth;
      this.laje.width = 19.20 / SCALE;
      this.laje.height = 12.72 / SCALE;
      this.engine.resize();
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
  }
}

</style>
