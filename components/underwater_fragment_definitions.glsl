#ifdef CAUSTIC

#define TAU 6.28318530718
#define MAX_ITER 5
#define SPEED 0.3
#define SCALE 30.0
#define FOG_DENSITY 2.2
#define FOG_DISTANCE_CORRECTION 2.5 // move the far plane closer

#define csb(f, con, sat, bri) mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), f*bri)), f*bri, sat), con)

float fogFactorExp(
  const float dist,
  const float density
) {
  return 1.0 - clamp(exp2(-density * dist), 0.0, 1.0);
}

vec4 caustic(vec2 uv) {
  vec2 p = mod(uv*TAU, TAU)-250.0;
  float t = time * SPEED + 23.0;

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

  float alpha=0.5;
  float contrast=0.0;
  color = mix(color, vec3(1.0,1.0,1.0),contrast);
  //color.a = alpha;
  vec4 color4 = vec4(color,0.0);

  return color4;
}


#endif
