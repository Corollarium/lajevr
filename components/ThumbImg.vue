<template>
  <picture class="picture">
    <img :src="srcImage.src" :srcset="isThumbnail ? '' : srcImage.srcSet" :alt="alt">
  </picture>
</template>
<script>
export default {
  props: {
    isThumbnail: {
      type: Boolean,
      required: true
    },
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    srcImage () {
      if (!this.src) {
        return null;
      }
      // a small thumb plus a large number to get the original image too.
      return require(`~/static/images/${this.src}?resize&sizes[]=360&sizes[]=800&sizes[]=10000`);
    }
  }
};
</script>
