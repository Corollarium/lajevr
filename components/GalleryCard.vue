<template>
  <section
    class="card"
  >
    <figure>
      <img :src="absoluteurl ? absoluteurl : base + url" v-if="type == 'image'" class="gallery-image">
      <video v-if="type == 'video'" class="gallery-video" controls preload="metadata">
        <source :src="absoluteurl ? absoluteurl : base + url">
      </video>
      <figcaption class="gallery-name">
        {{ name }}
      </figcaption>
    </figure>
    <p class="gallery-creator">
      <i18n>foto por</i18n> <a :href="creatorLink" target="_blank">{{ creator }}</a> {{ license }}
    </p>
    <p class="gallery-description">
      {{ description }}
    </p>
  </section>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
      required: false
    },
    creator: {
      type: String,
      required: true
    },
    creatorLink: {
      type: String,
      default: undefined,
      required: false
    },
    license: {
      type: String,
      default: undefined,
      required: false
    },
    url: {
      type: String,
      required: false,
      default: null
    },
    absoluteurl: {
      type: String,
      required: false,
      default: null
    },
    description: {
      type: String,
      default: '',
      required: false
    },
    type: {
      type: String,
      required: true
    }
  },

  computed: {
    base () { return this.$router.options.base; }
  }

};
</script>
<style lang="less" scoped>
.gallery-card {
  display: inline-block;
  vertical-align: top;

  .gallery-name {
    font-size: 120%;
    font-weight: bold;
  }

  .gallery-creator {
    font-size: 90%;
    font-style: italic;
    margin: 0;
  }
  .gallery-description {
    font-size: 90%;
    line-height: 1.5em;
    margin: 0;
  }
}
</style>
