<template>
  <article class="container">
    <h1 class="title">
      <font-awesome-icon :icon="['fas', 'fish']" />
      <font-awesome-icon :icon="['fas', 'dove']" />
      Fauna
    </h1>
    <p>
      Foram já identificadas 196 espécies de peixes na Laje de Santos.
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
                Filtros
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Cor
            </label>
            <div class="control">
              <div
                class="select"
              >
                <select
                  v-model="filterColor"
                >
                  <option value="">
                    Todas as cores
                  </option>
                  <option value="black">
                    Preto
                  </option>
                  <option value="blue">
                    Azul
                  </option>
                  <option value="yellow">
                    Amarelo
                  </option>
                  <option value="orange">
                    Laranja
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Tamanho (em cm)
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
              Nome
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

    <section
      v-for="(a, i) in filteredAnimals"
      :key="i"
      class="section section-fauna"
    >
      <figure>
        <img class="fauna-image" src="~assets/images/fish/goldfish-1900832_960_720.png">
      </figure>
      <h2 class="fauna-name">
        {{ a.name }}
      </h2>
      <h3 class="fauna-other-names">
        {{ a.othernames }}
      </h3>
      <p class="fauna-info">
        {{ a.size }} cm
      </p>
      <p>{{ a.description }}</p>
    </section>
  </article>
</template>

<script>
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';

export default {
  data () {
    return {
      animals: [
        {
          name: 'Nome do animal',
          colors: ['orange', 'red'],
          size: 5,
          pic: '~assets/images/fish/goldfish-1900832_960_720.png',
          othernames: 'Nome científico e outros nomes',
          description: 'Sobre o bicho bla bla bla'
        },
        {
          name: 'Outro animal',
          colors: ['blue', 'black'],
          size: 20,
          pic: '~assets/images/fish/goldfish-1900832_960_720.png',
          othernames: 'Nome científico e outros nomes',
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
    noUiSlider.create(
      this.$refs.slider, this.slider
    );
    this.$refs.slider.noUiSlider.on('update', (values, handle) => {
      this.minRange = parseInt(values[0], 10);
      this.maxRange = parseInt(values[1], 10);
    });
  },

  head: {
    title: 'Fauna da Laje de Santos',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Fauna aviária e aquática na Laje de Santos'
      }
    ]
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
</style>
