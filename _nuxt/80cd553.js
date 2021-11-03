(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{449:function(t,e,n){"use strict";n.r(e);n(135),n(36),n(92),n(34),n(71),n(72);var r=n(285),o=n.n(r),l=(n(286),n(192)),c=n(227).filter((function(i){return"size"in i})),v={components:{ThumbImg:n(251).a},extends:l.default,data:function(){return{email:"email@corollarium.com",animals:c,filterColor:"",filterSearch:"",minRange:null,maxRange:null,slider:{range:{min:0,max:300},step:6,margin:6,start:[0,300],connect:!0,pips:{mode:"count",values:7,density:4}},showModal:!1}},computed:{filteredAnimals:function(){var t=this,e=this.filterSearch?new RegExp(this.filterSearch,"i"):null;return this.animals.filter((function(i){return(!e||-1!==i.name.search(e)||-1!==i.description.search(e))&&(!(i.size<t.minRange||i.size>t.maxRange)&&!(t.filterColor&&!i.colors.includes(t.filterColor)))}),this)},base:function(){return this.$router.options.base}},mounted:function(){var t=this;this.head.title=this.$gettext("Espécies da Laje de Santos"),this.head.description=this.$gettext("Espécies aviáticas e aquáticas da Laje de Santos"),o.a.create(this.$refs.slider,this.slider),this.$refs.slider.noUiSlider.on("update",(function(e,n){t.minRange=parseInt(e[0],10),t.maxRange=parseInt(e[1],10)}))},methods:{showModalClick:function(i){this.showModal=!0}}},d=n(4),component=Object(d.a)(v,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("article",{attrs:{bp:"container"}},[n("div",{staticClass:"filter-header",attrs:{bp:"grid"}},[n("div",{attrs:{bp:"12 6@md 5@lg"}},[n("h1",{staticClass:"subpage-title"},[n("i18n",[t._v("Espécies")])],1),t._v(" "),n("p",[n("i18n",[t._v("Foram já identificadas 196 espécies de peixes na Laje de Santos.")]),t._v(" "),n("i18n",[t._v("Você tem imagens da Laje de Santos? Mande para nosso projeto:")]),t._v(" "+t._s(t.email)+".\n      ")],1)]),t._v(" "),n("form",{staticClass:"filter-form",attrs:{id:"filters",bp:"12 6@md 7@lg"}},[n("div",{attrs:{bp:"grid"}},[n("div",{attrs:{bp:"6 7@md 4@lg"}},[n("label",{staticClass:"label"},[n("i18n",[t._v("\n              Filtrar pelo nome\n            ")])],1),t._v(" "),n("div",[n("input",{directives:[{name:"model",rawName:"v-model",value:t.filterSearch,expression:"filterSearch"}],staticClass:"input",attrs:{type:"text",placeholder:"Digite o nome"},domProps:{value:t.filterSearch},on:{input:function(e){e.target.composing||(t.filterSearch=e.target.value)}}})])]),t._v(" "),n("div",{attrs:{bp:"6 5@md 3@lg"}},[n("label",[n("i18n",[t._v("\n              Cor\n            ")])],1),t._v(" "),n("div",[n("div",[n("select",{directives:[{name:"model",rawName:"v-model",value:t.filterColor,expression:"filterColor"}],class:t.filterColor,on:{change:function(e){var n=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){return"_value"in t?t._value:t.value}));t.filterColor=e.target.multiple?n:n[0]}}},[n("option",{directives:[{name:"translate",rawName:"v-translate"}],attrs:{value:""}},[t._v("\n                  Todas as cores\n                ")]),t._v(" "),n("option",{directives:[{name:"translate",rawName:"v-translate"}],attrs:{value:"black"}},[t._v("\n                  Preto\n                ")]),t._v(" "),n("option",{directives:[{name:"translate",rawName:"v-translate"}],attrs:{value:"blue"}},[t._v("\n                  Azul\n                ")]),t._v(" "),n("option",{directives:[{name:"translate",rawName:"v-translate"}],attrs:{value:"red"}},[t._v("\n                  Vermelho\n                ")]),t._v(" "),n("option",{directives:[{name:"translate",rawName:"v-translate"}],attrs:{value:"yellow"}},[t._v("\n                  Amarelo\n                ")]),t._v(" "),n("option",{directives:[{name:"translate",rawName:"v-translate"}],attrs:{value:"orange"}},[t._v("\n                  Laranja\n                ")]),t._v(" "),n("option",{directives:[{name:"translate",rawName:"v-translate"}],attrs:{value:"white"}},[t._v("\n                  Branco\n                ")]),t._v(" "),n("option",{directives:[{name:"translate",rawName:"v-translate"}],attrs:{value:"grey"}},[t._v("\n                  Cinza\n                ")]),t._v(" "),n("option",{directives:[{name:"translate",rawName:"v-translate"}],attrs:{value:"brown"}},[t._v("\n                  Marrom\n                ")])])])])]),t._v(" "),n("div",{attrs:{bp:"12 5@lg"}},[n("label",{staticStyle:{"text-align":"center"}},[n("i18n",[t._v("\n              Tamanho (em cm)\n            ")])],1),t._v(" "),n("div",{staticClass:"range-slider",attrs:{id:"slider-container"}},[n("div",{staticClass:"outputs"},[n("output",[t._v(t._s(t.minRange))]),t._v(" "),n("output",{staticStyle:{float:"right"}},[t._v(t._s(t.maxRange))])]),t._v(" "),n("div",{ref:"slider",attrs:{id:"slider"}})])])])])]),t._v(" "),n("transition-group",{staticClass:"section-article",attrs:{name:"fauna-list",tag:"div",bp:"grid 12 6@sm 4@md 3@lg"}},t._l(t.filteredAnimals,(function(a){return n("div",{key:a.name,staticClass:"card fauna-card"},[n("figure",[n("thumb-img",{staticClass:"fauna-image",attrs:{src:a.suburl}}),t._v(" "),a.creator?n("figcaption",{staticClass:"attribution"},[n("i18n",[t._v("foto por")]),t._v(" "),n("a",{attrs:{href:a.creatorLink,target:"_blank"}},[t._v(t._s(a.creator))]),t._v(" "+t._s(a.license)+"\n        ")],1):t._e()],1),t._v(" "),n("div",{staticClass:"fauna-name"},[t._v("\n        "+t._s(a.name)+"\n      ")]),t._v(" "),n("div",{staticClass:"fauna-info"},[n("span",{staticClass:"fauna-other-names"},[t._v("\n          "+t._s(a.othernames)+"\n        ")]),t._v(" "),n("p",{staticClass:"fauna-size"},[n("font-awesome-icon",{attrs:{icon:["fas","ruler"]}}),t._v("\n          "+t._s(a.size)+" cm\n        ")],1)]),t._v(" "),a.description?n("p",{staticClass:"fauna-description"},[n("font-awesome-icon",{attrs:{icon:["fas","info-circle"]}}),t._v("\n        "+t._s(a.description)+"\n      ")],1):t._e(),t._v(" "),n("span",{staticClass:"open-modal"},[n("a",{attrs:{href:"/galeria?filter="+a.name}},[n("font-awesome-icon",{attrs:{icon:["fas","photo-video"]}}),t._v(" "),n("i18n",[t._v("Ver imagens")])],1),t._v(" "),a.about?n("a",{attrs:{href:a.about}},[n("font-awesome-icon",{attrs:{icon:["fas","book"]}}),t._v(" "),n("i18n",[t._v("Mais detalhes")])],1):t._e()])])})),0),t._v(" "),n("div",[n("h2",[n("i18n",[t._v("Bibliografia")])],1),t._v(" "),t._m(0)]),t._v(" "),n("transition",{attrs:{name:"fade-in-up"}},[t.showModal?n("div",{staticClass:"modal-window",attrs:{name:"modal"}},[n("div",{staticClass:"modal-inner"},[n("span",{staticClass:"modal-close",attrs:{title:"Close"},on:{click:function(e){t.showModal=!1}}},[t._v("X")]),t._v("\n        outras fotos do mesmo animal\n      ")])]):t._e()])],1)}),[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("ul",[n("li",[n("a",{attrs:{target:"_blank",href:"https://www.semanticscholar.org/paper/The-reef-fish-assemblage-of-the-Laje-de-Santos-with-Luiz-Carvalho-Filho/53b6a911443d42724e6c0e75ff5eeebbc7c4ab59"}},[t._v("Luiz, Osmar J., Alfredo Carvalho-Filho, Carlos E. L. Ferreira, Sergio R. Floeter, João Luiz Gasparini and Ivan Sazima. “The reef fish assemblage of the Laje de Santos Marine State Park, Southwestern Atlantic: annotated checklist with comments on abundance, distribution, trophic structure, symbiotic associations, and conservation.” (2008)")])]),t._v(" "),n("li",[n("a",{attrs:{target:"_blank",href:"https://smastr16.blob.core.windows.net/consema/2018/11/e-laje-de-santos-plano-de-manejo.pdf"}},[t._v("\n          Laje de Santos, plano de manejo.\n        ")])])])}],!1,null,null,null);e.default=component.exports}}]);