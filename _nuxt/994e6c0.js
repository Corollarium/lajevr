(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{194:function(t,e,n){t.exports=n.p+"img/c7cf9fb.svg"},208:function(t,e,n){var content=n(225);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(33).default)("53546c01",content,!0,{sourceMap:!1})},224:function(t,e,n){"use strict";n(208)},225:function(t,e,n){var r=n(32),o=n(131),c=n(194),l=r(!1),d=o(c);l.push([t.i,".object-embed-3d[data-v-6c8a8318]{position:relative;cursor:move}.object-embed-3d .object-3d[data-v-6c8a8318]{width:100%;height:100%}.object-embed-3d:hover .object-embed-icon[data-v-6c8a8318]{opacity:0;transition:opacity .5s ease-in-out}.object-embed-icon[data-v-6c8a8318]{background-image:url("+d+");width:100%;height:100%;z-index:10;position:absolute;background-repeat:no-repeat;background-position:50%;background-size:contain;pointer-events:none;transition:opacity .5s ease-in-out}.object-embed-icon[data-v-6c8a8318]:hover{opacity:0;transition:opacity .5s ease-in-out}",""]),t.exports=l},249:function(t,e,n){"use strict";n(88),n(39),n(16),n(34),n(26),n(42),n(41),n(40);var r=n(203);n(223);function o(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return c(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return c(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var i=0,r=function(){};return{s:r,n:function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,l=!0,d=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return l=t.done,t},e:function(t){d=!0,o=t},f:function(){try{l||null==n.return||n.return()}finally{if(d)throw o}}}}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var i=0,n=new Array(e);i<e;i++)n[i]=t[i];return n}var l={props:{model:{type:String,required:!0},attribution:{type:String,required:!1,default:""},link:{type:String,required:!1,default:null},backgroundColor:{type:String,required:!1,default:"transparent"},autoRotate:{type:Boolean,required:!1,default:!0},initialAlpha:{type:[Number,String],required:!1,default:"random"},inputEnabled:{type:Boolean,required:!1,default:!0}},data:function(){return{engine:null,scene:null,camera:null,container:null}},watch:{inputEnabled:function(t){t?this.camera.detachControl(this.container):this.camera.attachControl(this.container)}},mounted:function(){var t=this;this.container=this.$el.querySelector(".object-3d"),this.engine=new r.Engine(this.container,!0),this.engine.loadingUIText="Mergulho na Laje de Santos",this.scene=new r.Scene(this.engine),this.scene.clearColor="transparent"===this.backgroundColor?new r.Color4(0,0,0,.1):r.Color3.FromHexString(this.backgroundColor),this.camera=new r.ArcRotateCamera("Camera",isNaN(parseFloat(this.initialAlpha))?6*Math.random()%(2*Math.PI):this.initialAlpha,Math.PI/2,80,new r.Vector3(0,0,0),this.scene),this.camera.applyGravity=!1,this.camera.speed=.1,this.camera.keysUp.push("w".charCodeAt(0)),this.camera.keysUp.push("W".charCodeAt(0)),this.inputEnabled&&this.camera.attachControl(this.container,!1),this.light1=new r.HemisphericLight("light1",new r.Vector3(1,1,0),this.scene),this.light2=new r.PointLight("light2",new r.Vector3(0,1,-1),this.scene);var path=this.model.slice(0,this.model.lastIndexOf("/")+1),e=this.model.slice(this.model.lastIndexOf("/")+1),n=!1,c=new r.AssetsManager(this.scene);c.addMeshTask("box","",path,e),c.onFinish=function(e){n=!0;var r,c=1,l=o(e[0].loadedMeshes);try{for(l.s();!(r=l.n()).done;){var d=r.value;if(d){var s=d.getBoundingInfo().boundingBox.extendSize;c<s.x/2&&(c=s.x/2),c<s.y/2&&(c=s.y/2),c<s.z/2&&(c=s.z/2)}}}catch(t){l.e(t)}finally{l.f()}var h=t.container.width/t.container.height;h<1&&(h=1/h),t.camera.radius=2.8*c*h},c.load(),this.engine.runRenderLoop((function(){var e=t.engine.getDeltaTime()/1e3;n&&t.autoRotate&&(t.camera.alpha=(t.camera.alpha+.2*e)%(2*Math.PI)),t.scene.render()})),window.addEventListener("resize",this.resize)},beforeDestroy:function(){window.removeEventListener("resize",this.resize),this.engine.stopRenderLoop(),this.scene.dispose(),this.scene=null,this.engine=null},methods:{resize:function(){this.engine.resize()}}},d=(n(224),n(4)),component=Object(d.a)(l,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"object-embed-3d"},[n("div",{staticClass:"object-embed-icon",attrs:{"touch-action":"none"}}),t._v(" "),n("canvas",{staticClass:"object-3d"}),t._v(" "),n("p",{staticClass:"attribution"},[t.link?n("a",{attrs:{href:t.link,target:"_blank"}},[t._v("\n      "+t._s(t.attribution)+"\n    ")]):n("span",[t._v("\n      "+t._s(t.attribution)+"\n    ")])])])}),[],!1,null,"6c8a8318",null);e.a=component.exports},254:function(t,e,n){var content=n(283);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(33).default)("589a7cf8",content,!0,{sourceMap:!1})},282:function(t,e,n){"use strict";n(254)},283:function(t,e,n){var r=n(32)(!1);r.push([t.i,".carousel3d-container[data-v-6e10ea8e]{width:100%}.carousel3d-container .carousel3d-item[data-v-6e10ea8e]{display:inline-block;width:300px;height:400px}.carousel3d-container .carousel3d-label[data-v-6e10ea8e]{font-size:180%;text-align:center}",""]),t.exports=r},439:function(t,e,n){"use strict";n.r(e);var r=n(120),o={components:{GLTFModel:n(249).a},props:{},data:function(){return{objects:[{name:"Raia Manta",model:"../models/manta/scene.gltf",link:"https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8",attribution:"Modelo 3D CC BY-NC por misaooo"},{name:"Bodião",model:"../models/manta/scene.gltf",link:"https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8",attribution:"Modelo 3D CC BY-NC por misaooo"}]}},computed:{base:function(){return this.$router.options.base}}},c=(n(282),n(4)),l={components:{Carousel3D:Object(c.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{staticClass:"carousel3d-container"},t._l(t.objects,(function(e){return n("div",{staticClass:"carousel3d-item"},[n("div",{staticClass:"model-container",staticStyle:{"min-height":"70vh"}},[n("GLTFModel",{attrs:{model:"../models/manta/scene.gltf",link:"https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8",attribution:"Modelo 3D CC BY-NC por misaooo",inputEnabled:!1}})],1),t._v(" "),n("div",{staticClass:"carousel3d-label"},[t._v("\n      "+t._s(e.name)+"\n    ")])])})),0)}),[],!1,null,"6e10ea8e",null).exports,LanguagePicker:r.a}},d=Object(c.a)(l,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("article",{staticClass:"container"},[t._m(0),t._v(" "),n("section",{staticClass:"section dark-background-section"},[n("h2",[t._v("\n      Typography\n    ")]),t._v(" "),n("hr"),t._v(" "),n("h1",[t._v("\n      This is Heading 1 appeareance\n    ")]),t._v(" "),n("h1",[n("i18n",[t._v("Título com tradução")])],1),t._v(" "),n("p",[t._v("Algum texto")]),t._v(" "),n("h2",[t._v("\n      This is Heading 2 appeareance\n    ")]),t._v(" "),n("p",[t._v("Algum texto")]),t._v(" "),n("h3",[t._v("\n      This is Heading 3 appeareance\n    ")]),t._v(" "),n("p",[t._v("Algum texto")]),t._v(" "),n("h4",[t._v("\n      This is Heading 4 appeareance\n    ")]),t._v(" "),t._m(1),t._v(" "),n("p",[t._v("\n      The Laje de Santos Marine State Park (Portuguese: Parque Estadual Marinho da Laje de Santos) is a state park in the state of São Paulo, Brazil.\n    ")]),t._v(" "),n("p",[t._v("\n      It protects a marine area off the coast of the state, and was the first such park to be created by São Paulo. It includes a rocky islet, tidal reefs and surrounding waters, with various areas suitable for diving, including a boat that was deliberately wrecked to form an artificial reef. The combination of warm surface waters and cold deeper waters supports a high level of biodiversity.\n    ")])]),t._v(" "),n("section",{staticClass:"section"},[n("h2",[t._v("Carrosel")]),t._v(" "),n("Carousel3D")],1),t._v(" "),n("section"),t._v(" "),t._m(2),t._v(" "),t._m(3),t._v(" "),n("section",{staticClass:"section"},[n("h2",{staticClass:"title is-2"},[t._v("\n      Elements\n    ")]),t._v(" "),n("h3",{staticClass:"title is-3"},[t._v("\n      number bullet\n    ")]),t._v(" "),n("div",{staticClass:"number-wrapper",attrs:{bp:"grid 6@md 3@lg"}},[n("number-bullet",{attrs:{to:550}},[n("i18n",[t._v("\n          metros de comprimento\n        ")])],1),n("number-bullet",{attrs:{to:33}},[n("i18n",[t._v("\n          metros de altura\n        ")])],1),n("number-bullet",{attrs:{to:185}},[n("i18n",[t._v("\n          metros de largura\n        ")])],1),n("number-bullet",{attrs:{to:5e3}},[n("i18n",[t._v("\n          hectares preservados\n        ")])],1),n("number-bullet",{attrs:{to:45}},[n("i18n",[t._v("\n          metros de profundidade máxima\n        ")])],1),n("number-bullet",{attrs:{to:40.7,format:function(t){return(new Intl.NumberFormat).format(parseFloat(t).toFixed(1))}}},[n("i18n",[t._v("\n          quilômetros da costa\n        ")])],1),n("number-bullet",{attrs:{to:29}},[n("i18n",[t._v("\n          espécies de aves\n        ")])],1),n("number-bullet",{attrs:{to:196}},[n("i18n",[t._v("\n          espécies de peixes\n        ")])],1)],1),t._v(" "),n("section",[n("h3",{staticClass:"title is-3"},[t._v("\n        Language Picker\n      ")]),t._v(" "),n("LanguagePicker")],1)])])}),[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("h1",{staticClass:"title is-1"},[t._v("\n    Laje VR\n    "),n("span",[t._v("Design System")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",[t._v("\n      This is a normal paragraph "),n("a",{attrs:{href:"#"}},[t._v("with a link")]),t._v(" and here's a text example:\n    ")])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{staticClass:"section"},[n("h2",{staticClass:"title is-2"},[t._v("\n      Responsive\n    ")]),t._v(" "),n("span",{staticClass:"is-hidden-tablet"},[t._v("in mobile devices")]),t._v(" "),n("span",{staticClass:"show-tablet-only"},[t._v("in tablet devices")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{staticClass:"section dark-background-section"},[n("h2",[t._v("\n      Colors\n    ")]),t._v(" "),n("hr"),t._v(" "),n("p",[n("a",{staticClass:"button-blue",attrs:{href:"#"}},[t._v("Button Blue")]),t._v(" "),n("a",{staticClass:"button-is-liquid"},[n("span",{staticClass:"button-is-liquid__text"},[t._v("Button Liquid")]),t._v(" "),n("span",{staticClass:"button-is-liquid__animation"})]),t._v(" "),n("br"),t._v(" "),n("span",[t._v("TODO (if necessary)")]),t._v(" "),n("br"),t._v(" "),n("a",{staticClass:"button is-dark",attrs:{href:"#"}},[t._v("Button Primary")]),t._v(" "),n("a",{staticClass:"button is-info",attrs:{href:"#"}},[t._v("Button Info")]),t._v(" "),n("a",{staticClass:"button is-success",attrs:{href:"#"}},[t._v("Button Success")]),t._v(" "),n("a",{staticClass:"button is-warning",attrs:{href:"#"}},[t._v("Button Warning")]),t._v(" "),n("a",{staticClass:"button is-danger",attrs:{href:"#"}},[t._v("Button danger")])]),t._v(" "),n("p",[n("a",{staticClass:"button",attrs:{href:"#"}},[t._v("Button in link")])])])}],!1,null,null,null);e.default=d.exports}}]);