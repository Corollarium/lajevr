<template>
  <article bp="container">
    <div bp="grid">
      <h1 bp="12 4@lg">
        Espécies
      </h1>
      <form id="filters" bp="12 8@lg" class="form">
        <div bp="grid">
          <div bp="1 4@md">
            <label class="label">
              <i18n>
                Nome
              </i18n>
            </label>
            <div>
              <input v-model="filterSearch" class="input" type="text" placeholder="busque">
              <span class="icon is-small is-left">
                <font-awesome-icon :icon="['fas', 'search']" />
              </span>
            </div>
          </div>
          <div bp="1 2@md">
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
                  <option v-translate value="white">
                    Branco
                  </option>
                  <option v-translate value="grey">
                    Cinza
                  </option>
                  <option v-translate value="brown">
                    Marrom
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div bp="1 6@md">
          <label class="label">
            <i18n>
              Tamanho (em cm)
            </i18n>
          </label>
          <div id="slider-container">
            <div>
              <output>{{ minRange }}</output>
              <output style="float: right;">{{ maxRange }}</output>
            </div>
            <div id="slider" ref="slider" />
          </div>
        </div>
      </form>
    </div>
    </form>

    <p>
      <i18n>Foram já identificadas 196 espécies de peixes na Laje de Santos.</i18n>
    </p>

    <transition-group
      name="fauna-list"
      tag="div"
      bp="grid 6 4@md 3@lg"
    >
      <div
        v-for="a in filteredAnimals"
        :key="a.name"
        class="card fauna-card"
      >
        <figure>
          <img :src="a.absoluteurl ? a.absoluteurl : base + a.url" class="fauna-image">
          <figcaption v-if="a.creator" class="attribution">
            <i18n>foto por</i18n> <a :href="a.creator_link" target="_blank">{{ a.creator }}</a> {{ a.license }}
          </figcaption>
        </figure>
        <div class="fauna-name">
          {{ a.name }}
        </div>
        <div class="fauna-info">
          <span class="fauna-other-names">
            {{ a.othernames }}
          </span>
          <p class="fauna-size">
            <font-awesome-icon :icon="['fas', 'ruler']" />
            {{ a.size }} cm
          </p>
        </div>
        <p v-if="a.description" class="fauna-description">
          <font-awesome-icon :icon="['fas', 'info-circle']" />
          {{ a.description }}
        </p>
        <span @click="showModalClick(a)" class="open-modal"><font-awesome-icon :icon="['fas', 'photo-video']" /> <i18n>Ver imagens</i18n></span>
      </div>
      </div>
    </transition-group>

    <ul>
      <li>
        <a
          target="_blank"
          href="https://www.semanticscholar.org/paper/The-reef-fish-assemblage-of-the-Laje-de-Santos-with-Luiz-Carvalho-Filho/53b6a911443d42724e6c0e75ff5eeebbc7c4ab59"
        >Luiz, Osmar J., Alfredo Carvalho-Filho, Carlos E. L. Ferreira, Sergio R. Floeter, João Luiz Gasparini and Ivan Sazima. “The reef fish assemblage of the Laje de Santos Marine State Park, Southwestern Atlantic: annotated checklist with comments on abundance, distribution, trophic structure, symbiotic associations, and conservation.” (2008)</a>
      </li>
      <li>
        <a target="_blank" href="https://smastr16.blob.core.windows.net/consema/2018/11/e-laje-de-santos-plano-de-manejo.pdf">
          Laje de Santos, plano de manejo.
        </a>
      </li>
    </ul>

    <div v-if="showModal" name="modal" class="modal-window">
      <div class="modal-inner">
        <span @click="showModal = false" title="Close" class="modal-close">X</span>
        outras fotos do mesmo animal
      </div>
    </div>
  </article>
</template>

<script>
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import page from './page.vue';
import animalData from '~/components/especies.js';

export default {
  extends: page,
  data () {
    return {
      animals: animalData, // TODO: sort
      filterColor: '',
      filterSearch: '',
      minRange: null, // slider
      maxRange: null, // slider
      slider: {
        range: {
          min: 0,
          max: 300
        },
        step: 6,
        margin: 6,
        start: [0, 300],
        connect: true,
        pips: {
          mode: 'count',
          values: 7,
          density: 4
        }
      },

      showModal: false
    };
  },

  computed: {
    filteredAnimals () {
      const r = this.filterSearch ? new RegExp(this.filterSearch, 'i') : null;
      return this.animals.filter((i) => {
        // texto
        if (r && i.name.search(r) === -1 && i.description.search(r) === -1) {
          return false;
        }
        // tamanho
        if (i.size < this.minRange || i.size > this.maxRange) {
          return false;
        }
        // cor
        if (this.filterColor && !i.colors.includes(this.filterColor)) {
          return false;
        }
        return true;
      }, this);
    },
    base () { return this.$router.options.base; }
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
  },

  methods: {
    showModalClick (i) {
      this.showModal = true;
    }
  }

};
</script>

<style lang="less" scoped>
#filters {
  margin-top: 1em;
}

#slider-container { // BG temporario até arrumar form
  height: 5em;
}

.section-fauna {
  width: 300px;
  display: inline-block;
  vertical-align: top;

  .fauna-name {
    font-variant: small-caps;
    font-size: 1.5rem;
    font-weight: 400;
    line-height: 1.25;
  }

  .fauna-info {
    font-style: italic;
    color: #999 ;
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
