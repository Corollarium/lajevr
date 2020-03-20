<template>
  <div id="ilha-container" />
</template>

<script>
/* eslint-disable */
import * as THREE from 'three';
import { ColladaLoader } from './three/ColladaLoader.mjs';
import { TrackballControls } from './three/TrackballControls.mjs';
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

    const container = document.getElementById('ilha-container');

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 20000);
    camera.position.set(0, 1000, 100);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x46BCEC);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    const controls = new TrackballControls(camera, container);
    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noPan = false;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [ 65, 83, 68 ];

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
    const ocean = new Ocean(this.renderer, camera, scene,
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

    ocean.materialOcean.uniforms.u_projectionMatrix = { value: camera.projectionMatrix };
    ocean.materialOcean.uniforms.u_viewMatrix = { value: camera.matrixWorldInverse };
    ocean.materialOcean.uniforms.u_cameraPosition = { value: camera.position };
    ocean.oceanMesh.scale.set(2, 2, 2);
    scene.add(ocean.oceanMesh);

    const render = () => {
      this.renderer.render(scene, camera);
    };

    const clickEvent = (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

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

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      controls.handleResize();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

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
      ocean.materialOcean.uniforms.u_projectionMatrix.value = camera.projectionMatrix;
      ocean.materialOcean.uniforms.u_viewMatrix.value = camera.matrixWorldInverse;
      ocean.materialOcean.uniforms.u_cameraPosition.value = camera.position;
      ocean.materialOcean.depthTest = true;

      controls.update();
      render();
    };

    animate();

    // on initialization
    window.addEventListener('resize', onWindowResize, false);
    this.renderer.domElement.addEventListener('mousedown', clickEvent);
    controls.addEventListener('change', render);
    container.appendChild(this.renderer.domElement);
  },

  beforeDestroy () {
    // TODO window.removeEventListener('mousedown',
    // TODO window.removeEventListener('resize',
    // TODO: controls.removeEventL
    this.renderer.forceContextLoss();
    this.renderer.domElement = null;
    this.renderer = null;
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
