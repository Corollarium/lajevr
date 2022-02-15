<template>
  <article>
    <section>
      <h1><i18n>Mergulho virtual</i18n></h1>
      <underwater-bug />
    </section>
  </article>
</template>

<script>
import page from './page.vue';
import UnderwaterBug from '~/components/UnderwaterBug.vue';

export default {

  components: {
    UnderwaterBug
  },

  extends: page,

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
