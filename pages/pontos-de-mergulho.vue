<template>
  <article class="dive-container">
    <aside class="dive-aside">
      <section class="section-base">
        <div v-show="selectedSite == -1">
          <h1>
            <i18n>
              Pontos de Mergulho na Laje de Santos
            </i18n>
          </h1>

          <p>
            <i18n>
              Clique em um ponto de mergulho para ter mais informações.
            </i18n>
          </p>

          <p>
            <i18n>
              A Laje de Santos é um local popular para a prática do mergulho. Próxima da cidade de São Paulo, a 1h30m de barco da costa e
              com uma diversidade de espécies que poucos lugares são capazes de igualar, raramente com menos de 10 metros de visibilidade.
              Selecione um local para ter mais informações.
            </i18n>
          </p>

          <p>
            <i18n>Fontes das informações:</i18n>
            <a target="_blank" href="https://www.lajeviva.org.br/Lajeviva/parque/pontos-de-mergulho/">Instituto Laje Viva</a>,
            <a target="_blank" href="http://arquivos.ambiente.sp.gov.br/fundacaoflorestal/2014/04/Plano-Emergencial-de-Uso-P%C3%BAblico_PEMLS_versaoFinal.pdf">Plano Emergencial de Uso Público do PEMLS</a>
            <a target="_blank" href="https://smastr16.blob.core.windows.net/consema/2018/11/e-laje-de-santos-plano-de-manejo.pdf">Plano de Manejo da Laje de Santos</a>
          </p>
        </div>
        <div
          v-show="selectedSite != -1"
        >
          <h2 class="subtitle is-3">
            {{ selectedSiteData.name }}
          </h2>
          <div>
            <p class="dive-dificuldade">
              {{ selectedSiteData.dificuldade }}
            </p>
            <p class="dive-coordinates">
              Latitude: {{ selectedSiteData.lat }} Longitude: {{ selectedSiteData.long }}
            </p>
            <p>
              <span class="dive-description">{{ selectedSiteData.description }}</span>
            </p>
          </div>
          <div>
            <GalleryCard
              v-for="(a, i) in filteredGallery"
              :key="i"
              v-bind:creator="a.creator"
              v-bind:creatorLink="a.creatorLink"
              v-bind:license="a.license"
              v-bind:url="a.url"
              v-bind:absoluteurl="a.absoluteurl"
              v-bind:description="a.description"
              v-bind:type="a.type"
            />
          </div>
        </div>
      </section>
    </aside>

    <section class="dive-3d">
      <Ilha3D
        :dive-sites="diveSites"
        v-on:pick="pick"
      />
    </section>
  </article>
</template>

<script>
import page from './page.vue';
import Ilha3D from '~/components/Ilha3D.vue';
import GalleryCard from '~/components/GalleryCard.vue';
import galleryData from '~/components/galleryData.js';

export default {
  components: {
    GalleryCard,
    Ilha3D
  },

  extends: page,

  data () {
    return {
      gallery: galleryData,
      selectedSite: -1,
      diveSites: [
        { name: 'Portinho',
          lat: -24.318083,
          long: -46.183444,
          description: 'Baixo grau de dificuldade.',
          dificuldade: 'A face norte é o local onde ocorre a maioria dos mergulhos, com profundidade de até 22m, mais abrigado das correntes e de fácil orientação.'
        },
        { name: 'Moréia',
          lat: -24.317056,
          long: -46.182083,
          description: 'Baixo grau de dificuldade.',
          dificuldade: 'Naufrágio do Moréia, um pesqueiro de ferro com 15m de comprimento. Na face norte, próximo à ponta leste, com estrutura em estado instável, desaconselhando penetração, profundidade máxima de 22m.'
        },
        { name: 'Piscinas',
          lat: -24.321667,
          long: -46.184306,
          description: 'Médio grau de dificuldade.',
          dificuldade: 'Na ponta oeste/sudoeste da Laje, ambiente com profundidade que varia de 10 a 35m e requer boa noção de orientação subaquática.'
        },
        { name: 'Boca da Baleia',
          lat: -24.316778,
          long: -46.179083,
          description: 'Fenda voltada para leste, com cerca de 50m de extensão e profundidade média de 15m. Requer excelente condição de mar e direção de ondulação adequada para que se possa adentrar.',
          dificuldade: 'Alto grau de dificuldade'
        },
        { name: 'Paredão Face Sul',
          lat: -24.320333,
          long: -46.180194,
          description: 'Médio grau de dificuldade.',
          dificuldade: 'Encosta rochosa íngreme que desce verticalmente até 42m de profundidade. Mergulhos feitos em "drifting" a favor da corrente. Formação com inclinação negativa entre 12 e 27m de profundidade do centro para leste.'
        },
        { name: 'Parcel das Âncoras',
          lat: -24.321833,
          long: -46.184972,
          description: 'Alto grau de dificuldade.',
          dificuldade: 'Fundo rochoso que se destaca da Laje em direção ao continente, apresenta estrutura complexa, exigindo boa orientação subaquática. Profundidade entre 18 e 42m. Presença de muitas âncoras de pesqueiros que ficaram presas ao fundo rochoso. Sujeito a correntes.'
        },
        { name: 'Parcel do Sul',
          lat: -24.326917,
          long: -46.183722,
          description: 'Médio grau de dificuldade.',
          dificuldade: 'Formação submersa a cerca de 400m a sudoeste da Laje, inicia aos 8m e segue até os 42m. Requer mar em boas condições, mas a formação permite orientação e deslocamento mais simples.'
        },
        { name: 'Calhaus Face Norte',
          lat: -24.327167,
          long: -46.161667,
          description: 'Baixo a médio grau de dificuldade.',
          dificuldade: 'Paredão levemente acidentado, com características de navegação subaquática semelhantes ao portinho da Laje, com profundidades que podem variar de 8 a 25m, passando a até 35m se houver afastamento das rochas na direção norte (sentido Laje).'
        },
        { name: 'Calhaus Face Sul',
          lat: -24.32825,
          long: -46.159278,
          description: 'Paredão levemente acidentado com incidência de correntes e profundidades que podem variar de 8 a 40m.',
          dificuldade: 'Alto grau de dificuldade.'
        },
        { name: 'Calhaus Túnel',
          lat: -24.328,
          long: -46.160722,
          description: 'Passagem em forma de ”U” e um arco central emerso, com grande apelo visual e profundidade máxima de 18m, porém exige bom equilíbrio hidrostático por parte do mergulhador. Sujeito a boas condições de mar.',
          dificuldade: 'Baixo grau de dificuldade.'
        },
        { name: 'Parcel Novo',
          lat: -24.345472,
          long: -46.173972,
          description: 'Alto grau de dificuldade.',
          dificuldade: 'Formação submersa localizada cerca de 1,5 milhas náuticas ao sul da Laje que inicia aos 26m de profundidade e chega aos 45m. Exige mar em excelentes condições e preparo adequado dos mergulhadores.'
        },
        { name: 'Parcel do Brilhante',
          lat: -24.28888889,
          long: -46.16388889,
          description: '-',
          dificuldade: 'Não há atividade turística. Área de preservação.'
        },
        { name: 'Laje do Bandolim',
          lat: -24.27666667,
          long: -46.18194444,
          description: '-',
          dificuldade: 'Não há atividade turística. Área de preservação.'
        }
      ]
    };
  },

  computed: {
    filteredGallery () {
      if (this.selectedSite === -1) {
        return [];
      }
      const name = this.diveSites[this.selectedSite].name;
      const r = name ? new RegExp(name, 'i') : null;
      return this.gallery.filter((i) => {
        // texto
        if (r && i.description.search(r) === -1) {
          return false;
        }
        return true;
      }, this);
    },

    selectedSiteData () {
      if (this.selectedSite === -1) {
        return {};
      }
      return this.diveSites[this.selectedSite];
    }
  },

  mounted () {
    this.head.title = this.$gettext('Projeto Laje de Santos Virtual');
    this.head.description = this.$gettext('Sobre o projeto Laje de Santos Virtual');
  },

  methods: {
    pick (diveSite) {
      for (let i = 0; i < this.diveSites.length; i++) {
        if (this.diveSites[i].name === diveSite) {
          this.selectedSite = i;
          break;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.dive-container {
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  width: 100%;
  height: 100vh;

  .dive-aside {
    flex-basis: 20%;
    min-width: 500px;
    max-height: 100%;
    overflow-y: auto;
  }

  .dive-3d {
    flex-grow: 1;
    height: 100%;
    display: flex;
  }
}

</style>
