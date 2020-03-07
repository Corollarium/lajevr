<template>
  <div>
    <section v-show="!isSafari" class="sticky-hero">
      <div class="sticky-hero-content">
        <Ocean />
        <div class="sticky-hero-attribution">
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
      <div class="sticky-back">
        <div class="description">
          <section class="section description-content">
            <img :src="imageLogoLaje" :srcset="imageLogoLaje.srcSet" alt="Laje de Santos - logo">
          </section>
        </div>
      </div>
    </section>
    <section v-show="isSafari" class="hero">
      <div class="hero-body">
        <img :src="imageIlhaFoto.src" :srcset="imageIlhaFoto.srcSet" alt="Laje de Santos">
      </div>
      <div class="hero-html">
        <section class="section description-content">
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
        </section>
      </div>
    </section>

    <section class="section">
      <div bp="grid 12 6@md vertical-center">
        <div class="description">
          <section class="section description-content">
            <figure class="image">
              <img :src="imageIconLaje.src" :srcset="imageIconLaje.srcSet" alt="Ícone da Laje de Santoss">
            </figure>
            <h1>
              <i18n>Laje de Santos</i18n>
            </h1>
            <p class="text-larger">
              O Parque Estadual Marinho da Laje de Santos é uma area de proteção da
              biodiversidade marinha e aviária.
            </p>
          </section>
        </div>
        <div>
          <section class="section">
            <figure class="image">
              <img :src="imageIlha.src" :srcset="imageIlha.srcSet" alt="Mapa esquematizado da Laje de Santos">
            </figure>
          </section>
        </div>
      </div>
      <div bp="grid 12 6@md vertical-center">
        <div>
          <section class="section">
            <figure class="image">
              <img :src="imageMapDistance.src" :srcset="imageMapDistance.srcSet" alt="Mapa esquematizado da Laje de Santos">
            </figure>
          </section>
        </div>
        <div bp="first first@sm last@md">
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
      <div bp="grid 12 6@md vertical-center">
        <div>
          <section class="section">
            <p class="text-larger">
              <i18n>A Laje oferece ótimas condições de mergulho, com boa visibilidade da água e muita vida, sendo um dos principais pontos do país.</i18n>
            </p>
          </section>
        </div>
        <div>
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
        <img :src="imagePeixes.src" :srcset="imagePeixes.srcSet" style="object-fit: cover; min-height: 70vh;" class="fade-top-bottom" alt="Cardume de Xira">
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
          <i18n>Mergulho virtual</i18n>
        </h2>
        <p>
          <i18n>
            Experimente como é mergulhar na Laje de Santos do seu próprio navegador.
          </i18n>
        </p>
        <p>
          <nuxt-link class="button-is-liquid" to="/mergulho-virtual">
            <span class="button-is-liquid__text"><i18n>Mergulhe agora</i18n></span>
            <span class="button-is-liquid__animation" />
          </nuxt-link>
        </p>
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
      <div style="text-align: center">
        <figure class="image image-fish">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Peixe_Frade.jpg/320px-Peixe_Frade.jpg" alt="Salmeidas / CC BY-SA (https://creativecommons.org/licenses/by-sa/3.0)">
          <figcaption>
            Peixe frade
          </figcaption>
        </figure>
        <figure class="image image-fish">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Mola_mola2.jpg/240px-Mola_mola2.jpg" alt="OpenCage / CC BY-SA (https://creativecommons.org/licenses/by-sa/2.5)">
          <figcaption>
            Peixe lua
          </figcaption>
        </figure>

        <figure class="image image-fish">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Tartaruga_da_Laje.jpg/320px-Tartaruga_da_Laje.jpg" alt="Ronaldo art [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons">
          <figcaption>
            Tartaruga de pente
          </figcaption>
        </figure>
        <figure class="image image-fish">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Dactylopterus_volitans.jpg/320px-Dactylopterus_volitans.jpg" alt="cralize / CC BY-SA (http://creativecommons.org/licenses/by-sa/3.0/)">
          <figcaption>
            Coió
          </figcaption>
        </figure>
      </div>

      <div style="text-align: center">
        <nuxt-link class="button-is-liquid" to="/vida">
          <span class="button-is-liquid__text"><i18n>Mais sobre a vida</i18n></span>
          <span class="button-is-liquid__animation" />
        </nuxt-link>

        <nuxt-link class="button-is-liquid" to="/especies">
          <span class="button-is-liquid__text"><i18n>Catálogo de espécies</i18n></span>
          <span class="button-is-liquid__animation" />
        </nuxt-link>
      </div>
    </section>

    <section id="mantas" bp="grid 12 6@md">
      <div>
        <GLTFModel
          :model="'./models/manta/scene.gltf'"
          :link="'https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8'"
          :attribution="'Modelo 3D CC BY-NC por misaooo'"
        />
        </GLTFModel>
      </div>
      <div>
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
        <h2 class="has-text-center">
          <i18n>
            A Laje em Números
          </i18n>
        </h2>
        <div class="number-wrapper" bp="grid 6@sm 4@md 3@lg">
          <number-bullet
            :to="550"
          >
            <i18n>
              Metros de comprimento
            </i18n>
          </number-bullet><number-bullet
            :to="33"
          >
            <i18n>
              Metros de altura
            </i18n>
          </number-bullet><number-bullet
            :to="185"
          >
            <i18n>
              Metros de largura
            </i18n>
          </number-bullet><number-bullet
            :to="5000"
          >
            <i18n>
              Hectares preservados
            </i18n>
          </number-bullet><number-bullet
            :to="45"
          >
            <i18n>
              Metros de profundidade máxima
            </i18n>
          </number-bullet><number-bullet
            :to="40.7"
            :format="num => new Intl.NumberFormat().format(parseFloat(num).toFixed(1))"
          >
            <i18n>
              Quilômetros da costa
            </i18n>
          </number-bullet><number-bullet
            :to="29"
          >
            <i18n>
              Espécies de aves
            </i18n>
          </number-bullet><number-bullet
            :to="196"
          >
            <i18n>
              Espécies de peixes
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
import Bowser from 'bowser';
import page from './page.vue';
import Timeline from '~/components/Timeline.vue';
import Ocean from '~/components/OceanB.vue';
import GLTFModel from '~/components/GLTFModel.vue';
import Bubbles from '~/components/Bubbles.vue';
// import Globe from '~/components/Globe.vue';
const imagePeixes = require('~/assets/images/laje/1280px-SP_-_Parque_Estadual_Marinho_Laje_de_Santos_-_Cardume_de_Xira_2.jpg?resize');
const imageIlha = require('~/assets/images/graficos/ilha-desktop.png?resize');
const imageIlhaFoto = require('~/assets/images/laje/Laje_de_Santos.jpg?resize');
const imageMapDistance = require('~/assets/images/graficos/mapa.png?resize');
const imageProfundidade = require('~/assets/images/graficos/profundidade.png?resize');
const imageMapNoBorders = require('~/assets/images/maps/BlankMap-World-noborders.png?resize');
const imageMapaGeral2 = require('~/assets/images/maps/MapaGeral2.png?resize');
const imageLogoLaje = require('~/assets/images/logos/logo-laje-de-santos.png?resize');
const imageIconLaje = require('~/assets/images/graficos/icon-laje.png?resize');

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
      imageIlhaFoto,
      imageMapDistance,
      imageProfundidade,
      imageMapNoBorders,
      imageMapaGeral2,
      imageLogoLaje,
      imageIconLaje,
      isSafari: false
    };
  },

  mounted () {
    this.head.title = this.$gettext('A Laje de Santos em Realidade Virtual');
    this.head.description = this.$gettext('Projeto de mapear a Laje de Santos em realidade virtual');
    const browser = Bowser.getParser(window.navigator.userAgent);
    this.isSafari = browser.satisfies({
      // declare browsers per OS
      macos: {
        safari: '>10.1'
      },

      // per platform (mobile, desktop or tablet)
      mobile: {
        safari: '>=9'
      }
    });
  }

};
</script>

<style lang="less" scoped>
h1, h2 {
  text-transform: uppercase
}

.sticky-hero {
  height: 300vh;
  position: relative;

  .sticky-hero-content {
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    position: sticky;
    top: 0px;
  }

  .sticky-hero-attribution {
    margin: 0 auto;
    position: static;
    width: auto;
    max-width: 1280px;
  }

  .sticky-back {
    position: absolute;
    height: 70vh;
    height: calc(var(--vh, 1vh) * 70);
    bottom: 0;
    width: 100%;
  }

}

.image-fish {
  display: inline-block
}

.bubbles {
  background: transparent;
  position: absolute;
}
</style>
