<template>
  <div>
    <Timeline />
  </div>
</template>

<script>
import page from './page.vue';
import Timeline from '~/components/Timeline.vue';

export default {
  components: {
    Timeline
  },

  extends: page,

  mounted () {
  }

};
</script>

<style></style>
