<template>
  <div>
    <section class="hero is-fullheight">
      <div class="hero-body">
        <Ocean />
        <div class="hero-html container">
          <!--div class="hero-image">
            <figure class="image">
              <img :src="imageLogoLaje.src" :srcset="imageLogoLaje.srcSet" alt="Logo Laje de Santos">
            </figure>
          </div -->
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
    <section class="section">
      <div class="pure-g">
        <div class="pure-u-1 pure-u-md-1-2 description">
          <section class="section description-content">
            <h1>
              <i18n>Laje de Santos</i18n>
            </h1>
            <p class="text-larger">
              O Parque Estadual Marinho da Laje de Santos é uma area de proteção da
              biodiversidade marinha e aviária.
            </p>
          </section>
        </div>
        <div class="pure-u-1 pure-u-md-1-2">
          <section class="section">
            <figure class="image">
              <img :src="imageIlha.src" :srcset="imageIlha.srcSet" alt="Mapa esquematizado da Laje de Santos">
            </figure>
          </section>
        </div>
      </div>
      <div class="pure-g">
        <div class="pure-u-1 pure-u-md-1-2">
          <section class="section">
            <figure class="image">
              <img :src="imageMapDistance.src" :srcset="imageMapDistance.srcSet" alt="Mapa esquematizado da Laje de Santos">
            </figure>
          </section>
        </div>
        <div class="pure-u-1 pure-u-md-1-2">
          <section class="section">
            <p class="text-larger">
              <i18n>
                Uma ilha na forma de baleia que surge no mar aberto, a 40km da costa do Estado de São Paulo, no Brasil.
              </i18n>
            </p>
            <figure class="image">
              <img :src="imageMapNoBorders.src" :srcset="imageMapNoBorders.srcSet" alt="Mapa-mundi com a Laje de Santos">
            </figure>
          </section>
        </div>
      </div>
      <div class="pure-g">
        <div class="pure-u-1 pure-u-md-1-2">
          <section class="section">
            <p class="text-larger">
              <i18n>A Laje oferece ótimas condições de mergulho, com boa visibilidade da água e muita vida, sendo um dos principais pontos do país.</i18n>
            </p>
          </section>
        </div>
        <div class="pure-u-1 pure-u-md-1-2">
          <section class="section">
            <figure class="image">
              <img :src="imageProfundidade.src" :srcset="imageProfundidade.srcSet" alt="Mapa profundidade da Laje de Santos">
            </figure>
          </section>
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
            <i18n />
          </p>
        </div>
      </div>
    </section>

    <section class="section">
      <div style="max-width: 500px; margin: 0 auto;">
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
    </section>

    <section id="mantas" class="columns" style="margin-bottom: 0;">
      <div class="column">
        <GLTFModel
          :model="'./models/manta/scene.gltf'"
          :background-color="0x001B33"
          :link="'https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8'"
          :attribution="'Modelo 3D CC BY-NC por misaooo'"
        />
        </GLTFModel>
      </div>
      <div class="column">
        <Bubbles />
        <div class="description">
          <div class="description-content" data-aos="fade-left">
            No inverno <nuxt-link to="/vida#manta">
              as raias mantas
            </nuxt-link> passam pela Laje. Chegam a 8 metros de envergadura e 2 toneladas. Estão vulneráveis à extinção.
          </div>
        </div>
      </div>
    </section>

    <section id="numeros" class="section">
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
          </number-bullet><number-bullet
            :to="33"
          >
            <i18n>
              metros de altura
            </i18n>
          </number-bullet><number-bullet
            :to="185"
          >
            <i18n>
              metros de largura
            </i18n>
          </number-bullet><number-bullet
            :to="5000"
          >
            <i18n>
              hectares preservados
            </i18n>
          </number-bullet><number-bullet
            :to="45"
          >
            <i18n>
              metros de profundidade máxima
            </i18n>
          </number-bullet><number-bullet
            :to="40.7"
            :format="num => new Intl.NumberFormat().format(parseFloat(num).toFixed(1))"
          >
            <i18n>
              quilômetros da costa
            </i18n>
          </number-bullet><number-bullet
            :to="29"
          >
            <i18n>
              espécies de aves
            </i18n>
          </number-bullet><number-bullet
            :to="196"
          >
            <i18n>
              espécies de peixes
            </i18n>
          </number-bullet>
        </div>
      </div>
    </section>
    <section id="timeline" class="section">
      <Timeline />
    </section>
  </div>
</template>

<script>
import page from './page.vue';
import Timeline from '~/components/Timeline.vue';
import Ocean from '~/components/OceanB.vue';
import GLTFModel from '~/components/GLTFModel.vue';
import Bubbles from '~/components/Bubbles.vue';
// import Globe from '~/components/Globe.vue';
const imagePeixes = require('~/assets/images/laje/1280px-SP_-_Parque_Estadual_Marinho_Laje_de_Santos_-_Cardume_de_Xira_2.jpg?resize');
const imageIlha = require('~/assets/images/graficos/ilha-desktop.png?resize');
const imageMapDistance = require('~/assets/images/graficos/mapa.png?resize');
const imageProfundidade = require('~/assets/images/graficos/profundidade.png?resize');
const imageMapNoBorders = require('~/assets/images/maps/BlankMap-World-noborders.png?resize');
const imageMapaGeral2 = require('~/assets/images/maps/MapaGeral2.png?resize');

// pivaNew
const imageLogoLaje = require('~/assets/images/logos/logo-laje-de-santos.png?resize');

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
      imageIlha,
      imageMapDistance,
      imageProfundidade,
      imageMapNoBorders,
      imageMapaGeral2,
      imageLogoLaje
    };
  },

  mounted () {
    this.head.title = this.$gettext('A Laje de Santos em Realidade Virtual');
    this.head.description = this.$gettext('Projeto de mapear a Laje de Santos em realidade virtual');
  }

};
</script>

<style lang="less" scoped>
h1, h2 {
  text-transform: uppercase
}

.number-wrapper .number-info {
  width: 20em !important;
}
.number-wrapper .number-info .number-round {
  width: 3.2em !important;
}

.bubbles {
  background: transparent;
  position: absolute;
}
</style>
