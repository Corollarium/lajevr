(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{197:function(e,t,n){var r=n(12);e.exports=function(e,t){if(!r(e)||e._t!==t)throw TypeError("Incompatible receiver, "+t+" required!");return e}},198:function(e,t,n){var content=n(207);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(28).default)("4ab489c4",content,!0,{sourceMap:!1})},201:function(e,t,n){"use strict";var strong=n(202),r=n(197);e.exports=n(203)("Set",(function(e){return function(){return e(this,arguments.length>0?arguments[0]:void 0)}}),{add:function(e){return strong.def(r(this,"Set"),e=0===e?0:e,e)}},strong)},202:function(e,t,n){"use strict";var r=n(10).f,o=n(68),c=n(134),l=n(30),d=n(133),h=n(136),f=n(94),v=n(137),m=n(93),y=n(9),_=n(135).fastKey,w=n(197),x=y?"_s":"size",j=function(e,t){var n,r=_(t);if("F"!==r)return e._i[r];for(n=e._f;n;n=n.n)if(n.k==t)return n};e.exports={getConstructor:function(e,t,n,f){var v=e((function(e,r){d(e,v,t,"_i"),e._t=t,e._i=o(null),e._f=void 0,e._l=void 0,e[x]=0,null!=r&&h(r,n,e[f],e)}));return c(v.prototype,{clear:function(){for(var e=w(this,t),data=e._i,n=e._f;n;n=n.n)n.r=!0,n.p&&(n.p=n.p.n=void 0),delete data[n.i];e._f=e._l=void 0,e[x]=0},delete:function(e){var n=w(this,t),r=j(n,e);if(r){var o=r.n,c=r.p;delete n._i[r.i],r.r=!0,c&&(c.n=o),o&&(o.p=c),n._f==r&&(n._f=o),n._l==r&&(n._l=c),n[x]--}return!!r},forEach:function(e){w(this,t);for(var n,r=l(e,arguments.length>1?arguments[1]:void 0,3);n=n?n.n:this._f;)for(r(n.v,n.k,this);n&&n.r;)n=n.p},has:function(e){return!!j(w(this,t),e)}}),y&&r(v.prototype,"size",{get:function(){return w(this,t)[x]}}),v},def:function(e,t,n){var r,o,c=j(e,t);return c?c.v=n:(e._l=c={i:o=_(t,!0),k:t,v:n,p:r=e._l,n:void 0,r:!1},e._f||(e._f=c),r&&(r.n=c),e[x]++,"F"!==o&&(e._i[o]=c)),e},getEntry:j,setStrong:function(e,t,n){f(e,t,(function(e,n){this._t=w(e,t),this._k=n,this._l=void 0}),(function(){for(var e=this,t=e._k,n=e._l;n&&n.r;)n=n.p;return e._t&&(e._l=n=n?n.n:e._t._f)?v(0,"keys"==t?n.k:"values"==t?n.v:[n.k,n.v]):(e._t=void 0,v(1))}),n?"entries":"values",!n,!0),m(t)}}},203:function(e,t,n){"use strict";var r=n(5),o=n(2),c=n(13),l=n(134),meta=n(135),d=n(136),h=n(133),f=n(12),v=n(8),m=n(92),y=n(53),_=n(95);e.exports=function(e,t,n,w,x,j){var k=r[e],S=k,C=x?"set":"add",z=S&&S.prototype,E={},A=function(e){var t=z[e];c(z,e,"delete"==e||"has"==e?function(a){return!(j&&!f(a))&&t.call(this,0===a?0:a)}:"get"==e?function(a){return j&&!f(a)?void 0:t.call(this,0===a?0:a)}:"add"==e?function(a){return t.call(this,0===a?0:a),this}:function(a,b){return t.call(this,0===a?0:a,b),this})};if("function"==typeof S&&(j||z.forEach&&!v((function(){(new S).entries().next()})))){var I=new S,M=I[C](j?{}:-0,1)!=I,L=v((function(){I.has(1)})),F=m((function(e){new S(e)})),H=!j&&v((function(){for(var e=new S,t=5;t--;)e[C](t,t);return!e.has(-0)}));F||((S=t((function(t,n){h(t,S,e);var r=_(new k,t,S);return null!=n&&d(n,x,r[C],r),r}))).prototype=z,z.constructor=S),(L||H)&&(A("delete"),A("has"),x&&A("get")),(H||M)&&A(C),j&&z.clear&&delete z.clear}else S=w.getConstructor(t,e,x,C),l(S.prototype,n),meta.NEED=!0;return y(S,e),E[e]=S,o(o.G+o.W+o.F*(S!=k),E),j||w.setStrong(S,e,x),S}},204:function(e,t,n){var r=n(2);r(r.S,"Math",{sign:n(205)})},205:function(e,t){e.exports=Math.sign||function(e){return 0==(e=+e)||e!=e?e:e<0?-1:1}},206:function(e,t,n){"use strict";n(198)},207:function(e,t,n){var r=n(27),o=n(138),c=n(208),l=r(!1),d=o(c);l.push([e.i,".object-embed-3d[data-v-4c36705e]{position:relative;cursor:move;width:100%}.object-embed-3d .object-3d[data-v-4c36705e]{width:100%;height:100%}.object-embed-3d:hover .object-embed-icon[data-v-4c36705e]{opacity:0;transition:opacity .5s ease-in-out}.object-embed-3d .object-scroll-message[data-v-4c36705e]{z-index:11;top:0;left:0;right:0;position:absolute;pointer-events:none;transition:opacity .5s ease-in-out;color:#fff;background-color:transparent;padding:.25rem .5rem;font-size:250%;line-height:250%;height:100%;opacity:.5;display:flex;justify-content:center;align-content:center;flex-direction:column;text-align:center}@media (hover:hover) and (pointer:coarse),(hover:hover) and (pointer:none),(hover:none){.object-embed-3d .object-scroll-message-mouse[data-v-4c36705e]{display:none!important}}@media (hover:hover) and (pointer:fine){.object-embed-3d .object-scroll-message-touch[data-v-4c36705e]{display:none!important}}.object-embed-3d .object-fullscreen[data-v-4c36705e]{position:absolute;top:10px;left:0;padding:10px;margin:0;z-index:1;max-width:80%;line-height:1.2em;border-radius:10px;background:#004;color:#fff;text-align:center}.object-embed-3d .object-embed-icon[data-v-4c36705e]{background-image:url("+d+");width:100%;height:100%;z-index:10;position:absolute;background-repeat:no-repeat;background-position:50%;background-size:contain;pointer-events:none;transition:opacity .5s ease-in-out}.object-embed-3d .object-embed-icon[data-v-4c36705e]:hover{opacity:0;transition:opacity .5s ease-in-out}",""]),e.exports=l},208:function(e,t,n){e.exports=n.p+"img/c7cf9fb.svg"},209:function(e,t,n){"use strict";n(91),n(201),n(37),n(15),n(38),n(204),n(35),n(29),n(21),n(36);var r=n(200);n(210);function o(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return c(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return c(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var i=0,r=function(){};return{s:r,n:function(){return i>=e.length?{done:!0}:{done:!1,value:e[i++]}},e:function(e){throw e},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,l=!0,d=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return l=e.done,e},e:function(e){d=!0,o=e},f:function(){try{l||null==n.return||n.return()}finally{if(d)throw o}}}}function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,n=new Array(t);i<t;i++)n[i]=e[i];return n}var l={props:{model:{type:String,required:!0},attribution:{type:String,required:!1,default:""},link:{type:String,required:!1,default:null},backgroundColor:{type:String,required:!1,default:"transparent"},autoRotate:{type:Boolean,required:!1,default:!0},initialAlpha:{type:[Number,String],required:!1,default:"random"},initialBeta:{type:[Number,String],required:!1,default:Math.PI/2},inputEnabled:{type:Boolean,required:!1,default:!0}},data:function(){return{engine:null,scene:null,camera:null,container:null,pointerIds:new Set,showZoomHelp:!0,showTouchHelp:!0}},computed:{touching:function(){return 0!==this.pointerIds.size}},watch:{inputEnabled:function(e){e?this.camera.detachControl(this.container):this.camera.attachControl(this.container)}},mounted:function(){var e=this;this.container=this.$el.querySelector(".object-3d"),this.engine=new r.Engine(this.container,!0),this.engine.loadingUIText="Mergulho na Laje de Santos",this.scene=new r.Scene(this.engine),this.scene.clearColor="transparent"===this.backgroundColor?new r.Color4(0,0,0,.1):r.Color3.FromHexString(this.backgroundColor),this.camera=new r.ArcRotateCamera("Camera",isNaN(parseFloat(this.initialAlpha))?6*Math.random()%(2*Math.PI):this.initialAlpha,this.initialBeta,.5,new r.Vector3(0,0,0),this.scene),this.camera.minZ=1e-4,this.camera.useFramingBehavior=!0,this.camera.applyGravity=!1,this.camera.speed=.1,this.camera.inputs.remove(this.camera.inputs.attached.mousewheel),this.container.addEventListener("wheel",(function(t){t.ctrlKey?(e.showZoomHelp=!1,e.camera.radius+=Math.sign(t.deltaY)*e.camera.radius*.1,t.preventDefault()):e.showZoomHelp=!0})),this.container.addEventListener("pointerdown",(function(t){e.pointerIds.add(t.pointerId),e.showZoomHelp=!1})),this.container.addEventListener("pointerleave",(function(t){e.pointerIds.delete(t.pointerId)})),this.camera.inputs.attached.pointers&&(this.camera.inputs.attached.pointers.pinchPrecision=1e3),this.camera.keysUp.push("w".charCodeAt(0)),this.camera.keysUp.push("W".charCodeAt(0)),this.inputEnabled&&this.camera.attachControl(this.container,!1),this.light1=new r.HemisphericLight("light1",new r.Vector3(1,1,0),this.scene),this.light2=new r.PointLight("light2",new r.Vector3(0,1,-1),this.scene);var path=this.model.slice(0,this.model.lastIndexOf("/")+1),t=this.model.slice(this.model.lastIndexOf("/")+1),n=!1,c=new r.AssetsManager(this.scene);c.addMeshTask("box","",path,t),c.onFinish=function(t){n=!0;var r,c=.01,l=null,d=o(t[0].loadedMeshes);try{for(d.s();!(r=d.n()).done;){var h=r.value;if(h){var s=h.getBoundingInfo().boundingBox.extendSize;c<s.x/2&&(c=s.x/2),c<s.y/2&&(c=s.y/2),c<s.z/2&&(c=s.z/2),l||(l=h)}}}catch(e){d.e(e)}finally{d.f()}e.camera.lockedTarget=l;var f=e.container.width/e.container.height;f<1&&(f=1/f),e.camera.radius=2*c/Math.tan(e.camera.fov/2)*f,e.camera.lowerRadiusLimit=c/10,e.setScrollHijacking(!1)},c.load(),this.engine.runRenderLoop((function(){var t=e.engine.getDeltaTime()/1e3;n&&e.autoRotate&&(e.camera.alpha=(e.camera.alpha+.2*t)%(2*Math.PI)),e.scene.render()})),window.addEventListener("resize",this.resize.bind(this)),this.container.onfullscreenchange=function(e){}},beforeDestroy:function(){window.removeEventListener("resize",this.resize.bind(this)),this.engine.stopRenderLoop(),this.scene.dispose(),this.scene=null,this.engine=null},methods:{resize:function(){this.engine.resize()},requestFullscreen:function(){this.engine.enterFullscreen()},setScrollHijacking:function(b){b?(this.container.setAttribute("touch-action","initial"),this.container.style.touchAction="initial"):(this.container.setAttribute("touch-action","pan-y"),this.container.style.touchAction="pan-y")}}},d=(n(206),n(4)),component=Object(d.a)(l,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"object-embed-3d"},[n("button",{staticClass:"object-fullscreen",attrs:{"touch-action":"none"},on:{click:function(t){return e.requestFullscreen()}}},[n("i18n",[e._v("Ver 3D em tela cheia")])],1),e._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:!e.touching,expression:"!touching"}],staticClass:"object-embed-icon",attrs:{"touch-action":"none"}}),e._v(" "),n("transition",{attrs:{name:"fade","touch-action":"none"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:e.showZoomHelp,expression:"showZoomHelp"}],attrs:{"touch-action":"none"}},[n("div",{staticClass:"object-scroll-message object-scroll-message-mouse"},[n("i18n",[e._v("use ctrl+scroll para zoom,")]),n("br"),e._v(" "),n("i18n",[e._v("arraste para girar")])],1),e._v(" "),n("div",{staticClass:"object-scroll-message object-scroll-message-touch",attrs:{"touch-action":"none"}},[n("i18n",[e._v("apertar com dedos para zoom,")]),n("br"),e._v(" "),n("i18n",[e._v("arraste para girar")])],1)])]),e._v(" "),n("canvas",{staticClass:"object-3d"}),e._v(" "),n("p",{staticClass:"attribution"},[e.link?n("a",{attrs:{href:e.link,target:"_blank"}},[e._v("\n      "+e._s(e.attribution)+"\n    ")]):n("span",[e._v("\n      "+e._s(e.attribution)+"\n    ")])])],1)}),[],!1,null,"4c36705e",null);t.a=component.exports},426:function(e,t,n){"use strict";n.r(t);var r={components:{GLTFModel:n(209).a},data:function(){return{}}},o=n(4),component=Object(o.a)(r,(function(){var e=this.$createElement,t=this._self._c||e;return t("article",[t("section",[t("GLTFModel",{attrs:{model:"./models/manta/scene.gltf",attribution:"xxxxx"}})],1)])}),[],!1,null,null,null);t.default=component.exports}}]);