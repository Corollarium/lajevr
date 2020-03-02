<template>
  <div>
    <section class="hero is-fullheight">
      <div class="hero-body">
        <Ocean />
        <div class="hero-html container">
          <div class="hero-title">
            LAJE DE SANTOS
          </div>
          <p class="attribution">
            Photo
            <a
              href="//commons.wikimedia.org/w/index.php?title=User:Afcarv&amp;action=edit&amp;redlink=1"
              class="new"
              title="User:Afcarv (page does not exist)"
            >Anael Ferraz de Carvalho</a>
            -
            <span class="int-own-work" lang="en">Own work</span>,
            <a
              href="https://creativecommons.org/licenses/by-sa/3.0"
              title="Creative Commons Attribution-Share Alike 3.0"
            >CC BY-SA 3.0</a>
            <a href="https://commons.wikimedia.org/w/index.php?curid=40439744">Link</a>
          </p>
        </div>
      </div>
    </section>
    <section class="description">
      <figure class="image">
        <img :src="imagePeixes.src" :srcset="imagePeixes.srcSet" style="object-fit: cover; min-height: 70vh;" class="fade-bottom" alt="Cardume de Xira">
        <figcaption class="attribution">
          By <a href="//commons.wikimedia.org/w/index.php?title=User:Rafa_Tecchio&amp;action=edit&amp;redlink=1" class="new" title="User:Rafa Tecchio (page does not exist)">Rafa Tecchio</a> - <span class="int-own-work" lang="en">Own work</span>, <a href="https://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=40644073">Link</a>
        </figcaption>
      </figure>
      <div class="text-over-image">
        <div class="description-content" data-aos="slide-left">
          <p>
            O <span class="text-larger">Parque Estadual Marinho da Laje de Santos</span> é uma area de proteção da
            biodiversidade marinha e aviária.
          </p>
        </div>
      </div>
    </section>
    <section class="description">
      <figure class="image">
        <img :src="imageMapNoBorders.src" :srcset="imageMapNoBorders.srcSet" alt="Mapa-mundi com a Laje de Santos">
      </figure>
      <div class="text-over-image">
        <div class="description-content" style="color: #c00" data-aos="slide-left">
          <p>
            <i18n>Fica na costa do Estado de São Paulo.</i18n>
          </p>
        </div>
      </div>
    </section>

    <section id="map" class="map" style="background: linear-gradient(#FFFFFF, #46BCEC,); color: #000;">
      <figure class="image center-crop">
        <img :src="imageMapaGeral2.src" :srcset="imageMapaGeral2.srcSet" class="fade-top" alt="Mapa da Laje de Santos">
      </figure>
    </section>

    <section id="mantas" class="columns" style="background: #46BCEC; margin-bottom: 0;">
      <div class="column">
        <GLTFModel
          :model="'./models/manta/scene.gltf'"
          :background-color="0x46BCEC"
          :link="'https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8'"
          :attribution="'Modelo 3D CC BY-NC por misaooo'"
        />
        </GLTFModel>
      </div>
      <div class="column">
        <Bubbles />
        <div class="description">
          <div class="description-content" data-aos="fade-left">
            No inverno <nuxt-link to="/manta">
              as raias mantas
            </nuxt-link> passam pela Laje. Chegam a 8 metros de envergadura e 2 toneladas. Estão vulneráveis à extinção.
          </div>
        </div>
      </div>
    </section>

    <section id="numeros" class="section" style="background: linear-gradient(#46BCEC, #FFFFFF); color: #000;">
      <div class="container">
        <h2 class="title is-1">
          <i18n>
            A Laje em Números
          </i18n>
        </h2>
        <div class="number-wrapper">
          <number-bullet
            :to="550"
          >
            <i18n>
              metros de comprimento
            </i18n>
          </number-bullet>
          <number-bullet
            :to="33"
          >
            <i18n>
              metros de altura
            </i18n>
          </number-bullet>
          <number-bullet
            :to="185"
          >
            <i18n>
              metros de largura
            </i18n>
          </number-bullet>
          <number-bullet
            :to="5000"
          >
            <i18n>
              hectares preservados
            </i18n>
          </number-bullet>
          <number-bullet
            :to="45"
          >
            <i18n>
              metros de profundidade máxima
            </i18n>
          </number-bullet>
          <number-bullet
            :to="40.7"
            :format="num => new Intl.NumberFormat().format(parseFloat(num).toFixed(1))"
          >
            <i18n>
              quilômetros da costa
            </i18n>
          </number-bullet>
          <number-bullet
            :to="29"
          >
            <i18n>
              espécies de aves
            </i18n>
          </number-bullet>
          <number-bullet
            :to="196"
          >
            <i18n>
              espécies de peixes
            </i18n>
          </number-bullet>
        </div>
      </div>
    </section>
    <section class="description">
      <div class="description-content">
        <p>
          Já de longe a Laje é visível, com a linda forma de uma baleia.
        </p>
      </div>
    </section>
    <section id="timeline" class="section">
      <Timeline />
    </section>
    <section id="explore" class="section">
      <h1 class="title is-1">
        Explore mais
      </h1>
      <div class="buttons are-large is-centered">
        <nuxt-link to="/mergulho-virtual" class="button">
          Mergulho
        </nuxt-link>
        <nuxt-link to="/vida" class="button">
          Vida
        </nuxt-link>
        <nuxt-link to="/fauna" class="button">
          Catálogo
        </nuxt-link>
        <nuxt-link to="/tecnologia" class="button">
          Tecnologia
        </nuxt-link>
        <nuxt-link to="/sobre" class="button">
          Sobre
        </nuxt-link>
      </div>
    </section>
  </div>
</template>

<script>
import page from './page.vue';
import Timeline from '~/components/Timeline.vue';
import Ocean from '~/components/Ocean.vue';
import GLTFModel from '~/components/GLTFModel.vue';
import Bubbles from '~/components/Bubbles.vue';
// import Globe from '~/components/Globe.vue';
const imagePeixes = require('~/assets/images/laje/1280px-SP_-_Parque_Estadual_Marinho_Laje_de_Santos_-_Cardume_de_Xira_2.jpg?resize');
const imageMapNoBorders = require('~/assets/images/maps/BlankMap-World-noborders.png?resize');
const imageMapaGeral2 = require('~/assets/images/maps/MapaGeral2.png?resize');

export default {
  components: {
    Timeline,
    Ocean,
    GLTFModel,
    Bubbles
  },

  extends: page,

  data () {
    return {
      imagePeixes,
      imageMapNoBorders,
      imageMapaGeral2
    };
  },

  mounted () {
    this.head.title = this.$gettext('A Laje de Santos em Realidade Virtual');
    this.head.description = this.$gettext('Projeto de mapear a Laje de Santos em realidade virtual');
  }

};
</script>

<style lang="less">
@import '~assets/css/index.less';

.background-light {
  background-color: #72797D;
}
.background-dark {
  background-color: #05111f;
}

.center-crop {
  position: relative;
  height: 100vh;
  overflow: hidden;

  > img {
    max-width: initial;
    height: 100vh;
    width: auto;
    position: absolute;
    top: -9999px;
    bottom: -9999px;
    left: -9999px;
    right: -9999px;
    margin: auto;
  }
}

.bubbles {
  background: transparent;
  position: absolute;
}

</style>
