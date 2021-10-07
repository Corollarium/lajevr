<template>
  <picture class="picture">
    <img :src="srcImage" :alt="alt">
  </picture>
</template>
<script>
export default {
  props: {
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
        return;
      }
      return require(`~/static/images/${this.src}?resize&size=360`);
    }
  }
};
</script>
