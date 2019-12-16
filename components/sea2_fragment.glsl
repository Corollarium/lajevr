#ifdef GL_ES
precision highp float;
#endif

uniform vec3 waterColor;
uniform float time;
uniform vec3 cameraPosition;
uniform sampler2D channel2;
uniform sampler2D channel3;

varying vec2 vUV;
varying vec3 vNormal;
varying vec3 vPosition;

#define csb(f, con, sat, bri) mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), f*bri)), f*bri, sat), con)

void main(void) {
  vec3 col = vec3(waterColor); // final color
  const vec2 sun = vec2(-0.1, 0.6); // sun position
  vec2 uv = vUV;
  vec3 pos = vPosition;
  vec3 dir = normalize(vec3(uv, -1.4));

 	// calculate sun
	float i = max(0.0, 1.0-length(sun-uv));
	col = vec3(pow(i, 1.9), pow(i, 1.0), pow(i, .8)) * 1.3;

	// Water distance colour...
  float viewAngle = abs(dot(normalize(cameraPosition-vPosition), vec3(0, 1, 0)));
	col = mix(col, vec3(0.0, .25, .45), ((1.0-vUV.y)*.45) * 1.8);

  // Add water ripples...
  float d = (3.0-pos.y) / -uv.y;
  vec2 wat = (dir * d).xz-pos.xz;
  wat +=  (texture(channel2, (wat*.03+time*.01)*.1, 1.0).z -
    texture(channel3, wat*.02-time*.01, .0).y) * .4;
  i = texture(channel3, wat* .02, 0.0).x;
  col += vec3(i) * max(abs(uv.y), 0.0);

  // contrast, saturation, brightness
  col = csb(col, 1.1, 1.05, 1.22);

  // handle horizon
  col = mix(waterColor, col, clamp(viewAngle*3.0 - 0.3, 0.0, 1.0));

  gl_FragColor.rgb = col;
}
