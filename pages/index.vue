<template>
  <div>
    <section v-if="!isRenderOcean" class="hero-apple">
      <Clouds />
      <img :src="imageLogoLaje" :srcset="imageLogoLaje.srcSet" class="ilha-logo" alt="Laje de Santos - logo">
      <img :src="imageMar.src" :srcset="imageMar.srcSet" class="ilha-mar" draggable="false" alt="Água do mar da Laje">
      <img :src="imageIlha.src" :srcset="imageIlha.srcSet" class="ilha-hero" draggable="false" alt="Ilha Laje de Santos CC SA 3.0, from https://commons.wikimedia.org/w/index.php?curid=40439744">
    </section>
    <section v-else class="sticky-hero">
      <div class="sticky-hero-content">
        <Ocean />
        <div class="ilha-logo">
          <img :src="imageLogoLaje" :srcset="imageLogoLaje.srcSet" alt="Laje de Santos - logo">
          <div class="ilha-logo-text">
            ⇩
          </div>
        </div>
        <div class="sticky-hero-attribution">
          <p class="attribution">
            Photo
            <a
              href="//commons.wikimedia.org/w/index.php?title=User:Afcarv&amp;action=edit&amp;redlink=1"
              class="new"
              title="User:Afcarv (page does not exist)"
              target="_blank"
            >Anael Ferraz de Carvalho</a>
            -
            <span class="int-own-work" lang="en">Own work</span>,
            <a
              href="https://creativecommons.org/licenses/by-sa/3.0"
              title="Creative Commons Attribution-Share Alike 3.0"
              target="_blank"
            >CC BY-SA 3.0</a>
            <a target="_blank" href="https://commons.wikimedia.org/w/index.php?curid=40439744">Link</a>
          </p>
        </div>
      </div>
    </section>

    <!-- Seção que liga hero com conteúdo -->
    <section :class="{'surface-dive': true, 'with-fade': true, 'after-3d': isRenderOcean}">
      <div class="fade-out" />
      <div class="surface-agua">
        <img :src="introSurfaceB.src" :srcset="introSurfaceB.srcSet" class="distorted-effect delay-2s" draggable="false" alt="Imagem contendo água do mar">
      </div>
      <div class="surface-espuma">
        <img :src="introSurfaceA.src" :srcset="introSurfaceA.srcSet" class="distorted-effect" draggable="false" alt="Gráfico representando as ondas do mar">
      </div>
      <div :class="{'animals': true, 'rellax-apple': !isApple}">
        <img
          :src="graphicTartaruga.src"
          :srcset="graphicTartaruga.srcSet"
          class="animal-turtle rellax"
          draggable="false"
          alt="Tartaruga"
          data-rellax-speed="-.75"
        >
        <img
          :src="graphicGolfinho.src"
          :srcset="graphicGolfinho.srcSet"
          class="animal-dolphin rellax"
          draggable="false"
          alt="Golfinho"
          data-rellax-speed="-.7"
        >
        <img
          :src="graphicRaia.src"
          :srcset="graphicRaia.srcSet"
          class="animal-ray rellax"
          draggable="false"
          alt="Raia"
          data-rellax-speed=".45"
        >
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section with-fade">
      <div class="fade-in" />
      <div class="fade-out" />
      <div bp="container" class="about-content">
        <figure bp="float-center" class="image icon-about-heading">
          <img :src="imageIconLaje.src" :srcset="imageIconLaje.srcSet" alt="Ícone da Laje de Santos">
        </figure>
        <h1 class="heading-intro has-text-center">
          <i18n>Laje de Santos</i18n>
        </h1>

        <div bp="grid" class="about-content">
          <div bp="12 6@md offset-6@md">
            <p>
              <i18n>
                Vivemos em um planeta de pequenas maravilhas naturais. Florestas gigantescas, cachoeiras idílicas, ilhas remotas.
              </i18n>
            </p>

            <p>
              <i18n>
                Espalhadas às vezes longe demais para podemos chegar. Tão longe.
              </i18n>
            </p>

            <p>
              <i18n>
                Mas a internet permite chegarmos um pouco mais perto.
              </i18n>
              <nuxt-link to="/sobre">
                <i18n>
                  Leia mais sobre o projeto "A Laje em Realidade Virtual".
                </i18n>
              </nuxt-link>
            </p>
          </div>
        </div>
      </div>

      <div bp="container">
        <div class="section-inner make-space-top" bp="grid 12 6@md vertical-center">
          <div>
            <p class="about-description">
              <i18n>
                O Parque Estadual Marinho da Laje de Santos é uma área de proteção da biodiversidade marinha e aviária.
                É o único parque marinho do estado de São Paulo, e proporciona um ambiente propício
                à concentração de peixes de passagem e recifais com grande diversidade biológica.
              </i18n>
            </p>
          </div>
          <div>
            <figure class="image spaced-image">
              <img :src="imageAboutIlha.src" :srcset="imageAboutIlha.srcSet" class="spaced-image" alt="Ilustração da Laje de Santos">
            </figure>
          </div>
        </div>

        <div class="section-inner" bp="vertical-center">
          <video ref="googleEarth" class="is-fullwidth" muted playsinline>
            <source src="~static/videos/laje_earth_1280.mp4">
          </video>
          <div>
            <p class="boxed-description">
              <i18n>Uma ilha na forma de baleia que surge no mar aberto, a 40km da costa do </i18n>
              Estado de <span class="text-is-bold">São Paulo</span>, <span class="text-is-bold">Brasil</span>.
            </p>
          </div>
        </div>

        <!-- <div class="section-inner" bp="grid vertical-center">
          <div bp="12 5@md">
            <p class="boxed-description">
              <i18n>Uma ilha na forma de baleia que surge no mar aberto, a 40km da costa do </i18n>
              Estado de <span class="text-is-bold">São Paulo</span>, <span class="text-is-bold">Brasil</span>.
            </p>
          </div>

          <div bp="first@md  12 7@md">
            <figure class="image">
              <img :src="imageAboutMapa.src" :srcset="imageAboutMapa.srcSet" class="spaced-image" alt="Mapa-mundi com a Laje de Santos">
            </figure>
          </div>
        </div> -->

        <div class="section-inner" bp="grid 12 6@md vertical-center">
          <div>
            <h3>
              <i18n>Um paraíso do mergulho</i18n>
            </h3>
            <p class="about-description">
              <i18n>
                A Laje oferece condições muito especiais em termos de profundidade
                e visibilidade para mergulho. Junto com a preservação e variedade da vida,
                isso faz da Laje um dos principais pontos de mergulho
                e de fotografia subaquática do país.
              </i18n>
              <br>
              <span class="text-is-bold"><i18n>Profundidade média:</i18n> 20m</span>
              <br>
              <span class="text-is-bold"><i18n>Profundidade máxima no entorno:</i18n> 42m</span>
            </p>
          </div>
          <div class="about-profundidade">
            <Clouds />
            <figure class="image">
              <img :src="imageAboutProfundidade.src" :srcset="imageAboutProfundidade.srcSet" alt="Mapa profundidade da Laje de Santos">
            </figure>
          </div>
        </div>
      </div>
    </section>

    <section id="moreia" bp="container" class="section-base">
      <h2><i18n>O naufrágio Moréia</i18n></h2>
      <img src="~static/images/nauther/moreia-proa.jpg" alt="Naufrágio Moreia, visto da proa. Foto: Nauther Andres">

      <p>
        <i18n>A 20 metros de profundidade está o</i18n>
        <nuxt-link to="moreia">
          <i18n>naufrágio Moréia.</i18n>
        </nuxt-link>
        <i18n>É o primeiro naufrágio artificial do Brasil feito para a prática de mergulho.</i18n>
      </p>
    </section>

    <!-- Dive Section -->
    <section class="section-with-slideshow with-fade">
      <div class="background-slideshow">
        <video autoplay loop muted playsinline>
          <source src="~static/videos/deiamorales/Video 2020-03-20 at 08.58.50.mp4">
        </video>
        <p class="attribution">
          Video
          <a
            href="https://www.instagram.com/deia_morales/"
            target="_blank"
          >Andréa Pontes</a>
        </p>
        <div class="fade-in" />
      </div>

      <div bp="grid">
        <div data-aos="fade-up" bp="10 6@md offset-2 offset-4@md" class="section-div-intro">
          <h2 class="has-text-center">
            <i18n>
              Mergulho Virtual
            </i18n>
          </h2>
          <p class="has-text-center">
            <i18n>
              Veja no seu computador cardumes de peixes, o naufrágio Moreia e animais fantásticos como se estivesse lá.
              Experimente como é mergulhar na Laje de Santos agora mesmo.
            </i18n>
          </p>
          <p class="has-text-center">
            <nuxt-link bp="b4 offset-5" class="button-is-liquid" to="/mergulho-virtual">
              <span class="button-is-liquid__text"><i18n>Mergulhe agora</i18n></span>
              <span class="button-is-liquid__animation" />
            </nuxt-link>
          </p>
          </i18n>
          </h2></i18n>
        </div>
      </div>

      <div bp="grid" class="section-dive-images">
        <div bp="4">
          <figure data-aos="zoom-out" data-aos-duration="200" data-aos-easing="ease-out" class="image image-circle-border side-image">
            <img :src="imageMergulhoBolha01.src" :srcset="imageMergulhoBolha01.srcSet" draggable="false" alt="Tartaruga na Laje de Santos">
            <figcaption class="caption">
              <i18n>Veja espécies presentes na laje como tartarugas, mantas e golfinhos.</i18n>
            </figcaption>
          </figure>
        </div>
        <div bp="4">
          <figure data-aos="zoom-out-up" data-aos-duration="500" data-aos-easing="ease-out" class="image image-circle-border center-image">
            <img :src="imageMergulhoBolha02.src" :srcset="imageMergulhoBolha02.srcSet" draggable="false" alt="Cardume de peixes">
            <figcaption class="caption">
              <i18n>Mergulhe virtualmente entre cardumes e recifes de corais.</i18n>
            </figcaption>
          </figure>
        </div>
        <div bp="4">
          <figure data-aos="zoom-out" data-aos-duration="200" data-aos-easing="ease-out" class="image image-circle-border side-image">
            <img :src="imageMergulhoBolha03.src" :srcset="imageMergulhoBolha03.srcSet" draggable="false" alt="Naufrágio Moréia">
            <figcaption class="caption">
              <i18n>Moréia, O primeiro naufrágio induzido para prática de mergulho no Brasil.</i18n>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- Pontos de Mergulho Section -->
    <section class="section-with-slideshow with-fade">
      <div class="background-slideshow two-slides">
        <figure class="image slide-1">
          <img :src="imageFundoPontoMergulho.src" :srcset="imageFundoPontoMergulho.srcSet" draggable="false" alt="Mergulhadores na Laje de Santos entre um cardume de peixes">
          <figcaption class="attribution">
            <a target="_blank" href="https://www.instagram.com/nautherandres/">Nauther Andres</a>
          </figcaption>
        </figure>
        <figure class="image slide-2">
          <img :src="imagePeixes.src" :srcset="imagePeixes.srcSet" draggable="false" alt="Cardume de Xira">
          <figcaption class="attribution">
            By <a target="_blank" href="//commons.wikimedia.org/w/index.php?title=User:Rafa_Tecchio&amp;action=edit&amp;redlink=1" class="new" title="User:Rafa Tecchio (page does not exist)">Rafa Tecchio</a> - <span class="int-own-work" lang="en">Own work</span>, <a target="_blank" href="https://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=40644073">Link</a>
          </figcaption>
        </figure>
      </div>
      <div class="fade-out" />

      <div bp="grid container">
        <div bp="10 8@md 6@lg 5@xl offset-2 offset-2@lg" class="section-div-intro">
          <h2 class="has-text-center">
            <i18n>Pontos de Mergulho</i18n>
          </h2>
          <p class="has-text-center">
            <i18n>Um mapa interativo para conhecer os pontos de mergulhos presentes na laje</i18n>
          </p>
          <p class="has-text-center">
            <nuxt-link class="button-is-liquid" to="/pontos-de-mergulho">
              <span class="button-is-liquid__text"><i18n>Ver pontos</i18n></span>
              <span class="button-is-liquid__animation" />
            </nuxt-link>
          </p>
        </div>
      </div>
    </section>

    <!-- Vida Section -->
    <section id="vida" bp="container" class="section-base" style="padding-bottom: 0;">
      <img
        :src="imageGraficoEstrelaMar.src"
        :srcset="imageGraficoEstrelaMar.srcSet"
        class="estrela-do-mar"
        draggable="false"
        alt="Foto de uma estrela do mar"
      >
      <div class="has-text-center" style="max-width: 32rem; display: block; margin: 2rem auto 3rem;">
        <h2>
          <i18n>A vida na Laje</i18n>
        </h2>
        <p>
          <i18n>
            A Laje de Santos é rica em vida. 196 espécies de peixes e 29 espécies de aves já foram catalogadas. É habitada
            por corais, golfinhos, tartarugas, algas, raias-manta.
          </i18n>
        </p>
      </div>
      <div bp="grid" class="imagens-vida">
        <figure bp="4" class="image image-fish vida-top">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Peixe_Frade.jpg/800px-Peixe_Frade.jpg" alt="Salmeidas / CC BY-SA (https://creativecommons.org/licenses/by-sa/3.0)">
          <figcaption class="attribution">
            <i18n>Peixe frade</i18n>
          </figcaption>
        </figure>
        <figure bp="4" class="image image-fish vida-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/1e/Mola_mola2.jpg" alt="OpenCage / CC BY-SA (https://creativecommons.org/licenses/by-sa/2.5)">
          <figcaption class="attribution">
            <i18n>Peixe lua</i18n>
          </figcaption>
        </figure>
        <figure bp="4" class="image image-fish vida-top">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Moradora_da_Laje.jpg/800px-Moradora_da_Laje.jpg" alt="Ronaldo art / CC BY-SA (https://creativecommons.org/licenses/by-sa/3.0)">
          <figcaption class="attribution">
            <i18n>Tartaruga verde</i18n>
          </figcaption>
        </figure>
        <div bp="12" class="vida-btn">
          <nuxt-link class="button-is-liquid" to="/vida">
            <span class="button-is-liquid__text"><i18n>Mais sobre a vida</i18n></span>
            <span class="button-is-liquid__animation" />
          </nuxt-link>
        </div>
        <figure bp="4" class="image image-fish vida-bottom">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Dactylopterus_volitans.jpg/640px-Dactylopterus_volitans.jpg" alt="cralize / CC BY-SA (http://creativecommons.org/licenses/by-sa/3.0/)">
          <figcaption class="attribution">
            <i18n>Coió</i18n>
          </figcaption>
        </figure>
        <figure bp="4" class="image image-fish vida-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Giant_Manta_AdF.jpg/1024px-Giant_Manta_AdF.jpg" alt="Arturo de Frias Marques / CC BY-SA (https://creativecommons.org/licenses/by-sa/4.0)">
          <figcaption class="attribution">
            <i18n>Manta</i18n>
          </figcaption>
        </figure>
        <figure bp="4" class="image image-fish vida-bottom">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/A_spinner_dolphin_in_the_Red_Sea.jpg/1024px-A_spinner_dolphin_in_the_Red_Sea.jpg" alt="Alexander Vasenin / CC BY-SA (https://creativecommons.org/licenses/by-sa/3.0)">
          <figcaption class="attribution">
            <i18n>Golfinho</i18n>
          </figcaption>
        </figure>
      </div>
    </section>

    <section id="visitar" bp="container" class="section-base">
      <div bp="grid">
        <h2 bp="12" class="has-text-center">
          <i18n>Como visitar a Laje</i18n>
        </h2>
        <div bp="12 6@md offset-1" class="visit-text">
          <p>
            <i18n>
              É permitido visitar com embarcações particulares, seguindo as regras de navegação e com piloto Mestre credenciado.
              Outra opção para visitar a Laje, é através das operadoras de turismo e mergulho credenciadas. Contate também seu dive center.
            </i18n>
          </p>

          <p>
            <i18n>
              Você pode encontrar mais informações sobre visitação e compra de ingressos,
              visitando o
            </i18n>
            <a href="https://www.infraestruturameioambiente.sp.gov.br/2017/09/parque-estadual-marinho-laje-de-santos-completa-24-anos/" target="_blank">
              <i18n>site da Diretoria do Parque Estadual Marinho da Laje de Santos</i18n>
            </a>.
          </p>
        </div>
        <div bp="12 6@md" class="visit-image">
          <img :src="boatFigure.src" :srcset="boatFigure.srcSet" draggable="false" alt="Imagem de um barco ilustrando a seção sobre visitas na laje">
        </div>
      </div>
    </section>
    <section id="mantas" class="mantinha section-base with-fade">
      <div class="fade-in" />
      <div class="fade-out" />
      <div bp="grid container 12 6@md vertical-center">
        <div class="model-container">
          <GLTFModel
            model="/models/raiaManta.glb"
            attribution="Raia manta"
          />
          <!-- <GLTFModel
            :model="'/models/manta/scene.gltf'"
            :link="'https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8'"
            :attribution="'Modelo 3D CC BY-NC por misaooo'"
          />
          </GLTFModel> -->
        </div>
        <div>
          <div>
            <div class="description">
              <i18n>
                No inverno
              </i18n> <nuxt-link to="/vida#raias">
                <i18n>as raias mantas</i18n>
              </nuxt-link> <i18n>passam pela Laje. Chegam a 8 metros de envergadura e 2 toneladas. Estão vulneráveis à extinção.</i18n>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="numeros" class="section-base">
      <Bubbles />
      <div bp="container">
        <h2 class="has-text-center">
          <i18n>
            A Laje em Números
          </i18n>
        </h2>
        <div class="number-wrapper section-inner" bp="grid 6 4@md 3@lg">
          <number-bullet
            :to="550"
            :icon="['fas', 'ruler-horizontal']"
          >
            <i18n>
              Metros de comprimento
            </i18n>
          </number-bullet>
          <number-bullet
            :to="33"
            :icon="['fas', 'ruler-vertical']"
          >
            <i18n>
              Metros de altura
            </i18n>
          </number-bullet>
          <number-bullet
            :to="185"
            :icon="['fas', 'ruler']"
          >
            <i18n>
              Metros de largura
            </i18n>
          </number-bullet>
          <number-bullet
            :to="5000"
            :icon="['fas', 'ruler-combined']"
          >
            <i18n>
              Hectares preservados
            </i18n>
          </number-bullet>
          <number-bullet
            :to="42"
            :icon="['fas', 'wave-square']"
          >
            <i18n>
              Metros de profundidade máxima
            </i18n>
          </number-bullet>
          <number-bullet
            :to="40.7"
            :icon="['fas', 'water']"
            :format="num => new Intl.NumberFormat().format(parseFloat(num).toFixed(1))"
          >
            <i18n>
              Quilômetros da costa
            </i18n>
          </number-bullet>
          <number-bullet
            :to="29"
            :icon="['fas', 'dove']"
          >
            <i18n>
              Espécies de aves
            </i18n>
          </number-bullet>
          <number-bullet
            :to="196"
          >
            <i18n>
              Espécies de peixes
            </i18n>
          </number-bullet>
        </div>
      </div>
    </section>
    <section id="timeline" class="section-base">
      <Timeline />
    </section>
    </sectionclass="section-with-slideshow">
  </div>
</template>

<script>
import Bowser from 'bowser';
import Rellax from 'rellax';
import page from './page.vue';
import Timeline from '~/components/sections/Timeline.vue';
import Ocean from '~/components/OceanB.vue';
import Clouds from '~/components/Clouds.vue';
import GLTFModel from '~/components/GLTFModelB.vue';
import Bubbles from '~/components/Bubbles.vue';

// import Globe from '~/components/Globe.vue';
const imageIlha = require('~/assets/images/graficos/laje-ilha.png?resize');
const imageMar = require('~/assets/images/backgrounds/sea.jpg?resize');
const introSurfaceA = require('~/assets/images/graficos/intro-surface-a.png?resize');
const introSurfaceB = require('~/assets/images/graficos/intro-surface-b.png?resize');
const graphicTartaruga = require('~/assets/images/graficos/turtle.png?resize');
const graphicGolfinho = require('~/assets/images/graficos/dolphin.png?resize');
const graphicRaia = require('~/assets/images/graficos/ray.png?resize');
const imageAboutIlha = require('~/assets/images/graficos/ilha-sobre.png?resize');
const imageAboutProfundidade = require('~/assets/images/graficos/laje-profundidade.png?resize');
const imageAboutMapa = require('~/assets/images/graficos/laje-mapa.png?resize');
const imageLogoLaje = require('~/assets/images/logos/logo-laje-de-santos.png?resize');
const imageIconLaje = require('~/assets/images/graficos/icon-laje.png?resize');
const imageMergulhoBolha01 = require('~/assets/images/graficos/bolha-mergulho1.jpg?resize');
const imageMergulhoBolha02 = require('~/assets/images/graficos/bolha-mergulho2.jpg?resize');
const imageMergulhoBolha03 = require('~/assets/images/graficos/bolha-mergulho3.jpg?resize');
const imagePeixes = require('~/assets/images/laje/1280px-SP_-_Parque_Estadual_Marinho_Laje_de_Santos_-_Cardume_de_Xira_2.jpg?resize');
const imageFundoPontoMergulho = require('~/assets/images/graficos/bg-pontos-de-mergulho.jpg?resize');
const imageGraficoEstrelaMar = require('~/assets/images/graficos/estrela-do-mar.png?resize');
const boatFigure = require('~/assets/images/graficos/boat.png?resize');

export default {
  components: {
    Timeline,
    Ocean,
    Clouds,
    GLTFModel,
    Bubbles
  },

  extends: page,

  data () {
    return {
      imageIlha: Object.freeze(imageIlha),
      imageMar: Object.freeze(imageMar),
      introSurfaceA: Object.freeze(introSurfaceA),
      introSurfaceB: Object.freeze(introSurfaceB),
      graphicTartaruga: Object.freeze(graphicTartaruga),
      graphicGolfinho: Object.freeze(graphicGolfinho),
      graphicRaia: Object.freeze(graphicRaia),
      imageAboutIlha: Object.freeze(imageAboutIlha),
      imageAboutProfundidade: Object.freeze(imageAboutProfundidade),
      imageAboutMapa: Object.freeze(imageAboutMapa),
      imageLogoLaje: Object.freeze(imageLogoLaje),
      imageIconLaje: Object.freeze(imageIconLaje),
      imageMergulhoBolha01: Object.freeze(imageMergulhoBolha01),
      imageMergulhoBolha02: Object.freeze(imageMergulhoBolha02),
      imageMergulhoBolha03: Object.freeze(imageMergulhoBolha03),
      imagePeixes: Object.freeze(imagePeixes),
      imageFundoPontoMergulho: Object.freeze(imageFundoPontoMergulho),
      imageGraficoEstrelaMar: Object.freeze(imageGraficoEstrelaMar),
      boatFigure: Object.freeze(boatFigure),
      isRenderOcean: true,
      isApple: false,
      isSafari: false,
      isIos: false,
      rellax: null
    };
  },

  mounted () {
    this.headerOverlay = true;
    this.head.title = this.$gettext('A Laje de Santos em Realidade Virtual');
    this.head.description = this.$gettext('Projeto de mapear a Laje de Santos em realidade virtual');
    this.rellax = new Rellax('.rellax');
    const browser = Bowser.getParser(window.navigator.userAgent);
    const osName = browser.getOSName(true);
    this.isIos = osName === 'ios';
    this.isSafari = browser.satisfies({
      // declare browsers per OS
      macos: {
        safari: '>10.1'
      }
    });
    this.isApple = this.isIos || this.isSafari;
    this.isRenderOcean = ('forceOcean' in this.$route.query) ? (this.$route.query.forceOcean === 'true') : !this.isApple;

    this.observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0) {
            this.$refs.googleEarth.play();
          }
        });
      });
    this.observer.observe(this.$refs.googleEarth);
  },
  beforeDestroy () {
    this.observer.unobserve(this.$refs.googleEarth);
    this.observer = null;
  }

};
</script>
