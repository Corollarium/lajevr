#ifdef GL_ES
precision highp float;
#endif

uniform vec3 color;
uniform float time;

varying vec2 vUV;
varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D normalMap;
uniform samplerCube environmentMap;

vec4 getNoise( vec2 uv )
{
	vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
	vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
	vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
	vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
	vec4 noise = vec4(0.0, 0.0, 0.0, 0.0);
      texture2D( normalMap, uv0 ) +
      texture2D( normalMap, uv1 ) +
      texture2D( normalMap, uv2 ) +
      texture2D( normalMap, uv3 );
	return noise * 0.5 - 1.0;
}

void main(void) {
  float alpha = 1.0;
  float reflectivity = 0.3;
  vec4 finalColor = vec4(color, alpha);
  vec3 eyePos = normalize(vec3(vUV.xy, -3.0));

//   vec3 eyePos = viewInverse[3].xyz;
  vec3 viewDirection = normalize(eyePos - vPosition);

  vec3 normal = vNormal;
  normal = normalize(getNoise(vPosition.xz * 6.0).xyz * vec3( 1.5, 1.0, 1.5 ));
  vec3 envTexel = textureCube(environmentMap, reflect(-viewDirection, normal)).xyz;
  finalColor.rgb = finalColor.rgb + envTexel * reflectivity;

  gl_FragColor = finalColor;
}
