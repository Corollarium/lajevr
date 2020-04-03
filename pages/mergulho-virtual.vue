<template>
  <article>
    <section>
      <Underwater />
    </section>
  </article>
</template>

<script>
import page from './page.vue';
import Underwater from '~/components/Underwaterb.vue';

export default {

  components: {
    Underwater
  },

  extends: page,

  layout: 'clean',

  data () {
    return {
    };
  },

  mounted () {
    this.head.title = this.$gettext('Mergulho virtual');
    this.head.description = this.$gettext('Mergulho em realidade virtual na Laje de Santos');
  }

};
</script>

<style></style>
