<template>
  <canvas id="ilha-container" />
</template>

<script>
/* eslint-disable */
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { WaterMaterial } from 'babylonjs-materials';
/* eslint-enable */

export default {
  props: {
    diveSites: {
      type: Array,
      default () { return []; }
    }
  },

  data () {
    return {
      engine: null,
      scene: null,
      camera: null,
      container: null
    };
  },

  mounted () {
    const SCENE_SIZE = 7000;
    const UNSELECTED_BUOY_COLOR = 0.2;
    const BOUY_NAME = 'bouy';

    function latlongToPixel (lat, long) {
      const latmin = -24.26333333; const latmax = -24.35333333; const lattotal = (latmin - latmax);
      const longmin = -46.15000; const longmax = -46.2000; const longtotal = (longmin - longmax);

      return [
        7000 * (latmin - lat) / lattotal - 4500,
        7000 * (longmin - long) / longtotal - 4500
      ];
    }

    this.container = document.getElementById('ilha-container');

    this.engine = new BABYLON.Engine(this.container, true); // Generate the BABYLON 3D engine
    this.engine.loadingUIText = 'Mergulho na Laje de Santos';

    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = BABYLON.Color3.FromHexString('0x46BCEC');

    this.camera = new BABYLON.ArcRotateCamera(
      'Camera',
      0.0,
      30.0 / Math.PI,
      500,
      new BABYLON.Vector3(0, 0, 0), // target
      this.scene
    );
    this.camera.position = new BABYLON.Vector3(0, 1000, 100);
    this.camera.minZ = 1.0;
    this.camera.maxZ = 2 * SCENE_SIZE;
    this.camera.useFramingBehavior = true;
    this.camera.applyGravity = false;
    this.camera.upperBetaLimit = Math.PI / 2.0 - Math.PI / 20.0;
    this.camera.upperRadiusLimit = SCENE_SIZE * 0.5;
    this.camera.inertialRadiusOffset = 5;
    this.camera.attachControl(this.container, false);
    this.camera.inputs.attached.mousewheel.wheelDeltaPercentage = 0.05;

    // Add lights to the scene
    this.light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), this.scene);
    this.light2 = new BABYLON.DirectionalLight('light2', new BABYLON.Vector3(1, -1, 0), this.scene);

    // loading manager
    const loader = new BABYLON.AssetsManager(this.scene);

    // const siteMeshes = {};
    const spriteManagerPlayer = new BABYLON.SpriteManager('playerManager', '/models/player.png', this.diveSites.length, 64, this.scene);
    let buoy = null;
    const instancedBuoyBuffer = new Float32Array(this.diveSites.length * 16);
    const instancedBuoyColors = new Float32Array(this.diveSites.length * 4);
    instancedBuoyColors.fill(UNSELECTED_BUOY_COLOR);
    loader.addMeshTask('flag', null, this.$router.options.base + 'models/flagLoop.glb').onSuccess = (task) => {
      // convert to a single mesh so instances will work
      buoy = BABYLON.Mesh.MergeMeshes(
        [
          task.loadedMeshes[1],
          task.loadedMeshes[2],
          task.loadedMeshes[3]
        ],
        true,
        true,
        undefined,
        false,
        true
      );
      buoy.name = BOUY_NAME;
      let i = 0;
      for (const site of this.diveSites) {
        const pos = latlongToPixel(site.lat, site.long);
        const matrix = BABYLON.Matrix.Scaling(15.0, 15.0, 15.0);
        matrix.addTranslationFromFloats(pos[0], 20, pos[1]);
        matrix.copyToArray(instancedBuoyBuffer, i * 16);
        // mesh.userData = site;
        // siteMeshes[site.name] = mesh;

        const player = new BABYLON.Sprite('player' + i, spriteManagerPlayer);
        player.cellIndex = i;
        player.position = new BABYLON.Vector3(pos[0], 150, pos[1]);
        player.width = 100;
        player.height = 100;
        i++;
      }
      buoy.thinInstanceSetBuffer('matrix', instancedBuoyBuffer, 16);
      buoy.thinInstanceSetBuffer('color', instancedBuoyColors, 4);
      buoy.isPickable = true;
      buoy.thinInstanceEnablePicking = true;
    };

    // collada
    const v = loader.addMeshTask('map', null, this.$router.options.base + 'PEMLSdae/', 'PEMLS_skt.dae');
    v.onSuccess = (task) => {
      console.log('lfl');
    //   land = collada.scene;
    //   land.position.set(220, 0, -100);
    //   const degrees = 80;
    //   land.rotateZ((degrees / 180.0) * Math.PI);
    };
    v.onError = (x) => {
      console.log(x);
    };

    // Skybox
    const skybox = BABYLON.Mesh.CreateBox('skyBox', SCENE_SIZE * 1.2, this.scene);
    const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('https://playground.babylonjs.com/textures/TropicalSunnyDay', this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.isPickable = false;

    // water
    const waterMesh = BABYLON.MeshBuilder.CreateGround('waterMesh', { width: SCENE_SIZE * 1.1, height: SCENE_SIZE * 1.1, subdivisions: 16 }, this.scene);
    const water = new WaterMaterial('water', this.scene, new BABYLON.Vector2(512, 512));
    water.backFaceCulling = true;
    water.bumpTexture = new BABYLON.Texture('https://playground.babylonjs.com/textures/waterbump.png', this.scene);
    water.windForce = 0;
    water.waveHeight = 3.7;
    water.bumpHeight = 0.7;
    water.windDirection = new BABYLON.Vector2(1, 1);
    water.waterColor = new BABYLON.Color3(0, 0, 221 / 255);
    water.colorBlendFactor = 0.0;
    water.addToRenderList(skybox);
    waterMesh.material = water;
    waterMesh.isPickable = false;

    const pickSite = (index) => {
      instancedBuoyColors.fill(UNSELECTED_BUOY_COLOR);
      if (index >= 0) {
        instancedBuoyColors[index * 4] =
        instancedBuoyColors[index * 4 + 1] =
        instancedBuoyColors[index * 4 + 2] =
        instancedBuoyColors[index * 4 + 3] = 1.0;
      }
      buoy.thinInstanceSetBuffer('color', instancedBuoyColors, 4);
    };

    this.scene.onPointerDown = (evt, pickResult) => {
      if (pickResult.hit && pickResult.pickedMesh.name === BOUY_NAME) {
        pickSite(pickResult.thinInstanceIndex);
        this.$emit('pick', this.diveSites[pickResult.thinInstanceIndex].name);
      } else {
        pickSite(-1);
      }
    };

    this.$on('picker', (selectedIndex) => {
      pickSite(selectedIndex);
    });

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    loader.load();
    // on initialization
    window.addEventListener('resize', this.onWindowResize, false);
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
    this.engine = null;
  },

  methods: {
    onWindowResize () {
      this.engine.resize();
    }
  }
};
</script>

<style lang="less" scoped>
#ilha-container {
  width: 100%;
  height: 100%;

  #ocean {
    position: absolute;
    height: 100%;
  }
}

</style>
