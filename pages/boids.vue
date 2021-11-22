<template>
  <article>
    <section>
      <Boids />
    </section>
  </article>
</template>

<script>
import page from './page.vue';
import Boids from '~/components/Boids.vue';

export default {

  components: {
    Boids
  },

  extends: page,

  data () {
    return {
    };
  },

  mounted () {
    this.head.title = this.$gettext('Mergulho virtual');
    this.head.description = this.$gettext('Boids');
  }

};
</script>
