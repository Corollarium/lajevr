<template>
  <div>
    <section class="sticky-hero">
      <div class="sticky-hero-content">
        <Ocean :forceLoad="true" />
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
            <h1>
              <i18n>Laje de Santos</i18n>
            </h1>
            <p class="text-larger">
              O Parque Estadual Marinho da Laje de Santos é uma area de proteção da
              biodiversidade marinha e aviária.
            </p>
          </section>
        </div>
      </div>
    </section>

    <section class="section">
      <div bp="grid 12 6@md">
        <div class="description">
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
        <div>
          <section class="section">
            <figure class="image">
              <img :src="imageIlha.src" :srcset="imageIlha.srcSet" alt="Mapa esquematizado da Laje de Santos">
            </figure>
          </section>
        </div>
      </div>
      <div bp="grid 12 6@md">
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
      <div bp="grid 12 6@md">
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
  </div>
</template>

<script>
import page from './page.vue';
import Ocean from '~/components/OceanB.vue';
// import Globe from '~/components/Globe.vue';
// const imagePeixes = require('~/assets/images/laje/1280px-SP_-_Parque_Estadual_Marinho_Laje_de_Santos_-_Cardume_de_Xira_2.jpg?resize');
// const imageIlha = require('~/assets/images/graficos/ilha-desktop.png?resize');
// const imageMapDistance = require('~/assets/images/graficos/mapa.png?resize');
// const imageProfundidade = require('~/assets/images/graficos/profundidade.png?resize');
// const imageMapNoBorders = require('~/assets/images/maps/BlankMap-World-noborders.png?resize');
// const imageMapaGeral2 = require('~/assets/images/maps/MapaGeral2.png?resize');

// pivaNew
const imageLogoLaje = require('~/assets/images/logos/logo-laje-de-santos.png?resize');

export default {
  components: {
    Ocean
  },

  extends: page,

  data () {
    return {
      //      imagePeixes,
      //      imageIlha,
      //      imageMapDistance,
      //      imageProfundidade,
      //      imageMapNoBorders,
      //      imageMapaGeral2,
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
</style>
