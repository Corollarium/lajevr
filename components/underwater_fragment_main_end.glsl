
#ifdef CAUSTIC
  // calculate the causit
  if (vNormalW.y > 0.0 && vPositionW.y < 0.0) {
    vec2 causticCoord = vec2(fract(vPositionW.x/SCALE), fract(vPositionW.z/SCALE));
    // scale by normal to make caustic less pronounced for more vertical faces.
    vec4 caustic = clamp(caustic(causticCoord), 0.0, 1.0) * vNormalW.y;

    float Zdepth = 10.0; // TODO vViewPos.z;

    vec4 causticFinalColor = gl_FragColor;
    causticFinalColor.rgb = mix(causticFinalColor.rgb, caustic.rgb, clamp(caustic.a * 0.5 * Zdepth, 0.2, 0.7)); // caustics + texture

#ifdef CAUSTIC_FOG
    // actual distance from the lens in scene units
    float distance = (cameraMinMaxZ.x + (cameraMinMaxZ.y - cameraMinMaxZ.x)*Zdepth);
    float normalizedDistance = distance / cameraMinMaxZ.y;
    float fogFactor = clamp(
      1.4 * fogFactorExp(normalizedDistance, FOG_DENSITY * FOG_DISTANCE_CORRECTION),
      0.0,
      1.0
    );
    // causticFinalColor.rgb = vec3(fogFactor, fogFactor, fogFactor); // pure fog
    // causticFinalColor.rgb = mix(causticFinalColor.rgb, fogColor, fogFactor); // fog + texture
    causticFinalColor.rgb = mix(
      causticFinalColor.rgb,
      fogColor,
      fogFactor
    ); // + godRays; // everything
#endif

    // color, saturation, brightness
    gl_FragColor.rgb = csb(causticFinalColor.rgb, 1.1, 1.05, 1.22);

    gl_FragColor.a = 1.0;
  }
#endif
