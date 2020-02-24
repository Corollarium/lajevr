<template>
  <article class="container">
    <h1 class="title">
      <font-awesome-icon :icon="['fas', 'fish']" />
      <font-awesome-icon :icon="['fas', 'dove']" />
      Fauna
    </h1>
    <p>
      <i18n>Foram já identificadas 196 espécies de peixes na Laje de Santos.</i18n>
      <a
        href="https://www.semanticscholar.org/paper/The-reef-fish-assemblage-of-the-Laje-de-Santos-with-Luiz-Carvalho-Filho/53b6a911443d42724e6c0e75ff5eeebbc7c4ab59"
      >The reef fish assemblage of the Laje de Santos Marine State Park, Southwestern Atlantic: annotated checklist with comments on abundance, distribution, trophic structure, symbiotic associations, and conservation</a>
      http://www.lajeviva.org.br/Lajeviva/wp-content/uploads/2015/10/2008_Luiz-Jr-et-al-Reef-Fishes-of-Laje-de-Santos-Marine-Park-ZOOTAXA.pdf
      https://smastr16.blob.core.windows.net/consema/2018/11/e-laje-de-santos-plano-de-manejo.pdf
    </p>

    <form id="filters" class="form">
      <div class="field is-horizontal ">
        <div class="field-body">
          <div class="field">
            <div class="control">
              <span style="font-weight: bold; font-size: 1.4em;">
                <i18n>
                  Filtros
                </i18n>
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label">
              <i18n>
                Cor
              </i18n>
            </label>
            <div class="control">
              <div
                class="select"
              >
                <select
                  v-model="filterColor"
                  :style="{'background-color': filterColor}"
                >
                  <option v-translate value="">
                    Todas as cores
                  </option>
                  <option v-translate value="black">
                    Preto
                  </option>
                  <option v-translate value="blue">
                    Azul
                  </option>
                  <option v-translate value="red">
                    Vermelho
                  </option>
                  <option v-translate value="yellow">
                    Amarelo
                  </option>
                  <option v-translate value="orange">
                    Laranja
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">
              <i18n>
                Tamanho (em cm)
              </i18n>
            </label>
            <div class="control">
              <div>
                <output>{{ minRange }}</output>
                <output style="float: right;">{{ maxRange }}</output>
              </div>
              <div id="slider" ref="slider" />
            </div>
          </div>
          <div class="field">
            <label class="label">
              <i18n>
                Nome
              </i18n>
            </label>
            <div class="control has-icons-left">
              <input v-model="filterSearch" class="input" type="text" placeholder="busque">
              <span class="icon is-small is-left">
                <font-awesome-icon :icon="['fas', 'search']" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>

    <transition-group
      name="fauna-list"
      tag="div"
    >
      <section
        v-for="a in filteredAnimals"
        :key="a.name"
        class="section section-fauna"
      >
        <figure>
          <img :src="a.pic" class="fauna-image">
        </figure>
        <div class="fauna-name">
          {{ a.name }}
        </div>
        <span class="fauna-other-names">
          {{ a.othernames }}
        </span>
        <p class="fauna-info">
          {{ a.size }} cm
        </p>
        <p>{{ a.description }}</p>
      </section>
    </transition-group>
  </article>
</template>

<script>
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import page from './page.vue';

export default {
  extends: page,
  data () {
    return {
      animals: [
        {
          name: 'Nome do animal',
          colors: ['orange', 'red'],
          size: 5,
          pic: '/images/fish/goldfish-1900832_960_720.png',
          othernames: 'Nome científico e outros nomes',
          description: 'Sobre o bicho bla bla bla'
        },
        {
          name: 'Blue animal',
          colors: ['blue', 'black'],
          size: 20,
          pic: '/images/fish/bluefish-1900832_960_720.png',
          othernames: 'Blue fish',
          description: 'Sobre o bicho bla bla bla'
        },
        {
          name: 'Red fish',
          colors: ['orange', 'red'],
          size: 5,
          pic: '/images/fish/goldfish-1900832_960_720.png',
          othernames: 'Nome científico e outros nomes',
          description: 'Sobre o bicho bla bla bla'
        },
        {
          name: 'Outro blue fish',
          colors: ['blue', 'black'],
          size: 20,
          pic: '/images/fish/bluefish-1900832_960_720.png',
          othernames: 'Other blue fish',
          description: 'Sobre o bicho bla bla bla'
        }
      ],
      filterColor: '', // TODO https://vue-select.org/guide/slots.html
      filterSearch: '',
      minRange: null,
      maxRange: null,
      slider: {
        range: {
          min: 0,
          max: 200
        },
        step: 5,
        margin: 5,
        start: [0, 200],
        connect: true,
        pips: {
          mode: 'count',
          values: 9,
          density: 3
        }
      }
    };
  },

  computed: {
    filteredAnimals () {
      return this.animals.filter((i) => {
        // TODO if (this.filterSearch && (i.description.match())
        if (i.size < this.minRange || i.size > this.maxRange) {
          return false;
        }
        if (this.filterColor && !i.colors.includes(this.filterColor)) {
          return false;
        }
        return true;
      }, this);
    }
  },

  mounted () {
    this.head.title = this.$gettext('Espécies da Laje de Santos');
    this.head.description = this.$gettext('Espécies aviáticas e aquáticas da Laje de Santos');

    noUiSlider.create(
      this.$refs.slider, this.slider
    );
    this.$refs.slider.noUiSlider.on('update', (values, handle) => {
      this.minRange = parseInt(values[0], 10);
      this.maxRange = parseInt(values[1], 10);
    });
  }
};
</script>

<style lang="less" scoped>
#filters {
  margin-top: 1em;
}
.section-fauna {
  width: 300px;
  display: inline-block;
  vertical-align: top;

  .fauna-name {
    font-variant: small-caps;
    color: #4a4a4a;
    font-size: 1.5rem;
    font-weight: 400;
    line-height: 1.25;
  }

  .fauna-other-names {
    font-style: italic;
  }
}
.control {
  margin-right: 3em;
}

// Transitions
.fauna-list-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.fauna-list-enter, .fauna-list-leave-to{
  opacity: 0;
  transform: translateY(30px);
}
.fauna-list-leave-active {
  position: absolute;
}
.fauna-list-move {
  transition: transform 1s;
}
</style>
