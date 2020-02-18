<template>
  <article class="container">
    <h1 class="title is-1">
      <translate>Galeria</translate>
    </h1>

    <form id="filters" class="form">
      <div class="field is-horizontal ">
        <div class="field-body">
          <div class="field">
            <label class="label">
              <translate>Buscar</translate>
            </label>
            <div class="control has-icons-left">
              <input v-model="filterSearch" :placeholder="filterSearchPlaceholder" class="input" type="text">
              <span class="icon is-small is-left">
                <font-awesome-icon :icon="['fas', 'search']" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>

    <section
      v-for="(a, i) in filteredGallery"
      :key="i"
      class="section section-gallery"
    >
      <figure>
        <img class="gallery-image" src="~assets/images/fish/goldfish-1900832_960_720.png">
      </figure>
      <p class="gallery-creator">
        <translate>por</translate> {{ a.creator }} {{ a.license }}
      </p>
      <p>{{ a.description }}</p>
    </section>
  </article>
</template>

<script>

export default {
  data () {
    return {
      gallery: [

      ],
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
</style>
