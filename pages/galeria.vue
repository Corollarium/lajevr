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
      <section
        v-for="(a, i) in filteredGallery"
        :key="i"
        class="section section-gallery"
      >
        <figure>
          <img :src="a.url" class="gallery-image">
        </figure>
        <p class="gallery-creator">
          <i18n>foto por</i18n> <a :href="a.creator_link" target="_blank">{{ a.creator }}</a> {{ a.license }}
        </p>
        <p class="gallery-description">
          {{ a.description }}
        </p>
      </section>
    </div>
  </article>
</template>

<script>
import galleryData from '~/components/gallery.json';

export default {
  data () {
    return {
      gallery: galleryData,
      filterSearch: '',
      filterSearchPlaceholder: ''
    };
  },

  computed: {
    filteredGallery () {
      return this.gallery.filter((i) => {
        // TODO if (this.filterSearch && (i.description.match())
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
