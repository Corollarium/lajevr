(window.webpackJsonp=window.webpackJsonp||[]).push([[17,14],{179:function(e,t,n){"use strict";n.r(t);var o={data:function(){return{headerOverlay:!1,head:{title:"",description:""}}},watch:{headerOverlay:function(e,t){this.$root.$emit("headerOverlay",e)}},mounted:function(){this.$root.$emit("headerOverlay",this.headerOverlay)},head:function(){return{title:this.head.title,meta:[{hid:"description",name:"description",content:this.head.description}]}}},r=n(3),component=Object(r.a)(o,(function(){var e=this.$createElement;return(this._self._c||e)("div")}),[],!1,null,null,null);t.default=component.exports},182:function(e,t,n){e.exports=n.p+"img/4b4a30d.svg"},184:function(e,t,n){var content=n(205);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(16).default)("ebc27f4a",content,!0,{sourceMap:!1})},204:function(e,t,n){"use strict";var o=n(184);n.n(o).a},205:function(e,t,n){var o=n(15),r=n(73),c=n(182);t=o(!1);var d=r(c);t.push([e.i,".object-embed-3d[data-v-3ac71508]{position:relative;cursor:move;width:100%}.object-embed-3d:hover .object-embed-icon[data-v-3ac71508]{opacity:0;transition:opacity .5s ease-in-out}.object-embed-3d .object-embed-icon[data-v-3ac71508]{background-image:url("+d+");width:100%;height:100%;z-index:10;position:absolute;background-repeat:no-repeat;background-position:50%;background-size:contain;pointer-events:none;transition:opacity .5s ease-in-out}.object-embed-3d .object-embed-icon[data-v-3ac71508]:hover{opacity:0;transition:opacity .5s ease-in-out}",""]),e.exports=t},206:function(e,t,n){var content=n(259);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(16).default)("f9381068",content,!0,{sourceMap:!1})},209:function(e,t,n){"use strict";var o=n(180),r=n(199),c=n(216),d={props:{model:{type:String,required:!0},attribution:{type:String,required:!1,default:""},link:{type:String,required:!1,default:null},backgroundColor:{type:String,required:!1,default:""}},data:function(){return{renderer:null}},mounted:function(){var e=this,t=this.$el,n=new o.PerspectiveCamera(75,t.clientWidth/t.clientHeight,1,2e4);n.position.set(0,0,150),n.lookAt(0,0,0);var d=new o.Scene;this.backgroundColor?(d.background=new o.Color(this.backgroundColor),this.renderer=new o.WebGLRenderer({powerPreference:"high-performance"})):(d.background=null,this.renderer=new o.WebGLRenderer({alpha:!0,powerPreference:"high-performance"}),this.renderer.setClearColor(16777215,0)),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(t.clientWidth,t.clientHeight);var l=new r.a(n,this.renderer.domElement);l.autoRotate=!0,l.autoRotateSpeed=1;var m=new o.AmbientLight(13421772,.8);d.add(m);var v,h,f=new o.DirectionalLight(16777215,.8);f.position.set(0,1,0).normalize(),d.add(f),(new c.a).load(this.model,(function(e){h=e.scene,d.add(h),(v=new o.AnimationMixer(h)).clipAction(e.animations[0]).play()}),(function(e){}),(function(e){})),t.appendChild(this.renderer.domElement);window.addEventListener("resize",(function(){n.aspect=t.clientWidth/window.innerHeight,n.updateProjectionMatrix(),l.update(),e.renderer.setSize(t.clientWidth,window.innerHeight)}),!1);var _=0;var C=!0,A=function(){C&&e.renderer.render(d,n)};!function animate(time){var dt=(time-_)/1e3;requestAnimationFrame(animate),v&&v.update(dt),l.update(),h&&(n.position.y+=.8*Math.sin(time/2e3)),A(),_=time}(),this.observer=new IntersectionObserver((function(e,t){e.forEach((function(e){C=e.intersectionRatio>=.05}))}),{threshold:[0,.05]}),this.observer.observe(this.renderer.domElement)},beforeDestroy:function(){this.observer.unobserve(this.renderer.domElement),this.observer=null,this.renderer.forceContextLoss(),this.renderer.domElement=null,this.renderer=null}},l=(n(204),n(3)),component=Object(l.a)(d,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"object-embed-3d"},[n("div",{staticClass:"object-embed-icon"}),e._v(" "),n("p",{staticClass:"attribution"},[e.link?n("a",{attrs:{href:e.link,target:"_blank"}},[e._v("\n      "+e._s(e.attribution)+"\n    ")]):n("span",[e._v("\n      "+e._s(e.attribution)+"\n    ")])])])}),[],!1,null,"3ac71508",null);t.a=component.exports},248:function(e,t,n){e.exports=n.p+"img/3b52d8d.jpg"},249:function(e,t,n){e.exports=n.p+"img/5d63aa1.jpg"},250:function(e,t,n){e.exports=n.p+"img/e96eeca.jpg"},251:function(e,t,n){e.exports=n.p+"img/62ec452.jpg"},252:function(e,t,n){e.exports=n.p+"img/f5284b8.jpeg"},253:function(e,t,n){e.exports=n.p+"img/723f74f.jpeg"},254:function(e,t,n){e.exports=n.p+"img/a678a2c.jpg"},255:function(e,t,n){e.exports=n.p+"img/d72f55e.jpg"},256:function(e,t,n){e.exports=n.p+"img/8a1572d.jpg"},257:function(e,t,n){e.exports={srcSet:n.p+"img/43191fb-360.jpg 360w,"+n.p+"img/17f4de1-640.jpg 640w,"+n.p+"img/92fd38d-1080.jpg 1080w",images:[{path:n.p+"img/43191fb-360.jpg",width:360,height:270},{path:n.p+"img/17f4de1-640.jpg",width:640,height:480},{path:n.p+"img/92fd38d-1080.jpg",width:1080,height:810}],src:n.p+"img/43191fb-360.jpg",toString:function(){return n.p+"img/43191fb-360.jpg"},placeholder:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx4BBQUFBwYHDggIDh4UERQeHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHv/AABEIAB4AKAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APSPCniSxlRII7hIXJ/vDp7YHNfoWKwzlra5+fYXFxStex0f/CWQCFX08RX3lzeXcDzlQxjnLYNeW8E22noeqswSStqTat400u1W4jjdXnhCHYzBc7yMHk++aingJtq7NKmZQinZGRqPjK2+zKZnWN1J81FYFsc9ME+3euuGC5W2jiqZhzKzPLvF/iYXEoMdwJYkRlYsoUuDjH+NehCKR5dSo27Hnllq9x5AiMhVlwQ4JIXHTpj3pKtJpRe4nQSfMjfsvE/nWkkUlxCg3bNom5kBGScev48elEa7lUs9hToOMLrcU6qiz/ag6iUxBXbcTkYA5zzS2i5bi1cuVaEs2s213NevJexW8sUe9FKH97kgFR6HvzUqrZKKVynScrybschq+pW89v5UexAFKkIxORyMmsqc7pxbOiVOzUrGALkqVcqE3jIcDOffk/pXPGXNrHU6nC2jCVpZkgCXkfykZXZheN3zfXGB/kVzunNysjVSik7lxL5o4sbw5HB5r0ad1G3U4ZwTlfoMuL9TEWDYIHI9B60/aKKd0NUm3oY13eYBVGyDzkGojUg9kdCpvqVFkaO3y3IEe5cHoD/WuPnXs7R0OnlvPUni1NTZ+V5OePkOenTmtMPFr3kzOrC7BZpDbGYHgHHvW6qpz5TN07DDJHJYXDOZN6qCuOnUDn9axq1JSlyGsKai0zP1ByCrhVAxnA96Uouy8jWlZtn/2Q==",width:360,height:270}},258:function(e,t,n){"use strict";var o=n(206);n.n(o).a},259:function(e,t,n){(t=n(15)(!1)).push([e.i,".especie-info[data-v-237056a7]{font-style:italic;margin:0 0 1em}.especie-info p[data-v-237056a7]{margin:0}",""]),e.exports=t},294:function(e,t,n){"use strict";n.r(t);var o=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"topbar-sticky"},[n("ul",{staticClass:"pure-menu-list horizontal-menu topbar-list"},[n("li",{staticClass:"pure-menu-item topbar-list-item",attrs:{"data-target":"intro"}},[n("a",{staticClass:"pure-menu-link",attrs:{href:"#intro"}},[e._v("Introdução")])]),e._v(" "),n("li",{staticClass:"pure-menu-item topbar-list-item",attrs:{"data-target":"raias"}},[n("a",{staticClass:"pure-menu-link",attrs:{href:"#manta"}},[e._v("Raias")])]),e._v(" "),n("li",{staticClass:"pure-menu-item topbar-list-item",attrs:{"data-target":"turtles"}},[n("a",{staticClass:"pure-menu-link",attrs:{href:"#turtles"}},[e._v("Tartarugas")])]),e._v(" "),n("li",{staticClass:"pure-menu-item topbar-list-item",attrs:{"data-target":"dolphins"}},[n("a",{staticClass:"pure-menu-link",attrs:{href:"#dolphins"}},[e._v("Golfinhos")])]),e._v(" "),n("li",{staticClass:"pure-menu-item topbar-list-item",attrs:{"data-target":"birds"}},[n("a",{staticClass:"pure-menu-link",attrs:{href:"#birds"}},[e._v("Aves")])])])])},function(){var e=this.$createElement,t=this._self._c||e;return t("section",{staticClass:"section-text"},[t("h1",[this._v("\n        Raias\n      ")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("section",{staticClass:"section-base section-text"},[t("h2",[this._v("\n        Raia-Manta\n      ")]),this._v(" "),t("div",{staticClass:"especie-info"},[t("p",[this._v("Espécie: Mobula birostris")]),this._v(" "),t("p",[this._v("Estado de conservação: Vulnerável a extinção")])])])},function(){var e=this.$createElement,t=this._self._c||e;return t("figure",{staticClass:"figure-text"},[t("img",{attrs:{alt:"Tartaruga de pente",src:n(248)}}),this._v(" "),t("figcaption",[t("p",[this._v("\n          Um mergulhador fotografa duas raias mantas na Laje de Santos. Foto: Nauther Andres\n        ")])])])},function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("section",{staticClass:"section-base section-text"},[o("h2",[e._v("\n        Raia-chita\n      ")]),e._v(" "),o("div",{staticClass:"especie-info"},[o("p",[e._v("Espécie: Aetobatus narinari")]),e._v(" "),o("p",[e._v("Estado de conservação: Quase ameaçada")])]),e._v(" "),o("p",[e._v("\n        Vive em quase todos os oceanos, mas na Laje pode ser vista quase o ano\n        todo, onde seus indivíduos são inclusive reconhecidos pelos\n        mergulhadores mais frequentes, graças ao padrão único de pintas nas\n        costas. Pode viver até 18 anos. Pode ser vista navegando sozinha ou em\n        cardumes com mais de 20 indivíduos, e muitas vezes saltando para fora\n        d’água, se alimentam de pequenos crustáceos e moluscos bivalves\n        (animais de duas conchas) sua mandíbula é extremamente forte capaz de\n        triturar carapaças e conchas.\n      ")]),e._v(" "),o("figure",{staticClass:"figure-text"},[o("img",{attrs:{alt:"Raia Chita",src:n(249)}}),e._v(" "),o("figcaption",[o("p",[e._v("\n            Raia Chita\n          ")])])])])},function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("section",{staticClass:"section-base section-text"},[o("h2",[e._v("\n        Raia-prego\n      ")]),e._v(" "),o("div",{staticClass:"especie-info"},[o("p",[e._v("Espécie: Dasyatis centroura")]),e._v(" "),o("p",[e._v("Estado de conservação: pouco preocupante")])]),e._v(" "),o("p",[e._v("\n        As raias-prego, ou raias manteiga como são conhecidas pelos\n        mergulhadores, sempre dão show quando encontradas. São animais de\n        corpo achatado associados ao substrato ou fundo de areia, pois\n        geralmente param ali e jogam a areia por cima de seu corpo para se\n        camuflarem e desta forma descansarem.\n      ")]),e._v(" "),o("p",[e._v("\n        Dizem que as raias e os tubarões não podem parar de nadar por que\n        podem morrer afogados, mas nem tudo é verdade. No caso de algumas\n        espécies de raias, quando estão paradas, elas abrem e fecham o\n        opérculo, órgão responsável por sua respiração, sugando a água que\n        passa por suas brânquias fazendo a troca de oxigênio. Apesar de não\n        atacarem pessoas, por causa deste comportamento de se enterrar na\n        areia e permanecer muitas vezes em águas rasas, ocorrem alguns\n        acidentes pelo mundo afora pelo seu ferrão venenoso. Foi o caso do\n        zoólogo e apresentador de TV Steve Irwin, conhecido mundialmente como\n        Caçador de Crocodilos, que faleceu por uma ferroada acidental de raia\n        do gênero Dasyatis.\n      ")]),e._v(" "),o("figure",{staticClass:"figure-text"},[o("div",{attrs:{bp:"grid"}},[o("div",{attrs:{bp:"6"}},[o("img",{attrs:{alt:"Raia prego",src:n(250)}})]),e._v(" "),o("div",{attrs:{bp:"6"}},[o("img",{attrs:{alt:"Raia prego",src:n(251)}})])]),e._v(" "),o("figcaption",[o("p",[e._v("\n            Na Laje de Santos raias-prego aparecem em determinadas épocas do ano e\n            geralmente estão prenhas ou grávidas como na foto. A\n            gravidez das raias é perceptível pelo ventre e pelo dorso\n            deixando-as protuberantes em ambos os lados.\n          ")])])])])},function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("section",{staticClass:"section-base section-text"},[o("h2",[e._v("\n        Raia-borboleta\n      ")]),e._v(" "),o("div",{staticClass:"especie-info"},[o("p",[e._v("Espécie: Gymnura altavela")]),e._v(" "),o("p",[e._v("Estado de conservação: Vulnerável a extinção e decaindo")])]),e._v(" "),o("p",[e._v("\n        A raia-borboleta pode ser encontrada em todo o oceano atlântico, mar\n        negro e nas Ilhas da Madeira e Ilhas Canárias. Podem ser vistas de 5 a\n        100 metros de profundidade, e na Laje de Santos são vistas nas\n        estações primavera e verão, utilizando a região para descanso no\n        período reprodutivo.\n      ")]),e._v(" "),o("p",[e._v("\n        Como a maioria das raias, elas também possuem o comportamento de se\n        camuflarem no fundo de areia, cobrindo todo seu corpo com uma fina\n        camada de sedimentos para se protegerem de possíveis predadores. Todos\n        os anos as encontramos e geralmente as fêmeas estão grávidas, o que é\n        possível saber por ficarem com o dorso proeminente.\n      ")]),e._v(" "),o("figure",{staticClass:"figure-text"},[o("div",{attrs:{bp:"grid"}},[o("div",{attrs:{bp:"6"}},[o("img",{attrs:{alt:"Raia borboleta",src:n(252)}})]),e._v(" "),o("div",{attrs:{bp:"6"}},[o("img",{attrs:{alt:"Raia borboleta",src:n(253)}})])]),e._v(" "),o("figcaption",[o("p",[e._v("\n            Raias-borboleta. Pode ser bem difícil diferenciar o macho da\n            fêmea, mas, um detalhe importante sobre os peixes cartilaginosos\n            ou raias e tubarões, é que os machos possuem dois clásperes ou\n            (pênis) que é possível ser visualizado na base da cauda dos machos\n            e ausente nas fêmeas. Fotos: "),o("a",{attrs:{href:"https://www.instagram.com/marcelomigliari/",target:"_blank"}},[e._v("Marcelo Migliari")])])])])])},function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("section",{staticClass:"section-index",attrs:{id:"turtles"}},[o("section",{staticClass:"section-base section-text"},[o("h2",[e._v("\n        Tartarugas\n      ")]),e._v(" "),o("p",[e._v("\n        Existem duas espécies de tartarugas que frequentam a Laje de Santos, a\n        Tartaruga-verde e a tartaruga-de-pente. São parecidas, mas alguns\n        detalhes são importantes para diferenciá-las: no caso da\n        tartaruga-de-pente, apresentam cabeça mais fina e comprida, bico como de\n        falcão, placas do casco sobrepostas ou imbricadas como telha, coloração\n        marrom amarelada, o casco geralmente bem ornamentado. Já as tartarugas\n        verdes possuem o casco mais simétrico, com placas intercaladas e\n        conectadas como um quebra-cabeça, cabeça arredondada e coloração do\n        casco predominante do verde e marrom, para amarelo claro em seu ventre.\n      ")])]),e._v(" "),o("figure",{staticClass:"figure-text"},[o("div",{attrs:{bp:"grid"}},[o("div",{attrs:{bp:"6"}},[o("img",{attrs:{alt:"Tartaruga de pente",src:n(254)}})]),e._v(" "),o("div",{attrs:{bp:"6"}},[o("img",{attrs:{alt:"Tartaruga verde",src:n(255)}})])]),e._v(" "),o("figcaption",[o("p",[e._v("\n          Tartaruga verde (à esquerda)\n          e tartaruga de pente (à direita).\n        ")])])]),e._v(" "),o("section",{staticClass:"section-base section-text"},[o("p",[e._v('\n        Graças à beleza do casco, as tartarugas-de-pente foram extremamente\n        caçadas e quase chegaram à extinção. Seu casco era utilizados para fazer\n        utensílios como porta-jóias e objetos como pentes, daí seu nome popular\n        "tartaruga-de-pente".\n      ')]),e._v(" "),o("p",[e._v("\n        Como são animais de vida longa, atingindo a maturidade sexual após os 30\n        anos, as tartarugas encontradas na Laje de Santos são animais juvenis\n        utilizando a área para alimentação e abrigo.\n      ")])])])},function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("section",{staticClass:"section-index",attrs:{id:"dolphins"}},[o("section",{staticClass:"section-base section-text"},[o("h2",[e._v("\n        Golfinhos\n      ")]),e._v(" "),o("p",[e._v("\n        Duas espécies de golfinhos habitam a Laje de Santos. É comum vê-los durante a travessia de barco, em pequenos grupos que\n        aparecem, acompanham o barco por alguns minutos e de novo somem em mar aberto, parecendo nos recepcionar.\n      ")]),e._v(" "),o("p",[e._v("\n        O Golfinho nariz de garrafa\n      ")]),e._v(" "),o("p",[e._v("\n        O Golfinho pintado do Atlântico.\n      ")]),e._v(" "),o("figure",{staticClass:"figure-text"},[o("img",{attrs:{src:n(256)}}),e._v(" "),o("figcaption",[o("p",[e._v("\n            Golfinhos\n          ")])])])])])},function(){var e=this.$createElement,t=this._self._c||e;return t("section",{staticClass:"section-index",attrs:{id:"birds"}},[t("section",{staticClass:"section-base section-text"},[t("h2",[this._v("\n        Aves\n      ")]),this._v(" "),t("p",[this._v("\n        29 espécies de aves já foram catalogadas na Laje.\n      ")])])])}],r=n(215),c=n.n(r),d=n(179),l=n(209),m=n(257),v={components:{GLTFModel:l.a},extends:d.default,data:function(){return{imageCardume:m,lms:null,rellax:null}},mounted:function(){this.head.title=this.$gettext("Vida na Laje de Santos"),this.head.description=this.$gettext("Sobre seres vivos na Laje de Santos"),this.rellax=new c.a(".rellax"),this.asideMenu()},methods:{asideMenu:function(){if("IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"intersectionRatio"in window.IntersectionObserverEntry.prototype){var e=new IntersectionObserver((function(e,t){e.forEach((function(e){var t=document.querySelector('.topbar-list-item[data-target="'+e.target.id+'"] .pure-menu-link');e.intersectionRatio>=.1?t.classList.add("is-active"):t.classList.remove("is-active")}))}),{threshold:[.1,.9]});document.querySelectorAll("section.section-index").forEach((function(t){e.observe(t)}))}}}},h=(n(258),n(3)),component=Object(h.a)(v,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("article",[n("section",{staticClass:"hero"},[n("div",{staticClass:"hero-body"},[n("img",{attrs:{src:e.imageCardume.src,srcset:e.imageCardume.srcSet,alt:"Cardume"}})]),e._v(" "),n("div",{staticClass:"hero-html"},[n("h1",[n("i18n",[e._v("\n          A vida na Laje de Santos\n        ")])],1),e._v(" "),n("p",{staticClass:"attribution"},[n("i18n",[e._v("\n          Foto\n        ")]),e._v(" "),n("a",{attrs:{target:"_blank",href:"https://www.instagram.com/nautherandres/"}},[e._v("Nauther Andres")])],1)])]),e._v(" "),n("div",{staticClass:"rellax"},[e._v('\n    I’m that default chill speed of "-2"\n  ')]),e._v(" "),n("div",{staticClass:"rellax",attrs:{"data-rellax-speed":"7"}},[e._v("\n    I’m super fast!!\n  ")]),e._v(" "),n("div",{staticClass:"rellax",attrs:{"data-rellax-speed":"-4"}},[e._v("\n    I’m extra slow and smooth\n  ")]),e._v(" "),e._m(0),e._v(" "),n("section",{staticClass:"section-index section-base section-text",attrs:{id:"intro"}},[n("p",[n("i18n",[e._v("\n        A Laje de Santos é rica em vida. 196 espécies de peixes e 29 espécies de aves já foram catalogadas.\n        É também habitada por corais, algas e outras formas de vida. Há muitas áreas com algas marrons e vermelhas.\n      ")]),e._v(" "),n("nuxt-link",{attrs:{to:"/especies"}},[n("i18n",[e._v("Se estiver procurando espécies, veja a lista completa.")])],1)],1)]),e._v(" "),n("section",{staticClass:"section-index",attrs:{id:"raias"}},[e._m(1),e._v(" "),e._m(2),e._v(" "),e._m(3),e._v(" "),n("section",{staticClass:"section-base section-text"},[n("p",[e._v("\n        Reconhecida como a maior espécie de raia do mundo, podendo ultrapassar\n        os 8 metros de envergadura de uma nadadeira a outra e pesar mais de 2\n        mil quilos, a raia manta não possui ferrão. É o peixe com o maior\n        cérebro de todos os outros peixes do mar, por isso é extremamente\n        inteligente, um animal muito dócil e curioso. Quando encontra um\n        mergulhador, permite a interação e por vezes permanece por vários\n        minutos nadando ao seu redor para saber o que é. As bolhas de ar dos\n        mergulhadores parecem fazer cócegas em sua barriga\n      ")]),e._v(" "),n("div",{staticClass:"model-container",staticStyle:{"min-height":"70vh"}},[n("GLTFModel",{attrs:{model:"./models/manta/scene.gltf",link:"https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8",attribution:"Modelo 3D CC BY-NC por misaooo"}})],1),e._v(" "),n("p",[e._v("\n        Podem ser\n        encontradas nas zonas tropicais e subtropicais do planeta. Na laje de\n        Santos aparecem no período de inverno, nos meses de abril a setembro. As\n        mantas são identificadas individualmente através de fotografia das\n        manchas ventrais que formam padrões únicos. Esses dados são inserido em\n        bancos de dados brasileiro e mundial para organização, assim é possível\n        a quantificação de números populacionais.\n      ")]),e._v(" "),n("p",[e._v("\n        Durante as suas migrações, as jamantas efetuam mergulhos frequentes até\n        profundidades de quase dois quilômetros (entre os maiores alguma vez\n        medidos para um animal marinho), onde as temperaturas da água atingem os\n        três graus centígrados.\n      ")])]),e._v(" "),e._m(4),e._v(" "),e._m(5),e._v(" "),e._m(6)]),e._v(" "),e._m(7),e._v(" "),e._m(8),e._v(" "),e._m(9)])}),o,!1,null,"237056a7",null);t.default=component.exports}}]);