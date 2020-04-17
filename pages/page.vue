<template>
  <div />
</template>

<script>
export default {
  data () {
    return {
      headerOverlay: false,
      head: {
        title: '',
        description: ''
      }
    };
  },

  watch: {
    headerOverlay (newD, oldD) {
      this.$root.$emit('headerOverlay', newD);
    }
  },

  mounted () {
    this.$root.$emit('headerOverlay', this.headerOverlay);
  },

  head () {
    return {
      title: this.head.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.head.description
        }
      ]
    };
  }

};
</script>

<style></style>
