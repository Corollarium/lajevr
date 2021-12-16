#define CAUSTIC_FOG

#ifdef CAUSTIC

  if (vPositionW.y < 0.0) {
    float normalizedDistance = (gl_FragCoord.z / gl_FragCoord.w) / 100.0;
    vec4 causticFinalColor = gl_FragColor;

    // calculate the caustic
    if (vNormalW.y > 0.0) {
      vec2 causticCoord = vec2(fract(vPositionW.x/SCALE), fract(vPositionW.z/SCALE));
      // scale by normal to make caustic less pronounced for more vertical faces.
      vec4 caustic = clamp(caustic(causticCoord), 0.0, 1.0) * vNormalW.y;

      causticFinalColor.rgb = mix(causticFinalColor.rgb, caustic.rgb, clamp(caustic.a * 0.5 * normalizedDistance, 0.2, 0.7)); // caustics + texture
    }

#ifdef CAUSTIC_FOG
    float fogFactor = clamp(
      fogFactorExp(normalizedDistance, FOG_DENSITY * FOG_DISTANCE_CORRECTION),
      0.0,
      1.0
    );
    vec3 fogColor = vec3(0.0, 0.5, 0.85); // TODO uniform
    causticFinalColor.rgb = mix(
      causticFinalColor.rgb,
      fogColor,
      fogFactor
    );
#endif
    // color, saturation, brightness
    gl_FragColor.rgb = csb(causticFinalColor.rgb, 1.1, 1.05, 1.22);

    gl_FragColor.a = 1.0;
  }
#endif
