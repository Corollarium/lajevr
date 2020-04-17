<template>
  <article>
    <div bp="grid container vertical-center" style="padding: 1rem 0 1.5rem">
      <h1 bp="6 8@md" class="subpage-title">
        <i18n>Galeria</i18n>
      </h1>

      <form id="filters" bp="6 4@md" class="form">
        <div class="field">
          <label class="label">
            <i18n>Buscar</i18n>
          </label>
          <div class="control has-icons-left">
            <input v-model="filterSearch" :placeholder="filterSearchPlaceholder" class="input" type="text">
            <span class="icon is-small is-left">
              <font-awesome-icon :icon="['fas', 'search']" />
            </span>
          </div>
        </div>
      </form>
    </div>

    <div bp="grid container 6 4@md 3@lg">
      <GalleryCard
        v-for="(a, i) in filteredGallery"
        :key="i"
        @click.native="showModalClick(i)"
        v-bind="a"
      />
    </div>

    <div v-if="showModal" name="modal" class="modal-window">
      <div class="modal-inner">
        <span @click="showModal = false" title="Close" class="modal-close">X</span>
        <GalleryCard
          v-bind="modalItem"
        />
      </div>
    </div>
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
      return this.gallery.filter((i) => {
        // texto
        if (r && i.creator.search(r) === -1 && i.description.search(r) === -1) {
          return false;
        }
        return true;
      }, this);
    },
    modalItem () {
      return this.gallery[this.galleryPicked];
    }
  },

  mounted () {
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
