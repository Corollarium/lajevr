(window.webpackJsonp=window.webpackJsonp||[]).push([[19,15],{192:function(t,e,n){"use strict";n.r(e);var o={data:function(){return{headerOverlay:!1,head:{title:"",description:""}}},watch:{headerOverlay:function(t,e){this.$root.$emit("headerOverlay",t)}},mounted:function(){this.$root.$emit("headerOverlay",this.headerOverlay)},head:function(){return{title:this.head.title,meta:[{hid:"description",name:"description",content:this.head.description}]}}},r=n(4),component=Object(r.a)(o,(function(){var t=this.$createElement;return(this._self._c||t)("div")}),[],!1,null,null,null);e.default=component.exports},200:function(t,e,n){var content=n(211);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(33).default)("1d3bd654",content,!0,{sourceMap:!1})},208:function(t,e,n){"use strict";var o=n(28),r=n(91),h=n(15);t.exports=function(t){for(var e=o(this),n=h(e.length),l=arguments.length,c=r(l>1?arguments[1]:void 0,n),d=l>2?arguments[2]:void 0,f=void 0===d?n:r(d,n);f>c;)e[c++]=t;return e}},210:function(t,e,n){"use strict";n(200)},211:function(t,e,n){var o=n(32)(!1);o.push([t.i,".swimming-fish{position:relative;z-index:-1}.flip{transform:scaleX(-1)}@-webkit-keyframes swim{0%{margin-left:-235px}to{margin-left:calc(100% + 235px)}}@keyframes swim{0%{margin-left:-235px}to{margin-left:calc(100% + 235px)}}.fish{top:5em;overflow:visible;width:235px;height:104px;margin-left:-235px;position:absolute;-webkit-animation:swim 20s;animation:swim 20s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-timing-function:linear;animation-timing-function:linear}svg .fish1,svg .fish2,svg .fish3,svg .fish4,svg .fish5,svg .fish6{-webkit-animation:bounce 2s infinite;animation:bounce 2s infinite}svg .fish2{-webkit-animation-delay:.5s;animation-delay:.5s}svg .fish3{-webkit-animation-delay:.2s;animation-delay:.2s}svg .fish4{-webkit-animation-delay:.4s;animation-delay:.4s}svg .fish5{-webkit-animation-delay:.1s;animation-delay:.1s}svg .fish6{-webkit-animation-delay:.3s;animation-delay:.3s}@-webkit-keyframes bounce{0%,50%,to{transform:translateY(0)}25%{transform:translateY(-5px)}75%{transform:translateY(-3px)}}@keyframes bounce{0%,50%,to{transform:translateY(0)}25%{transform:translateY(-5px)}75%{transform:translateY(-3px)}}",""]),t.exports=o},214:function(t,e,n){var content=n(247);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(33).default)("1357fccf",content,!0,{sourceMap:!1})},215:function(t,e,n){"use strict";n(88);var o={props:{total:{type:Number,default:5},color:{type:String,default:"#325454"},flip:{type:Boolean,default:!1},opacity:{type:Number,default:1}}},r=(n(210),n(4)),component=Object(r.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{class:{"swimming-fish":!0,flip:t.flip}},[n("svg",{staticClass:"fish"},[n("path",{staticClass:"fish1",style:{fill:t.color,"fill-opacity":t.opacity},attrs:{d:"m 68.19699,20.522295 c 0.0489,-0.44418 -0.2178,-0.896934 -1.01784,-1.415715 -0.72801,-0.47505 -1.4826,-0.932949 -2.2149,-1.401138 -1.6035,-1.02813 -3.29018,-1.969653 -4.89798,-3.079245 C 55.39553,11.384887 49.845,10.221274 44.30305,9.4752582 42.0307,9.1888572 39.49082,9.3063332 37.58119,7.900907 36.09945,6.819613 33.53126,3.072384 30.71613,1.444869 30.22993,1.154181 27.94386,0 27.94386,0 c 0,0 1.30939,3.550006 1.60951,4.264295 0.69542,1.644664 -0.38158,3.063809 -0.83262,4.642447 -0.29069,1.0418502 2.13772,0.8129002 2.26463,1.782721 0.18179,1.432007 -4.15197,1.936211 -6.59152,2.417263 -3.65634,0.715146 -7.91635,2.082842 -11.56925,0.884072 C 8.52001,12.607667 5.45192,9.8611282 2.35895,6.755302 3.79696,13.480591 7.79715,17.358159 7.97465,18.177919 8.16072,19.083427 7.51504,19.269502 6.93366,19.860313 5.64399,21.125967 0.018,27.591438 0,29.641695 1.61379,29.39388 3.56115,27.980738 4.9803,27.155833 c 1.58035,-0.905509 7.60593,-5.373029 9.29347,-6.065023 0.38587,-0.160351 5.0549,-1.531476 5.09434,-0.932948 0.0695,0.932948 -0.30784,1.137031 -0.18436,1.527188 0.22638,0.746016 1.44144,1.46545 2.02282,1.985088 1.50918,1.292237 3.21044,2.42841 4.27373,4.156252 1.49203,2.401827 1.55805,4.999163 1.98251,7.677102 0.99469,-0.111473 2.0091,-2.17545 2.55961,-2.992638 0.51278,-0.772598 2.38639,-4.071359 3.09725,-4.275442 0.67227,-0.204082 2.75511,0.958673 3.50284,1.180763 2.85973,0.848057 5.644,1.353976 8.56032,1.353976 3.50799,0.0094 12.726,0.258104 19.55505,-4.800226 0.75545,-0.567658 2.55703,-2.731104 2.55703,-2.731104 0,0 -0.37644,-0.57709 -1.04785,-0.790605 0.89779,-0.584808 1.8659,-1.211633 1.94993,-1.925921 z"}}),t._v(" "),n("path",{staticClass:"fish2",style:{fill:t.color,"fill-opacity":t.opacity},attrs:{d:"m 172.04828,20.913839 c 0.0489,-0.444179 -0.2178,-0.896934 -1.01784,-1.415715 -0.72801,-0.475049 -1.4826,-0.932948 -2.2149,-1.401138 -1.6035,-1.028129 -3.29018,-1.969653 -4.89798,-3.079244 -4.67074,-3.24131 -10.22127,-4.404923 -15.76322,-5.1509392 -2.27235,-0.286401 -4.81223,-0.168925 -6.72186,-1.574351 -1.48174,-1.081294 -4.04993,-4.828523 -6.86506,-6.456038 -0.4862,-0.290688 -2.77227,-1.44486897 -2.77227,-1.44486897 0,0 1.30939,3.55000597 1.60951,4.26429497 0.69542,1.644664 -0.38158,3.063809 -0.83262,4.642447 -0.29069,1.0418502 2.13772,0.8129002 2.26463,1.7827212 0.18179,1.432007 -4.15197,1.936211 -6.59152,2.417263 -3.65634,0.715146 -7.91635,2.082841 -11.56925,0.884071 -4.3046,-1.38313 -7.37269,-4.129669 -10.46566,-7.2354952 1.43801,6.7252892 5.4382,10.6028562 5.6157,11.4226162 0.18607,0.905509 -0.45961,1.091584 -1.04099,1.682394 -1.28967,1.265655 -6.91566,7.731125 -6.93366,9.781383 1.61379,-0.247815 3.56115,-1.660957 4.9803,-2.485862 1.58035,-0.905509 7.60593,-5.373029 9.29347,-6.065023 0.38587,-0.160351 5.0549,-1.531476 5.09434,-0.932949 0.0695,0.932949 -0.30784,1.137031 -0.18436,1.527189 0.22638,0.746016 1.44144,1.465449 2.02282,1.985088 1.50918,1.292237 3.21044,2.42841 4.27373,4.156252 1.49203,2.401827 1.55805,4.999163 1.98251,7.677102 0.99469,-0.111473 2.0091,-2.17545 2.55961,-2.992638 0.51278,-0.772598 2.38639,-4.07136 3.09725,-4.275442 0.67227,-0.204082 2.75511,0.958673 3.50284,1.180763 2.85973,0.848057 5.644,1.353976 8.56032,1.353976 3.50799,0.0094 12.726,0.258104 19.55505,-4.800226 0.75545,-0.567658 2.55703,-2.731104 2.55703,-2.731104 0,0 -0.37644,-0.577091 -1.04785,-0.790605 0.89779,-0.584808 1.8659,-1.211633 1.94993,-1.925922 z"}}),t._v(" "),n("path",{staticClass:"fish3",style:{fill:t.color,"fill-opacity":t.opacity},attrs:{d:"m 234.99441,42.953992 c 0.0489,-0.44418 -0.2178,-0.896934 -1.01784,-1.415715 -0.72801,-0.47505 -1.4826,-0.932949 -2.2149,-1.401138 -1.6035,-1.02813 -3.29018,-1.969653 -4.89798,-3.079245 -4.67074,-3.24131 -10.22127,-4.404923 -15.76322,-5.150939 -2.27235,-0.286401 -4.81223,-0.168925 -6.72186,-1.574351 -1.48174,-1.081294 -4.04993,-4.828523 -6.86506,-6.456038 -0.4862,-0.290688 -2.77227,-1.444869 -2.77227,-1.444869 0,0 1.30939,3.550006 1.60951,4.264295 0.69542,1.644664 -0.38158,3.063809 -0.83262,4.642447 -0.29069,1.04185 2.13772,0.8129 2.26463,1.782721 0.18179,1.432007 -4.15197,1.936211 -6.59152,2.417263 -3.65634,0.715146 -7.91635,2.082842 -11.56925,0.884072 -4.3046,-1.383131 -7.37269,-4.12967 -10.46566,-7.235496 1.43801,6.725289 5.4382,10.602857 5.6157,11.422617 0.18607,0.905508 -0.45961,1.091583 -1.04099,1.682394 -1.28967,1.265654 -6.91566,7.731125 -6.93366,9.781382 1.61379,-0.247815 3.56115,-1.660957 4.9803,-2.485862 1.58035,-0.905509 7.60593,-5.373029 9.29347,-6.065023 0.38587,-0.160351 5.0549,-1.531476 5.09434,-0.932948 0.0695,0.932948 -0.30784,1.137031 -0.18436,1.527188 0.22638,0.746016 1.44144,1.46545 2.02282,1.985088 1.50918,1.292237 3.21044,2.42841 4.27373,4.156252 1.49203,2.401827 1.55805,4.999163 1.98251,7.677102 0.99469,-0.111473 2.0091,-2.17545 2.55961,-2.992638 0.51278,-0.772598 2.38639,-4.071359 3.09725,-4.275442 0.67227,-0.204082 2.75511,0.958673 3.50284,1.180763 2.85973,0.848057 5.644,1.353976 8.56032,1.353976 3.50799,0.0094 12.726,0.258104 19.55505,-4.800226 0.75545,-0.567658 2.55703,-2.731104 2.55703,-2.731104 0,0 -0.37644,-0.57709 -1.04785,-0.790605 0.89779,-0.584808 1.8659,-1.211633 1.94993,-1.925921 z"}}),t._v(" "),n("path",{staticClass:"fish6",style:{fill:t.color,"fill-opacity":t.opacity},attrs:{d:"m 200.07076,80.737109 c 0.0489,-0.44418 -0.2178,-0.896934 -1.01784,-1.415715 -0.72801,-0.47505 -1.4826,-0.932949 -2.2149,-1.401138 -1.6035,-1.02813 -3.29018,-1.969653 -4.89798,-3.079245 -4.67074,-3.24131 -10.22127,-4.404923 -15.76322,-5.150939 -2.27235,-0.286401 -4.81223,-0.168925 -6.72186,-1.574351 -1.48174,-1.081294 -4.04993,-4.828523 -6.86506,-6.456038 -0.4862,-0.290688 -2.77227,-1.444869 -2.77227,-1.444869 0,0 1.30939,3.550006 1.60951,4.264295 0.69542,1.644664 -0.38158,3.063809 -0.83262,4.642447 -0.29069,1.04185 2.13772,0.8129 2.26463,1.782721 0.18179,1.432007 -4.15197,1.936211 -6.59152,2.417263 -3.65634,0.715146 -7.91635,2.082842 -11.56925,0.884072 -4.3046,-1.383131 -7.37269,-4.12967 -10.46566,-7.235496 1.43801,6.725289 5.4382,10.602857 5.6157,11.422617 0.18607,0.905508 -0.45961,1.091583 -1.04099,1.682394 -1.28967,1.265654 -6.91566,7.731125 -6.93366,9.781382 1.61379,-0.247815 3.56115,-1.660957 4.9803,-2.485862 1.58035,-0.905509 7.60593,-5.373029 9.29347,-6.065023 0.38587,-0.160351 5.0549,-1.531476 5.09434,-0.932948 0.0695,0.932948 -0.30784,1.137031 -0.18436,1.527188 0.22638,0.746016 1.44144,1.46545 2.02282,1.985088 1.50918,1.292237 3.21044,2.42841 4.27373,4.156252 1.49203,2.401827 1.55805,4.999163 1.98251,7.677102 0.99469,-0.111473 2.0091,-2.17545 2.55961,-2.992638 0.51278,-0.772598 2.38639,-4.071359 3.09725,-4.275442 0.67227,-0.204082 2.75511,0.958673 3.50284,1.180763 2.85973,0.848057 5.644,1.353976 8.56032,1.353976 3.50799,0.0094 12.726,0.258104 19.55505,-4.800226 0.75545,-0.567658 2.55703,-2.731104 2.55703,-2.731104 0,0 -0.37644,-0.57709 -1.04785,-0.790605 0.89779,-0.584808 1.8659,-1.211633 1.94993,-1.925921 z"}}),t._v(" "),n("path",{staticClass:"fish4",style:{fill:t.color,"fill-opacity":t.opacity},attrs:{d:"m 77.275623,89.018799 c 0.0489,-0.44418 -0.2178,-0.896934 -1.01784,-1.415715 -0.72801,-0.47505 -1.4826,-0.932949 -2.2149,-1.401138 -1.6035,-1.02813 -3.29018,-1.969653 -4.89798,-3.079245 -4.67074,-3.24131 -10.22127,-4.404923 -15.76322,-5.150939 -2.272347,-0.286401 -4.812227,-0.168925 -6.721857,-1.574351 -1.48174,-1.081294 -4.04993,-4.828523 -6.86506,-6.456038 -0.4862,-0.290688 -2.77227,-1.444869 -2.77227,-1.444869 0,0 1.30939,3.550006 1.60951,4.264295 0.69542,1.644664 -0.38158,3.063809 -0.83262,4.642447 -0.29069,1.04185 2.13772,0.8129 2.26463,1.782721 0.18179,1.432007 -4.15197,1.936211 -6.59152,2.417263 -3.65634,0.715146 -7.91635,2.082842 -11.56925,0.884072 -4.3046,-1.383131 -7.37269,-4.12967 -10.46566,-7.235496 1.43801,6.725289 5.4382,10.602857 5.6157,11.422617 0.18607,0.905508 -0.45961,1.091583 -1.04099,1.682394 -1.28967,1.265654 -6.9156603,7.731122 -6.9336603,9.781382 1.6137903,-0.24782 3.5611503,-1.66096 4.9803003,-2.48586 1.58035,-0.90551 7.60593,-5.37303 9.29347,-6.065025 0.38587,-0.160351 5.0549,-1.531476 5.09434,-0.932948 0.0695,0.932948 -0.30784,1.137031 -0.18436,1.527183 0.22638,0.74602 1.44144,1.46546 2.02282,1.98509 1.50918,1.29224 3.21044,2.42841 4.27373,4.15625 1.49203,2.40183 1.55805,4.999171 1.98251,7.677111 0.99469,-0.11148 2.0091,-2.17545 2.55961,-2.99264 0.51278,-0.7726 2.38639,-4.071361 3.09725,-4.275441 0.67227,-0.20408 2.75511,0.95867 3.50284,1.18076 2.85973,0.84806 5.644,1.35398 8.560317,1.35398 3.50799,0.009 12.726,0.2581 19.55505,-4.80023 0.75545,-0.56766 2.55703,-2.7311 2.55703,-2.7311 0,0 -0.37644,-0.57709 -1.04785,-0.79061 0.89779,-0.58481 1.8659,-1.211632 1.94993,-1.92592 z"}}),t._v(" "),n("path",{staticClass:"fish5",style:{fill:t.color,"fill-opacity":t.opacity},attrs:{d:"m 127.65312,60.900973 c 0.0489,-0.44418 -0.2178,-0.896934 -1.01784,-1.415715 -0.72801,-0.47505 -1.4826,-0.932949 -2.2149,-1.401138 -1.6035,-1.02813 -3.29018,-1.969653 -4.89799,-3.079245 -4.67074,-3.24131 -10.22127,-4.404923 -15.76322,-5.150939 -2.27235,-0.286401 -4.812228,-0.168925 -6.721858,-1.574351 -1.48174,-1.081294 -4.04993,-4.828523 -6.86506,-6.456038 -0.4862,-0.290688 -2.77227,-1.444869 -2.77227,-1.444869 0,0 1.30939,3.550006 1.60951,4.264295 0.69542,1.644664 -0.38158,3.063809 -0.83262,4.642447 -0.29069,1.04185 2.13772,0.8129 2.26463,1.782721 0.18179,1.432007 -4.15197,1.936211 -6.59152,2.417263 -3.65634,0.715146 -7.91635,2.082842 -11.56925,0.884072 -4.3046,-1.383131 -7.37269,-4.12967 -10.46566,-7.235496 1.43801,6.725289 5.4382,10.602857 5.6157,11.422617 0.18607,0.905508 -0.45961,1.091583 -1.04099,1.682394 -1.28967,1.265654 -6.91566,7.731125 -6.93366,9.781382 1.61379,-0.247815 3.56115,-1.660957 4.9803,-2.485862 1.58035,-0.905509 7.60593,-5.373029 9.29347,-6.065023 0.38587,-0.160351 5.0549,-1.531476 5.09434,-0.932948 0.0695,0.932948 -0.30784,1.137031 -0.18436,1.527188 0.22638,0.746016 1.44144,1.46545 2.02282,1.985088 1.50918,1.292237 3.21044,2.42841 4.27373,4.156252 1.49203,2.401827 1.55805,4.999163 1.98251,7.677102 0.99469,-0.111473 2.0091,-2.17545 2.55961,-2.992638 0.51278,-0.772598 2.38639,-4.071359 3.09725,-4.275442 0.67227,-0.204082 2.75511,0.958673 3.50284,1.180763 2.85973,0.848057 5.643998,1.353976 8.560318,1.353976 3.50799,0.0094 12.726,0.258104 19.55506,-4.800226 0.75545,-0.567658 2.55703,-2.731104 2.55703,-2.731104 0,0 -0.37644,-0.57709 -1.04785,-0.790605 0.89779,-0.584808 1.8659,-1.211633 1.94993,-1.925921 z"}})])])}),[],!1,null,null,null);e.a=component.exports},230:function(t,e,n){t.exports={srcSet:n.p+"img/ae40c7c-360.jpg 360w,"+n.p+"img/a17cacf-640.jpg 640w,"+n.p+"img/f864abe-1000.jpg 1000w",images:[{path:n.p+"img/ae40c7c-360.jpg",width:360,height:123},{path:n.p+"img/a17cacf-640.jpg",width:640,height:218},{path:n.p+"img/f864abe-1000.jpg",width:1e3,height:341}],src:n.p+"img/ae40c7c-360.jpg",toString:function(){return n.p+"img/ae40c7c-360.jpg"},placeholder:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx4BBQUFBwYHDggIDh4UERQeHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHv/AABEIAA4AKAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/ADW/E13FAZWZtucZr7SvjeRaH8+5Zw/Sr1ORs5O58SXs8rbZmCYznvXmVMxqH2FDhnC00rq7M9NYmfDyTShjwOSMmub67Uetz03k9CK5YxVvkWLXV5WZBvkLHGMk5+gq44ypfcxq5XSinorfgd1Y3F5b2sRaQucc85r3aGJvFX3PznFUsPVryUVZFAW8N6rM6fIcjaeQRXhSlz6s9SdergWoRevc5zXNEiRh9nlaLdnjqBiuSpGx9Jled1KiftVe1vxMOOymWFGa5+Q5woUfzNYn0bxMXNxtqi9pcCrcQyW/EjShAz88/wCFaRODGVrwnGpsk3oelQ4FvlwDhecCvUpTaR+UVIt1LR6n/9k=",width:360,height:123}},245:function(t,e,n){var o=n(3);o(o.P,"Array",{fill:n(208)}),n(94)("fill")},246:function(t,e,n){"use strict";n(214)},247:function(t,e,n){var o=n(32)(!1);o.push([t.i,".bubbles{background:transparent;position:absolute}",""]),t.exports=o},252:function(t,e,n){"use strict";n(88),n(245);var o={props:{total:{type:Number,required:!1,default:0}},data:function(){return{cw:0,ch:0,observer:null}},mounted:function(){var t=this,e=this.$el.getContext("2d"),n=this;this.cw=this.$el.width=this.$el.parentElement.clientWidth,this.ch=this.$el.height=this.$el.parentElement.clientHeight;var o,r=this.total?this.total:parseInt(this.cw*this.ch/2e4),h=.5522847498,l=Math.sqrt(this.ch*this.ch+this.cw/2*(this.cw/2)),c=e.createRadialGradient(this.cw/2,0,0,this.cw/2,0,l);function d(){this.cx=Math.round(Math.random()*n.cw)+1,this.cy=Math.round(Math.random()*n.ch)+1,this.x=this.cx,this.y=this.cy;var t=w(93,99)/100;this.rw=w(5,25),this.rh=~~(this.rw*t),this.a=(Math.round(360*Math.random())+1)*(Math.PI/180),this.driftFlag=!(Math.random()<.5),this.lift=w(2,10)/18,this.grd=v(this.cx,this.cy,this.rw)}c.addColorStop(0,"#badbf5"),c.addColorStop(.35,"#53a5dd"),c.addColorStop(.75,"#306eab"),c.addColorStop(1,"#22417a"),e.fillStyle="rgba(0, 0, 200, 0.)";var f=[];function m(){for(var i=0;i<r;i++)f[i]=new d;(o=e.createLinearGradient(0,0,0,n.ch)).addColorStop(0,"rgba(0, 0, 200, 1)"),o.addColorStop(.1,"rgba(0, 0, 200, 0)"),o.addColorStop(.9,"rgba(0, 0, 200, 0)"),o.addColorStop(1,"rgba(0, 0, 200, 1)")}function v(t,n,o){return(c=e.createRadialGradient(t,n-o/20*o,0,t,n-o/20*o,o)).addColorStop(0,"rgba(186,219,245, .6)"),c.addColorStop(1,"rgba(186,219,245, 0.05)"),c}function w(t,e){return Math.floor(Math.random()*(e-t+1)+t)}var y=!0;m(),window.requestAnimationFrame((function t(){if(window.requestAnimationFrame(t),y){e.clearRect(0,0,n.cw,n.ch);for(var r=0;r<f.length;r++)f[r].a+=.1,f[r].cy<-1*f[r].rw?f[r].cy=n.ch+f[r].rw:f[r].cy-=f[r].lift,f[r].cx<=f[r].x-10?f[r].driftFlag=!0:f[r].cx>=f[r].x+10&&(f[r].driftFlag=!1),f[r].driftFlag?f[r].cx+=.15:f[r].cx-=.15,f[r].grd=v(f[r].cx,f[r].cy,f[r].rw),l=f[r].cx,c=f[r].cy,d=f[r].rw,m=f[r].rh,a=f[r].a,w=f[r].grd,_=void 0,A=void 0,M=void 0,x=void 0,S=void 0,C=void 0,k=void 0,E=void 0,I=void 0,B=void 0,T=void 0,Q=void 0,P=void 0,F=void 0,D=void 0,j=void 0,H=void 0,z=void 0,R=void 0,$=void 0,O=void 0,V=void 0,Y=void 0,G=void 0,J=void 0,U=void 0,W=void 0,N=void 0,Z=void 0,X=void 0,_=d*h,A=m*h,M=Math.sqrt(A*A+d*d),x=Math.sqrt(_*_+m*m),S=Math.atan(A/d),C=Math.atan(_/m),k=l+d*Math.cos(a),E=c+d*Math.sin(a),I=l+m*Math.cos(Math.PI/2+a),B=c+m*Math.sin(Math.PI/2+a),T=l+d*Math.cos(Math.PI+a),Q=c+d*Math.sin(Math.PI+a),P=l+m*Math.cos(3*Math.PI/2+a),F=c+m*Math.sin(3*Math.PI/2+a),D=l+M*Math.cos(S+a),j=c+M*Math.sin(S+a),H=l+x*Math.cos(Math.PI/2-C+a),z=c+x*Math.sin(Math.PI/2-C+a),R=l+x*Math.cos(Math.PI/2+C+a),$=c+x*Math.sin(Math.PI/2+C+a),O=l+M*Math.cos(Math.PI-S+a),V=c+M*Math.sin(Math.PI-S+a),Y=l+M*Math.cos(Math.PI+S+a),G=c+M*Math.sin(Math.PI+S+a),J=l+x*Math.cos(3*Math.PI/2-C+a),U=c+x*Math.sin(3*Math.PI/2-C+a),W=l+x*Math.cos(3*Math.PI/2+C+a),N=c+x*Math.sin(3*Math.PI/2+C+a),Z=l+M*Math.cos(-S+a),X=c+M*Math.sin(-S+a),e.save(),e.fillStyle=w,e.strokeStyle="rgba(200,200,200,.1)",e.beginPath(),e.moveTo(k,E),e.bezierCurveTo(D,j,H,z,I,B),e.bezierCurveTo(R,$,O,V,T,Q),e.bezierCurveTo(Y,G,J,U,P,F),e.bezierCurveTo(W,N,Z,X,k,E),e.fill(),e.stroke(),e.restore();var l,c,d,m,a,w,_,A,M,x,S,C,k,E,I,B,T,Q,P,F,D,j,H,z,R,$,O,V,Y,G,J,U,W,N,Z,X;e.save(),e.globalAlpha=1,e.globalCompositeOperation="destination-out",e.fillStyle=o,e.fillRect(0,0,n.cw,n.ch),e.restore()}})),window.addEventListener("resize",(function(){t.cw=t.$el.width=t.$el.parentElement.clientWidth,t.ch=t.$el.height=t.$el.parentElement.clientHeight,r=t.total?t.total:parseInt(t.cw*t.ch/2e4),m()}),!1),this.observer=new IntersectionObserver((function(t,e){t.forEach((function(t){y=t.intersectionRatio>=.05}))}),{threshold:[0,.05]}),this.observer.observe(this.$el)},beforeDestroy:function(){this.observer.unobserve(this.$el),this.observer=null}},r=(n(246),n(4)),component=Object(r.a)(o,(function(){var t=this.$createElement;return(this._self._c||t)("canvas",{staticClass:"bubbles"})}),[],!1,null,null,null);e.a=component.exports},274:function(t,e,n){var content=n(385);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(33).default)("30e03399",content,!0,{sourceMap:!1})},381:function(t,e,n){t.exports=n.p+"img/f8e17eb.png"},382:function(t,e,n){t.exports=n.p+"img/c0083d3.png"},383:function(t,e,n){t.exports=n.p+"img/72fe1ed.jpg"},384:function(t,e,n){"use strict";n(274)},385:function(t,e,n){var o=n(32)(!1);o.push([t.i,".people[data-v-502d004e]{list-style:none;padding:0}.people img[data-v-502d004e]{border-radius:50%;overflow:hidden;padding:1rem}.people .people-name[data-v-502d004e]{margin:1rem 0 .5rem}.about-page-text p[data-v-502d004e]{max-width:50rem}",""]),t.exports=o},444:function(t,e,n){"use strict";n.r(e);var o=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",[t._v("\n      The "),n("a",{attrs:{href:"https://github.com/Corollarium/lajevr"}},[t._v("source code")]),t._v(" is available, by\n      the way. And talk to us if you have other questions or similar projects that could use\n      our expertise.\n    ")])},function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("section",{staticClass:"section-base container"},[o("h2",[t._v("\n      Dive effect for the home page\n    ")]),t._v(" "),o("p",[t._v('\n      "It has to be unique," we said. "It\'s about a dive site, so... let\'s dive". The effect\n      of scrolling down and splashing into the water had to be quick to load, performant,\n      but unique.\n    ')]),t._v(" "),o("figure",[o("img",{attrs:{src:n(381),alt:"Above the fold"}})]),t._v(" "),o("p",[t._v("\n      The animation above the fold is a composed of 2D and 3D. The island is a 2D image, which is\n      quick to load -- much quicker than a 3D model, and faster to render. It's mapped as a sprite,\n      so it responds correctly to the camera motion. The clouds are a background layer, so they don't\n      move at all. Mixing the two you get a sense of parallax, that the island is far but not that far,\n      and that the clouds are much farther.\n    ")]),t._v(" "),o("p",[t._v("\n      We tried to use a video for the ocean, but not only it was near impossible to get a looping video\n      that looked like an ocean, the water was close to the camera and we needed a perspective change\n      when the user scrolls and dives. We had to go full 3D. For that we used an ocean water simulator\n      that renders the water with GLSL. It's a bit hard on the GPU and we had trouble with Safari, but\n      on other platforms with better WebGL implementations the effect was striking.\n    ")]),t._v(" "),o("p",[t._v('\n      We mapped the page scroll events to the 3D camera position, so as you scroll the camera lowers until\n      you get to the water. This was a bit trickier than expected, since we had to match the scroll size\n      with the 3D translation, which required a bit of "sticky" magic with CSS. An outer div had a larger\n      height, to control the scroll size, and an inner div was stickied inside it with a constant 100vh size.\n    ')]),t._v(" "),o("figure",[o("img",{attrs:{src:n(382),alt:"Below the fold, transition"}})]),t._v(" "),o("p",[t._v('\n      The transition into "underwater" had to move from the 3D ocean back to the 2D HTML page. This was\n      done with a cool CSS effect where two transparent '),o("code",[t._v("div")]),t._v(" were overlayed, and a CSS animation\n      for a distortion effect made them look like oceans. I don't think a lot of people used\n      "),o("code",[t._v("transform: skew")]),t._v(" in CSS before, but the final effect was cool. It was also heavy: some\n      browsers just slowed to a crawl when we added the effect and needed some gentle coaxing to work well\n      again.\n    ")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",[t._v("\n      Reacting to scrolling became much easier after "),n("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API"}},[t._v("IntersectionObserver")]),t._v("\n      was created. We use it all over the site to animate objects when they come into view, and to pause\n      3D rendering when it comes out of view.\n    ")])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",[t._v("\n      This is a composed picture, combining four individual photos. "),n("a",{attrs:{href:"http://hugin.sourceforge.net/"}},[t._v("Hugin")]),t._v("\n      was very helpful to compose these images and compensate for the wide lens distortion.\n    ")])},function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("figure",[o("img",{attrs:{src:n(383),alt:"Panorama do Moreia"}}),t._v(" "),o("figcaption",[t._v("The four images used to compose the picture above.")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{staticClass:"section-base container"},[n("h2",[t._v("And in 3D!")]),t._v(" "),n("p",[t._v("\n      We use both ThreeJS and BabylonJS for the 3D rendering. This wasn't planned from the start:\n      our plan was to use solely ThreeJS, but it turned out to have a major problem with multipass\n      rendering and animations with ThreeJS that seemed unsolvable. BabylonJS didn't have such a\n      limitation, and we moved to it later - and even contributed with some code and documentation.\n      Because it turns out that nobody had implemented some of the things we were doing yet using\n      the same technology\n    ")]),t._v(" "),n("p",[t._v("\n      Boids\n    ")]),t._v(" "),n("p",[t._v("\n      Multipass rendering\n    ")]),t._v(" "),n("p",[t._v("\n      Vertex Animation Textures\n    ")])])}],r=n(192),h=n(215),l=n(252),c=n(230),d={components:{SwimmingFish:h.a,Bubbles:l.a},extends:r.default,data:function(){return{moreiaPanorama:c}},mounted:function(){this.headerOverlay=!0,this.head.title="The technology",this.head.description=this.$gettext("Sobre o projeto Laje de Santos Virtual")}},f=(n(384),n(4)),component=Object(f.a)(d,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("article",[n("section",{staticClass:"hero"},[n("div",{staticClass:"hero-body hero-vida"},[n("figure",[n("img",{attrs:{src:t.moreiaPanorama.src,srcset:t.moreiaPanorama.srcSet,alt:"Panorama do Moreia"}})])]),t._v(" "),n("div",{staticClass:"vida-hero-text rellax",attrs:{"data-rellax-speed":"2"}},[n("h1",{staticClass:"has-text-center vida-hero-title"},[n("i18n",[t._v("\n          The technology\n        ")])],1)])]),t._v(" "),n("section",{staticClass:"section-base container"},[n("h2",[t._v("\n      The technology behind this site\n    ")]),t._v(" "),n("p",[t._v("\n      This project required a lot of technology to get off the ground -- or under the water,\n      in this case. From image capture to 3D reconstruction, from innovative web design to\n      3D web implementation that had to be fast even on cell phones. It was fun, and some\n      times hard. This page will go through some of the tech we used.\n    ")]),t._v(" "),t._m(0),t._v(" "),n("p",[t._v("\n      The site uses Vue and Nuxt.JS for its structure. There's not much that's reactive, but Vue\n      made it easier to build reusable components, and Nuxt.JS was helpful to generate a static\n      site out of dynamic data. We were constantly adding images and videos, which required\n      generating thumbnails of different sizes, as well as generating some code automatically\n      (like the statistics on the "),n("nuxt-link",{attrs:{to:"/sobre"}},[t._v("\n        about page\n      ")]),t._v(").\n    ")],1),t._v(" "),n("p",[t._v("\n      A lot of effort went into planning the pages, making content attractive and interesting,\n      and worrying about UX. The fun part of doing unique projects like this one is to solve\n      problems that are a bit unique and new. The "),n("nuxt-link",{attrs:{to:"/especies"}},[t._v("\n        species page\n      ")]),t._v('\n      was such a case: it came from a common thing that divers do when they get back to the boat.\n      "I saw this blue and black fish about this big, what is it called?" Well, let\'s allow users\n      to search species by color and size.\n    ')],1)]),t._v(" "),t._m(1),t._v(" "),n("section",{staticClass:"section-base container"},[n("h2",[t._v("\n      CSS and JS everywhere\n    ")]),t._v(" "),t._m(2),t._v(" "),n("p",[t._v("\n      But most of the effects are pure CSS, using animations. That's the case of the liquid buttons,\n      which use :before and :after to render animated waves with the same animation with different periods.\n    ")]),t._v(" "),n("p",{staticClass:"has-text-center"},[n("nuxt-link",{staticClass:"button-is-liquid",attrs:{to:"/"}},[n("span",{staticClass:"button-is-liquid__text"},[t._v("Index page")]),t._v(" "),n("span",{staticClass:"button-is-liquid__animation"})])],1),t._v(" "),n("p",[t._v('\n      Anything that was "well behaved" in terms of animation was moved to CSS. That is also the case of\n      the swimming fish.\n    ')]),t._v(" "),n("swimming-fish"),t._v(" "),n("p",{staticStyle:{"margin-top":"300px"}},[t._v("\n      After all, the biggest performance problem in all pages is JavaScript, particularly with 3D.\n      Moving things out of the main JS thread results in a smooth animation without worries.\n      But while JS was kept to a minimum, although some effects were more complex and required some code.\n      That is the case of the air bubbles, which are of different sizes, with wobbles and motion at\n      different speeds. They are rendered in a canvas as ellipses - so they are always smooth - but their\n      motion is controlled by a JS loop.\n    ")]),t._v(" "),n("section",{staticStyle:{height:"400px"}},[n("bubbles")],1)],1),t._v(" "),n("section",{staticClass:"section-base container"},[n("h2",[t._v("\n      Panorama reconstruction\n    ")]),t._v(" "),n("p",[t._v('\n      Underwater we can usually see only a few meters. At Laje the Santos the usual visibility is betwen 5m and 12m,\n      and on rare occasions you can see up to 20m. Even on these perfect days, 20m means that "at 20m you cannot see anything\n      anymore", with visibility decaying exponentially before that. Moreia, the wreck, is about 22m long, so it\'s almost\n      to impossible to take a picture covering all of it. If you are close enough to get a clear picture, you are too close\n      to get the entier wreck into a single picture, even with a wide lens.\n    ')]),t._v(" "),n("figure",[n("img",{attrs:{src:t.moreiaPanorama.src,srcset:t.moreiaPanorama.srcSet,alt:"Panorama do Moreia"}}),t._v(" "),n("figcaption",[t._v("But we did it: Moreia in its entirety.")])]),t._v(" "),t._m(3),t._v(" "),t._m(4),t._v(" "),n("p",[t._v("\n      This technique is interesting to provide a flat view as well. TO COME\n    ")])]),t._v(" "),t._m(5)])}),o,!1,null,"502d004e",null);e.default=component.exports}}]);