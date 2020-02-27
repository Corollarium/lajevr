<template>
  <article>
    <section>
      <GLTFModel
        :model="'./models/manta/scene.gltf'"
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
