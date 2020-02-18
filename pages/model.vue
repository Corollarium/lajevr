<template>
  <article>
    <section>
      <GLTFModel
        :model="'./models/borboleta/borboleta.glb'"
        :background-color="0x46BCEC"
        :attribution="'xxxxx'"
      />
      </GLTFModel>
    </section>
  </article>
</template>

<script>
import GLTFModel from '~/components/GLTFModel.vue';

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
