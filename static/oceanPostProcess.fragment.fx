/*
 * "Seascape" by Alexander Alekseev aka TDM - 2014
 * Babylon.js integration by luaacro https://twitter.com/Luaacro
 * License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * Contact: tdmaav@gmail.com
 */

// Uniforms
uniform sampler2D textureSampler;
uniform sampler2D positionSampler;

#ifdef REFLECTION_ENABLED
uniform sampler2D reflectionSampler;
#endif
#ifdef REFRACTION_ENABLED
uniform sampler2D refractionSampler;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec3 cameraRotation;
uniform vec3 cameraPosition;

// Varyings
varying vec2 vUV;

// Constants
const int NUM_STEPS = 8;
const float PI = 3.141592;
const float EPSILON = 1e-3;
#define EPSILON_NRM (0.1 / resolution.x)
const float MAXIMUM_MARCH_DISTANCE = 700.0;

// Sea
const int ITER_GEOMETRY = 8;
const int ITER_FRAGMENT = 5;
const float SEA_HEIGHT = 0.6;
const float SEA_CHOPPY = 4.0;
const float SEA_SPEED = 0.8;
const float SEA_FREQ = 0.16;

const vec3 DARK_BLUE = vec3(0.0, 0.13, 0.25);
const vec3 LIGHT_BLUE = vec3(0, 0.55, 0.78);
const vec3 SEA_BASE = DARK_BLUE;
const vec3 SEA_WATER_COLOR = DARK_BLUE;
const vec3 SEA_BASE_UNDERWATER = LIGHT_BLUE;
const vec3 SEA_WATER_COLOR_UNDERWATER = LIGHT_BLUE;

#define SEA_TIME (1.0 + time * SEA_SPEED)

#define csb(f, con, sat, bri) mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), f*bri)), f*bri, sat), con)

const mat2 octave_m = mat2(1.6, 1.2, -1.2, 1.6);

// Returns a matrix from an euler angle
mat3 fromEuler(vec3 ang) {
  vec2 a1 = vec2(sin(ang.x), cos(ang.x));
  vec2 a2 = vec2(sin(ang.y), cos(ang.y));
  vec2 a3 = vec2(sin(ang.z), cos(ang.z));
  mat3 m;
  m[0] = vec3(a1.y * a3.y + a1.x * a2.x * a3.x, a1.y * a2.x * a3.x + a3.y * a1.x, -a2.y * a3.x);
  m[1] = vec3(-a2.y * a1.x, a1.y * a2.y, a2.x);
  m[2] = vec3(a3.y * a1.x * a2.x + a1.y * a3.x, a1.x * a3.x - a1.y * a3.y * a2.x, a2.y * a3.y);
  return m;
}

// bteitler: A 2D hash function for use in noise generation that returns range [0 .. 1].  You could
// use any hash function of choice, just needs to deterministic and return
// between 0 and 1, and also behave randomly.  Googling "GLSL hash function" returns almost exactly
// this function: http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
// Performance is a real consideration of hash functions since ray-marching is already so heavy.
float hash(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}

// bteitler: A 2D psuedo-random wave / terrain function.  This is actually a poor name in my opinion,
// since its the "hash" function that is really the noise, and this function is smoothly interpolating
// between noisy points to create a continuous surface.
float noise(in vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  // bteitler: This is equivalent to the "smoothstep" interpolation function.
  // This is a smooth wave function with input between 0 and 1
  // (since it is taking the fractional part of <p>) and gives an output
  // between 0 and 1 that behaves and looks like a wave.  This is far from obvious, but we can graph it to see
  // Wolfram link: http://www.wolframalpha.com/input/?i=plot+x*x*%283.0-2.0*x%29+from+x%3D0+to+1
  // This is used to interpolate between random points.  Any smooth wave function that ramps up from 0 and
  // and hit 1.0 over the domain 0 to 1 would work.  For instance, sin(f * PI / 2.0) gives similar visuals.
  // This function is nice however because it does not require an expensive sine calculation.
  vec2 u = f * f * (3.0 - 2.0 * f);

  // bteitler: This very confusing looking mish-mash is simply pulling deterministic random values (between 0 and 1)
  // for 4 corners of the grid square that <p> is inside, and doing 2D interpolation using the <u> function
  // (remember it looks like a nice wave!)
  // The grid square has points defined at integer boundaries.  For example, if <p> is (4.3, 2.1), we will
  // evaluate at points (4, 2), (5, 2), (4, 3), (5, 3), and then interpolate x using u(.3) and y using u(.1).
  return -1.0 +
    2.0 * mix(
      mix(
        hash(i + vec2(0.0, 0.0)),
        hash(i + vec2(1.0, 0.0)),
        u.x
      ),
      mix(
        hash(i + vec2(0.0, 1.0)),
        hash(i + vec2(1.0, 1.0)),
        u.x
      ),
      u.y
    );
}

// bteitler: diffuse lighting calculation - could be tweaked to taste
// lighting
float diffuse(vec3 n, vec3 l, float p) {
  return pow(dot(n, l) * 0.4 + 0.6, p);
}

// bteitler: specular lighting calculation - could be tweaked taste
float specular(vec3 n, vec3 l, vec3 e, float s) {
  float nrm = (s + 8.0) / (PI * 8.0);
  return pow(max(dot(reflect(e, n), l), 0.0), s) * nrm;
}

// sea
// bteitler: TLDR is that this passes a low frequency random terrain through a 2D symmetric wave function that looks like this:
// http://www.wolframalpha.com/input/?i=%7B1-%7B%7B%7BAbs%5BCos%5B0.16x%5D%5D+%2B+Abs%5BCos%5B0.16x%5D%5D+%28%281.+-+Abs%5BSin%5B0.16x%5D%5D%29+-+Abs%5BCos%5B0.16x%5D%5D%29%7D+*+%7BAbs%5BCos%5B0.16y%5D%5D+%2B+Abs%5BCos%5B0.16y%5D%5D+%28%281.+-+Abs%5BSin%5B0.16y%5D%5D%29+-+Abs%5BCos%5B0.16y%5D%5D%29%7D%7D%5E0.65%7D%7D%5E4+from+-20+to+20
// The <choppy> parameter affects the wave shape.
float sea_octave(vec2 uv, float choppy) {
    // bteitler: Add the smoothed 2D terrain / wave function to the input coordinates
    // which are going to be our X and Z world coordinates.  It may be unclear why we are doing this.
    // This value is about to be passed through a wave function.  So we have a smoothed psuedo random height
    // field being added to our (X, Z) coordinates, and then fed through yet another wav function below.
  uv += noise(uv);
    // Note that you could simply return noise(uv) here and it would take on the characteristics of our
    // noise interpolation function u and would be a reasonable heightmap for terrain.
    // However, that isn't the shape we want in the end for an ocean with waves, so it will be fed through
    // a more wave like function.  Note that although both x and y channels of <uv> have the same value added, there is a
    // symmetry break because <uv>.x and <uv>.y will typically be different values.

    // bteitler: This is a wave function with pointy peaks and curved troughs:
    // http://www.wolframalpha.com/input/?i=1-abs%28cos%28x%29%29%3B
  vec2 wv = 1.0 - abs(sin(uv));

    // bteitler: This is a wave function with curved peaks and pointy troughs:
    // http://www.wolframalpha.com/input/?i=abs%28cos%28x%29%29%3B
  vec2 swv = abs(cos(uv));

    // bteitler: Blending both wave functions gets us a new, cooler wave function (output between 0 and 1):
    // http://www.wolframalpha.com/input/?i=abs%28cos%28x%29%29+%2B+abs%28cos%28x%29%29+*+%28%281.0-abs%28sin%28x%29%29%29+-+abs%28cos%28x%29%29%29
  wv = mix(wv, swv, wv);

    // bteitler: Finally, compose both of the wave functions for X and Y channels into a final
    // 1D height value, shaping it a bit along the way.  First, there is the composition (multiplication) of
    // the wave functions: wv.x * wv.y.  Wolfram will give us a cute 2D height graph for this!:
    // http://www.wolframalpha.com/input/?i=%7BAbs%5BCos%5Bx%5D%5D+%2B+Abs%5BCos%5Bx%5D%5D+%28%281.+-+Abs%5BSin%5Bx%5D%5D%29+-+Abs%5BCos%5Bx%5D%5D%29%7D+*+%7BAbs%5BCos%5By%5D%5D+%2B+Abs%5BCos%5By%5D%5D+%28%281.+-+Abs%5BSin%5By%5D%5D%29+-+Abs%5BCos%5By%5D%5D%29%7D
    // Next, we reshape the 2D wave function by exponentiation: (wv.x * wv.y)^0.65.  This slightly rounds the base of the wave:
    // http://www.wolframalpha.com/input/?i=%7B%7BAbs%5BCos%5Bx%5D%5D+%2B+Abs%5BCos%5Bx%5D%5D+%28%281.+-+Abs%5BSin%5Bx%5D%5D%29+-+Abs%5BCos%5Bx%5D%5D%29%7D+*+%7BAbs%5BCos%5By%5D%5D+%2B+Abs%5BCos%5By%5D%5D+%28%281.+-+Abs%5BSin%5By%5D%5D%29+-+Abs%5BCos%5By%5D%5D%29%7D%7D%5E0.65
    // one last final transform (with choppy = 4) results in this which resembles a recognizable ocean wave shape in 2D:
    // http://www.wolframalpha.com/input/?i=%7B1-%7B%7B%7BAbs%5BCos%5Bx%5D%5D+%2B+Abs%5BCos%5Bx%5D%5D+%28%281.+-+Abs%5BSin%5Bx%5D%5D%29+-+Abs%5BCos%5Bx%5D%5D%29%7D+*+%7BAbs%5BCos%5By%5D%5D+%2B+Abs%5BCos%5By%5D%5D+%28%281.+-+Abs%5BSin%5By%5D%5D%29+-+Abs%5BCos%5By%5D%5D%29%7D%7D%5E0.65%7D%7D%5E4
    // Note that this function is called with a specific frequency multiplier which will stretch out the wave.  Here is the graph
    // with the base frequency used by map and map_detailed (0.16):
    // http://www.wolframalpha.com/input/?i=%7B1-%7B%7B%7BAbs%5BCos%5B0.16x%5D%5D+%2B+Abs%5BCos%5B0.16x%5D%5D+%28%281.+-+Abs%5BSin%5B0.16x%5D%5D%29+-+Abs%5BCos%5B0.16x%5D%5D%29%7D+*+%7BAbs%5BCos%5B0.16y%5D%5D+%2B+Abs%5BCos%5B0.16y%5D%5D+%28%281.+-+Abs%5BSin%5B0.16y%5D%5D%29+-+Abs%5BCos%5B0.16y%5D%5D%29%7D%7D%5E0.65%7D%7D%5E4+from+-20+to+20
  return pow(1.0 - pow(wv.x * wv.y, 0.65), choppy);
}
// bteitler: Compute the distance along Y axis of a point to the surface of the ocean
// using a low(er) resolution ocean height composition function (less iterations).
float map(vec3 p, vec3 ori) {
  if (ori.y <= 0.0) {
    // return p.y;
  }

  float freq = SEA_FREQ;
  float amp = SEA_HEIGHT;
  float choppy = SEA_CHOPPY;
  vec2 uv = p.xz;
  uv.x *= 0.75;

  // bteitler: Compose our wave noise generation ("sea_octave") with different frequencies
  // and offsets to achieve a final height map that looks like an ocean.  Likely lots
  // of black magic / trial and error here to get it to look right.  Each sea_octave has this shape:
  // http://www.wolframalpha.com/input/?i=%7B1-%7B%7B%7BAbs%5BCos%5B0.16x%5D%5D+%2B+Abs%5BCos%5B0.16x%5D%5D+%28%281.+-+Abs%5BSin%5B0.16x%5D%5D%29+-+Abs%5BCos%5B0.16x%5D%5D%29%7D+*+%7BAbs%5BCos%5B0.16y%5D%5D+%2B+Abs%5BCos%5B0.16y%5D%5D+%28%281.+-+Abs%5BSin%5B0.16y%5D%5D%29+-+Abs%5BCos%5B0.16y%5D%5D%29%7D%7D%5E0.65%7D%7D%5E4+from+-20+to+20
  // which should give you an idea of what is going.  You don't need to graph this function because it
  // appears to your left :)
  float d, h = 0.0;
  for(int i = 0; i < ITER_GEOMETRY; i++) {
        // bteitler: start out with our 2D symmetric wave at the current frequency
    d = sea_octave((uv + SEA_TIME) * freq, choppy);
        // bteitler: stack wave ontop of itself at an offset that varies over time for more height and wave pattern variance
    d += sea_octave((uv - SEA_TIME) * freq, choppy);

    h += d * amp; // bteitler: Bump our height by the current wave function

    // bteitler: "Twist" our domain input into a different space based on a permutation matrix
    // The scales of the matrix values affect the frequency of the wave at this iteration, but more importantly
    // it is responsible for the realistic assymetry since the domain is shiftly differently.
    // This is likely the most important parameter for wave topology.
    uv *= octave_m;

    freq *= 1.9; // bteitler: Exponentially increase frequency every iteration (on top of our permutation)
    amp *= 0.22; // bteitler: Lower the amplitude every frequency, since we are adding finer and finer detail
        // bteitler: finally, adjust the choppy parameter which will effect our base 2D sea_octave shape a bit.  This makes
        // the "waves within waves" have different looking shapes, not just frequency and offset
    choppy = mix(choppy, 1.0, 0.2);
  }
  return p.y - h;
}

// bteitler: Compute the distance along Y axis of a point to the surface of the ocean
// using a high(er) resolution ocean height composition function (more iterations).
float map_detailed(vec3 p) {
  float freq = SEA_FREQ;
  float amp = SEA_HEIGHT;
  float choppy = SEA_CHOPPY;
  vec2 uv = p.xz;
  uv.x *= 0.75;

  // bteitler: Compose our wave noise generation ("sea_octave") with different frequencies
  // and offsets to achieve a final height map that looks like an ocean.  Likely lots
  // of black magic / trial and error here to get it to look right.  Each sea_octave has this shape:
  // http://www.wolframalpha.com/input/?i=%7B1-%7B%7B%7BAbs%5BCos%5B0.16x%5D%5D+%2B+Abs%5BCos%5B0.16x%5D%5D+%28%281.+-+Abs%5BSin%5B0.16x%5D%5D%29+-+Abs%5BCos%5B0.16x%5D%5D%29%7D+*+%7BAbs%5BCos%5B0.16y%5D%5D+%2B+Abs%5BCos%5B0.16y%5D%5D+%28%281.+-+Abs%5BSin%5B0.16y%5D%5D%29+-+Abs%5BCos%5B0.16y%5D%5D%29%7D%7D%5E0.65%7D%7D%5E4+from+-20+to+20
  // which should give you an idea of what is going.  You don't need to graph this function because it
  // appears to your left :)
  float d, h = 0.0;
  for(int i = 0; i < ITER_FRAGMENT; i++) {
      // bteitler: start out with our 2D symmetric wave at the current frequency
    d = sea_octave((uv + SEA_TIME) * freq, choppy);
      // bteitler: stack wave ontop of itself at an offset that varies over time for more height and wave pattern variance
    d += sea_octave((uv - SEA_TIME) * freq, choppy);

    h += d * amp; // bteitler: Bump our height by the current wave function

      // bteitler: "Twist" our domain input into a different space based on a permutation matrix
      // The scales of the matrix values affect the frequency of the wave at this iteration, but more importantly
      // it is responsible for the realistic assymetry since the domain is shiftly differently.
      // This is likely the most important parameter for wave topology.
    uv *= octave_m;

    freq *= 1.9; // bteitler: Exponentially increase frequency every iteration (on top of our permutation)
    amp *= 0.22; // bteitler: Lower the amplitude every frequency, since we are adding finer and finer detail
      // bteitler: finally, adjust the choppy parameter which will effect our base 2D sea_octave shape a bit.  This makes
      // the "waves within waves" have different looking shapes, not just frequency and offset
    choppy = mix(choppy, 1.0, 0.2);
  }
  return p.y - h;
}

// bteitler:
// p: point on ocean surface to get color for
// n: normal on ocean surface at <p>
// l: light (sun) direction
// eye: ray direction from camera position for this pixel
// dist: distance from camera to point <p> on ocean surface
vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist, bool isUnderwater) {
  float fresnelAngle = 0.0;

  // if we're underwater we want to invert the fresnel angle, since we are now reflecting
  // rays to under the water and they get darker, while above water they reflect to the
  // sky and get lighter
  if (isUnderwater) {
    fresnelAngle = abs(dot(n, -eye));
  }
  else {
    fresnelAngle = 1.0 - abs(dot(n, -eye));
  }

  // bteitler: Fresnel is an exponential that gets bigger when the angle between ocean
  // surface normal and eye ray is smaller
  float fresnel = clamp(fresnelAngle, 0.0, 1.0);
  fresnel = pow(fresnel, 3.0) * 0.65;

#if defined(REFLECTION_ENABLED) || defined(REFRACTION_ENABLED)
    // bteitler: Bounce eye ray off ocean towards sky, and get the color of the sky
  vec2 reflectionUv = vec2(vUV.x, vUV.y + normalize(n).y);
#endif

#ifdef REFLECTION_ENABLED
  vec3 reflected = texture2D(reflectionSampler, reflectionUv).rgb * (1.0 - fresnel);
#else
  vec3 eyeNormal = reflect(eye, n);
  eyeNormal.y = max(eyeNormal.y, 0.0);
  vec3 reflected = vec3(pow(1.0 - eyeNormal.y, 2.0), 1.0 - eyeNormal.y, 0.6 + (1.0 - eyeNormal.y) * 0.4);
#endif

  // bteitler: refraction effect based on angle between light surface normal
#ifdef REFRACTION_ENABLED
  vec3 refracted = SEA_BASE + diffuse(n, l, 80.0) * SEA_WATER_COLOR * 0.12;
  refracted += (texture2D(refractionSampler, reflectionUv).rgb * fresnel);
#else
  vec3 refracted = SEA_BASE + diffuse(n, l, 80.0) * SEA_WATER_COLOR * 0.12;
#endif

    // bteitler: blend the refracted color with the reflected color based on our fresnel term
  vec3 color = mix(refracted, reflected, fresnel);

    // bteitler: Apply a distance based attenuation factor which is stronger
    // at peaks
  float atten = max(1.0 - dot(dist, dist) * 0.001, 0.0);
  color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.18 * atten;

    // bteitler: Apply specular highlight
  color += vec3(specular(n, l, eye, 60.0));

  return color;
}

// p: point on ocean surface to get color for
// n: normal on ocean surface at <p>
// l: light (sun) direction
// eye: ray direction from camera position for this pixel
// dist: distance from camera to point <p> on ocean surface
vec3 getSeaColorUnderwater(
  vec3 p,
  vec3 n,
  vec3 l,
  vec3 eye,
  vec3 dist,
  bool isUnderwater
) {
  float fresnel = clamp(abs(dot(n, -eye)), 0.0, 1.0);
  fresnel = pow(fresnel, 3.0) * 0.65;

#if defined(REFLECTION_ENABLED) || defined(REFRACTION_ENABLED)
    // bteitler: Bounce eye ray off ocean towards sky, and get the color of the sky
  vec2 reflectionUv = vec2(vUV.x, vUV.y + normalize(n).y);
#endif

#ifdef REFLECTION_ENABLED
  vec3 reflected = texture2D(reflectionSampler, reflectionUv).rgb * (1.0 - fresnel);
#else
  vec3 eyeNormal = reflect(eye, n);
  eyeNormal.y = max(eyeNormal.y, 0.0);
  vec3 reflected = vec3(pow(1.0 - eyeNormal.y, 2.0), 1.0 - eyeNormal.y, 0.6 + (1.0 - eyeNormal.y) * 0.4);
#endif

  // bteitler: refraction effect based on angle between light surface normal
#ifdef REFRACTION_ENABLED
  vec3 refracted = SEA_BASE_UNDERWATER + diffuse(n, l, 80.0) * SEA_WATER_COLOR_UNDERWATER * 0.12;
  refracted += (texture2D(refractionSampler, reflectionUv).rgb * fresnel);
#else
  vec3 refracted = SEA_BASE_UNDERWATER + diffuse(n, l, 80.0) * SEA_WATER_COLOR_UNDERWATER * 0.12;
#endif

  // bteitler: blend the refracted color with the reflected color based on our fresnel term
  vec3 color = mix(refracted, reflected, fresnel);

  // bteitler: Apply a distance based attenuation factor which is stronger
  // at peaks
  float atten = max(1.0 - dot(dist, dist) * 0.001, 0.0);
  color += SEA_WATER_COLOR_UNDERWATER * (p.y - SEA_HEIGHT) * 0.18 * atten;

    // bteitler: Apply specular highlight
  color += vec3(specular(n, l, eye, 60.0));

  return color;
}


// bteitler: Estimate the normal at a point <p> on the ocean surface using a slight more detailed
// ocean mapping function (using more noise octaves).
// Takes an argument <eps> (stands for epsilon) which is the resolution to use
// for the gradient.  See here for more info on gradients: https://en.wikipedia.org/wiki/Gradient
// tracing
vec3 getNormal(vec3 p, float eps) {
    // bteitler: Approximate gradient.  An exact gradient would need the "map" / "map_detailed" functions
    // to return x, y, and z, but it only computes height relative to surface along Y axis.  I'm assuming
    // for simplicity and / or optimization reasons we approximate the gradient by the change in ocean
    // height for all axis.
  vec3 n;
  n.y = map_detailed(p); // bteitler: Detailed height relative to surface, temporarily here to save a variable?
  n.x = map_detailed(vec3(p.x + eps, p.y, p.z)) - n.y; // bteitler approximate X gradient as change in height along X axis delta
  n.z = map_detailed(vec3(p.x, p.y, p.z + eps)) - n.y; // bteitler approximate Z gradient as change in height along Z axis delta
    // bteitler: Taking advantage of the fact that we know we won't have really steep waves, we expect
    // the Y normal component to be fairly large always.  Sacrifices yet more accurately to avoid some calculation.
  n.y = eps;
  return normalize(n);

    // bteitler: A more naive and easy to understand version could look like this and
    // produces almost the same visuals and is a little more expensive.
    // vec3 n;
    // float h = map_detailed(p);
    // n.y = map_detailed(vec3(p.x,p.y+eps,p.z)) - h;
    // n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - h;
    // n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - h;
    // return normalize(n);
}

// bteitler: Find out where a ray intersects the current ocean
float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {
  float tm = 0.0;
  float tx = MAXIMUM_MARCH_DISTANCE; // bteitler: a really far distance, this could likely be tweaked a bit as desired

  // bteitler: At a really far away distance along the ray, what is it's height relative
  // to the ocean in ONLY the Y direction?
  float hx = map(ori + dir * tx, ori);

  // bteitler: A positive height relative to the ocean surface (in Y direction) at a really far distance means
  // this pixel is pure sky.  Quit early and return the far distance constant.
  if (ori.y > 0.0 && hx > 0.0) {
    return tx;
  }
  else if (ori.y < 0.0 && hx < 0.0) {
    return -tx;
  }

  if (ori.y < 0.0) {
    return -ori.y / dir.y;
  }

  // bteitler: hm starts out as the height of the camera position relative to ocean.
  float hm = map(ori + dir * tm, ori);

  // bteitler: This is the main ray marching logic.  This is probably the single most confusing part of the shader
  // since height mapping is not an exact distance field (tells you distance to surface if you drop a line down to ocean
  // surface in the Y direction, but there could have been a peak at a very close point along the x and z
  // directions that is closer).  Therefore, it would be possible/easy to overshoot the surface using the raw height field
  // as the march distance.  The author uses a trick to compensate for this.
  float tmid = 0.0;
  for (int i = 0; i < NUM_STEPS; i++) { // bteitler: Constant number of ray marches per ray that hits the water
    // bteitler: Move forward along ray in such a way that has the following properties:
    // 1. If our current height relative to ocean is higher, move forward more
    // 2. If the height relative to ocean floor very far along the ray is much lower
    //    below the ocean surface, move forward less
    // Idea behind 1. is that if we are far above the ocean floor we can risk jumping
    // forward more without shooting under ocean, because the ocean is mostly level.
    // The idea behind 2. is that if extruding the ray goes farther under the ocean, then
    // you are looking more orthgonal to ocean surface (as opposed to looking towards horizon), and therefore
    // movement along the ray gets closer to ocean faster, so we need to move forward less to reduce risk
    // of overshooting.
    tmid = mix(tm, tx, hm / (hm - hx));
    p = ori + dir * tmid;

    float hmid = map(p, ori); // bteitler: Re-evaluate height relative to ocean surface in Y axis

    if ((ori.y > 0.0 && hmid < 0.0) || (ori.y < 0.0 && hmid > 0.0)) {
      // bteitler: We went through the ocean surface if we are negative relative to surface now
      // bteitler: So instead of actually marching forward to cross the surface, we instead
      // assign our really far distance and height to be where we just evaluated that crossed the surface.
      // Next iteration will attempt to go forward more and is less likely to cross the boundary.
      // A naive implementation might have returned <tmid> immediately here, which
      // results in a much poorer / somewhat indeterministic quality rendering.
      tx = tmid;
      hx = hmid;
    } else {
      // Haven't hit surface yet, easy case, just march forward
      tm = tmid;
      hm = hmid;
    }
  }

  // bteitler: Return the distance, which should be really close to the height map without going under the ocean
  return tmid; //  * sign(ori.y);
}

// Main
void main() {
#ifdef NOT_SUPPORTED
  // Just work as a pass through
  gl_FragColor = texture2D(textureSampler, vUV);
#else

  bool isUnderwater = cameraPosition.y < 0.0;

  vec2 uv = vUV;

  // bteitler: 2D Pixel location passed in as raw pixel, let's divide by resolution
  // to convert to coordinates between 0 and 1
  uv = uv * 2.0 - 1.0;
  uv.x *= resolution.x / resolution.y;

  // ray
  // This will be used to drive where the user is looking in world space.
  vec3 ang = vec3(cameraRotation.z, cameraRotation.x, cameraRotation.y);
  // bteitler: Calculate the "origin" of the camera in world space.
  vec3 ori = vec3(cameraPosition.x, cameraPosition.y, -cameraPosition.z);

  // bteitler: This is the ray direction we are shooting from the camera location ("ori") that we need to light
  // for this pixel.  The numeric parameter indicates we are using a focal length equal to it.
  vec3 dir = normalize(vec3(uv.xy, -3.0));

  // bteitler: Renormalize the ray direction, and then rotate it based on the previously calculated
  // animation angle "ang".  "fromEuler" just calculates a rotation matrix from a vector of angles.
  // if you remove the " * fromEuler(ang)" part, you will disable the camera rotation animation.
  dir = normalize(dir) * fromEuler(ang);

  // Tracing
  vec3 baseColor = texture2D(textureSampler, vUV).rgb;
  float alpha = 1.0;

  // bteitler: ray-march to the ocean surface (which can be thought of as a randomly generated height map)
  // and store in p
  vec3 p;

  float distance = 0.0;
  if (ori.y > 0.0) {
    distance = heightMapTracing(ori, dir, p);
  }
  else {
    distance = heightMapTracing(ori * vec3(1.0, -1.0, 1.0), dir * vec3(1.0, -1.0, 1.0), p);
    p.y = -p.y;
  }
  vec3 color = baseColor;
  if (distance >= MAXIMUM_MARCH_DISTANCE || distance <= -MAXIMUM_MARCH_DISTANCE) {
    // ray definitely escaped
  }
  else {
    // bteitler: distance vector to ocean surface for this pixel's ray
    vec3 dist = p - ori;

    // bteitler: Calculate the normal on the ocean surface where we intersected (p), using
    // different "resolution" (in a sense) based on how far away the ray traveled.  Normals close to
    // the camera should be calculated with high resolution, and normals far from the camera should be calculated with low resolution
    // The reason to do this is that specular effects (or non linear normal based lighting effects) become fairly random at
    // far distances and low resolutions and can cause unpleasant shimmering during motion.
    vec3 normalAtOcean = getNormal(p, dot(dist, dist) * EPSILON_NRM);

    // bteitler: direction of the infinitely far away directional light.  Changing this will change
    // the sunlight direction.
    vec3 light = normalize(vec3(0.0, 1.0, 0.8));

    // Color
    float seaFact = 1.0; // clamp(max(ori.y, 0.0), 0.0, 1.0);
    vec3 position = texture2D(positionSampler, vUV).rgb;

    if (ori.y > 0.0 && max(position.y, 0.0) < p.y) {
      // Sea above

      // bteitler: Mix (linear interpolate) a color calculated for the sky (based solely on ray direction) and a sea color
      // which contains a realistic lighting model.  This is basically doing a fog calculation: weighing more the sky color
      // in the distance in an exponential manner.
      color = mix(
        baseColor,
        getSeaColor(p, normalAtOcean, light, dir, dist, isUnderwater),
        pow(smoothstep(0.0, -0.05, dir.y), 0.3)
      ) * seaFact;
    }
    else if (ori.y < 0.0) {
      if (min(position.y, 0.00) > p.y) {
        vec3 normDist = normalize(dist);
        // underwater. Mix rendered color with the outside, so sky is visible.
        // Transparency mimics Snell's window with a fake function that looks good.
        const float cosAngleLimit = 0.8;
        // transparency is normalized.
        float transparency = smoothstep(1.0, cosAngleLimit, abs(normDist.y));
        vec3 seaColor = getSeaColorUnderwater(p, normalAtOcean, light * vec3(1.0, -1.0, 0.0), dir, dist, isUnderwater);
        float seaColorBrightness = 1.0;
        // make things brighter on the Snell window
        if (transparency <= cosAngleLimit) {
          seaColorBrightness = 1.0 + (1.0 - transparency / cosAngleLimit) * 1.3;
        }
        color = mix(
          baseColor,
          seaColor * seaColorBrightness,
          transparency
        ) * seaFact * seaColorBrightness;
      }
    }

    if (ori.y > 0.0) {
      color = mix(color, baseColor * SEA_BASE + diffuse(normalAtOcean, normalAtOcean, 80.0) * SEA_WATER_COLOR * 0.12, 1.0 - seaFact);
    }
  }

  // post
  // bteitler: Apply an overall image brightness factor as the final color for this pixel.  Can be
  // tweaked artistically.
  // gl_FragColor = vec4(pow(color, vec3(0.75)), alpha);
  gl_FragDepth = clamp(distance/600.0, 0.0, 1.0);
  gl_FragColor = vec4(color, alpha);
#endif
}
