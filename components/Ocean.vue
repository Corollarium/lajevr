<template>
  <div id="ocean">
    <!-- THIS is OPENGL Shading language scripts -->
    <script id="vertex-shader" type="no-js">
      void main() {
      gl_Position = vec4( position, 1.0 );
      }
    </script>

    <!-- original from https://www.shadertoy.com/view/Ms2SD1
    /*
    * "Seascape" by Alexander Alekseev aka TDM - 2014
    * License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
    * Contact: tdmaav@gmail.com
    */
    -->
    <script id="fragment-shader" type="no-js">
      #ifdef GL_ES
      precision mediump float;
      #endif

      uniform float time;
      uniform vec2 mouse;
      uniform vec2 resolution;
      varying vec2 surfacePosition;

      const int NUM_STEPS = 8;
      const float PI      = 3.1415;
      const float EPSILON = 1e-3;
      float EPSILON_NRM   = 0.1 / resolution.x;

      // sea
      const int ITER_GEOMETRY = 3;
      const int ITER_FRAGMENT = 5;
      const float SEA_HEIGHT = 0.6;
      const float SEA_CHOPPY = 2.0;
      const float SEA_SPEED = 0.8;
      const float SEA_FREQ = 0.16;
      // const vec3 SEA_BASE = vec3(0.1,0.19,0.22);
      // const vec3 SEA_WATER_COLOR = vec3(0.8,0.9,0.6);
      const vec3 SEA_BASE = vec3(0.0,0.09,0.18);
      const vec3 SEA_WATER_COLOR = vec3(0.8,0.9,0.6)*0.6;
      const float SKY_INTENSITY = 0.4;

      #define SEA_TIME time * SEA_SPEED

      // math
      mat4 fromEuler(vec3 ang) {
      vec2 a1 = vec2(sin(ang.x),cos(ang.x));
      vec2 a2 = vec2(sin(ang.y),cos(ang.y));
      vec2 a3 = vec2(sin(ang.z),cos(ang.z));
      mat4 m;
      m[0] = vec4(a1.y*a3.y+a1.x*a2.x*a3.x,a1.y*a2.x*a3.x+a3.y*a1.x,-a2.y*a3.x,0.0);
      m[1] = vec4(-a2.y*a1.x,a1.y*a2.y,a2.x,0.0);
      m[2] = vec4(a3.y*a1.x*a2.x+a1.y*a3.x,a1.x*a3.x-a1.y*a3.y*a2.x,a2.y*a3.y,0.0);
      m[3] = vec4(0.0,0.0,0.0,1.0);
      return m;
      }
      vec3 rotate(vec3 v, mat4 m) {
      return vec3(dot(v,m[0].xyz),dot(v,m[1].xyz),dot(v,m[2].xyz));
      }
      float hash( vec2 p ) {
      float h = dot(p,vec2(127.1,311.7));
      return fract(sin(h)*43758.5453123);
      }
      float noise( in vec2 p ) {
      vec2 i = floor( p );
      vec2 f = fract( p );
      vec2 u = f*f*(3.0-2.0*f);
      return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ),
      hash( i + vec2(1.0,0.0) ), u.x),
      mix( hash( i + vec2(0.0,1.0) ),
      hash( i + vec2(1.0,1.0) ), u.x), u.y);
      }

      // lighting
      float diffuse(vec3 n,vec3 l,float p) { return pow(dot(n,l) * 0.4 + 0.6,p); }
      float specular(vec3 n,vec3 l,vec3 e,float s) {
      float nrm = (s + 8.0) / (3.1415 * 8.0);
      return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
      }

      // sky
      vec3 sky_color(vec3 e) {
      e.y = max(e.y,0.0);
      vec3 ret;
      ret.x = pow(1.0-e.y,2.0);
      ret.y = 1.0-e.y;
      ret.z = 0.6+(1.0-e.y)*0.4;
      return ret * SKY_INTENSITY;
      }

      // sea
      float sea_octave(vec2 uv, float choppy) {
      uv += noise(uv);
      vec2 wv = 1.0-abs(sin(uv));
      vec2 swv = abs(cos(uv));
      wv = mix(wv,swv,wv);
      return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
      }

      float map(vec3 p) {
      float freq = SEA_FREQ;
      float amp = SEA_HEIGHT;
      float choppy = SEA_CHOPPY;
      vec2 uv = p.xz; uv.x *= 0.75;
      mat2 m = mat2(1.6,1.2,-1.2,1.6);

      float d, h = 0.0;
      for(int i = 0; i < ITER_GEOMETRY; i++) {
      d = sea_octave((uv+SEA_TIME)*freq,choppy);
      d += sea_octave((uv-SEA_TIME)*freq,choppy);
      h += d * amp;
      uv *= m; freq *= 1.9; amp *= 0.22;
      choppy = mix(choppy,1.0,0.2);
      }
      return p.y - h;
      }
      float map_detailed(vec3 p) {
      float freq = SEA_FREQ;
      float amp = SEA_HEIGHT;
      float choppy = SEA_CHOPPY;
      vec2 uv = p.xz; uv.x *= 0.75;
      mat2 m = mat2(1.6,1.2,-1.2,1.6);

      float d, h = 0.0;
      for(int i = 0; i < ITER_FRAGMENT; i++) {
      d = sea_octave((uv+SEA_TIME)*freq,choppy);
      d += sea_octave((uv-SEA_TIME)*freq,choppy);
      h += d * amp;
      uv *= m; freq *= 1.9; amp *= 0.22;
      choppy = mix(choppy,1.0,0.2);
      }
      return p.y - h;
      }

      vec3 sea_color(in vec3 p, in vec3 n, in vec3 eye, in vec3 dist) {
      float fresnel_o = 1.0 - max(dot(n,-eye),0.0);
      float fresnel = pow(fresnel_o,3.0) * 0.65;

      // reflection
      vec3 refl = sky_color(reflect(eye,n));

      // color
      vec3 ret = SEA_BASE;
      ret = mix(ret,refl,fresnel);

      // wave peaks
      float atten = max(1.0 - dot(dist,dist) * 0.001, 0.0);
      ret += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.18 * atten;

      return ret;
      }

      // tracing
      vec3 getNormal(vec3 p, float eps) {
      vec3 n;
      n.y = map_detailed(p);
      n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y;
      n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y;
      n.y = eps;
      return normalize(n);
      }
      float hftracing(vec3 ori, vec3 dir, out vec3 p) {
      float tm = 0.0;
      float tx = 1000.0;
      float hx = map(ori + dir * tx);
      if(hx > 0.0) return tx;
      float hm = map(ori + dir * tm);
      float tmid = 0.0;
      for(int i = 0; i < NUM_STEPS; i++) {
      tmid = mix(tm,tx, hm/(hm-hx));
      p = ori + dir * tmid;
      float hmid = map(p);
      if(hmid < 0.0) {
      tx = tmid;
      hx = hmid;
      } else {
      tm = tmid;
      hm = hmid;
      }
      }
      return tmid;
      }

      // main
      void main(void)
      {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      uv = 1.0 - uv * 2.0;
      uv.x *= resolution.x / resolution.y;
      //uv = (surfacePosition+vec2(0., .5))*17. + 5E-3*(pow(length(surfacePosition+vec2(0. ,0.5)), -2.));
      uv.y *= -1.;
      //uv.y += -2.;

      // ray
      vec3 ang = vec3(0.0,0.003, pow(time, 0.6));
      ang = vec3(0.0,clamp(2.0-mouse.y*0.01,-0.3,PI),mouse.x*0.01);

      vec3 ori = vec3(0.0,3.5,time*.05);
      vec3 dir = normalize(vec3(uv.xy,-2.0));
      dir.z -= length(uv) * 0.15;
      //dir = rotate(normalize(dir),ang);

      // tracing
      vec3 p;
      float dens = hftracing(ori,dir,p);
      vec3 dist = p - ori;
      vec3 n = getNormal(p, dot(dist,dist)*EPSILON_NRM);

      // color
      vec3 color = sea_color(p,n,dir,dist);
      vec3 light = normalize(vec3(0.0,1.0,0.8));
      color += vec3(diffuse(n,light,80.0) * SEA_WATER_COLOR) * 0.12;
      color += vec3(specular(n,light,dir,60.0));

      // post
      color = mix(sky_color(dir),color,pow(smoothstep(0.0,-0.05,dir.y),0.3));
      color = pow(color,vec3(0.75));
      gl_FragColor = vec4(color,1.0);
      }
    </script>
  </div>
</template>

<script>
const THREE = require('three');
/* eslint-disable no-unused-vars */

export default {
  data () {
    return {
      observer: null,
      scene: null,
      camera: null,
      renderer: null
    };
  },

  mounted () {
    // init camera, scene, renderer
    this.scene = new THREE.Scene();
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
    this.camera.position.z = 100;
    this.camera.lookAt(this.scene.position);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setClearColor(0xC4C4C4);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('ocean').appendChild(this.renderer.domElement);
    const clock = new THREE.Clock();

    const tuniform = {
      time: {
        type: 'f',
        value: 0.1
      },
      resolution: {
        type: 'v2',
        value: new THREE.Vector2()
      },
      mouse: {
        type: 'v4',
        value: new THREE.Vector2()
      }
    };

    tuniform.resolution.value.x = window.innerWidth;
    tuniform.resolution.value.y = window.innerHeight;
    // Create Plane
    const material = new THREE.ShaderMaterial({
      uniforms: tuniform,
      vertexShader: document.getElementById('vertex-shader').textContent,
      fragmentShader: document.getElementById('fragment-shader').textContent
    });
    const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight, 40),
      material
    );
    this.scene.add(mesh);

    const cameraOrtho = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 1, 10);
    cameraOrtho.position.z = 10;
    const sceneOrtho = new THREE.Scene(); // overlay scene
    let spriteLaje = null;
    let mapLaje, mapCeu;

    const fitLaje = () => {
      if (spriteLaje) {
        const SCALE = window.innerWidth / 2000;
        spriteLaje.scale.set(mapLaje.image.width * SCALE, mapLaje.image.height * SCALE, 1);
      }
    };

    const x = new THREE.TextureLoader().load('/textures/ocean/laje_com_ceu.png',
      (_mapLaje) => {
        mapLaje = _mapLaje;
        const materialLaje = new THREE.SpriteMaterial({ map: mapLaje, color: 0xFFFFFF, depthTest: true });
        spriteLaje = new THREE.Sprite(materialLaje);
        spriteLaje.center.set(0.5, 0.3);
        spriteLaje.renderDepth = -1;
        const SCALE = 0.9;
        spriteLaje.scale.set(mapLaje.image.width * SCALE, mapLaje.image.height * SCALE, 1);
        spriteLaje.position.set(0, 0, 1);
        fitLaje();
        sceneOrtho.add(spriteLaje);
      }
    );

    this.renderer.autoClear = false;

    // resize canvas function
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      cameraOrtho.left = -width / 2;
      cameraOrtho.right = width / 2;
      cameraOrtho.top = height / 2;
      cameraOrtho.bottom = -height / 2;
      cameraOrtho.updateProjectionMatrix();
      fitLaje();

      tuniform.resolution.value.x = window.innerWidth;
      tuniform.resolution.value.y = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // draw animation
    let shouldRender = true;
    const render = (time) => {
      if (!this.renderer) {
        return;
      }
      requestAnimationFrame(render);
      if (!shouldRender) {
        return;
      }
      this.renderer.clear();
      tuniform.time.value += clock.getDelta();
      this.renderer.render(this.scene, this.camera);
      this.renderer.clearDepth();
      this.renderer.render(sceneOrtho, cameraOrtho);
    };
    render();

    window.addEventListener('scroll', function (e) {
      // TODO: "dive" when scroll this.camera.position.y = window.scrollY;
      tuniform.mouse[1] = window.scrollY;
    });

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
    // TODO window.addEventListener('scroll',
    this.observer.unobserve(this.renderer.domElement);
    this.observer = null;
    this.renderer.forceContextLoss();
    this.renderer.domElement = null;
    this.renderer = null;
  }
};
</script>
<style lang="less" scoped>
#ocean {
  position: absolute;
  height: 100%;
}
</style>
