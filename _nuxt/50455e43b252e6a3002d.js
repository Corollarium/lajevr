(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{173:function(t,e,n){var content=n(186);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(19).default)("529d634e",content,!0,{sourceMap:!1})},175:function(t,e,n){t.exports=n.p+"img/4b4a30d.svg"},185:function(t,e,n){"use strict";var r=n(173);n.n(r).a},186:function(t,e,n){var r=n(18),o=n(108),l=n(175);e=r(!1);var c=o(l);e.push([t.i,".object-embed-3d[data-v-13c54f50]{position:relative;cursor:move}.object-embed-3d:hover .object-embed-icon[data-v-13c54f50]{opacity:0;transition:opacity .5s ease-in-out}.object-embed-icon[data-v-13c54f50]{background-image:url("+c+");width:100%;height:100%;z-index:10;position:absolute;background-repeat:no-repeat;background-position:50%;background-size:contain;pointer-events:none;transition:opacity .5s ease-in-out}.object-embed-icon[data-v-13c54f50]:hover{opacity:0;transition:opacity .5s ease-in-out}",""]),t.exports=e},188:function(t,e,n){var content=n(243);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(19).default)("008967bc",content,!0,{sourceMap:!1})},189:function(t,e,n){var content=n(248);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(19).default)("b6890a7a",content,!0,{sourceMap:!1})},190:function(t,e,n){"use strict";var r=n(171),o=n(202),l=n(203),c={props:{model:{type:String,required:!0},attribution:{type:String,required:!1,default:""},link:{type:String,required:!1,default:null},backgroundColor:{type:String,required:!1,default:""}},data:function(){return{renderer:null}},mounted:function(){var t=this,e=this.$el,n=new r.PerspectiveCamera(75,e.clientWidth/window.innerHeight,1,2e4);n.position.set(0,0,150),n.lookAt(0,0,0);var c=new r.Scene;this.backgroundColor?(c.background=new r.Color(this.backgroundColor),this.renderer=new r.WebGLRenderer({powerPreference:"high-performance"})):(c.background=null,this.renderer=new r.WebGLRenderer({alpha:!0,powerPreference:"high-performance"}),this.renderer.setClearColor(16777215,0)),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(e.clientWidth,window.innerHeight);var d=new o.a(n,this.renderer.domElement);d.autoRotate=!0,d.autoRotateSpeed=1;var m=new r.AmbientLight(13421772,.8);c.add(m);var h,v,f=new r.DirectionalLight(16777215,.8);f.position.set(0,1,0).normalize(),c.add(f),(new l.a).load(this.model,(function(t){v=t.scene,c.add(v),(h=new r.AnimationMixer(v)).clipAction(t.animations[0]).play()}),(function(t){}),(function(t){})),e.appendChild(this.renderer.domElement);window.addEventListener("resize",(function(){n.aspect=e.clientWidth/window.innerHeight,n.updateProjectionMatrix(),d.update(),t.renderer.setSize(e.clientWidth,window.innerHeight)}),!1);var _=0;var C=!0,x=function(){C&&t.renderer.render(c,n)};!function animate(time){var dt=(time-_)/1e3;requestAnimationFrame(animate),h&&h.update(dt),d.update(),v&&(n.position.y+=.8*Math.sin(time/2e3)),x(),_=time}(),this.observer=new IntersectionObserver((function(t,e){t.forEach((function(t){C=t.intersectionRatio>=.05}))}),{threshold:[0,.05]}),this.observer.observe(this.renderer.domElement)},beforeDestroy:function(){this.observer.unobserve(this.renderer.domElement),this.observer=null,this.renderer.forceContextLoss(),this.renderer.domElement=null,this.renderer=null}},d=(n(185),n(4)),component=Object(d.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"object-embed-3d"},[n("div",{staticClass:"object-embed-icon"}),t._v(" "),n("p",{staticClass:"attribution"},[t.link?n("a",{attrs:{href:t.link,target:"_blank"}},[t._v("\n      "+t._s(t.attribution)+"\n    ")]):n("span",[t._v("\n      "+t._s(t.attribution)+"\n    ")])])])}),[],!1,null,"13c54f50",null);e.a=component.exports},237:function(t,e,n){t.exports=n.p+"img/067e1d9.png"},238:function(t,e,n){t.exports=n.p+"img/4be00b5.jpg"},239:function(t,e,n){t.exports=n.p+"img/103a6ca.jpg"},240:function(t,e,n){t.exports=n.p+"img/563fc51.jpg"},241:function(t,e,n){t.exports=n.p+"img/9baa1c9.jpg"},242:function(t,e,n){"use strict";var r=n(188);n.n(r).a},243:function(t,e,n){(e=n(18)(!1)).push([t.i,'.timeline[data-v-0760f1a4]{display:flex;margin:0 auto;flex-wrap:wrap;flex-direction:column;max-width:1280px;position:relative}.timeline__content-title[data-v-0760f1a4]{font-weight:400;font-size:66px;margin:-10px 0 0;transition:.4s;padding:0 10px;box-sizing:border-box;font-family:Raleway,Droid Sans,Helvetica Neue,Helvetica,Arial,sans-serif;color:#fff}.timeline__content-desc[data-v-0760f1a4]{margin:0;font-size:15px;box-sizing:border-box;color:hsla(0,0%,100%,.7);font-family:Montserrat,Droid Sans,Helvetica Neue,Helvetica,Arial,sans-serif;font-weight:400;line-height:25px}.timeline[data-v-0760f1a4]:before{position:absolute;left:50%;width:2px;height:100%;margin-left:-1px;content:"";background:hsla(0,0%,100%,.07)}@media only screen and (max-width:767px){.timeline[data-v-0760f1a4]:before{left:40px}}.timeline-item[data-v-0760f1a4]{padding:40px 0;opacity:.3;-webkit-filter:blur(2px);filter:blur(2px);transition:.5s;box-sizing:border-box;width:calc(50% - 40px);display:flex;position:relative;transform:translateY(-80px)}.timeline-item[data-v-0760f1a4]:before{letter-spacing:3px;width:100%;position:absolute;color:hsla(0,0%,100%,.5);font-size:13px;font-family:Raleway,Droid Sans,Helvetica Neue,Helvetica,Arial,sans-serif;border-left:2px solid hsla(0,0%,100%,.5);top:70%;margin-top:-5px;padding-left:15px;opacity:0;right:calc(-100% - 56px)}.timeline-item[data-v-0760f1a4]:nth-child(2n){align-self:flex-end}.timeline-item[data-v-0760f1a4]:nth-child(2n):before{right:auto;text-align:right;left:calc(-100% - 56px);padding-left:0;border-left:none;border-right:2px solid hsla(0,0%,100%,.5);padding-right:15px}.timeline-item--active[data-v-0760f1a4]{opacity:1;transform:translateY(0);-webkit-filter:blur(0);filter:blur(0)}.timeline-item--active[data-v-0760f1a4]:before{top:50%;transition:all .3s .2s;opacity:1}.timeline-item--active .timeline__content-title[data-v-0760f1a4]{margin:-50px 0 20px}@media only screen and (max-width:767px){.timeline-item[data-v-0760f1a4]{align-self:baseline!important;width:100%;padding:0 30px 150px 80px}.timeline-item[data-v-0760f1a4]:before{left:10px!important;padding:0!important;top:50px;text-align:center!important;width:60px;border:none!important}.timeline-item[data-v-0760f1a4]:last-child{padding-bottom:40px}}.timeline__figure[data-v-0760f1a4],.timeline__img[data-v-0760f1a4]{max-width:100%;box-shadow:0 10px 15px rgba(0,0,0,.4)}.timeline-container[data-v-0760f1a4]{width:100%;position:relative;transition:.3s ease 0s;background-attachment:fixed;background-size:cover;background-position:50%}.timeline-container[data-v-0760f1a4]:before{position:absolute;left:0;top:0;width:100%;height:100%;content:""}.timeline-background[data-v-0760f1a4]{width:100%;height:100%;position:absolute;transition:.3s ease 0s;background-attachment:fixed;background-size:cover;background-position:50%;transition:opacity .4s ease-in-out}.timeline-header[data-v-0760f1a4]{width:100%;text-align:center;margin-bottom:80px;position:relative}.timeline-header__title[data-v-0760f1a4]{color:#fff;font-size:46px;font-family:Montserrat,Droid Sans,Helvetica Neue,Helvetica,Arial,sans-serif;font-weight:400;margin:0}.timeline-header__subtitle[data-v-0760f1a4]{color:hsla(0,0%,100%,.5);font-family:Raleway,Droid Sans,Helvetica Neue,Helvetica,Arial,sans-serif;font-size:16px;letter-spacing:5px;margin:10px 0 0;font-weight:400}',""]),t.exports=e},244:function(t,e,n){var r=n(7);r(r.P,"Array",{fill:n(245)}),n(74)("fill")},245:function(t,e,n){"use strict";var r=n(30),o=n(110),l=n(25);t.exports=function(t){for(var e=r(this),n=l(e.length),c=arguments.length,d=o(c>1?arguments[1]:void 0,n),m=c>2?arguments[2]:void 0,h=void 0===m?n:o(m,n);h>d;)e[d++]=t;return e}},246:function(t,e,n){t.exports={srcSet:n.p+"img/3be5243-360.jpg 360w,"+n.p+"img/1f2053e-640.jpg 640w,"+n.p+"img/1a148b1-1080.jpg 1080w",images:[{path:n.p+"img/3be5243-360.jpg",width:360,height:238},{path:n.p+"img/1f2053e-640.jpg",width:640,height:424},{path:n.p+"img/1a148b1-1080.jpg",width:1080,height:715}],src:n.p+"img/3be5243-360.jpg",toString:function(){return n.p+"img/3be5243-360.jpg"},placeholder:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx4BBQUFBwYHDggIDh4UERQeHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHv/AABEIABoAKAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AO/0+EgA5NfTs8JSb6mzA+0DJY1k4lczJxO2MfMfrU8iK9oxjk/ewfyqrC5mC3TAbRxVRgX7axFa2oCjC1DmZKCLPlxRDMrIg9WYCspVUt2axpt7IqtrOiRyCM6hAWP9wlx+YzXPLGUo7yOmGCrS2iT/ANp6WSFN2qlhkBlZc/mKUcZSltIbwdZbxI2ktJXP2e5hmI6hJASPyrohXUtmc86LXxI86OtancSCWXU7krjGwbFQdTjAX369feoqUFPds3p1vZ7JESK32iS4NxM0jj5i2xsj6lcmsZYKlLe/3m8cdVjtb7hVgjW48/7RKHPQ/uz3/wB2k8FStaw1jqt73Lxa+tGi3PeReYBsLQR4b80rP+z6D6fiafX6/cdeaHruoxxI6yOIzvjkURBlOc9QoNEcNRg7xFLFVZ6M5eAkWwIJBx1r02eczWwNi8etSMJiY1idCVbzB8w4NIaOz0XVNTm020M2o3khbG4vMxzx3ya5JxSbsjaLbOs8SRxpHbFI1UtChYgYz9aygas//9k=",width:360,height:238}},247:function(t,e,n){"use strict";var r=n(189);n.n(r).a},248:function(t,e,n){(e=n(18)(!1)).push([t.i,"h1[data-v-03ffdd74],h2[data-v-03ffdd74]{text-transform:uppercase}.sticky-hero[data-v-03ffdd74]{height:300vh;position:relative}.sticky-hero .sticky-hero-content[data-v-03ffdd74]{height:100vh;height:calc(var(--vh, 1vh)*100);position:-webkit-sticky;position:sticky;top:0}.sticky-hero .sticky-hero-attribution[data-v-03ffdd74]{margin:0 auto;position:static;width:auto;max-width:1280px}.sticky-hero .sticky-back[data-v-03ffdd74]{position:absolute;height:70vh;height:calc(var(--vh, 1vh)*70);bottom:0;width:100%}.number-wrapper .number-info[data-v-03ffdd74]{width:20em!important}.number-wrapper .number-info .number-round[data-v-03ffdd74]{width:3.2em!important}.image-fish[data-v-03ffdd74]{display:inline-block}.bubbles[data-v-03ffdd74]{background:transparent;position:absolute}",""]),t.exports=e},250:function(t,e,n){"use strict";n.r(e);var r=n(193),o=n.n(r),l=n(172),c=[function(){var t=this.$createElement,e=this._self._c||t;return e("figure",{staticClass:"timeline__figure"},[e("img",{staticClass:"timeline__img",attrs:{src:n(238)}}),this._v(" "),e("figcaption",{staticClass:"timeline__img-attribution"},[e("a",{attrs:{href:"https://commons.wikimedia.org/w/index.php?curid=40644070"}},[this._v("Rafa Tecchio - Own work, CC BY-SA 3.0")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("figure",{staticClass:"timeline__figure"},[e("img",{staticClass:"timeline__img",attrs:{src:n(239),alt:"Parque Estadual, vista aérea"}}),this._v(" "),e("figcaption",{staticClass:"attribution"},[e("a",{attrs:{href:"https://commons.wikimedia.org/wiki/File:Parque_Estadual_Marinho_da_Laje_de_Santos.jpg"}},[this._v("\n              ALEXANDRE ANDREAZZI, CC BY-SA 4.0\n            ")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("figure",{staticClass:"timeline__figure"},[e("img",{staticClass:"timeline__img",attrs:{src:n(240),alt:"Instituto Laje Viva"}}),this._v(" "),e("figcaption",{staticClass:"attribution"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("figure",{staticClass:"timeline__figure"},[e("img",{staticClass:"timeline__img",attrs:{src:n(241),alt:"Livro Laje dos Sonhos"}})])},function(){var t=this.$createElement,e=this._self._c||t;return e("figure",{staticClass:"timeline__figure"},[e("iframe",{staticClass:"image",staticStyle:{width:"560px",height:"315px","max-width":"100%"},attrs:{width:"560",height:"315",src:"https://www.youtube-nocookie.com/embed/emBUPoyJ8Pk",frameborder:"0",allow:"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:"",loading:"lazy"}})])}],d=(n(72),n(73),{data:function(){return{observer:null}},mounted:function(){var t=this,e=this.$el.querySelector(".timeline-background");this.observer=new IntersectionObserver((function(n,r){n.forEach((function(n){var r=n.target;if(n.intersectionRatio>=.5){var o=r.querySelector(".timeline__img");o&&!t.$el.style.background.includes(o.src)&&(e.style.opacity=.5,setTimeout((function(){e.style.opacity=1}),300)),r.classList.add("timeline-item--active")}else n.intersectionRatio<=.3&&r.classList.remove("timeline-item--active")}))}),{threshold:[.3,.5]}),this.$el.querySelectorAll(".timeline-item").forEach((function(e){return t.observer.observe(e)}))}}),m=(n(242),n(4)),h=Object(m.a)(d,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"timeline-container"},[r("div",{staticClass:"timeline-background"}),t._v(" "),r("div",{staticClass:"timeline-header"},[r("h2",{staticClass:"timeline-header__title"},[r("i18n",[t._v("Linha do Tempo")])],1)]),t._v(" "),r("div",{staticClass:"timeline"},[r("div",{staticClass:"timeline-item",attrs:{"data-text":"Início"}},[r("div",{staticClass:"timeline__content"},[r("h2",{staticClass:"timeline__content-title"},[t._v("\n          1960\n        ")]),t._v(" "),r("p",{staticClass:"timeline__content-desc"},[r("i18n",[t._v("Primeiros mergulhos na Laje de Santos")])],1)])]),t._v(" "),r("div",{staticClass:"timeline-item",attrs:{"data-text":"LAJE DE SANTOS"}},[r("div",{staticClass:"timeline__content"},[t._m(0),t._v(" "),r("h2",{staticClass:"timeline__content-title"},[t._v("\n          19 de abril de 1992\n        ")]),t._v(" "),r("p",{staticClass:"timeline__content-desc"},[r("i18n",[t._v("A embarcação Moreia é naufragada. É o primeiro naufrágio feito para prática de mergulho no Brasil.")])],1)])]),t._v(" "),r("div",{staticClass:"timeline-item",attrs:{"data-text":"LAJE DE SANTOS"}},[r("div",{staticClass:"timeline__content"},[t._m(1),t._v(" "),r("h2",{staticClass:"timeline__content-title"},[t._v("\n          27 de setembro de 1993\n        ")]),t._v(" "),r("p",{staticClass:"timeline__content-desc"},[r("i18n",[t._v("Parque criado pelo decreto estadual n° 37.537. Passa a ser área de preservação, sendo proibida a pesca.")])],1)])]),t._v(" "),r("div",{staticClass:"timeline-item",attrs:{"data-text":"LAJE DE SANTOS"}},[r("div",{staticClass:"timeline__content"},[t._m(2),t._v(" "),r("h2",{staticClass:"timeline__content-title"},[t._v("\n          2003\n        ")]),t._v(" "),r("p",{staticClass:"timeline__content-desc"},[r("i18n",[t._v("Criado o "),r("a",{attrs:{href:"https://www.lajeviva.org.br/"}},[t._v("Instituto Laje Viva")]),t._v(", para ajudar na preservação das espécies marinhas do litoral paulista e brasileiro.")])],1)])]),t._v(" "),r("div",{staticClass:"timeline-item",attrs:{"data-text":"LAJE DE SANTOS"}},[r("div",{staticClass:"timeline__content"},[t._m(3),t._v(" "),r("h2",{staticClass:"timeline__content-title"},[t._v("\n          2009\n        ")]),t._v(" "),r("p",{staticClass:"timeline__content-desc"},[r("i18n",[t._v('Publicado o livro "Laje de Santos, Laje dos Sonhos".')])],1)])]),t._v(" "),r("div",{staticClass:"timeline-item",attrs:{"data-text":"LAJE DE SANTOS"}},[r("div",{staticClass:"timeline__content"},[t._m(4),t._v(" "),r("h2",{staticClass:"timeline__content-title"},[t._v("\n          2012\n        ")]),t._v(" "),r("p",{staticClass:"timeline__content-desc"},[r("i18n",[t._v("Produzido o documentário Laje dos Sonhos.")])],1)])]),t._v(" "),r("div",{staticClass:"timeline-item",attrs:{"data-text":"LAJE DE SANTOS"}},[r("div",{staticClass:"timeline__content"},[r("img",{staticClass:"timeline__img",attrs:{src:n(237),alt:"Laje de Santos em Realidade Virtual"}}),t._v(" "),r("h2",{staticClass:"timeline__content-title"},[t._v("\n          2020\n        ")]),t._v(" "),r("p",{staticClass:"timeline__content-desc"},[r("i18n",[t._v('Projeto "A Laje em Realidade Virtual".')])],1)])])])])}),c,!1,null,"0760f1a4",null).exports,v=n(204),f=n(190),_=(n(244),n(75),{props:{total:{type:Number,required:!1,default:0}},data:function(){return{observer:null}},mounted:function(){var t,e=this,n=this.$el,r=n.getContext("2d"),o=n.width=this.$el.parentElement.clientWidth,l=n.height=this.$el.parentElement.clientHeight,c=this.total?this.total:parseInt(o/10),d=Math.sqrt(l*l+o/2*(o/2)),m=r.createRadialGradient(o/2,0,0,o/2,0,d);function h(){this.rw=C(5,25),this.cx=Math.round(Math.random()*o)+1,this.cy=Math.round(Math.random()*l)+1,this.cx<1.2*this.rw?this.cx=this.rw:this.cx>l-1.2*this.rw&&(this.cx=this.rw),this.x=this.cx,this.y=this.cy;var t=C(75,95)/100;this.rh=~~(this.rw*t),this.a=(Math.round(360*Math.random())+1)*(Math.PI/180),this.driftFlag=!(Math.random()<.5),this.lift=C(2,10)/10,this.grd=_(this.cx,this.cy,this.rw)}m.addColorStop(0,"#badbf5"),m.addColorStop(.35,"#53a5dd"),m.addColorStop(.75,"#306eab"),m.addColorStop(1,"#22417a"),r.fillStyle="rgba(0, 0, 200, 0.)";var v=[];function f(){for(var i=0;i<c;i++)v[i]=new h;(t=r.createLinearGradient(0,0,0,l)).addColorStop(0,"rgba(0, 0, 200, 1)"),t.addColorStop(.1,"rgba(0, 0, 200, 0)"),t.addColorStop(.9,"rgba(0, 0, 200, 0)"),t.addColorStop(1,"rgba(0, 0, 200, 1)")}function _(t,e,n){return(m=r.createRadialGradient(t,e-n/20*n,0,t,e-n/20*n,n)).addColorStop(0,"rgba(186,219,245,.9)"),m.addColorStop(1,"rgba(186,219,245, 0.1)"),m}function C(t,e){return Math.floor(Math.random()*(e-t+1)+t)}var x=!0;f(),window.requestAnimationFrame((function e(){if(window.requestAnimationFrame(e),x){r.clearRect(0,0,o,l);for(var n=0;n<v.length;n++)v[n].a+=.1,v[n].cy<-1*v[n].rw?v[n].cy=l+v[n].rw:v[n].cy-=v[n].lift,v[n].cx<=v[n].x-10?v[n].driftFlag=!0:v[n].cx>=v[n].x+10&&(v[n].driftFlag=!1),v[n].driftFlag?v[n].cx+=.15:v[n].cx-=.15,v[n].grd=_(v[n].cx,v[n].cy,v[n].rw),c=v[n].cx,d=v[n].cy,m=v[n].rw,h=v[n].rh,a=v[n].a,f=v[n].grd,C=void 0,w=void 0,A=void 0,S=void 0,k=void 0,y=void 0,M=void 0,E=void 0,j=void 0,L=void 0,P=void 0,I=void 0,B=void 0,R=void 0,F=void 0,H=void 0,Q=void 0,z=void 0,N=void 0,T=void 0,D=void 0,O=void 0,Y=void 0,U=void 0,J=void 0,$=void 0,G=void 0,V=void 0,Z=void 0,W=void 0,C=.5522847498*m,w=.5522847498*h,A=Math.sqrt(w*w+m*m),S=Math.sqrt(C*C+h*h),k=Math.atan(w/m),y=Math.atan(C/h),M=c+m*Math.cos(a),E=d+m*Math.sin(a),j=c+h*Math.cos(Math.PI/2+a),L=d+h*Math.sin(Math.PI/2+a),P=c+m*Math.cos(Math.PI+a),I=d+m*Math.sin(Math.PI+a),B=c+h*Math.cos(3*Math.PI/2+a),R=d+h*Math.sin(3*Math.PI/2+a),F=c+A*Math.cos(k+a),H=d+A*Math.sin(k+a),Q=c+S*Math.cos(Math.PI/2-y+a),z=d+S*Math.sin(Math.PI/2-y+a),N=c+S*Math.cos(Math.PI/2+y+a),T=d+S*Math.sin(Math.PI/2+y+a),D=c+A*Math.cos(Math.PI-k+a),O=d+A*Math.sin(Math.PI-k+a),Y=c+A*Math.cos(Math.PI+k+a),U=d+A*Math.sin(Math.PI+k+a),J=c+S*Math.cos(3*Math.PI/2-y+a),$=d+S*Math.sin(3*Math.PI/2-y+a),G=c+S*Math.cos(3*Math.PI/2+y+a),V=d+S*Math.sin(3*Math.PI/2+y+a),Z=c+A*Math.cos(-k+a),W=d+A*Math.sin(-k+a),r.save(),r.fillStyle=f,r.strokeStyle="rgba(200,200,200,.3)",r.beginPath(),r.moveTo(M,E),r.bezierCurveTo(F,H,Q,z,j,L),r.bezierCurveTo(N,T,D,O,P,I),r.bezierCurveTo(Y,U,J,$,B,R),r.bezierCurveTo(G,V,Z,W,M,E),r.fill(),r.stroke(),r.restore();var c,d,m,h,a,f,C,w,A,S,k,y,M,E,j,L,P,I,B,R,F,H,Q,z,N,T,D,O,Y,U,J,$,G,V,Z,W;r.save(),r.globalAlpha=1,r.globalCompositeOperation="destination-out",r.fillStyle=t,r.fillRect(0,0,o,l),r.restore()}})),window.addEventListener("resize",(function(){o=n.width=e.$el.parentElement.clientWidth,l=n.height=e.$el.parentElement.clientHeight,f()}),!1),this.observer=new IntersectionObserver((function(t,e){t.forEach((function(t){x=t.intersectionRatio>=.05}))}),{threshold:[0,.05]}),this.observer.observe(this.$el)},beforeDestroy:function(){this.observer.unobserve(this.$el),this.observer=null}}),C=Object(m.a)(_,(function(){var t=this.$createElement;return(this._self._c||t)("canvas",{staticClass:"bubbles"})}),[],!1,null,null,null).exports,x=n(194),w=n(195),A=n(246),S=n(196),k=n(197),y=n(198),M=n(199),E=n(200),j={components:{Timeline:h,Ocean:v.a,GLTFModel:f.a,Bubbles:C},extends:l.default,data:function(){return{imagePeixes:x,imageIlha:w,imageIlhaFoto:A,imageMapDistance:S,imageProfundidade:k,imageMapNoBorders:y,imageMapaGeral2:M,imageLogoLaje:E,isSafari:!1}},mounted:function(){this.head.title=this.$gettext("A Laje de Santos em Realidade Virtual"),this.head.description=this.$gettext("Projeto de mapear a Laje de Santos em realidade virtual");var t=o.a.getParser(window.navigator.userAgent);this.isSafari=t.satisfies({macos:{safari:">10.1"},mobile:{safari:">=9"}})}},L=(n(247),Object(m.a)(j,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("section",{directives:[{name:"show",rawName:"v-show",value:!t.isSafari,expression:"!isSafari"}],staticClass:"sticky-hero"},[n("div",{staticClass:"sticky-hero-content"},[n("Ocean"),t._v(" "),t._m(0)],1),t._v(" "),n("div",{staticClass:"sticky-back"},[n("div",{staticClass:"description"},[n("section",{staticClass:"section description-content"},[n("img",{attrs:{src:t.imageLogoLaje,srcset:t.imageLogoLaje.srcSet,alt:"Laje de Santos - logo"}})])])])]),t._v(" "),n("section",{directives:[{name:"show",rawName:"v-show",value:t.isSafari,expression:"isSafari"}],staticClass:"hero"},[n("div",{staticClass:"hero-body"},[n("img",{attrs:{src:t.imageIlhaFoto.src,srcset:t.imageIlhaFoto.srcSet,alt:"Laje de Santos"}})]),t._v(" "),t._m(1)]),t._v(" "),n("section",{staticClass:"section"},[n("div",{attrs:{bp:"grid 12 6@md vertical-center"}},[n("div",{staticClass:"description"},[n("section",{staticClass:"section description-content"},[n("h1",[n("i18n",[t._v("Laje de Santos")])],1),t._v(" "),n("p",{staticClass:"text-larger"},[t._v("\n            O Parque Estadual Marinho da Laje de Santos é uma area de proteção da\n            biodiversidade marinha e aviária.\n          ")])])]),t._v(" "),n("div",[n("section",{staticClass:"section"},[n("figure",{staticClass:"image"},[n("img",{attrs:{src:t.imageIlha.src,srcset:t.imageIlha.srcSet,alt:"Mapa esquematizado da Laje de Santos"}})])])])]),t._v(" "),n("div",{attrs:{bp:"grid 12 6@md vertical-center"}},[n("div",[n("section",{staticClass:"section"},[n("figure",{staticClass:"image"},[n("img",{attrs:{src:t.imageMapDistance.src,srcset:t.imageMapDistance.srcSet,alt:"Mapa esquematizado da Laje de Santos"}})])])]),t._v(" "),n("div",{attrs:{bp:"first first@sm last@md"}},[n("section",{staticClass:"section"},[n("p",{staticClass:"text-larger"},[n("i18n",[t._v("\n              Uma ilha na forma de baleia que surge no mar aberto, a 40km da costa do Estado de São Paulo, no Brasil.\n            ")])],1),t._v(" "),n("figure",{staticClass:"image"},[n("img",{attrs:{src:t.imageMapNoBorders.src,srcset:t.imageMapNoBorders.srcSet,alt:"Mapa-mundi com a Laje de Santos"}})])])])]),t._v(" "),n("div",{attrs:{bp:"grid 12 6@md vertical-center"}},[n("div",[n("section",{staticClass:"section"},[n("p",{staticClass:"text-larger"},[n("i18n",[t._v("A Laje oferece ótimas condições de mergulho, com boa visibilidade da água e muita vida, sendo um dos principais pontos do país.")])],1)])]),t._v(" "),n("div",[n("section",{staticClass:"section"},[n("figure",{staticClass:"image"},[n("img",{attrs:{src:t.imageProfundidade.src,srcset:t.imageProfundidade.srcSet,alt:"Mapa profundidade da Laje de Santos"}})])])])])]),t._v(" "),n("section",{staticClass:"description"},[n("figure",{staticClass:"image"},[n("img",{staticClass:"fade-top-bottom",staticStyle:{"object-fit":"cover","min-height":"70vh"},attrs:{src:t.imagePeixes.src,srcset:t.imagePeixes.srcSet,alt:"Cardume de Xira"}}),t._v(" "),t._m(2)]),t._v(" "),n("div",{staticClass:"text-over-image"},[n("div",{staticClass:"description-content",attrs:{"data-aos":"slide-left"}},[n("p",[n("i18n")],1)])])]),t._v(" "),n("section",{staticClass:"section"},[n("div",{staticStyle:{"max-width":"500px",margin:"0 auto"}},[n("h2",[n("i18n",[t._v("Mergulho virtual")])],1),t._v(" "),n("p",[n("i18n",[t._v("\n          Experimente como é mergulhar na Laje de Santos do seu próprio navegador.\n        ")])],1),t._v(" "),n("p",[n("nuxt-link",{staticClass:"button-is-liquid",attrs:{to:"/mergulho-virtual"}},[n("span",{staticClass:"button-is-liquid__text"},[n("i18n",[t._v("Mergulhe agora")])],1),t._v(" "),n("span",{staticClass:"button-is-liquid__animation"})])],1)])]),t._v(" "),n("section",{staticClass:"section"},[n("div",{staticStyle:{"max-width":"500px",margin:"0 auto"}},[n("h2",[n("i18n",[t._v("A vida na Laje")])],1),t._v(" "),n("p",[n("i18n",[t._v("\n          A Laje de Santos é rica em vida. 196 espécies de peixes e 29 espécies de aves já foram catalogadas. É habitada\n          por corais, golfinhos, tartarugas, algas, raias-manta.\n        ")])],1)]),t._v(" "),t._m(3),t._v(" "),n("div",{staticStyle:{"text-align":"center"}},[n("nuxt-link",{staticClass:"button-is-liquid",attrs:{to:"/vida"}},[n("span",{staticClass:"button-is-liquid__text"},[n("i18n",[t._v("Mais sobre a vida")])],1),t._v(" "),n("span",{staticClass:"button-is-liquid__animation"})]),t._v(" "),n("nuxt-link",{staticClass:"button-is-liquid",attrs:{to:"/especies"}},[n("span",{staticClass:"button-is-liquid__text"},[n("i18n",[t._v("Catálogo de espécies")])],1),t._v(" "),n("span",{staticClass:"button-is-liquid__animation"})])],1)]),t._v(" "),n("section",{attrs:{id:"mantas",bp:"grid 12 6@md"}},[n("div",[n("GLTFModel",{attrs:{model:"./models/manta/scene.gltf",link:"https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8",attribution:"Modelo 3D CC BY-NC por misaooo"}})],1),t._v(" "),n("div",[n("Bubbles"),t._v(" "),n("div",{staticClass:"description"},[n("div",{staticClass:"description-content",attrs:{"data-aos":"fade-left"}},[t._v("\n          No inverno "),n("nuxt-link",{attrs:{to:"/vida#manta"}},[t._v("\n            as raias mantas\n          ")]),t._v(" passam pela Laje. Chegam a 8 metros de envergadura e 2 toneladas. Estão vulneráveis à extinção.\n        ")],1)])],1)]),t._v(" "),n("section",{staticClass:"section",attrs:{id:"numeros"}},[n("div",{staticClass:"container"},[n("h2",{staticClass:"title is-1"},[n("i18n",[t._v("\n          A Laje em Números\n        ")])],1),t._v(" "),n("div",{staticClass:"number-wrapper",attrs:{bp:"grid 6@md 3@lg"}},[n("number-bullet",{attrs:{to:550}},[n("i18n",[t._v("\n            metros de comprimento\n          ")])],1),n("number-bullet",{attrs:{to:33}},[n("i18n",[t._v("\n            metros de altura\n          ")])],1),n("number-bullet",{attrs:{to:185}},[n("i18n",[t._v("\n            metros de largura\n          ")])],1),n("number-bullet",{attrs:{to:5e3}},[n("i18n",[t._v("\n            hectares preservados\n          ")])],1),n("number-bullet",{attrs:{to:45}},[n("i18n",[t._v("\n            metros de profundidade máxima\n          ")])],1),n("number-bullet",{attrs:{to:40.7,format:function(t){return(new Intl.NumberFormat).format(parseFloat(t).toFixed(1))}}},[n("i18n",[t._v("\n            quilômetros da costa\n          ")])],1),n("number-bullet",{attrs:{to:29}},[n("i18n",[t._v("\n            espécies de aves\n          ")])],1),n("number-bullet",{attrs:{to:196}},[n("i18n",[t._v("\n            espécies de peixes\n          ")])],1)],1)])]),t._v(" "),n("section",{staticClass:"section",attrs:{id:"timeline"}},[n("Timeline")],1)])}),[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"sticky-hero-attribution"},[n("p",{staticClass:"attribution"},[t._v("\n          Photo\n          "),n("a",{staticClass:"new",attrs:{href:"//commons.wikimedia.org/w/index.php?title=User:Afcarv&action=edit&redlink=1",title:"User:Afcarv (page does not exist)"}},[t._v("Anael Ferraz de Carvalho")]),t._v("\n          -\n          "),n("span",{staticClass:"int-own-work",attrs:{lang:"en"}},[t._v("Own work")]),t._v(",\n          "),n("a",{attrs:{href:"https://creativecommons.org/licenses/by-sa/3.0",title:"Creative Commons Attribution-Share Alike 3.0"}},[t._v("CC BY-SA 3.0")]),t._v(" "),n("a",{attrs:{href:"https://commons.wikimedia.org/w/index.php?curid=40439744"}},[t._v("Link")])])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"hero-html"},[n("section",{staticClass:"section description-content"},[n("p",{staticClass:"attribution"},[t._v("\n          Photo\n          "),n("a",{staticClass:"new",attrs:{href:"//commons.wikimedia.org/w/index.php?title=User:Afcarv&action=edit&redlink=1",title:"User:Afcarv (page does not exist)"}},[t._v("Anael Ferraz de Carvalho")]),t._v("\n          -\n          "),n("span",{staticClass:"int-own-work",attrs:{lang:"en"}},[t._v("Own work")]),t._v(",\n          "),n("a",{attrs:{href:"https://creativecommons.org/licenses/by-sa/3.0",title:"Creative Commons Attribution-Share Alike 3.0"}},[t._v("CC BY-SA 3.0")]),t._v(" "),n("a",{attrs:{href:"https://commons.wikimedia.org/w/index.php?curid=40439744"}},[t._v("Link")])])])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("figcaption",{staticClass:"attribution"},[t._v("\n        By "),n("a",{staticClass:"new",attrs:{href:"//commons.wikimedia.org/w/index.php?title=User:Rafa_Tecchio&action=edit&redlink=1",title:"User:Rafa Tecchio (page does not exist)"}},[t._v("Rafa Tecchio")]),t._v(" - "),n("span",{staticClass:"int-own-work",attrs:{lang:"en"}},[t._v("Own work")]),t._v(", "),n("a",{attrs:{href:"https://creativecommons.org/licenses/by-sa/3.0",title:"Creative Commons Attribution-Share Alike 3.0"}},[t._v("CC BY-SA 3.0")]),t._v(", "),n("a",{attrs:{href:"https://commons.wikimedia.org/w/index.php?curid=40644073"}},[t._v("Link")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticStyle:{"text-align":"center"}},[n("figure",{staticClass:"image image-fish"},[n("img",{attrs:{src:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Peixe_Frade.jpg/320px-Peixe_Frade.jpg",alt:"Salmeidas / CC BY-SA (https://creativecommons.org/licenses/by-sa/3.0)"}}),t._v(" "),n("figcaption",[t._v("\n          Peixe frade\n        ")])]),t._v(" "),n("figure",{staticClass:"image image-fish"},[n("img",{attrs:{src:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Mola_mola2.jpg/240px-Mola_mola2.jpg",alt:"OpenCage / CC BY-SA (https://creativecommons.org/licenses/by-sa/2.5)"}}),t._v(" "),n("figcaption",[t._v("\n          Peixe lua\n        ")])]),t._v(" "),n("figure",{staticClass:"image image-fish"},[n("img",{attrs:{src:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Tartaruga_da_Laje.jpg/320px-Tartaruga_da_Laje.jpg",alt:"Ronaldo art [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons"}}),t._v(" "),n("figcaption",[t._v("\n          Tartaruga de pente\n        ")])]),t._v(" "),n("figure",{staticClass:"image image-fish"},[n("img",{attrs:{src:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Dactylopterus_volitans.jpg/320px-Dactylopterus_volitans.jpg",alt:"cralize / CC BY-SA (http://creativecommons.org/licenses/by-sa/3.0/)"}}),t._v(" "),n("figcaption",[t._v("\n          Coió\n        ")])])])}],!1,null,"03ffdd74",null));e.default=L.exports}}]);