<template>
  <div class="object-embed-3d">
    <div class="object-embed-icon" />
    <p
      v-if="error"
      class="error"
    >
      {{ error }}
    </p>
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
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

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
      renderer: null,
      error: null
    };
  },

  mounted () {
    const container = this.$el;

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1.0 / 100, 1.0 * 100);
    camera.position.set(0, 0, 1.0);
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
    const MANAGER = new THREE.LoadingManager();
    const loader = new GLTFLoader(MANAGER).setCrossOrigin('anonymous');

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    const dracoLoader = new DRACOLoader(MANAGER);
    dracoLoader.setDecoderPath(this.$router.options.base + 'code/draco/');
    loader.setDRACOLoader(dracoLoader);
    loader.setMeshoptDecoder(MeshoptDecoder);

    let mixer, mesh;
    // Load a glTF resource
    loader.load(
      // resource URL
      this.model,
      // called when the resource is loaded
      function (gltf) {
        mesh = gltf.scene || gltf.scenes[0];

        scene.add(mesh);

        const box = new THREE.Box3().setFromObject(mesh);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        const object = mesh;
        object.position.x += (object.position.x - center.x);
        object.position.y += (object.position.y - center.y);
        object.position.z += (object.position.z - center.z);
        controls.maxDistance = size * 10;
        camera.near = size / 100;
        camera.far = size * 100;
        camera.updateProjectionMatrix();

        camera.position.copy(center);
        camera.position.x += size / 2.0;
        camera.position.y += size / 5.0;
        camera.position.z += size / 2.0;
        camera.lookAt(center);

        mixer = new THREE.AnimationMixer(mesh);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      // called when loading has errors
      function (e) {
        this.error = e.message;
        console.log('An error happened', e);
      }
    );

    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

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
        // camera.position.y += 0.8 * Math.sin(time / 2000);
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
  },
  methods: {
    degToRad (deg) {
      return deg / 180.0 * Math.PI;
    }
  }
};
</script>
<style lang="less" scoped>
.object-embed-3d {
  position: relative;
  cursor: move;
  width: 100%;

  &:hover .object-embed-icon {
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
}
</style>
