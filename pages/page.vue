<template>
  <div />
</template>

<script>
export default {
  data () {
    return {
      head: {
        title: '',
        description: ''
      }
    };
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
