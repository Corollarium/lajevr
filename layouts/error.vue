<template>
  <div class="nuxt-error">
    <h1>
      {{ errorMessage }}
    </h1>
  </div>
</template>

<script>

export default {
  name: 'NuxtError',
  layout: 'default', // optional
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    errorMessage () {
      if (this.error.statusCode === 404) {
        return '404 - Esta página não existe.';
      } // catch everything else
      return this.error.statusCode + ' - Erro.';
    }
  }
};
</script>
