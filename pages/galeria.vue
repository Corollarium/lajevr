<template>
  <article class="container">
    <h1 class="title is-1">
      <i18n>Galeria</i18n>
    </h1>

    <form id="filters" class="form">
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

    <div bp="grid 6@md 4@lg 3@xl" class="gallery-container">
      <GalleryCard
        v-for="(a, i) in filteredGallery"
        :key="i"
        @click.native="showModalClick(i)"
        v-bind:name="a.name"
        v-bind:creator="a.creator"
        v-bind:creatorLink="a.creatorLink"
        v-bind:license="a.license"
        v-bind:url="a.url"
        v-bind:absoluteurl="a.absoluteurl"
        v-bind:description="a.description"
        v-bind:type="a.type"
      />
    </div>

    <div v-if="showModal" @click="showModal = false" name="modal" class="modal">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>custom header</h3>
          </div>
          <div class="modal-body">
            <GalleryCard
              v-bind:name="modalItem.name"
              v-bind:creator="modalItem.creator"
              v-bind:creatorLink="modalItem.creatorLink"
              v-bind:license="modalItem.license"
              v-bind:url="modalItem.url"
              v-bind:absoluteurl="modalItem.absoluteurl"
              v-bind:description="modalItem.description"
              v-bind:type="modalItem.type"
            />
          </div>
          OK
          </button>
        </div>
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

<style lang="less" scoped>
.gallery-container {
  .gallery-card {
    width: 320px;
  }
}

</style>
