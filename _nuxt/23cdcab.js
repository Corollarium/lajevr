(window.webpackJsonp=window.webpackJsonp||[]).push([[6,14],{195:function(e,t,n){"use strict";n.r(t);var r={data:function(){return{headerOverlay:!1,head:{title:"",description:""}}},watch:{headerOverlay:function(e,t){this.$root.$emit("headerOverlay",e)}},mounted:function(){this.$root.$emit("headerOverlay",this.headerOverlay)},head:function(){return{title:this.head.title,meta:[{hid:"description",name:"description",content:this.head.description}]}}},o=n(4),component=Object(o.a)(r,(function(){var e=this.$createElement;return(this._self._c||e)("div")}),[],!1,null,null,null);t.default=component.exports},222:function(e,t,n){"use strict";n(35),n(15),n(21),n(38),n(36),n(37);var r=n(96),o=n(97),d=(n(27),n(194));function c(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return h(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return h(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var i=0,r=function(){};return{s:r,n:function(){return i>=e.length?{done:!0}:{done:!1,value:e[i++]}},e:function(e){throw e},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,d=!0,c=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return d=e.done,e},e:function(e){c=!0,o=e},f:function(){try{d||null==n.return||n.return()}finally{if(c)throw o}}}}function h(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,n=new Array(t);i<t;i++)n[i]=e[i];return n}var l=function(){function e(t,n,o){Object(r.a)(this,e),this.id=t,this.position=n,this.velocity=o,this.force=new d.Vector3(0,0,0)}return Object(o.a)(e,[{key:"orientation",get:function(){return this.velocity.normalize()}}]),e}(),f=function(){function e(t,n){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,c=arguments.length>3&&void 0!==arguments[3]?arguments[3]:100,h=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null;Object(r.a)(this,e),this.cohesion=.3,this.separation=.4,this.alignment=1,this.separationMinDistance=3,this.maxSpeed=1,this.boundsMin=new d.Vector3(n.x-c,n.y-c,n.z-c),this.boundsMax=new d.Vector3(n.x+c,n.y+c,n.z+c),this.calculateBounds(),this.otherForces=[],this.boids=[],this.debug={show:!1,influences:[],arrows:[]},this.center=n.clone(),this.avgVel=new d.Vector3(0,0,0),this.reset(t,o,h)}return Object(o.a)(e,[{key:"reset",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;n||(n=new d.Vector3(.3,0,.3)),this.boids=[];for(var r=n.length(),i=0;i<e;i++){var o=this.center.add(new d.Vector3((Math.random()-.5)*t,(Math.random()-.5)*t,(Math.random()-.5)*t)),c=new d.Vector3(n.x+(Math.random()-.5)/10*r,n.y+(Math.random()-.5)/10*r,n.z+(Math.random()-.5)/10*r),h=new l(i,o,c);this.boids.push(h)}}},{key:"calculateBounds",value:function(){this.sizeVector=new d.Vector3(Math.abs(this.boundsMax.x-this.boundsMin.x),Math.abs(this.boundsMax.y-this.boundsMin.y),Math.abs(this.boundsMax.z-this.boundsMin.z))}},{key:"update",value:function(e){var t=this;this._updateCenter(),this.boids.forEach((function(n){var r=t._forceCentreMass(n),o=t._forceSeparation(n),d=t._forceMatchVelocity(n),c=t._forceBoundaries(n),h=r.add(o).add(d).add(c);t.otherForces.forEach((function(e){h.add(e(t,n))})),n.force.copyFrom(h),n.velocity.addInPlace(h.scale(e)),n.position.addInPlace(n.velocity.scale(e))})),this._updateDebug()}},{key:"_updateCenter",value:function(){if(this.boids.length){var e=new d.Vector3(0,0,0),t=new d.Vector3(0,0,0);this.boids.forEach((function(n){e.addInPlace(n.position),t.addInPlace(n.velocity)})),e.scaleInPlace(1/this.boids.length),t.scaleInPlace(1/this.boids.length),this.center=e,this.avgVel=t}}},{key:"_forceCentreMass",value:function(e){return this.center.subtract(e.position).scale(this.cohesion)}},{key:"_forceSeparation",value:function(e){var t=this,n=new d.Vector3(0,0,0);return this.boids.forEach((function(r){if(e.id!==r.id){var o=e.position.subtract(r.position),d=o.length();d<t.separationMinDistance&&n.addInPlace(o.scale(t.separationMinDistance-d))}})),n.scale(this.separation)}},{key:"_forceMatchVelocity",value:function(e){return this.avgVel.subtract(e.velocity).scale(this.alignment)}},{key:"_forceBoundaries",value:function(e){var t=new d.Vector3(0,0,0),n=.04;return e.position.x<this.boundsMin.x+.1*this.sizeVector.x?t.x=n:e.position.x>this.boundsMax.x-.1*this.sizeVector.x&&(t.x=-.04),e.position.y<this.boundsMin.y+.1*this.sizeVector.y?t.y=n:e.position.y>this.boundsMax.y-.1*this.sizeVector.y&&(t.y=-.04),e.position.z<this.boundsMin.z+.1*this.sizeVector.z?t.z=n:e.position.z>this.boundsMax.z-.1*this.sizeVector.z&&(t.z=-.04),t}},{key:"addForce",value:function(e){this.otherForces.push(e)}},{key:"showDebug",value:function(e){if(!this.debug.show){var t=new d.StandardMaterial("debug_center",e);t.diffuseColor=d.Color3.FromHexString("#FF00FF"),this.debug.center=d.MeshBuilder.CreateSphere("center",{diameter:.1,segments:8}),this.debug.center.material=t;var n=new d.StandardMaterial("debug_bbox",e);n.emissiveColor=d.Color3.FromHexString("#00FF00"),n.disableLighting=!0,n.wireframe=!0,this.debug.bbox=d.MeshBuilder.CreateBox("boids_bbox",{},e),this.debug.bbox.scaling.x=Math.abs(this.boundsMax.x-this.boundsMin.x),this.debug.bbox.scaling.y=Math.abs(this.boundsMax.y-this.boundsMin.y),this.debug.bbox.scaling.z=Math.abs(this.boundsMax.z-this.boundsMin.z),this.debug.bbox.position=this.boundsMin.add(this.boundsMax.subtract(this.boundsMin).scale(.5)),this.debug.bbox.material=n;var r=new d.StandardMaterial("debug_wireframe",e);r.diffuseColor=d.Color3.FromHexString("#FFFFFF"),r.wireframe=!0;var o,i=0,h=c(this.boids);try{for(h.s();!(o=h.n()).done;){var l=o.value;l.debug={},l.debug.force=d.MeshBuilder.CreateTube("boid_arrow_".concat(i),{path:[l.position.add(l.velocity),l.position.clone()],radius:.01,updatable:!0},e),l.debug.influence=d.MeshBuilder.CreateSphere("boid_influence_".concat(i),{diameter:1,segments:8}),l.debug.influence.scaling.setAll(this.separationMinDistance),l.debug.influence.material=r,i++}}catch(e){h.e(e)}finally{h.f()}this.debug.show=!0,this._updateDebug()}}},{key:"hideDebug",value:function(e){this.debug.show=!1,this.debug.center=void 0;var t,n=c(this.boids);try{for(n.s();!(t=n.n()).done;){var r=t.value;r.debug&&(r.debug.force.dispose(),r.debug.influence.dispose(),r.debug={})}}catch(e){n.e(e)}finally{n.f()}}},{key:"_updateDebug",value:function(){if(this.debug.show){this.debug.center.position.copyFrom(this.center);var e,t=c(this.boids);try{for(t.s();!(e=t.n()).done;){var n=e.value,path=[n.position.add(n.velocity.scale(10)),n.position.clone()];n.debug.force=d.MeshBuilder.CreateTube(n.debug.force.name,{path:path,radius:.01,instance:n.debug.force}),n.debug.influence.position.copyFrom(n.position)}}catch(e){t.e(e)}finally{t.f()}}}},{key:"gui",value:function(e){var t=this,n=d.GUI,r=n.AdvancedDynamicTexture.CreateFullscreenUI("UI",void 0,void 0,e),o=new n.StackPanel;o.width="220px",o.horizontalAlignment=n.Control.HORIZONTAL_ALIGNMENT_RIGHT,o.verticalAlignment=n.Control.VERTICAL_ALIGNMENT_CENTER,r.addControl(o);var c=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:4,d=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){},header=new n.TextBlock;header.text="".concat(e," ").concat(t[e]),header.height="30px",header.color="white",o.addControl(header);var c=new n.Slider;c.minimum=0,c.maximum=r,c.value=t[e],c.height="20px",c.width="200px";var h=function(e,header,t){return function(n){e[t]=n,header.text="".concat(t," ").concat(n),d.apply(e)}}(t,header,e);c.onValueChangedObservable.add(h),o.addControl(c)};c("cohesion",1.5),c("separation"),c("alignment"),c("separationMinDistance",50,(function(e){t.debug.center&&t.boids.forEach((function(e){e.debug.influence.scaling.setAll(t.separationMinDistance)}))}));var header=new n.TextBlock;header.text="show debug helpers",header.height="30px",header.color="white",o.addControl(header);var h=new n.Checkbox;h.width="20px",h.height="20px",h.isChecked=this.debug.show,h.color="green",h.onIsCheckedChangedObservable.add((function(n){n?t.showDebug(e):t.hideDebug(e)})),o.addControl(h)}}]),e}();t.a=f},240:function(e,t,n){var content=n(264);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(34).default)("2e821261",content,!0,{sourceMap:!1})},263:function(e,t,n){"use strict";n(240)},264:function(e,t,n){var r=n(33)(!1);r.push([e.i,"#underwater[data-v-0801f584]{height:100vh;width:100%;position:relative}#underwater-3d[data-v-0801f584]{height:100vh;width:100vw}#underwater-debug[data-v-0801f584]{top:0;right:0;z-index:1000}#underwater-debug[data-v-0801f584],#underwater-hud[data-v-0801f584]{position:absolute;padding:10px;border-radius:10px;background:#000;color:#fff;text-align:right}#underwater-hud[data-v-0801f584]{bottom:0;left:0;width:160px;height:220px;z-index:10;font-family:monospace}#underwater-hud span[data-v-0801f584]{display:inline-block}#underwater-hud #underwater-hud-compass[data-v-0801f584],#underwater-hud #underwater-hud-time[data-v-0801f584]{margin-top:10px}#underwater-hud #underwater-hud-compass-value[data-v-0801f584],#underwater-hud #underwater-hud-depth-value[data-v-0801f584],#underwater-hud #underwater-hud-time-value[data-v-0801f584]{line-height:.9;font-size:42px;font-family:monospace}#underwater-hud #underwater-hud-depth-ascent[data-v-0801f584]{-ms-writing-mode:tb-rl;writing-mode:vertical-rl}#underwater-hud #underwater-hud-compass-name[data-v-0801f584],#underwater-hud #underwater-hud-depth-name[data-v-0801f584],#underwater-hud #underwater-hud-time-name[data-v-0801f584]{color:#4c70ff}#underwater-hud #underwater-hud-depth-unit[data-v-0801f584],#underwater-hud #underwater-hud-time-unit[data-v-0801f584]{vertical-align:top}#underwater-fullscreen[data-v-0801f584]{position:absolute;top:20px;left:0;padding:20px;margin:0;z-index:1;max-width:80%;line-height:1.2em;border-radius:10px;font-size:42px;background:#004;color:#fff;text-align:center}#underwater-settings[data-v-0801f584]{position:absolute;bottom:0;right:0;padding:10px;z-index:1000;color:#fff;text-align:right}#underwater-settings svg[data-v-0801f584]{cursor:pointer}",""]),e.exports=r},420:function(e,t,n){"use strict";n.r(t);var r=n(195),o=(n(35),n(15),n(21),n(38),n(36),n(37),n(96)),d=n(97),c=(n(27),n(216),n(41),n(194)),h=(n(206),n(222));function l(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return f(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return f(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var i=0,r=function(){};return{s:r,n:function(){return i>=e.length?{done:!0}:{done:!1,value:e[i++]}},e:function(e){throw e},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,d=!0,c=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return d=e.done,e},e:function(e){c=!0,o=e},f:function(){try{d||null==n.return||n.return()}finally{if(c)throw o}}}}function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,n=new Array(t);i<t;i++)n[i]=e[i];return n}var m=function(e,t,n){return new c.Vector3(e,t,n)},v=function(){function e(t){var n=this;Object(o.a)(this,e),this.base="",this.engine=null,this.scene=null,this.camera=null,this.assetsManager=null,this.sunLight=null;var r=document.getElementById("underwater-3d");document.onfullscreenchange=function(e){t.isFullscreen=!!document.fullscreenElement},this.base=t.base,this.bootScene(r),this.lights();var d=c.Mesh.CreateSphere("cPoint0",16,.1,this.scene);d.position=m(0,0,0);var h=new c.StandardMaterial("sp0Material",this.scene);h.emissiveColor=new c.Color3(1,0,0),h.disableLighting=!0,d.material=h;var l=c.Mesh.CreateSphere("cPoint1",16,.1,this.scene);l.position=m(20,10,10);var f=new c.StandardMaterial("sp1Material",this.scene);f.emissiveColor=new c.Color3(0,0,1),f.disableLighting=!0,l.material=f;var v=this.loadBoidsModel(this.base+"models/","sargentinho.glb",30,d.position,l.position,[{from:1,to:30,name:"swim"}]);[].push(v.promise),this.assetsManager.load(),this.camera.speed=.5,t.$route.query.debug&&this.debugUtils();new Date;this.engine.runRenderLoop((function(){new Date;var e=n.engine.getDeltaTime()/1e3;if(t.$route.query.debug){var r=document.getElementById("inspector-host");r&&(r.style.position="absolute")}v.update(e),n.scene.render()})),window.addEventListener("resize",this.resize.bind(this))}return Object(d.a)(e,[{key:"beforeDestroy",value:function(){window.removeEventListener("resize",this.resize.bind(this)),document.onfullscreenchange=null,this.engine.stopRenderLoop(),this.scene.dispose(),this.scene=null,this.engine=null}},{key:"bootScene",value:function(e){var t=this;function n(){this.loadingUIText="Mergulho na Laje de Santos"}n.prototype.displayLoadingUI=function(){alert(this.loadingUIText)},n.prototype.hideLoadingUI=function(){alert("Loaded!")},this.engine=new c.Engine(e,!0),this.engine.loadingUIText="Mergulho na Laje de Santos",this.scene=new c.Scene(this.engine),this.scene.clearColor=new c.Color3(0,0,0);var r=new c.Vector3(5,5,5);"ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0?this.camera=new c.VirtualJoysticksCamera("Camera",r,this.scene):this.camera=new c.UniversalCamera("Camera",r,this.scene),this.camera.applyGravity=!1,this.camera.speed=.05,this.camera.ellipsoid=new c.Vector3(.5,1,.5),this.camera.keysUp.push("w".charCodeAt(0)),this.camera.keysUp.push("W".charCodeAt(0)),new URL(document.location).searchParams.has("debug")&&this.scene.debugLayer.show(),this.scene.onKeyboardObservable.add((function(e){switch(e.type){case c.KeyboardEventTypes.KEYDOWN:console.log("KEY DOWN: ",e.event.key);break;case c.KeyboardEventTypes.KEYUP:console.log("KEY UP: ",e.event.keyCode)}})),this.camera.minZ=.1,this.camera.maxZ=700,this.camera.setTarget(new c.Vector3(12.89001753167552,1.708562384403646,25.710433418293825)),this.camera.attachControl(e,!0),this.camera.inputs.attached.virtualJoystick&&this.camera.inputs.attached.virtualJoystick._rightjoystick.setJoystickSensibility(.01),this.assetsManager=new c.AssetsManager(this.scene),this.assetsManager.onTaskErrorObservable.add((function(e){console.error("task failed",e.name,e.errorObject.message,e.errorObject.exception)})),this.assetsManager.onTaskSuccessObservable.add((function(e){console.log("task successful",e.name)})),this.assetsManager.onProgress=function(e,n,r){t.engine.loadingUIText="We are loading the scene. "+e+" out of "+n+" items still need to be loaded."}}},{key:"debugUtils",value:function(){this.scene.debugLayer.show()}},{key:"instrumentation",value:function(){var e=new c.EngineInstrumentation(this.engine);e.captureGPUFrameTime=!0,e.captureShaderCompilationTime=!0;var i=0;this.scene.registerBeforeRender((function(){i%30==0&&console.log("current frame time (GPU): "+(1e-6*e.gpuFrameTimeCounter.current).toFixed(2)+"ms\naverage frame time (GPU): "+(1e-6*e.gpuFrameTimeCounter.average).toFixed(2)+"ms\ntotal shader compilation time: "+e.shaderCompilationTimeCounter.total.toFixed(2)+"ms\naverage shader compilation time: "+e.shaderCompilationTimeCounter.average.toFixed(2)+"ms\ncompiler shaders count: "+e.shaderCompilationTimeCounter.count),i++}))}},{key:"resize",value:function(){this.engine.resize()}},{key:"lights",value:function(){var e=new c.HemisphericLight("light1",new c.Vector3(0,1,0),this.scene);e.diffuse=c.Color3.FromHexString("#CCCCCC"),e.intensity=.4,this.sunLight=new c.DirectionalLight("DirectionalLight",new c.Vector3(-.5,-1,.6).normalize(),this.scene),this.sunLight.diffuse=c.Color3.FromHexString("#FFFFFF"),this.sunLight.intensity=.8}},{key:"loadBoidsModel",value:function(e,t,n,r,o,d){var f=this,m=new h.a(n,r.add(o.subtract(r).scale(.5)),1,30);m.boundsMin=r,m.boundsMax=o,m.calculateBounds(),m.cohesion=.001,m.alignment=.03,m.separationMinDistance=.5,m.maxSpeed=1,m.showDebug(this.scene);for(var v=null,y=new Float32Array(16*n),w=c.Matrix.Identity(),i=0;i<n;i++)w.copyToArray(y,16*i);new Float32Array(4*n);var p=c.SceneLoader.ImportMeshAsync("",e,t,this.scene,void 0).then((function(e){var t,n=e.meshes,r=l(n);try{for(r.s();!(t=r.n()).done;){var o=t.value;o.material&&o.material.freeze()}}catch(e){r.e(e)}finally{r.f()}c.BoxBuilder.CreateBox("rooxxt",{size:1},f.scene);var d=n[0];v=n[1],console.log(v.name),d.scaling.z=1,d.scaling.y=1,d.scaling.x=1,d.rotationQuaternion.y=0,v.parent.rotationQuaternion.x=1,v.parent.rotationQuaternion.y=0,v.parent.rotationQuaternion.z=0,v.parent.rotationQuaternion.w=0,v.parent.rotationQuaternion.normalize(),v.computeWorldMatrix(),v.thinInstanceSetBuffer("matrix",y,16)})).catch((function(e){console.error(e)}));return{models:[v],boidsManager:m,promise:p,update:function(e,t,n){var r=new c.Vector3(1,1,1),o=new c.Vector3(1,1,1),d=c.Matrix.Identity(),h=c.Quaternion.Zero(),l=e.boids.map((function(i){return new c.Vector3(0,0,0)}));return function(t){if(v){e.update(t);for(var f=0;f<n;f++){var m=e.boids[f];m.velocity.normalizeToRef(o);var w=c.Vector3.Cross(l[f],o);w.y=-Math.abs(w.y),l[f].copyFrom(o);var x=c.Vector3.Cross(l[f],w);c.Quaternion.RotationQuaternionFromAxisToRef(x,l[f],w,h),c.Matrix.ComposeToRef(r,h,m.position,d),d.copyToArray(y,16*f)}v.thinInstanceSetBuffer("matrix",y,16)}}}(m,0,n)}}},{key:"random",value:function(e,t){return Math.random()*(t-e)+e}},{key:"clamp",value:function(e,t,n){return Math.min(Math.max(e,t),n)}}]),e}(),y={props:{},data:function(){return{isFullscreen:!1}},computed:{base:function(){return this.$router.options.base}},mounted:function(){this.underwater=new v(this),window.underwater=this.underwater},methods:{fullscreen:function(){document.getElementById("underwater").requestFullscreen()}}},w=(n(263),n(4)),x={components:{Boids:Object(w.a)(y,(function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)}),[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"underwater"}},[t("canvas",{attrs:{id:"underwater-3d","touch-action":"none"}})])}],!1,null,"0801f584",null).exports},extends:r.default,data:function(){return{}},mounted:function(){this.head.title=this.$gettext("Mergulho virtual"),this.head.description=this.$gettext("Boids")}},M=Object(w.a)(x,(function(){var e=this.$createElement,t=this._self._c||e;return t("article",[t("section",[t("Boids")],1)])}),[],!1,null,null,null);t.default=M.exports}}]);