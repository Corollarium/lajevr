(window.webpackJsonp=window.webpackJsonp||[]).push([[5,14],{193:function(e,t,n){var r=n(12);e.exports=function(e,t){if(!r(e)||e._t!==t)throw TypeError("Incompatible receiver, "+t+" required!");return e}},194:function(e,t,n){"use strict";n.r(t);var r={data:function(){return{headerOverlay:!1,head:{title:"",description:""}}},watch:{headerOverlay:function(e,t){this.$root.$emit("headerOverlay",e)}},mounted:function(){this.$root.$emit("headerOverlay",this.headerOverlay)},head:function(){return{title:this.head.title,meta:[{hid:"description",name:"description",content:this.head.description}]}}},o=n(4),component=Object(o.a)(r,(function(){var e=this.$createElement;return(this._self._c||e)("div")}),[],!1,null,null,null);t.default=component.exports},197:function(e,t,n){"use strict";var strong=n(198),r=n(193);e.exports=n(199)("Set",(function(e){return function(){return e(this,arguments.length>0?arguments[0]:void 0)}}),{add:function(e){return strong.def(r(this,"Set"),e=0===e?0:e,e)}},strong)},198:function(e,t,n){"use strict";var r=n(10).f,o=n(68),c=n(132),l=n(28),d=n(131),h=n(134),m=n(93),f=n(135),v=n(92),_=n(9),w=n(133).fastKey,x=n(193),y=_?"_s":"size",k=function(e,t){var n,r=w(t);if("F"!==r)return e._i[r];for(n=e._f;n;n=n.n)if(n.k==t)return n};e.exports={getConstructor:function(e,t,n,m){var f=e((function(e,r){d(e,f,t,"_i"),e._t=t,e._i=o(null),e._f=void 0,e._l=void 0,e[y]=0,null!=r&&h(r,n,e[m],e)}));return c(f.prototype,{clear:function(){for(var e=x(this,t),data=e._i,n=e._f;n;n=n.n)n.r=!0,n.p&&(n.p=n.p.n=void 0),delete data[n.i];e._f=e._l=void 0,e[y]=0},delete:function(e){var n=x(this,t),r=k(n,e);if(r){var o=r.n,c=r.p;delete n._i[r.i],r.r=!0,c&&(c.n=o),o&&(o.p=c),n._f==r&&(n._f=o),n._l==r&&(n._l=c),n[y]--}return!!r},forEach:function(e){x(this,t);for(var n,r=l(e,arguments.length>1?arguments[1]:void 0,3);n=n?n.n:this._f;)for(r(n.v,n.k,this);n&&n.r;)n=n.p},has:function(e){return!!k(x(this,t),e)}}),_&&r(f.prototype,"size",{get:function(){return x(this,t)[y]}}),f},def:function(e,t,n){var r,o,c=k(e,t);return c?c.v=n:(e._l=c={i:o=w(t,!0),k:t,v:n,p:r=e._l,n:void 0,r:!1},e._f||(e._f=c),r&&(r.n=c),e[y]++,"F"!==o&&(e._i[o]=c)),e},getEntry:k,setStrong:function(e,t,n){m(e,t,(function(e,n){this._t=x(e,t),this._k=n,this._l=void 0}),(function(){for(var e=this,t=e._k,n=e._l;n&&n.r;)n=n.p;return e._t&&(e._l=n=n?n.n:e._t._f)?f(0,"keys"==t?n.k:"values"==t?n.v:[n.k,n.v]):(e._t=void 0,f(1))}),n?"entries":"values",!n,!0),v(t)}}},199:function(e,t,n){"use strict";var r=n(5),o=n(2),c=n(13),l=n(132),meta=n(133),d=n(134),h=n(131),m=n(12),f=n(8),v=n(91),_=n(53),w=n(94);e.exports=function(e,t,n,x,y,k){var E=r[e],j=E,A=y?"set":"add",S=j&&j.prototype,M={},C=function(e){var t=S[e];c(S,e,"delete"==e||"has"==e?function(a){return!(k&&!m(a))&&t.call(this,0===a?0:a)}:"get"==e?function(a){return k&&!m(a)?void 0:t.call(this,0===a?0:a)}:"add"==e?function(a){return t.call(this,0===a?0:a),this}:function(a,b){return t.call(this,0===a?0:a,b),this})};if("function"==typeof j&&(k||S.forEach&&!f((function(){(new j).entries().next()})))){var V=new j,I=V[A](k?{}:-0,1)!=V,F=f((function(){V.has(1)})),B=v((function(e){new j(e)})),L=!k&&f((function(){for(var e=new j,t=5;t--;)e[A](t,t);return!e.has(-0)}));B||((j=t((function(t,n){h(t,j,e);var r=w(new E,t,j);return null!=n&&d(n,y,r[A],r),r}))).prototype=S,S.constructor=j),(F||L)&&(C("delete"),C("has"),y&&C("get")),(L||I)&&C(A),k&&S.clear&&delete S.clear}else j=x.getConstructor(t,e,y,A),l(j.prototype,n),meta.NEED=!0;return _(j,e),M[e]=j,o(o.G+o.W+o.F*(j!=E),M),k||x.setStrong(j,e,y),j}},200:function(e,t,n){var r=n(2);r(r.S,"Math",{sign:n(201)})},201:function(e,t){e.exports=Math.sign||function(e){return 0==(e=+e)||e!=e?e:e<0?-1:1}},202:function(e,t,n){e.exports=n.p+"img/c7cf9fb.svg"},239:function(e,t,n){var content=n(262);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(34).default)("7938a73c",content,!0,{sourceMap:!1})},261:function(e,t,n){"use strict";n(239)},262:function(e,t,n){var r=n(33),o=n(136),c=n(202),l=r(!1),d=o(c);l.push([e.i,".object-embed-3d[data-v-0434436a]{position:relative;cursor:move;width:100%}.object-embed-3d .object-3d[data-v-0434436a]{width:100%}.object-embed-3d:hover .object-embed-icon[data-v-0434436a]{opacity:0;transition:opacity .5s ease-in-out}.object-embed-3d .object-scroll-message[data-v-0434436a]{z-index:11;top:0;left:0;right:0;position:absolute;pointer-events:none;transition:opacity .5s ease-in-out;color:#fff;background-color:transparent;padding:.25rem .5rem;font-size:250%;line-height:250%;height:100%;opacity:.5;display:flex;justify-content:center;align-content:center;flex-direction:column;text-align:center}@media (hover:hover) and (pointer:coarse),(hover:hover) and (pointer:none),(hover:none){.object-embed-3d .object-scroll-message-mouse[data-v-0434436a]{display:none!important}}@media (hover:hover) and (pointer:fine){.object-embed-3d .object-scroll-message-touch[data-v-0434436a]{display:none!important}}.object-embed-3d .object-fullscreen[data-v-0434436a]{position:absolute;top:10px;left:0;padding:10px;margin:0;z-index:1;max-width:80%;line-height:1.2em;border-radius:10px;background:#004;color:#fff;text-align:center}.object-embed-3d .object-embed-icon[data-v-0434436a]{background-image:url("+d+");width:100%;height:100%;z-index:10;position:absolute;background-repeat:no-repeat;background-position:50%;background-size:contain;pointer-events:none;transition:opacity .5s ease-in-out}.object-embed-3d .object-embed-icon[data-v-0434436a]:hover{opacity:0;transition:opacity .5s ease-in-out}",""]),e.exports=l},421:function(e,t,n){"use strict";n.r(t);var r=n(195),o=n(194),c=(n(90),n(197),n(36),n(15),n(37),n(200),n(35),n(216),n(40),n(206),{props:{babylonEngine:{type:Object,default:null},model:{type:String,required:!0},attribution:{type:String,required:!1,default:""},animationInitFrame:{type:Number,require:!1,default:0},animationEndFrame:{type:Number,require:!1,default:0},link:{type:String,required:!1,default:null},backgroundColor:{type:String,required:!1,default:"transparent"},autoRotate:{type:Boolean,required:!1,default:!0},initialAlpha:{type:[Number,String],required:!1,default:"random"},initialBeta:{type:[Number,String],required:!1,default:Math.PI/2},inputEnabled:{type:Boolean,required:!1,default:!0}},data:function(){return{engine:null,scene:null,camera:null,container:null,pointerIds:new Set,showZoomHelp:!0,showTouchHelp:!0}},computed:{touching:function(){return 0!==this.pointerIds.size}},watch:{inputEnabled:function(e){e?this.camera.detachControl(this.container):this.camera.attachControl(this.container)}},mounted:function(){var e=this;this.container=this.$el.querySelector(".object-3d"),setTimeout((function(){e.container.style.height=e.container.parentElement.offsetHeight+"px"}),500),this.babylonEngine?this.engine=this.babylonEngine:(this.engine=new r.Engine(this.container,!0),this.engine.loadingUIText="Mergulho na Laje de Santos"),this.scene=new r.Scene(this.engine),Window.bscene=this.scene,Window.bengine=this.engine,this.scene.clearColor="transparent"===this.backgroundColor?new r.Color4(0,0,0,.1):r.Color3.FromHexString(this.backgroundColor),this.camera=new r.ArcRotateCamera("Camera",isNaN(parseFloat(this.initialAlpha))?6*Math.random()%(2*Math.PI):this.initialAlpha,this.initialBeta,.5,new r.Vector3(0,0,0),this.scene),this.camera.minZ=1e-4,this.camera.useFramingBehavior=!0,this.camera.applyGravity=!1,this.camera.speed=.1;var view=null;this.babylonEngine&&(view=this.engine.registerView(this.container,this.camera,!0)),this.camera.inputs.remove(this.camera.inputs.attached.mousewheel),this.container.addEventListener("wheel",(function(t){t.ctrlKey?(e.showZoomHelp=!1,e.camera.radius+=Math.sign(t.deltaY)*e.camera.radius*.1,t.preventDefault()):e.showZoomHelp=!0})),this.container.addEventListener("pointerdown",(function(t){e.pointerIds.add(t.pointerId),e.showZoomHelp=!1})),this.container.addEventListener("pointerleave",(function(t){e.pointerIds.delete(t.pointerId)})),this.camera.inputs.attached.pointers&&(this.camera.inputs.attached.pointers.pinchPrecision=1e3),this.inputEnabled&&this.camera.attachControl(this.container,!1),this.light1=new r.HemisphericLight("light1",new r.Vector3(1,1,0),this.scene),this.light2=new r.PointLight("light2",new r.Vector3(0,1,-1),this.scene);var path=this.model.slice(0,this.model.lastIndexOf("/")+1),t=this.model.slice(this.model.lastIndexOf("/")+1),n=new Float32Array(4),o=[{from:this.animationInitFrame,to:this.animationEndFrame,name:t.replace(/\.[^/.]+$/,"_Animation")}],c=!1;r.SceneLoader.ImportMeshAsync("",path,t,this.scene,void 0).then((function(n){var r=n.meshes;e.mainMesh=r[1];var o="/bakedAnim/"+t.replace(/\.[^/.]+$/,".json");return fetch(o)})).then((function(l){if(!l.ok){var d=new r.VertexAnimationBaker(e.scene,e.mainMesh);throw d.bakeVertexData(o).then((function(l){var h=d.serializeBakedVertexDataToJSON(l);window.createdJsonFile=h;var a=document.createElement("a");a.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(h)),a.setAttribute("download",t.replace(/\.[^/.]+$/,".json")),a.click();var m=d.textureFromBakedVertexData(l),f=new r.BakedVertexAnimationManager(e.scene);f.texture=m,e.mainMesh.bakedVertexAnimationManager=f;var v=new r.Vector4(o[0].from,o[0].to,0,30);n.set(v.asArray()),e.mainMesh.thinInstanceSetBuffer("bakedVertexAnimationSettingsInstanced",n,4),e.scene.registerBeforeRender((function(){e.mainMesh.bakedVertexAnimationManager.time+=e.engine.getDeltaTime()/1e3})),c=!0})),new Error("Error loading JSon")}return l.text()})).then((function(t){window.loadedJsonFile=t;var l=new r.VertexAnimationBaker(e.scene,e.mainMesh),d=l.loadBakedVertexDataFromJSON(t),h=l.textureFromBakedVertexData(d),m=new r.BakedVertexAnimationManager(e.scene);m.texture=h,e.mainMesh.bakedVertexAnimationManager=m;var f=new r.Vector4(o[0].from,o[0].to,0,30);n.set(f.asArray()),e.mainMesh.thinInstanceSetBuffer("bakedVertexAnimationSettingsInstanced",n,4),c=!0,e.scene.registerBeforeRender((function(){e.mainMesh.bakedVertexAnimationManager.time+=e.engine.getDeltaTime()/1e3}))})).catch((function(e){console.error(e)}));var l=!0;this.observer=new IntersectionObserver((function(t,n){t.forEach((function(t){l=t.intersectionRatio>=.05,view.enabled=l,l&&(e.scene.detachControl(),e.engine.inputElement=e.container,e.scene.attachControl())}))}),{threshold:[0,.05]}),this.observer.observe(this.container);var d=function(){if(l){var t=e.engine.getDeltaTime()/1e3;c&&e.autoRotate&&(e.camera.alpha=(e.camera.alpha+.2*t)%(2*Math.PI)),e.scene.render()}};this.babylonEngine?this.babylonEngine.sceneList[this.model]={container:this.container,renderScene:d}:this.engine.runRenderLoop(d),window.addEventListener("resize",this.resize.bind(this)),this.container.onfullscreenchange=function(e){}},beforeDestroy:function(){window.removeEventListener("resize",this.resize.bind(this)),this.babylonEngine?(this.engine.unRegisterView(this.container),delete this.babylonEngine.sceneList[this.model]):this.engine.stopRenderLoop(),this.scene.dispose(),this.scene=null,this.engine=null},methods:{resize:function(){this.engine.resize()},requestFullscreen:function(){this.container.requestFullscreen()},setScrollHijacking:function(b){b?(this.container.setAttribute("touch-action","initial"),this.container.style.touchAction="initial"):(this.container.setAttribute("touch-action","pan-y"),this.container.style.touchAction="pan-y")}}}),l=(n(261),n(4)),d={components:{EBA:Object(l.a)(c,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"object-embed-3d"},[n("button",{staticClass:"object-fullscreen",attrs:{"touch-action":"none"},on:{click:function(t){return e.requestFullscreen()}}},[n("i18n",[e._v("Ver 3D em tela cheia")])],1),e._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:!e.touching,expression:"!touching"}],staticClass:"object-embed-icon",attrs:{"touch-action":"none"}}),e._v(" "),n("transition",{attrs:{name:"fade","touch-action":"none"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:e.showZoomHelp,expression:"showZoomHelp"}],attrs:{"touch-action":"none"}},[n("div",{staticClass:"object-scroll-message object-scroll-message-mouse"},[n("i18n",[e._v("use ctrl+scroll para zoom,")]),n("br"),e._v(" "),n("i18n",[e._v("arraste para girar")])],1),e._v(" "),n("div",{staticClass:"object-scroll-message object-scroll-message-touch",attrs:{"touch-action":"none"}},[n("i18n",[e._v("apertar com dedos para zoom,")]),n("br"),e._v(" "),n("i18n",[e._v("arraste para girar")])],1)])]),e._v(" "),n("canvas",{staticClass:"object-3d"}),e._v(" "),e.attribution?n("p",{staticClass:"attribution"},[e.link?n("a",{attrs:{href:e.link,target:"_blank"}},[e._v("\n      "+e._s(e.attribution)+"\n    ")]):n("span",[e._v("\n      "+e._s(e.attribution)+"\n    ")])]):e._e()],1)}),[],!1,null,"0434436a",null).exports},extends:o.default,data:function(){return{rellax:null,engine:null}},mounted:function(){var e=this,canvas=document.createElement("canvas");this.engine=new r.Engine(canvas,!0),this.engine.loadingUIText="Mergulho na Laje de Santos",this.engine.sceneList={},this.engine.runRenderLoop((function(){for(var i in e.engine.sceneList){var s=e.engine.sceneList[i];e.engine.activeView&&e.engine.activeView.target===s.container&&s.renderScene()}})),this.head.title=this.$gettext("Vida na Laje de Santos"),this.head.description=this.$gettext("Sobre seres vivos na Laje de Santos")}},h=Object(l.a)(d,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("article",{staticClass:"pagina-vida"},[n("article",{staticClass:"article-index",attrs:{id:"turtles"}},[n("section",{staticClass:"section-container container"},[n("h2",{staticClass:"title-specimen"},[e._v("\n        Animation Baking Extractor\n      ")]),e._v(" "),n("div",[n("p",[n("i18n",[e._v("Extrai o baking da Textura de Animação de Vértices para um arquivo JSOn, caso ele não exista.")]),e._v(" "),n("br"),e._v(" "),n("i18n",[e._v("Ajuste o modelo, a quantidade de quadros e um delta de quadros por segundo.")]),e._v(" "),n("br"),e._v(" "),n("i18n",[e._v("Se o arquivo não baixar, significa que ele já existe no servidor.")]),e._v(" "),n("br"),e._v(" "),n("i18n",[e._v("Improvisações: Animação não rodando nessa página. Aplicar deslocamento de animação, para animação composta.")])],1)]),e._v(" "),n("div",{staticClass:"model-container",staticStyle:{"min-height":"70vh"},attrs:{bp:"12 6@md"}},[e.engine?n("EBA",{attrs:{id:"x1111",model:"./models/tartaruga/tartaruga.glb",attribution:"Modelo de tartaruga",babylonEngine:e.engine,animationInitFrame:1,animationEndFrame:90}}):e._e(),e._v(" "),e.engine?n("EBA",{attrs:{id:"x22222",model:"./models/frade.glb",attribution:"Modelo de tartaruga",babylonEngine:e.engine,animationInitFrame:1,animationEndFrame:90}}):e._e()],1)])])])}),[],!1,null,null,null);t.default=h.exports}}]);