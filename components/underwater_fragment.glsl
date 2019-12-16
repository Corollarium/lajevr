precision highp float;

varying vec2 vUv;
varying vec3 vPosition;
uniform vec3 fogColor;
uniform sampler2D baseTexture;
uniform sampler2D causticTexture;
uniform sampler2D depthTexture;

#define FOG_DENSITY 9.7

float fogFactorExp(
  const float dist,
  const float density
) {
  return clamp(exp(-density * dist), 0.0, 1.0);
}

void main() {
  // apply visibility loss with distance
  vec4 actualDepth = texture2D(depthTexture, vUv);
  float depth = actualDepth.r;
  float fogFactor = clamp(1.1*fogFactorExp(actualDepth.r, FOG_DENSITY), 0.0, 1.0);

  // TODO: noise
  // TODO: color loss with depth
  vec4 base = texture2D(baseTexture, vUv);
  vec4 caustic = texture2D(causticTexture, vUv);

  // gl_FragColor.rgb = base.rgb; // plain
  // gl_FragColor.rgb = actualDepth.rgb; // just depth
  gl_FragColor.rgb = caustic.rgb; // just depth
  // gl_FragColor.rgb = vec3(fogFactor, fogFactor, fogFactor); // pure fog
  // gl_FragColor.rgb = mix(base.rgb, fogColor, fogFactor); // fog + texture
  // gl_FragColor.rgb = mix(base.rgb, caustic.rgb, depth); // caustics + texture
  // gl_FragColor.rgb = mix(mix(base.rgb, caustic.rgb, depth), fogColor, fogFactor); // everything
  gl_FragColor.w = base.w;
}
