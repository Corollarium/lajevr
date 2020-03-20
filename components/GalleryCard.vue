<template>
  <section
    class="gallery-section"
  >
    <figure>
      <img :src="url" v-if="type == 'image'" class="gallery-image">
      <video v-if="type == 'video'" class="gallery-video" controls preload="metadata">
        <source :src="url">
      </video>
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
      required: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  }

};
</script>
<style lang="less" scoped>
.gallery-creator {
  font-size: 80%;
  font-style: italic;
}
</style>
