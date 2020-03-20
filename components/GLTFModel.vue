<template>
  <div class="object-embed-3d">
    <div class="object-embed-icon" />
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
import * as THREE from 'three';
import { OrbitControls } from './three/OrbitControls.mjs';
import { GLTFLoader } from './three/GLTFLoader.mjs'; // TODO: link symbolic
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
      default: ''
    }
  },

  data () {
    return {
      renderer: null
    };
  },

  mounted () {
    const container = this.$el;

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 20000);
    camera.position.set(0, 0, 150); // TODO: scale
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    if (!this.backgroundColor) {
      scene.background = null;
      this.renderer = new THREE.WebGLRenderer({ alpha: true, powerPreference: 'high-performance' });
      this.renderer.setClearColor(0xFFFFFF, 0);
    } else {
      scene.background = new THREE.Color(this.backgroundColor);
      this.renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance' });
    }

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    const controls = new OrbitControls(camera, this.renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;

    // lights
    const ambientLight = new THREE.AmbientLight(0xCCCCCC, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    directionalLight.position.set(0, 1, 0).normalize();
    scene.add(directionalLight);

    // loading manager
    const loader = new GLTFLoader();
    let mixer, mesh;
    // Load a glTF resource
    loader.load(
      // resource URL
      this.model,
      // called when the resource is loaded
      function (gltf) {
        mesh = gltf.scene;
        scene.add(mesh);
        mixer = new THREE.AnimationMixer(mesh);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
      },
      // called while loading is progressing
      function (xhr) {
        // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      // called when loading has errors
      function (e) {
        // console.log('An error happened', error);
      }
    );

    //
    container.appendChild(this.renderer.domElement);

    const onWindowResize = () => {
      camera.aspect = container.clientWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      controls.update();
      this.renderer.setSize(container.clientWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize, false);

    let prevTime = 0;
    function animate (time) {
      const dt = (time - prevTime) / 1000;
      requestAnimationFrame(animate);
      if (mixer) {
        mixer.update(dt);
      }
      controls.update();
      if (mesh) {
        camera.position.y += 0.8 * Math.sin(time / 2000);
      }
      render();
      prevTime = time;
    }

    let shouldRender = true;
    const render = () => {
      if (!shouldRender) {
        return;
      }
      this.renderer.render(scene, camera);
    };

    animate();

    // don't render when not visible
    this.observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          shouldRender = (entry.intersectionRatio >= 0.05);
        });
      },
      {
        threshold: [0, 0.05]
      });
    this.observer.observe(this.renderer.domElement);
  },
  beforeDestroy () {
    // TODO window.removeEventListener('mousedown',
    // TODO window.removeEventListener('resize',
    // TODO: controls.removeEventL
    this.observer.unobserve(this.renderer.domElement);
    this.observer = null;
    this.renderer.forceContextLoss();
    this.renderer.domElement = null;
    this.renderer = null;
  }
};
</script>
<style lang="less" scoped>
.object-embed-3d {
  position: relative;
  cursor: move;
}

.object-embed-3d:hover .object-embed-icon {
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
</style>
