<template>
  <picture class="picture">
    <img :src="srcImage" alt="Am image">
  </picture>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  computed: {
    srcImage () {
      if (!this.src) {
        return;
      }
      return require(`~/static/images/${this.src}?resize`);
    }
  }
};
</script>
