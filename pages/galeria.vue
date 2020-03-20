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

    <div bp="grid 6@md 4@lg 3@xl">
      <GalleryCard
        v-for="(a, i) in filteredGallery"
        :key="i"
        v-bind:creator="a.creator"
        v-bind:creatorLink="a.creatorLink"
        v-bind:license="a.license"
        v-bind:url="a.url"
        v-bind:description="a.description"
        v-bind:type="a.type"
      />
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
      filterSearchPlaceholder: ''
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
    }
  },

  mounted () {
    this.filterSearchPlaceholder = this.$gettext('buscar na galeria');
  }
};
</script>

<style lang="less" scoped>

.section-gallery {
  width: 300px;
  display: inline-block;
  vertical-align: top;
  .gallery-creator {
    font-size: 90%;
    font-style: italic;
  }
  .gallery-description {
    font-weight: bold;
  }
}

</style>
