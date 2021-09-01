(window.webpackJsonp=window.webpackJsonp||[]).push([[11,14],{177:function(e,t,n){"use strict";n.r(t);var r={data:function(){return{headerOverlay:!1,head:{title:"",description:""}}},watch:{headerOverlay:function(e,t){this.$root.$emit("headerOverlay",e)}},mounted:function(){this.$root.$emit("headerOverlay",this.headerOverlay)},head:function(){return{title:this.head.title,meta:[{hid:"description",name:"description",content:this.head.description}]}}},o=n(3),component=Object(o.a)(r,(function(){var e=this.$createElement;return(this._self._c||e)("div")}),[],!1,null,null,null);t.default=component.exports},199:function(e,t,n){var content=n(250);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(25).default)("33905d00",content,!0,{sourceMap:!1})},223:function(e,t,n){"use strict";n.r(t),t.default="precision highp float;\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\n\nuniform mat4 view;\nuniform mat4 projection;\nuniform mat4 worldViewProjection;\nuniform vec2 cameraMinMaxZ;\n\nvarying vec2 vUV;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\n// varying float normalizedDepth;\n\n#include<bonesDeclaration>\n#include<instancesDeclaration>\n\n/*\n * Vertex shader for caustic and babylonjs.\n */\nvoid main() {\n    vec3 positionUpdated = position;\n\n    // include shaders to calculate instances and bones\n    #include<instancesVertex>\n    #include<bonesVertex>\n\n    // return normal, uv and position\n    vec4 worldPos = finalWorld * vec4(positionUpdated, 1.0);\n    vec4 viewPos = view * worldPos;\n\n    // float distancetoCamera = -viewPos.z;\n    // float distance = (cameraMinMaxZ.x + (cameraMinMaxZ.y - cameraMinMaxZ.x)*depth);\n    // float normalizedDistance = distance / cameraMinMaxZ.x;\n    // normalizedDepth = (distancetoCamera - cameraMinMaxZ.x)/(cameraMinMaxZ.y - cameraMinMaxZ.x);\n\n    vNormal = normalize(vec3(finalWorld * vec4(normal, 0.0)));\n    vPosition = worldPos.xyz;\n    vUV = uv;\n\n    gl_Position = projection * viewPos;\n}\n"},242:function(e,t,n){"use strict";n.r(t),t.default="precision highp float;\n\nvarying vec2 vUV;\n\nuniform float time;\nuniform vec3 fogColor;\nuniform vec2 cameraMinMaxZ;\nuniform vec3 cameraPosition;\n\nuniform sampler2D textureSampler;\nuniform sampler2D causticTexture;\nuniform sampler2D depthTexture;\n\n#define csb(f, con, sat, bri) mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), f*bri)), f*bri, sat), con)\n\n#define TAU 6.28318530718\n#define MAX_ITER 8\n#define BASE_INTEN .005\n#define FOG_DENSITY 2.8 // TODO: review\n\nfloat fogFactorExp(\n  const float dist,\n  const float density\n) {\n  return 1.0 - clamp(exp(-density * dist), 0.0, 1.0);\n}\n\nfloat causticX(float x, float power, float gtime)\n{\n  float p = mod(x*TAU, TAU)-250.0;\n  float tTime = gtime * .5+23.0;\n\n\tfloat i = p;\n\tfloat c = 1.0;\n\tfloat inten = BASE_INTEN;\n\n\tfor (int n = 0; n < MAX_ITER/2; n++)\n\t{\n\t\tfloat t = tTime * (1.0 - (3.5 / float(n+1)));\n\t\ti = p + cos(t - i) + sin(t + i);\n\t\tc += 1.0/length(p / (sin(i+t)/inten));\n\t}\n\tc /= float(MAX_ITER);\n\tc = 1.17-pow(c, power);\n\n    return c;\n}\n\nfloat godRaysCalc(vec2 uv)\n{\n    float light = 0.0;\n\n    light += pow(causticX((uv.x+0.08*uv.y)/1.7+0.5, 1.8, time*0.65),10.0)*0.05;\n    light -= pow((1.0-uv.y)*0.3,2.0)*0.2;\n    light += pow(causticX(sin(uv.x), 0.3,time*0.7),9.0)*0.4;\n    light += pow(causticX(cos(uv.x*2.3), 0.3,time*1.3),4.0)*0.1;\n\n    light -= pow((1.0-uv.y)*0.3,3.0);\n    light = clamp(light,0.0,1.0);\n\n    return light;\n}\n\nvoid main() {\n  // apply visibility loss with distance\n  vec4 depthVec = texture2D(depthTexture, vUV);\n  float depth = depthVec.r;\n\n  // base texture\n  vec4 base = texture2D(textureSampler, vUV);\n\n  // no effect above water\n  if (cameraPosition.y >= 0.0) {\n    gl_FragColor.rgb = base.rgb;\n    gl_FragColor.w = 1.0;\n    return;\n  }\n\n  // actual distance from the lens in scene units\n  float distance = (cameraMinMaxZ.x + (cameraMinMaxZ.y - cameraMinMaxZ.x)*depth);\n  float normalizedDistance = distance / cameraMinMaxZ.y;\n  float fogFactor = clamp(1.1*fogFactorExp(depth, FOG_DENSITY), 0.0, 1.0); // normalized distance\n\n  // god rays\n  vec3 skyColor = vec3(0.3, 1.0, 1.0);\n  // TODO: godRays should take camera angle into consideration\n  vec3 godRays = 0.7*(godRaysCalc(vUV*2.)*mix(float(skyColor), 1.0, vUV.y*vUV.y) * vec3(0.7,1.0,1.0));\n\n  // TODO: noise\n  // TODO: color loss with depth\n  vec4 caustic = texture2D(causticTexture, vUV);\n\n  vec4 color;\n  color.rgb = base.rgb; // plain\n  // color.r = actualDepth.r; // plain\n  // color.rgb = caustic.rgb; // pure caustic\n  // color.rgb = godRays; // pure god rays\n  // color.rgb = vec3(distance, distance, distance); ; // just depth\n  // color.rgb = vec3(distance / cameraMinMaxZ.y, distance / cameraMinMaxZ.y, distance / cameraMinMaxZ.y); // normalized depth\n  // color.rgb = vec3(fogFactor, fogFactor, fogFactor); // pure fog\n  // color.rgb = mix(base.rgb, fogColor, fogFactor); // fog + texture\n  //color.rgb = mix(base.rgb, caustic.rgb, max(depth, 0.1)); // caustics + texture\n  color.rgb = mix(mix(base.rgb, caustic.rgb, caustic.a * 0.5 * depth), fogColor, fogFactor) + godRays; // everything\n\n  // color, saturation, brightness\n  color.rgb = csb(color.rgb, 1.1, 1.05, 1.22);\n\n\t// Vignette\n\tcolor.rgb = mix(color.rgb, vec3(.0), abs(vUV.x - 0.5)*abs(vUV.y * 2.0 - 1.0));\n\n  gl_FragColor.rgb = color.rgb;\n  gl_FragColor.w = 1.0; //base.w;\n}\n"},243:function(e,t,n){"use strict";n.r(t),t.default="precision highp float;\n\nattribute vec3 position;\nattribute vec2 uv;\n\nuniform mat4 worldViewProjection;\n\nvarying vec2 vUV;\n\nvoid main() {\n  vUV = uv;\n  gl_Position = worldViewProjection * vec4(position, 1.0);\n}\n"},244:function(e,t,n){"use strict";n.r(t),t.default="#ifdef GL_ES\nprecision highp float;\n#endif\n\nuniform vec3 color;\nuniform float time;\n\nvarying vec2 vUV;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\n\nuniform sampler2D normalMap;\nuniform samplerCube environmentMap;\n\nvec4 getNoise( vec2 uv )\n{\n\tvec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);\n\tvec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );\n\tvec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );\n\tvec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );\n\tvec4 noise = vec4(0.0, 0.0, 0.0, 0.0);\n      texture2D( normalMap, uv0 ) +\n      texture2D( normalMap, uv1 ) +\n      texture2D( normalMap, uv2 ) +\n      texture2D( normalMap, uv3 );\n\treturn noise * 0.5 - 1.0;\n}\n\nvoid main(void) {\n  float alpha = 1.0;\n  float reflectivity = 0.3;\n  vec4 finalColor = vec4(color, alpha);\n  vec3 eyePos = normalize(vec3(vUV.xy, -3.0));\n\n//   vec3 eyePos = viewInverse[3].xyz;\n  vec3 viewDirection = normalize(eyePos - vPosition);\n\n  vec3 normal = vNormal;\n  normal = normalize(getNoise(vPosition.xz * 6.0).xyz * vec3( 1.5, 1.0, 1.5 ));\n  vec3 envTexel = textureCube(environmentMap, reflect(-viewDirection, normal)).xyz;\n  finalColor.rgb = finalColor.rgb + envTexel * reflectivity;\n\n  gl_FragColor = finalColor;\n}\n"},245:function(e,t,n){"use strict";n.r(t),t.default="#ifdef GL_ES\nprecision highp float;\n#endif\n\nuniform vec3 waterColor;\nuniform float time;\nuniform vec3 cameraPosition;\nuniform sampler2D channel2;\nuniform sampler2D channel3;\n\nvarying vec2 vUV;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\n\n#define csb(f, con, sat, bri) mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), f*bri)), f*bri, sat), con)\n\nvoid main(void) {\n  vec3 col = vec3(waterColor); // final color\n  const vec2 sun = vec2(-0.1, 0.6); // sun position\n  vec2 uv = vUV;\n  vec3 pos = vPosition;\n  vec3 dir = normalize(vec3(uv, -1.4));\n\n \t// calculate sun\n\tfloat i = max(0.0, 1.0-length(sun-uv));\n\tcol = vec3(pow(i, 1.9), pow(i, 1.0), pow(i, .8)) * 1.3;\n\n\t// Water distance colour...\n  float viewAngle = abs(dot(normalize(cameraPosition-vPosition), vec3(0, 1, 0)));\n\tcol = mix(col, vec3(0.0, .25, .45), ((1.0-vUV.y)*.45) * 1.8);\n\n  // Add water ripples...\n  float d = (3.0-pos.y) / -uv.y;\n  vec2 wat = (dir * d).xz-pos.xz;\n  wat +=  (texture(channel2, (wat*.03+time*.01)*.1, 1.0).z -\n    texture(channel3, wat*.02-time*.01, .0).y) * .4;\n  i = texture(channel3, wat* .02, 0.0).x;\n  col += vec3(i) * max(abs(uv.y), 0.0);\n\n  // contrast, saturation, brightness\n  col = csb(col, 1.1, 1.05, 1.22);\n\n  // handle horizon\n  col = mix(waterColor, col, clamp(viewAngle*3.0 - 0.3, 0.0, 1.0));\n\n  gl_FragColor.rgb = col;\n}\n"},246:function(e,t,n){"use strict";n.r(t),t.default="precision highp float;\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\n\nuniform mat4 view;\nuniform mat4 projection;\nuniform mat4 worldViewProjection;\nuniform vec2 cameraMinMaxZ;\n\nvarying vec2 vUV;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\n\n#include<bonesDeclaration>\n#include<instancesDeclaration>\n\nvoid main() {\n    vec3 positionUpdated = position;\n\n    // include shaders to calculate instances and bones\n    #include<instancesVertex>\n    #include<bonesVertex>\n\n    // return normal, uv and position\n    vec4 worldPos = finalWorld * vec4(positionUpdated, 1.0);\n    vec4 viewPos = view * worldPos;\n\n    vNormal = normalize(vec3(finalWorld * vec4(normal, 0.0)));\n    vPosition = worldPos.xyz;\n    // TODO vUV = uv * uvRepeat + uvOffset;\n    vUV = uv;\n\n    gl_Position = projection * viewPos;\n}\n"},247:function(e,t,n){"use strict";n.r(t),t.default="#ifdef GL_ES\nprecision highp float;\n#endif\n\n#define TAU 6.28318530718\n#define MAX_ITER 5\n#define SPEED 0.3\n#define SCALE 30.0\n\nuniform float time;\n\nvarying vec2 vUV;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\n\nvec4 caustic(vec2 uv) {\n  vec2 p = mod(uv*TAU, TAU)-250.0;\n  float t = time * SPEED + 23.0;\n\n  vec2 i = vec2(p);\n  float c = 1.0;\n  float inten = .005;\n\n  for (int n = 0; n < MAX_ITER; n++) {\n    float t = t * (1.0 - (3.5 / float(n+1)));\n    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));\n    c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));\n  }\n\n  c /= float(MAX_ITER);\n  c = 1.17-pow(c, 1.4);\n  vec3 color = vec3(pow(abs(c), 8.0));\n  color = clamp(color + vec3(0.0, 0.0, 0.0), 0.0, 1.0);\n\n  float alpha=0.5;\n  float contrast=0.0;\n  color = mix(color, vec3(1.0,1.0,1.0),contrast);\n  //color.a = alpha;\n  vec4 color4 = vec4(color,0.0);\n\n  return color4;\n}\n\n/*\n * Fragment shader for caustic and babylonjs. Renders a fake caustic, using an\n * animated noise function and the world coordinates as UV.\n */\nvoid main(void)\n{\n  // TODO: y coordinate should multiply caustic to reduce light on higher ocean depths\n\n  vec2 coord = vec2(fract(vPosition.x/SCALE), fract(vPosition.z/SCALE));\n  if (vNormal.y > 0.0) {\n    // scale by normal to make caustic less pronounced for more vertical faces.\n    gl_FragColor = clamp(caustic(coord), 0.0, 1.0) * vNormal.y;\n    gl_FragColor.a = 1.0;\n  }\n  else {\n    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n  }\n}\n\n"},248:function(e,t,n){"use strict";n.r(t),t.default="#ifdef GL_ES\nprecision highp float;\n#endif\n\nuniform float time;\n\nvarying vec2 vUV;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\n\n/*\n * simple pure black shader for objects that should not render caustics.\n */\nvoid main(void)\n{\n  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n}\n\n"},249:function(e,t,n){"use strict";var r=n(199);n.n(r).a},250:function(e,t,n){(t=n(24)(!1)).push([e.i,"#underwater[data-v-fb03e746]{position:relative}#underwater[data-v-fb03e746],#underwater-3d[data-v-fb03e746]{height:100vh;width:100vw}#underwater-debug[data-v-fb03e746]{top:0;right:0}#underwater-debug[data-v-fb03e746],#underwater-hud[data-v-fb03e746]{position:absolute;padding:10px;z-index:1000;border-radius:10px;background:#000;color:#fff;text-align:right}#underwater-hud[data-v-fb03e746]{bottom:0;left:0;width:160px;height:150px;font-family:monospace}#underwater-hud span[data-v-fb03e746]{display:inline-block}#underwater-hud #underwater-hud-time[data-v-fb03e746]{margin-top:10px}#underwater-hud #underwater-hud-depth-value[data-v-fb03e746],#underwater-hud #underwater-hud-time-value[data-v-fb03e746]{line-height:.9;font-size:42px;font-family:monospace}#underwater-hud #underwater-hud-depth-ascent[data-v-fb03e746]{-ms-writing-mode:tb-rl;writing-mode:vertical-rl}#underwater-hud #underwater-hud-depth-name[data-v-fb03e746],#underwater-hud #underwater-hud-time-name[data-v-fb03e746]{color:#4c70ff}#underwater-hud #underwater-hud-depth-unit[data-v-fb03e746],#underwater-hud #underwater-hud-time-unit[data-v-fb03e746]{vertical-align:top}",""]),e.exports=t},308:function(e,t,n){"use strict";n.r(t);var r=n(177),o=(n(45),n(34),n(46),n(33),n(31),n(32),n(76));var c=n(101);function l(e){return function(e){if(Array.isArray(e))return Object(o.a)(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||Object(c.a)(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}n(35),n(15),n(47);var d=n(180);n(192);function f(e,t){var n;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return h(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return h(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var i=0,r=function(){};return{s:r,n:function(){return i>=e.length?{done:!0}:{done:!1,value:e[i++]}},e:function(e){throw e},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,c=!0,l=!1;return{s:function(){n=e[Symbol.iterator]()},n:function(){var e=n.next();return c=e.done,e},e:function(e){l=!0,o=e},f:function(){try{c||null==n.return||n.return()}finally{if(l)throw o}}}}function h(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,n=new Array(t);i<t;i++)n[i]=e[i];return n}var v=n(242),m=n(243),w=n(244),y=n(245),x=n(246),M=n(247),C=n(248),S=n(223),T=n(223),E={props:{},data:function(){return{engine:null,scene:null,camera:null,assetsManager:null,renderTargetCaustic:null,causticMaterial:null,causticBlackMaterial:null,waterMaterial:null,rttMaterials:[],mantas:[],ascentSpeed:0,depth:0,lastDepth:0,time:0,air:100,fps:0}},computed:{ascentSpeedColor:function(){return this.ascentSpeed<1/60?"#000":this.ascentSpeed<.1||this.ascentSpeed<.2?"#0f0":this.ascentSpeed<.3?"#ff0":"#f00"},ascentSpeedGraph:function(){return this.ascentSpeed<1/60||this.ascentSpeed<.1?"<":this.ascentSpeed<.2?"<<":this.ascentSpeed<.3?"<<<":"<<<<"}},mounted:function(){var e=this,t=document.getElementById("underwater-3d");this.bootScene(t),this.lights(),this.materials(),this.composer(),this.loadOcean();var n=[];n.push(this.loadTerrain()),Promise.all(n).then((function(){console.log("all loaded")})),this.assetsManager.load(),this.debugUtils();var r=new Date;this.engine.runRenderLoop((function(){var t=new Date,n=(t-r)/1e3,o=e.engine.getDeltaTime()/1e3;e.depth=e.camera.position.y<=0?(-e.camera.position.y).toFixed(1):0,e.time=n,e.ascentSpeed=(e.camera.position.y-e.lastDepth)/o,e.lastDepth=e.camera.position.y;var c=document.getElementById("inspector-host");c&&(c.style.position="absolute"),e.causticMaterial&&e.causticMaterial.setFloat("time",n),e.waterMaterial&&(e.waterMaterial.setFloat("time",n),e.waterMaterial.setVector3("cameraPosition",e.camera.position),e.waterMesh.position.x=e.camera.x,e.waterMesh.position.z=e.camera.z),e.rttMaterials.forEach((function(e){e.setFloat("time",n)}));var l=0,h=t/1e4,v=new d.Vector3(Math.sin(h+Math.PI/2),0,Math.cos(h+Math.PI/2)),m=10*Math.sin(h),w=10*Math.cos(h);e.mantas.forEach((function(e){var t,n=f(e.rootNodes);try{for(n.s();!(t=n.n()).done;){var r=t.value;r.position.x=m+2*l,r.position.y=10-1.5*l,r.position.z=w+2*l,r.setDirection(v)}}catch(e){n.e(e)}finally{n.f()}l++})),e.fps=e.engine.getFps().toFixed(),e.scene.render()})),window.addEventListener("resize",this.resize)},beforeDestroy:function(){window.removeEventListener("resize",this.resize),this.engine.stopRenderLoop(),this.scene.dispose(),this.scene=null,this.engine=null},methods:{bootScene:function(e){function t(){this.loadingUIText="Mergulho na Laje de Santos"}t.prototype.displayLoadingUI=function(){alert(this.loadingUIText)},t.prototype.hideLoadingUI=function(){alert("Loaded!")},this.engine=new d.Engine(e,!0),this.engine.loadingUIText="Mergulho na Laje de Santos",this.scene=new d.Scene(this.engine),this.scene.clearColor=d.Color3.FromHexString("#2963CF"),this.camera=new d.UniversalCamera("Camera",new d.Vector3(-16.12,-6,28),this.scene),this.camera.applyGravity=!1,this.camera.speed=.05,this.camera.ellipsoid=new d.Vector3(.5,1,.5),window.camera=this.camera,this.camera.keysUp.push("w".charCodeAt(0)),this.camera.keysUp.push("W".charCodeAt(0)),this.scene.onKeyboardObservable.add((function(e){switch(e.type){case d.KeyboardEventTypes.KEYDOWN:console.log("KEY DOWN: ",e.event.key);break;case d.KeyboardEventTypes.KEYUP:console.log("KEY UP: ",e.event.keyCode)}})),this.camera.minZ=.1,this.camera.maxZ=50,this.camera.setTarget(new d.Vector3(-15.2,-6.36,27.62)),this.camera.attachControl(e,!0),this.scene.collisionsEnabled=!0,this.camera.checkCollisions=!0,this.assetsManager=new d.AssetsManager(this.scene),this.assetsManager.onTaskErrorObservable.add((function(e){console.error("task failed",e.errorObject.message,e.errorObject.exception)}))},sceneOptimizer:function(){return d.SceneOptimizer.OptimizeAsync(this.scene)},debugUtils:function(){this.scene.debugLayer.show()},resize:function(){this.engine.resize()},lights:function(){var e=new d.HemisphericLight("light1",new d.Vector3(1,1,0),this.scene);e.diffuse=d.Color3.FromHexString("#CCCCCC"),e.intensity=.4,new d.DirectionalLight("DirectionalLight",new d.Vector3(.2,-1,0),this.scene).diffuse=d.Color3.FromHexString("#FFFFFF"),e.intensity=.8},getCausticMaterial:function(){var e=this.causticMaterial.clone();return e.freeze(),this.rttMaterials.push(e),e},getCausticBlackMaterial:function(){var e=this.causticBlackMaterial.clone();return e.freeze(),this.rttMaterials.push(e),e},materials:function(){d.Effect.ShadersStore.causticVertexShader=S.default,d.Effect.ShadersStore.causticFragmentShader=M.default,d.Effect.ShadersStore.causticblackVertexShader=T.default,d.Effect.ShadersStore.causticblackFragmentShader=C.default,this.causticMaterial=new d.ShaderMaterial("caustic material",this.scene,"caustic",{attributes:["position","normal","uv"],uniforms:["world","worldView","worldViewProjection","view","projection","time","direction"]}),this.causticMaterial.freeze(),this.causticBlackMaterial=new d.ShaderMaterial("caustic black material",this.scene,"causticblack",{attributes:["position","normal","uv"],uniforms:["world","worldView","worldViewProjection","view","projection","time","direction"]}),this.causticBlackMaterial.freeze(),d.Effect.ShadersStore.seaVertexShader=x.default,d.Effect.ShadersStore.seaFragmentShader=w.default,d.Effect.ShadersStore.sea2VertexShader=x.default,d.Effect.ShadersStore.sea2FragmentShader=y.default},composer:function(){var e=this;d.Effect.ShadersStore.underwaterVertexShader=m.default,d.Effect.ShadersStore.underwaterFragmentShader=v.default;var t=this.scene.enableDepthRenderer(),n=new d.PassPostProcess("imagePass",1,null,d.Texture.NEAREST_SAMPLINGMODE,this.engine);this.renderTargetCaustic=new d.RenderTargetTexture("caustic",1024,this.scene),this.scene.customRenderTargets.push(this.renderTargetCaustic),this.setRTTMaterials();var r=new d.PostProcess("Underwater pass","underwater",["fogColor","cameraMinMaxZ","cameraPosition","time"],["depthTexture","causticTexture"],1,this.camera,0,this.engine),o=new Date;r.onApply=function(n){var r=(new Date-o)/1e3;n.setColor3("fogColor",e.scene.clearColor),n.setFloat2("cameraMinMaxZ",e.camera.minZ,e.camera.maxZ),n.setFloat("time",r),n.setTexture("causticTexture",e.renderTargetCaustic),n.setTexture("depthTexture",t.getDepthMap()),n.setVector3("cameraPosition",e.camera.position)};var c=new d.PostProcessRenderEffect(this.engine,"renderLayer",(function(){return[n]})),l=new d.PostProcessRenderPipeline(this.engine,"pipeline");l.addEffect(c),l.samples=4,l.fxaaEnabled=!0,this.scene.postProcessRenderPipelineManager.addPipeline(l),this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("pipeline",this.camera)},loadSky:function(){var e=d.Mesh.CreateBox("skyBox",5e3,this.scene),t=new d.StandardMaterial("skyBox",this.scene);t.backFaceCulling=!1,t.reflectionTexture=new d.CubeTexture("textures/TropicalSunnyday/TropicalSunnyDay",this.scene),t.reflectionTexture.coordinatesMode=d.Texture.SKYBOX_MODE,t.diffuseColor=new d.Color3(0,0,0),t.specularColor=new d.Color3(0,0,0),t.disableLighting=!0,e.material=t},loadOcean:function(){var e=new d.Texture("/textures/sea/channel2.jpg",this.scene),t=new d.Texture("/textures/sea/channel3.jpg",this.scene),n=new d.ShaderMaterial("water material",this.scene,"sea2",{attributes:["position","normal","uv"],uniforms:["world","worldView","worldViewProjection","view","projection","time","color","channel2","channel3","cameraPosition"]});n.setColor3("waterColor",this.scene.clearColor),n.setFloat("time",0),n.setVector3("cameraPosition",this.camera.position),n.setTexture("channel2",e),n.setTexture("channel3",t),n.backFaceCulling=!1,n.freeze(),this.waterMesh=d.Mesh.CreateGround("waterMesh",128,128,16,this.scene,!1),this.waterMesh.flipFaces(),this.waterMesh.material=this.waterMaterial=n;var r=this.getCausticBlackMaterial();this.waterMesh.rttMaterial=r,this.renderTargetCaustic.renderList.push(this.waterMesh)},setRTTMaterialsSlow:function(){var e=this;this.renderTargetCaustic.onBeforeRender=function(){for(var i in e.renderTargetCaustic.renderList)e.renderTargetCaustic.renderList[i]._saved=e.renderTargetCaustic.renderList[i].material,e.renderTargetCaustic.renderList[i].material=e.renderTargetCaustic.renderList[i].rttMaterial},this.renderTargetCaustic.onAfterRender=function(){for(var i in e.renderTargetCaustic.renderList)e.renderTargetCaustic.renderList[i].material=e.renderTargetCaustic.renderList[i]._saved}},setRTTMaterials:function(){var e=this;this.renderTargetCaustic.onBeforeRender=function(t){e.renderTargetCaustic.renderList.forEach((function(e){if("InstancedMesh"!==e.getClassName()){if(e.material&&!e.isFrozen&&"isReady"in e&&e.isReady(!0)){var t=[];e.subMeshes.forEach((function(e){t.push([e.effect,e._materialDefines])})),e.isFrozen=!0,e.material.freeze(),e._saved_orig_material=e.material,e._origSubMeshEffects=t}if(e._origSubMeshEffects&&(e.material=e.rttMaterial,e._rtt_subMeshEffects))for(var s=0;s<e.subMeshes.length;++s){var n;(n=e.subMeshes[s]).setEffect.apply(n,l(e._rtt_subMeshEffects[s]))}}}))},this.renderTargetCaustic.onAfterRender=function(){e.renderTargetCaustic.renderList.forEach((function(e){if("InstancedMesh"!==e.getClassName()&&e._origSubMeshEffects){e._rtt_subMeshEffects||(e._rtt_subMeshEffects=[],e.subMeshes.forEach((function(t){e._rtt_subMeshEffects.push([t.effect,t._materialDefines])}))),e.material=e._saved_orig_material;for(var s=0;s<e.subMeshes.length;++s){var t;(t=e.subMeshes[s]).setEffect.apply(t,l(e._origSubMeshEffects[s]))}}}))}},addToSceneAndCaustic:function(e){var t=this,n=this.getCausticMaterial();return e.forEach((function(e){e.rttMaterial=n,t.renderTargetCaustic.renderList.push(e)})),n},loadTerrain:function(){var e=this;return new Promise((function(t,n){e.assetsManager.addMeshTask("terrain",null,"/models/","island.glb").onSuccess=function(n){n.loadedMeshes.forEach((function(e){e.freeze&&(e.freeze(),e.freezeWorldMatrix(),e.convertToUnIndexedMesh(),e.material&&e.material.freeze())})),e.addToSceneAndCaustic(n.loadedMeshes).backFaceCulling=!1,t()}}))},loadBoat:function(){},loadFishFlock:function(e,t,n){},loadMantas:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:2,p=new Promise((function(n,r){d.SceneLoader.LoadAssetContainer("/models/manta/","scene.gltf",e.scene,(function(n){n.addAllToScene();var r=e.getCausticMaterial();n.meshes.forEach((function(t){t.scaling=new d.Vector3(.02,.02,.02),t.position.y=10,t.setEnabled(!1),t.material&&t.material.freeze(),t.rttMaterial=r,e.renderTargetCaustic.renderList.push(t)}));for(var o=function(i){var t,r=n.instantiateModelsToScene((function(p){return"manta"+p+i})),o=f(r.rootNodes);try{for(o.s();!(t=o.n()).done;){var c=t.value;c.position.x+=10*(i+1),e.mantas.push(r),e.renderTargetCaustic.renderList.push(c),e.renderTargetCaustic.renderList=e.renderTargetCaustic.renderList.concat(c.getChildMeshes())}}catch(e){o.e(e)}finally{o.f()}var l,d=f(r.animationGroups);try{for(d.s();!(l=d.n()).done;){var h=l.value;h.speedRatio=1-.1*i,h.play(!0)}}catch(e){d.e(e)}finally{d.f()}},i=0;i<t;i++)o(i);console.log("mantas loaded")})),n()}));return p},clamp:function(e,t,n){return Math.min(Math.max(e,t),n)}}},_=(n(249),n(3)),P={components:{Underwater:Object(_.a)(E,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"underwater"}},[n("canvas",{attrs:{id:"underwater-3d","touch-action":"none"}}),e._v(" "),n("div",{attrs:{id:"underwater-debug"}},[e._v("\n    "+e._s(e.fps)+" fps\n  ")]),e._v(" "),n("div",{attrs:{id:"underwater-hud"}},[n("div",{attrs:{id:"underwater-hud-depth"}},[n("span",{attrs:{id:"underwater-hud-depth-name"}},[n("i18n",[e._v("Profundidade")])],1),n("br"),e._v(" "),n("span",{style:{color:e.ascentSpeedColor},attrs:{id:"underwater-hud-depth-ascent"}},[e._v(e._s(e.ascentSpeedGraph))]),e._v(" "),n("span",{attrs:{id:"underwater-hud-depth-value"}},[e._v(e._s(e.depth))]),e._v(" "),n("span",{attrs:{id:"underwater-hud-depth-unit"}},[e._v("m")])]),e._v(" "),n("div",{attrs:{id:"underwater-hud-time"}},[n("span",{attrs:{id:"underwater-hud-time-name"}},[n("i18n",[e._v("Tempo")])],1),n("br"),e._v(" "),n("span",{attrs:{id:"underwater-hud-time-value"}},[e._v(e._s(parseInt(e.time/60,10))+":"+e._s(parseInt(e.time%60,10).toString().padStart(2,"0")))])])])])}),[],!1,null,"fb03e746",null).exports},extends:r.default,layout:"clean",data:function(){return{}},mounted:function(){this.head.title=this.$gettext("Mergulho virtual"),this.head.description=this.$gettext("Mergulho em realidade virtual na Laje de Santos")}},V=Object(_.a)(P,(function(){var e=this.$createElement,t=this._self._c||e;return t("article",[t("section",[t("Underwater")],1)])}),[],!1,null,null,null);t.default=V.exports}}]);