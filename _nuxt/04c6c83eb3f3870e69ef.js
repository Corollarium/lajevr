(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{166:function(e,t,n){var content=n(175);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(14).default)("0d835a96",content,!0,{sourceMap:!1})},174:function(e,t,n){"use strict";var r=n(166);n.n(r).a},175:function(e,t,n){var r=n(13),o=n(192),d=n(176);t=e.exports=r(!1);var c=o(d);t.push([e.i,".object-embed-3d[data-v-3e6658c7]{position:relative;cursor:move}.object-embed-3d:hover .object-embed-icon[data-v-3e6658c7]{opacity:0}.object-embed-3d:hover .object-embed-icon[data-v-3e6658c7],.object-embed-icon[data-v-3e6658c7]{-webkit-transition:opacity .5s ease-in-out;transition:opacity .5s ease-in-out}.object-embed-icon[data-v-3e6658c7]{background-image:url("+c+");width:100%;height:100%;z-index:10;position:absolute;background-repeat:no-repeat;background-position:50%;background-size:contain;pointer-events:none}.object-embed-icon[data-v-3e6658c7]:hover{opacity:0;-webkit-transition:opacity .5s ease-in-out;transition:opacity .5s ease-in-out}",""])},176:function(e,t,n){e.exports=n.p+"img/4b4a30d.svg"},177:function(e,t,n){var content=n(220);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(14).default)("5492c37a",content,!0,{sourceMap:!1})},181:function(e,t,n){"use strict";n(189);var r=n(164),o=n(190),d=n(191),c={props:{model:{type:String,required:!0},attribution:{type:String,required:!1,default:""},backgroundColor:{type:Number,required:!1,default:16777215}},data:function(){return{renderer:null}},mounted:function(){var e=this,t=this.$el,n=new r.PerspectiveCamera(75,t.clientWidth/window.innerHeight,1,2e4);n.position.set(0,0,150),n.lookAt(0,0,0);var c=new r.Scene;c.background=new r.Color(this.backgroundColor),this.renderer=new r.WebGLRenderer({powerPreference:"high-performance"}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(t.clientWidth,window.innerHeight);var l=new o.a(n,this.renderer.domElement);l.autoRotate=!0,l.autoRotateSpeed=1;var m=new r.AmbientLight(13421772,.8);c.add(m);var v,h,f=new r.DirectionalLight(16777215,.8);f.position.set(0,1,0).normalize(),c.add(f),(new d.a).load(this.model,(function(e){h=e.scene,c.add(h),(v=new r.AnimationMixer(h)).clipAction(e.animations[0]).play()}),(function(e){}),(function(e){})),t.appendChild(this.renderer.domElement);window.addEventListener("resize",(function(){n.aspect=t.clientWidth/window.innerHeight,n.updateProjectionMatrix(),l.update(),e.renderer.setSize(t.clientWidth,window.innerHeight)}),!1);var _=0;var w=!0,C=function(){w&&e.renderer.render(c,n)};!function animate(time){var dt=(time-_)/1e3;requestAnimationFrame(animate),v&&v.update(dt),l.update(),h&&(n.position.y+=.8*Math.sin(time/2e3)),C(),_=time}(),this.observer=new IntersectionObserver((function(e,t){e.forEach((function(e){w=e.intersectionRatio>=.05}))}),{threshold:[0,.05]}),this.observer.observe(this.renderer.domElement)},beforeDestroy:function(){this.observer.unobserve(this.renderer.domElement),this.observer=null,this.renderer.forceContextLoss(),this.renderer.domElement=null,this.renderer=null}},l=(n(174),n(9)),component=Object(l.a)(c,(function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"object-embed-3d"},[t("div",{staticClass:"object-embed-icon"}),this._v(" "),t("p",{staticClass:"attribution",domProps:{innerHTML:this._s(this.attribution)}})])}),[],!1,null,"3e6658c7",null);t.a=component.exports},219:function(e,t,n){"use strict";var r=n(177);n.n(r).a},220:function(e,t,n){var r=n(13);(e.exports=r(!1)).push([e.i,'@media (min-width:640px){.sidebar[data-v-fd2310de]{position:-webkit-sticky;position:sticky;top:30px}}.menu-list li[data-v-fd2310de]{height:5em;background-color:#eee;border:6px solid #fff;vertical-align:middle;text-transform:capitalize;font-feature-settings:"c2sc";font-variant:small-caps;font-weight:700}@media screen and (min-width:1024px){.menu-list li[data-v-fd2310de]{font-size:1.2em}}.menu-list li a[data-v-fd2310de]{line-height:4.5em;padding:0}.menu-list li.active[data-v-fd2310de]{background-color:#ccc}figure[data-v-fd2310de]{text-align:center}',""])},244:function(e,t,n){"use strict";n.r(t);var r={components:{GLTFModel:n(181).a},mounted:function(){this.asideMenu()},methods:{asideMenu:function(){if("IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"intersectionRatio"in window.IntersectionObserverEntry.prototype){var e=new IntersectionObserver((function(e,t){e.forEach((function(e){var t=document.querySelector('[data-target="'+e.target.id+'"]');e.intersectionRatio>=.1?t.classList.add("active"):t.classList.remove("active")}))}),{threshold:[.1,.9]});document.querySelectorAll("section.section").forEach((function(t){e.observe(t)}))}}}},o=(n(219),n(9)),component=Object(o.a)(r,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("article",{staticClass:"container columns"},[e._m(0),e._v(" "),n("div",{staticClass:"main column"},[n("h1",{staticClass:"title is-1"},[e._v("\n      A vida na Laje de Santos\n    ")]),e._v(" "),n("section",{staticClass:"section",attrs:{id:"intro"}},[n("p",[e._v("\n        A Laje de Santos é rica em vida. 196 espécies de peixes e 29 espécies de aves já foram catalogadas.\n        É também habitada por corais, algas e outras formas de vida. Há bastantes áreas com algas marrons e vermelhas.\n        "),n("nuxt-link",{attrs:{to:"/fauna"}},[e._v("\n          Se estiver procurando espécies, veja a lista completa.\n        ")])],1)]),e._v(" "),n("section",{staticClass:"section",attrs:{id:"manta"}},[n("h2",{staticClass:"title is-2"},[e._v("\n        Raias Mantas\n      ")]),e._v(" "),n("p",[e._v("\n        A jamanta (Mobula birostris), também conhecida como manta. é uma espécie de peixes pelágicos e oceânicos. É a maior espécie atual de raias.\n        Encontra-se nas regiões tropicais e subtropicais de todos os oceanos, tipicamente perto de recifes de coral.\n      ")]),e._v(" "),n("GLTFModel",{attrs:{model:"/models/manta/scene.gltf",attribution:"<a href='https: sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8'>Modelo 3D CC BY-NC por misaooo</a>"}}),e._v(" "),n("p",[e._v("\n        A jamanta tem o corpo em forma de losango e uma cauda longa sem espinho e pode atingir sete metros de envergadura e pesar até 1,350kg. Podem viver até 20 anos. Estes peixes não têm verdadeiros dentes e alimentam-se de plâncton e pequenos peixes, sendo portanto inofensivos. Ocasionalmente, podem aproximar-se de um barco ou de mergulhadores e podem executar curtos “voos” fora da água. Têm a maior taxa de volume de cérebro em relação ao do corpo de todos os tubarões e raias[1].\n      ")]),e._v(" "),n("p",[e._v("\n        Durante as suas migrações, as jamantas efetuam mergulhos frequentes até profundidades de quase dois quilómetros (entre os maiores alguma vez medidos para um animal marinho), onde as temperaturas da água atingem os três graus centígrados.[2]\n      ")]),e._v(" "),e._m(1)],1),e._v(" "),e._m(2),e._v(" "),e._m(3),e._v(" "),e._m(4),e._v(" "),n("section",{staticClass:"section",attrs:{id:"fish"}},[n("h2",{staticClass:"title is-2"},[e._v("\n        Peixes\n      ")]),e._v(" "),n("GLTFModel",{attrs:{model:"/models/fish/scene.gltf",attribution:""}})],1)])])}),[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"column is-2 is-fullheight is-hidden-mobile"},[n("div",{staticClass:"sidebar"},[n("ul",{staticClass:"menu-list"},[n("li",{staticClass:"sidebar-link",attrs:{"data-target":"intro"}},[n("a",{attrs:{href:"#intro"}},[e._v("Introdução")])]),e._v(" "),n("li",{staticClass:"sidebar-link",attrs:{"data-target":"manta"}},[n("a",{attrs:{href:"#manta"}},[e._v("Mantas")])]),e._v(" "),n("li",{staticClass:"sidebar-link",attrs:{"data-target":"turtles"}},[n("a",{attrs:{href:"#turtles"}},[e._v("Tartarugas")])]),e._v(" "),n("li",{staticClass:"sidebar-link",attrs:{"data-target":"dolphins"}},[n("a",{attrs:{href:"#dolphins"}},[e._v("Golfinhos")])]),e._v(" "),n("li",{staticClass:"sidebar-link",attrs:{"data-target":"birds"}},[n("a",{attrs:{href:"#birds"}},[e._v("Aves")])]),e._v(" "),n("li",{staticClass:"sidebar-link",attrs:{"data-target":"fish"}},[n("a",{attrs:{href:"#fish"}},[e._v("Peixes")])])])])])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("Fonte: "),t("a",{attrs:{href:"https://pt.wikipedia.org/wiki/Jamanta"}},[this._v("Wikipedia: Jamanta")]),this._v(".")])},function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",{staticClass:"section",attrs:{id:"turtles"}},[n("h2",{staticClass:"title is-2"},[e._v("\n        Tartarugas\n      ")]),e._v(" "),n("p",[e._v("\n        Há duas espécies de tartarugas na Laje de Santos: a tartaruga de pente e a tartaruga-verde.\n      ")]),e._v(" "),n("figure",[n("img",{attrs:{width:"800",alt:"Tartaruga da Laje",src:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Tartaruga_da_Laje.jpg/800px-Tartaruga_da_Laje.jpg"}}),e._v(" "),n("figcaption",[e._v("\n          Tartaruga de pente. REVER FOTO\n          "),n("a",{attrs:{title:"Ronaldo art [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",href:"https://commons.wikimedia.org/wiki/File:Tartaruga_da_Laje.jpg"}},[e._v("Ronaldo art [CC BY-SA 3.0]")])])]),e._v(" "),n("figure",[n("img",{attrs:{width:"800",alt:"Green sea turtle near Marsa Alam",src:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Green_sea_turtle_near_Marsa_Alam.JPG/800px-Green_sea_turtle_near_Marsa_Alam.JPG"}}),e._v(" "),n("figcaption",[e._v("\n          Tartaruga verde. REVER FOTO\n          "),n("a",{attrs:{title:"Ronaldo art [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",href:"https://commons.wikimedia.org/wiki/File:Tartaruga_da_Laje.jpg"}},[e._v("Alexander Vasenin [CC BY-SA 3.0]")])])])])},function(){var e=this.$createElement,t=this._self._c||e;return t("section",{staticClass:"section",attrs:{id:"dolphins"}},[t("h2",{staticClass:"title is-2"},[this._v("\n        Golfinhos\n      ")]),this._v(" "),t("p",[this._v("\n        Duas espécies de golfinhos habitam a Laje de Santos. É comum vê-los durante a travessia de barco, em pequenos grupos que\n        aparecem, acompanham o barco por alguns minutos e de novo somem em mar aberto, parecendo nos recepcionar.\n      ")]),this._v(" "),t("p",[this._v("\n        O Golfinho nariz de garrafa\n      ")]),this._v(" "),t("p",[this._v("\n        O Golfinho pintado do Atlântico.\n      ")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("section",{staticClass:"section",attrs:{id:"birds"}},[t("h2",{staticClass:"title is-2"},[this._v("\n        Aves\n      ")])])}],!1,null,"fd2310de",null);t.default=component.exports}}]);