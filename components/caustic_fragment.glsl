#ifdef GL_ES
precision highp float;
#endif

#define TAU 6.28318530718
#define MAX_ITER 5
#define SPEED 0.3

uniform float t;
varying vec2 vUv;
varying vec3 vPosition;

vec4 caustic(vec2 uv) {
  vec2 p = mod(uv*TAU, TAU)-250.0;
  float t = t * SPEED + 23.0;

  vec2 i = vec2(p);
  float c = 1.0;
  float inten = .005;

  for (int n = 0; n < MAX_ITER; n++) {
    float t = t * (1.0 - (3.5 / float(n+1)));
    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
    c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
  }

  c /= float(MAX_ITER);
  c = 1.17-pow(c, 1.4);
  vec3 color = vec3(pow(abs(c), 8.0));
  color = clamp(color + vec3(0.0, 0.0, 0.0), 0.0, 1.0);

  float aplha=0.5;
  float contrast=0.0;
  color = mix(color, vec3(1.0,1.0,1.0),contrast);
  //color.a = alpha;
  vec4 color4 = vec4(color,0.0);

  return color4;
}


void main(void)
{
  // TODO: z coordinate should multiply caustic to reduce light on higher ocean depths
  // TODO: instead of vUv use x + y
  float x = fract(vPosition.x);
  float y = fract(vPosition.y);
  gl_FragColor = clamp(caustic(vUv) + vec4(0.3), 0.0, 1.0);
}

