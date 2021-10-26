<template>
  <div id="ilha-container" />
</template>

<script>
/* eslint-disable */
import * as THREE from 'three';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Ocean } from './Ocean.js';
import { SpriteText2D, textAlign } from 'three-text2d';
/* eslint-enable */

// https://3dwarehouse.sketchup.com/model/b42235a3-7efb-4d5d-b70f-6d323453ac49/Parque-Estadual-Marinho-Laje-de-Santos-PEMLS?hl=nl

export default {
  props: {
    diveSites: {
      type: Array,
      default () { return []; }
    }
  },

  data () {
    return {
      container: null,
      controls: null,
      camera: null,
      renderer: null
    };
  },

  mounted () {
    let land, lastTime;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const diveSiteGroup = new THREE.Group();

    function latlongToPixel (lat, long) {
      const latmin = -24.26333333; const latmax = -24.35333333; const lattotal = (latmin - latmax);
      const longmin = -46.15000; const longmax = -46.2000; const longtotal = (longmin - longmax);

      return [
        7000 * (latmin - lat) / lattotal - 4500,
        7000 * (longmin - long) / longtotal - 4500
      ];
    }

    this.container = document.getElementById('ilha-container');

    this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 1, 20000);
    this.camera.position.set(0, 1000, 100);
    this.camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x46BCEC);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.controls = new OrbitControls(this.camera, this.container);
    this.controls.rotateSpeed = 2.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.noPan = false;
    this.controls.staticMoving = false;
    this.controls.dynamicDampingFactor = 0.3;
    this.controls.keys = [ 65, 83, 68 ];
    this.controls.maxDistance = 100.0;
    this.controls.maxDistance = 5000.0;
    this.controls.maxPolarAngle = Math.PI / 2.0 - Math.PI / 20.0;

    // lights
    const ambientLight = new THREE.AmbientLight(0xCCCCCC, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    directionalLight.position.set(1, 1, 0).normalize();
    scene.add(directionalLight);

    // loading manager
    const loadingManager = new THREE.LoadingManager(function () {
      scene.add(land);
    });

    const siteMaterial = new THREE.MeshLambertMaterial({ color: 0x0077FF, side: 2, shading: THREE.FlatShading });
    const siteSelectedMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000, side: 2, shading: THREE.FlatShading });
    const siteMeshes = {};
    for (const site of this.diveSites) {
      const radius = 20;
      const tube = 10;
      const geometry = new THREE.TorusGeometry(radius, tube, 16, 100);
      const mesh = new THREE.Mesh(geometry, siteMaterial);
      const pos = latlongToPixel(site.lat, site.long);
      mesh.position.set(pos[0], 20, pos[1]);
      mesh.userData = site;
      siteMeshes[site.name] = mesh;

      // create html overlay box
      const sprite = new SpriteText2D(
        site.name,
        { align: textAlign.center, font: '40px Arial', fillStyle: '#FFFFFF', antialias: true, shadowColor: '#333333', shadowOffsetX: 2, shadowOffsetY: 2 }
      );
      sprite.position.set(pos[0], 60, pos[1]);
      sprite.sprite.userData = sprite.userData = site;
      sprite.material.depthWrite = false;
      diveSiteGroup.add(mesh, sprite);
    }
    scene.add(diveSiteGroup);

    // collada
    const loader = new ColladaLoader(loadingManager);
    loader.load('./PEMLSdae/PEMLS_skt.dae', function (collada) {
      land = collada.scene;
      land.position.set(220, 0, -100);
      const degrees = 80;
      land.rotateZ((degrees / 180.0) * Math.PI);
    });

    const gsize = 8192;
    const res = 1024;
    const gres = res / 2;
    const origx = -gsize / 2;
    const origz = -gsize / 2;
    const ocean = new Ocean(this.renderer, this.camera, scene,
      {
        USE_HALF_FLOAT: false,
        INITIAL_SIZE: 2048.0,
        INITIAL_WIND: [ 4.0, 4.0 ],
        INITIAL_CHOPPINESS: 0.3,
        CLEAR_COLOR: [ 1.0, 1.0, 1.0, 0.0 ],
        GEOMETRY_ORIGIN: [ origx, origz ],
        SUN_DIRECTION: [ -1.0, 1.0, 1.0 ],
        OCEAN_COLOR: new THREE.Vector3(0.004, 0.016, 0.047),
        SKY_COLOR: new THREE.Vector3(3.2, 9.6, 12.8),
        EXPOSURE: 0.35,
        GEOMETRY_RESOLUTION: gres,
        GEOMETRY_SIZE: gsize,
        RESOLUTION: res
      });

    ocean.materialOcean.uniforms.u_projectionMatrix = { value: this.camera.projectionMatrix };
    ocean.materialOcean.uniforms.u_viewMatrix = { value: this.camera.matrixWorldInverse };
    ocean.materialOcean.uniforms.u_cameraPosition = { value: this.camera.position };
    ocean.oceanMesh.scale.set(2, 2, 2);
    scene.add(ocean.oceanMesh);

    const render = () => {
      this.renderer.render(scene, this.camera);
    };

    const clickEvent = (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);

      const intersects = raycaster.intersectObject(diveSiteGroup, true);

      if (intersects.length > 0) {
        const object = intersects[0].object;

        for (const name in siteMeshes) {
          siteMeshes[name].material = siteMaterial;
        }
        siteMeshes[object.userData.name].material = siteSelectedMaterial;
        this.$emit('pick', object.userData.name);
      }
    };

    this.$on('picker', (selectedIndex) => {
      for (const name in siteMeshes) {
        siteMeshes[name].material = siteMaterial;
      }
      siteMeshes[this.diveSites[selectedIndex].name].material = siteSelectedMaterial;
    });

    const animate = () => {
      // TODO: if framerate too low
      if (!this || !this.renderer) {
        return;
      }

      requestAnimationFrame(animate);

      const currentTime = new Date().getTime();
      ocean.deltaTime = (currentTime - lastTime) / 1000 || 0.0;
      lastTime = currentTime;
      ocean.render(ocean.deltaTime * 0.02);
      ocean.overrideMaterial = ocean.materialOcean;

      if (ocean.changed) {
        ocean.materialOcean.uniforms.u_size.value = ocean.size;
        ocean.materialOcean.uniforms.u_sunDirection.value.set(ocean.sunDirectionX, ocean.sunDirectionY, ocean.sunDirectionZ);
        ocean.materialOcean.uniforms.u_exposure.value = ocean.exposure;
        ocean.changed = false;
      }

      ocean.materialOcean.uniforms.u_normalMap.value = ocean.normalMapFramebuffer.texture;
      ocean.materialOcean.uniforms.u_displacementMap.value = ocean.displacementMapFramebuffer.texture;
      ocean.materialOcean.uniforms.u_projectionMatrix.value = this.camera.projectionMatrix;
      ocean.materialOcean.uniforms.u_viewMatrix.value = this.camera.matrixWorldInverse;
      ocean.materialOcean.uniforms.u_cameraPosition.value = this.camera.position;
      ocean.materialOcean.depthTest = true;

      this.controls.update();
      render();
    };

    animate();

    // on initialization
    window.addEventListener('resize', this.onWindowResize, false);
    this.renderer.domElement.addEventListener('mousedown', clickEvent);

    this.container.appendChild(this.renderer.domElement);
  },

  beforeDestroy () {
    this.$off('picker');
    window.removeEventListener('resize', this.onWindowResize);
    this.renderer.forceContextLoss();
    this.renderer.domElement = null;
    this.renderer = null;
  },

  methods: {
    onWindowResize () {
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
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
