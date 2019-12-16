<template>
  <div id="underwater">
    <div id="underwater-3d" />
    <div id="underwater-hud">
      <div id="underwater-hud-depth">
        {{ depth }}m
      </div>
      <div id="underwater-hud-time">
        {{ parseInt(time/60, 10) }}:{{ parseInt(time%60, 10).toString().padStart(2, '0') }}
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as THREE from 'three';
import { PointerLockControls } from './three/PointerLockControls.mjs';
import { GLTFLoader } from './three/GLTFLoader.mjs';
import { EffectComposer } from './three/EffectComposer.mjs';
import { RenderPass } from './three/RenderPass.mjs';
import { ShaderPass } from './three/ShaderPass.mjs';
import { SavePass } from './three/SavePass.mjs';
import { SkeletonUtils } from './three/SkeletonUtils.mjs';
import { Ocean } from './Ocean.js';
// const Stats = require('stats.js');

const underwater_fragment = require('!!raw-loader!./underwater_fragment.glsl');
const underwater_vertex = require('!!raw-loader!./underwater_vertex.glsl');
const caustic_fragment = require('!!raw-loader!./caustic_fragment.glsl');
const caustic_vertex = require('!!raw-loader!./caustic_vertex.glsl');
const mix_fragment = require('!!raw-loader!./mix_fragment.glsl');
const mix_vertex = require('!!raw-loader!./mix_vertex.glsl');
/* eslint-enable */

/*
https://github.com/pissang/undersea
https://www.shadertoy.com/results?query=tag%3Dunderwater
http://webglsamples.org/aquarium/aquarium.html

https://medium.com/@akufen/ocean-school-technical-case-study-ae391656b7ab
https://www.youtube.com/watch?v=l9NX06mvp2E

unity
https://assetstore.unity.com/packages/tools/particles-effects/aquas-2020-138749
https://assetstore.unity.com/packages/vfx/shaders/lux-water-119244
*/

export default {
  props: {
  },

  head () {
    return {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Oxygen+Mono&display=swap' }
      ]
    };
  },

  data () {
    return {
      // 3D
      renderer: null,
      scene: null,
      camera: null,
      loader: null,
      mixers: [],

      causticMaterial: null,

      // simulation
      depth: 0,
      time: 0,
      air: 100
    };
  },

  mounted () {
    const container = document.getElementById('underwater-3d');

    /*
     * boot renderer, scene, camera
     */
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.uuid = THREE.Math.generateUUID();
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.set(0, -5, 10);
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2963CF);

    this.loader = new GLTFLoader();

    // add stuff
    this.lights();
    const controls = this.controls(container);
    const finalComposer = this.composer();

    this.land();
    this.loader.load(
      '/models/manta/scene.gltf',
      // called when the resource is loaded
      (gltf) => {
        const { school, mixers } = this.createFishSchool(gltf, 2);
        this.mixers = this.mixers.concat(mixers);
        this.scene.add(school);
      },
      (xhr) => {
        // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (e) => {
        console.error('An error happened', e);
      }
    );

    // render
    // const stats = this.stats();
    // const startTime = 0;
    let lastTime = 0;
    let speed = 0;
    const render = (now) => {
      // stats.begin();
      now *= 0.001; // convert to seconds
      const deltaTime = now - lastTime; // since last frame
      // const ellapsedTime = now - startTime; // since start
      lastTime = now;

      // update shaders
      this.causticMaterial.uniforms.t.value = now;

      // update camera
      if (controls.isLocked === true) {
        controls.moveLikeCamera(speed * deltaTime);
      }

      // update HUD
      this.depth = (this.camera.position.y <= 0 ? (-this.camera.position.y).toFixed(1) : 0.0);

      // animate
      this.mixers.forEach((m) => { m.update(deltaTime); });

      // render
      finalComposer.render(deltaTime);
      // stats.end();
      requestAnimationFrame(render);
    };

    const onWindowResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      // controls.handleResize();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // on initialization
    window.addEventListener('resize', onWindowResize, false);

    container.addEventListener('click', function () {
      controls.lock();
    }, false);
    this.scene.add(controls.getObject());

    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'w':
          speed += 0.1;
          this.clamp(speed, 0, 2);
          break;

        case 's':
          speed -= 0.1;
          this.clamp(speed, 0, 2);
          break;

        case 't':
          speed = 0.0;
          break;
      }
    });

    render();
  },

  beforeDestroy () {
    // TODO window.removeEventListener('mousedown',
    // TODO window.removeEventListener('resize',
    // TODO: controls.removeEventL
    this.renderer.forceContextLoss();
    this.renderer.domElement = null;
    this.renderer = null;
  },

  methods: {
    lights () {
      // lights
      const ambientLight = new THREE.AmbientLight(0xCCCCCC, 0.4);
      this.scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
      directionalLight.position.set(1, 1, 0).normalize();
      this.scene.add(directionalLight);
    },

    stats () {
      // const stats = new Stats();
      // stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
      // document.body.appendChild(stats.dom);
      // return stats;
    },

    controls (container) {
      const controls = new PointerLockControls(this.camera, container);
      controls.moveLikeCamera = (
        (camera) => {
          return function (distance) {
            const vector = new THREE.Vector3(0, 0, -1);
            camera.getWorldDirection(vector);
            camera.position.addScaledVector(vector, distance);
          };
        }
      )(this.camera);
      return controls;
    },

    composer () {
      // render the scene with the caustic material
      this.causticMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.common,
          THREE.UniformsLib.specularmap,
          THREE.UniformsLib.envmap,
          THREE.UniformsLib.aomap,
          THREE.UniformsLib.lightmap,
          THREE.UniformsLib.fog,
          {
            tDiffuse: { value: null },
            t: { type: 'f', value: 0 }
          }
        ]),
        vertexShader: caustic_vertex.default,
        fragmentShader: caustic_fragment.default
      });
      const renderCausticPass = new RenderPass(this.scene, this.camera, this.causticMaterial); // render caustic
      renderCausticPass.renderToScreen = false;

      // we will save the caustic on a texture, so add a save pass
      const causticTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        stencilBuffer: false
      });
      const renderCausticSavePass = new SavePass(causticTarget); // render caustic
      renderCausticSavePass.renderToScreen = false;

      // render the scene with the depth material
      const depthMaterial = new THREE.MeshDepthMaterial({ skinning: true });
      depthMaterial.skinning = true;
      const renderDepthPass = new RenderPass(this.scene, this.camera, depthMaterial); // render depth
      renderDepthPass.renderToScreen = false;

      // we will save depth on a texture, so add a save pass
      const depthTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        stencilBuffer: false
      });
      const renderDepthSavePass = new SavePass(depthTarget); // render caustic
      renderDepthSavePass.renderToScreen = false;

      // the render scene
      const renderScenePass = new RenderPass(this.scene, this.camera);
      renderScenePass.renderToScreen = false;
      renderScenePass.clear = true;
      renderScenePass.clearDepth = true;

      // merge caustic and texture, apply fog
      const underwaterPass = new ShaderPass(
        new THREE.ShaderMaterial({
          uniforms: {
            baseTexture: { value: null },
            causticTexture: { value: causticTarget.texture },
            depthTexture: { value: depthTarget.texture },
            fogColor: { type: 'c', value: this.scene.background }
          },
          vertexShader: underwater_vertex.default,
          fragmentShader: underwater_fragment.default,
          fog: false
        }), 'baseTexture'
      );
      underwaterPass.needsSwap = true;
      underwaterPass.renderToScreen = true;

      // compose passes
      const finalComposer = new EffectComposer(this.renderer);
      finalComposer.addPass(renderCausticPass);
      finalComposer.addPass(renderCausticSavePass);
      finalComposer.addPass(renderDepthPass);
      finalComposer.addPass(renderDepthSavePass);
      finalComposer.addPass(renderScenePass);
      finalComposer.addPass(underwaterPass);
      return finalComposer;
    },
    land () {
      // Load a glTF resource
      this.loader.load(
        '/models/terrain.glb',
        // called when the resource is loaded
        (gltf) => {
          const land = gltf.scene;
          land.position.y = -20;
          this.scene.add(land);
        },
        (xhr) => {
        // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (e) => {
          console.error('An error happened', e);
        }
      );
    },

    createFishSchool (model, amount) {
      const school = new THREE.Group();
      const mixers = [];

      /* console.log(model);
      const printMaterial = (model) => {
        if ('material' in model) {
          console.log(model.material);
        }
        if ('children' in model) {
          model.children.forEach(printMaterial);
        }
      };
      printMaterial(model.scene); */

      // TODO: https://github.com/mrdoob/three.js/blob/219e3c1bc24163e2c31ab6f5cf4bb66f81b689bc/examples/webgl_buffergeometry_instancing_lambert.html
      for (let i = 1; i <= amount; i++) {
        const m = SkeletonUtils.clone(model.scene);
        if (!m) {
          console.error('Cannot clone object');
          break;
        }

        // TODO: random
        m.applyMatrix(new THREE.Matrix4().makeTranslation(20 + i * 5, i * 5, -50 + i * 5));
        m.rotateX(Math.random() * 1);
        m.rotateY(Math.random() * 1);
        m.scale.set(0.1, 0.1, 0.1);

        // if there is an animation, add a mixer for it
        if (model.animations && model.animations.length > 0) {
          const x = new THREE.AnimationMixer(m.children[0]);
          x.clipAction(model.animations[0]).play();
          x.update(Math.random() * model.animations[0].duration); // start at a random time so we're not all in sync
          mixers.push(x);
        }

        school.add(m);
      }
      return { school, mixers };
    },
    clamp (t, min, max) {
      return Math.min(Math.max(t, min), max);
    }
  }
};
</script>

<style lang="less" scoped>
#underwater {
  height: 100vh;
  width: 100vw;
  position: relative;
}

#underwater-hud {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px;
  width: 160px;
  height: 200px;
  z-index: 1000;
  border-radius: 10px;
  background: #000;
  font-family: 'Oxygen', monospace;
  font-size: 64px;
  color: #fff;
  text-align: right;
}
</style>
