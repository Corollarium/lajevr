#ifdef GL_ES
precision highp float;
#endif

uniform float time;

varying vec2 vUV;
varying vec3 vNormal;
varying vec3 vPosition;

/*
 * simple pure black shader for objects that should not render caustics.
 */
void main(void)
{
  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
}

