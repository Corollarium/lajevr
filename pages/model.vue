<template>
  <article>
    <section>
      <GLTFModel
        :model="'./models/raiaManta.glb'"
        :attribution="'xxxxx'"
      />
      </GLTFModel>
    </section>
  </article>
</template>

<script>
import GLTFModel from '~/components/GLTFModelB.vue';

export default {
  components: {
    GLTFModel
  },
  data () {
    return {
    };
  }
};
</script>

<style></style>
