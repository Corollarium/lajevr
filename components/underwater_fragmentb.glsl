precision highp float;

varying vec2 vUV;
// varying vec3 vPosition;
uniform float time;
uniform vec3 fogColor;
uniform vec2 cameraMinMaxZ;

uniform sampler2D textureSampler;
uniform sampler2D causticTexture;
uniform sampler2D depthTexture;

#define csb(f, con, sat, bri) mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), f*bri)), f*bri, sat), con)

#define TAU 6.28318530718
#define MAX_ITER 8
#define BASE_INTEN .005
#define FOG_DENSITY 2.8 // TODO: review

float fogFactorExp(
  const float dist,
  const float density
) {
  return 1.0 - clamp(exp(-density * dist), 0.0, 1.0);
}

float causticX(float x, float power, float gtime)
{
  float p = mod(x*TAU, TAU)-250.0;
  float tTime = gtime * .5+23.0;

	float i = p;
	float c = 1.0;
	float inten = BASE_INTEN;

	for (int n = 0; n < MAX_ITER/2; n++)
	{
		float t = tTime * (1.0 - (3.5 / float(n+1)));
		i = p + cos(t - i) + sin(t + i);
		c += 1.0/length(p / (sin(i+t)/inten));
	}
	c /= float(MAX_ITER);
	c = 1.17-pow(c, power);

    return c;
}

float godRaysCalc(vec2 uv)
{
    float light = 0.0;

    light += pow(causticX((uv.x+0.08*uv.y)/1.7+0.5, 1.8, time*0.65),10.0)*0.05;
    light -= pow((1.0-uv.y)*0.3,2.0)*0.2;
    light += pow(causticX(sin(uv.x), 0.3,time*0.7),9.0)*0.4;
    light += pow(causticX(cos(uv.x*2.3), 0.3,time*1.3),4.0)*0.1;

    light -= pow((1.0-uv.y)*0.3,3.0);
    light = clamp(light,0.0,1.0);

    return light;
}

void main() {
  // apply visibility loss with distance
  vec4 depthVec = texture2D(depthTexture, vUV);
  float depth = depthVec.r;

  // actual distance from the lens in scene units
  float distance = (cameraMinMaxZ.x + (cameraMinMaxZ.y - cameraMinMaxZ.x)*depth);
  float normalizedDistance = distance / cameraMinMaxZ.y;
  float fogFactor = clamp(1.1*fogFactorExp(depth, FOG_DENSITY), 0.0, 1.0); // normalized distance

  // god rays
  vec3 skyColor = vec3(0.3, 1.0, 1.0);
  // TODO: godRays should take camera angle into consideration
  vec3 godRays = (godRaysCalc(vUV*2.)*mix(float(skyColor), 1.0, vUV.y*vUV.y) * vec3(0.7,1.0,1.0));

  // TODO: noise
  // TODO: color loss with depth
  vec4 base = texture2D(textureSampler, vUV);
  vec4 caustic = texture2D(causticTexture, vUV);

  vec4 color;
  color.rgb = base.rgb; // plain
  // color.r = actualDepth.r; // plain
  // color.rgb = caustic.rgb; // pure caustic
  // color.rgb = godRays; // pure god rays
  // color.rgb = vec3(distance, distance, distance); ; // just depth
  // color.rgb = vec3(distance / cameraMinMaxZ.y, distance / cameraMinMaxZ.y, distance / cameraMinMaxZ.y); // normalized depth
  // color.rgb = vec3(fogFactor, fogFactor, fogFactor); // pure fog
  // color.rgb = mix(base.rgb, fogColor, fogFactor); // fog + texture
  //color.rgb = mix(base.rgb, caustic.rgb, max(depth, 0.1)); // caustics + texture
  color.rgb = mix(mix(base.rgb, caustic.rgb, caustic.a * depth), fogColor, fogFactor) + godRays; // everything

  // color, saturation, brightness
  color.rgb = csb(color.rgb, 1.1, 1.05, 1.22);

	// Vignette
	color.rgb = mix(color.rgb, vec3(.0), abs(vUV.x - 0.5)*abs(vUV.y * 2.0 - 1.0));

  gl_FragColor.rgb = color.rgb;
  gl_FragColor.w = 1.0; //base.w;
}
