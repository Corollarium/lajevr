<template>
  <article>
    <div bp="grid container vertical-center" style="padding: 1rem 0 1.5rem">
      <h1 bp="12 6@sm 8@md" class="subpage-title">
        <i18n>Galeria</i18n>
      </h1>

      <form id="filters" bp="12 6@sm 4@md" class="filter-form">
        <label class="label">
          <i18n>Buscar</i18n>
        </label>
        <div class="input-with-icon">
          <input v-model="filterSearch" :placeholder="filterSearchPlaceholder" class="input" type="text">
          <span class="input-icon">
            <font-awesome-icon :icon="['fas', 'search']" />
          </span>
        </div>
      </form>

      <p bp="12">
        <i18n>Você tem imagens da Laje de Santos? Mande para nosso projeto:</i18n> {{ email }}.
      </p>
    </div>

    <transition-group
      name="fauna-list"
      tag="div"
      bp="grid container 12 6@sm 4@md 3@lg"
    >
      <GalleryCard
        v-for="a in filteredGallery"
        :key="a.base ? a.base : a.url"
        v-bind="a"
        class="gallery-card"
      />
    </transition-group>

    <transition name="fade-in-up">
      <div v-if="showModal" name="modal" class="modal-window">
        <div class="modal-inner">
          <span @click="showModal = false" title="Close" class="modal-close">X</span>
          <GalleryCard
            v-bind="modalItem"
          />
        </div>
      </div>
    </transition>
  </article>
</template>

<script>
import page from './page.vue';
import galleryData from '~/components/galleryData.js';
import GalleryCard from '~/components/GalleryCard.vue';

export default {
  components: {
    GalleryCard
  },

  extends: page,

  data () {
    return {
      email: 'email@corollarium.com',
      gallery: galleryData,
      filterSearch: '',
      filterSearchPlaceholder: '',
      galleryPicked: 0,
      showModal: false
    };
  },

  computed: {
    filteredGallery () {
      const r = this.filterSearch ? new RegExp(this.filterSearch, 'i') : null;
      if (!r) {
        return this.gallery;
      }

      return this.gallery.filter((i) => {
        // texto
        if (i.creator.search(r) !== -1 ||
          (i.name ? i.name.search(r) !== -1 : false) ||
          (i.description ? i.description.search(r) !== -1 : false)
        ) {
          return true;
        }
        return false;
      }, this);
    },
    modalItem () {
      return this.gallery[this.galleryPicked];
    }
  },

  mounted () {
    this.head.title = this.$gettext('Galeria de Fotos da Laje de Santos');
    this.head.description = this.$gettext('Fotos tiradas no Parque Estadual Marinho da Laje de Santos');

    this.filterSearch = this.$route.query.filter ? this.$route.query.filter : '';
    this.filterSearchPlaceholder = this.$gettext('buscar na galeria');
  },

  methods: {
    showModalClick (i) {
      this.galleryPicked = i;
      this.showModal = true;
    }
  }
};
</script>
