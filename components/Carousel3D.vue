<template>
  <section
    class="carousel3d-container"
  >
    <div
      v-for="item in objects"
      class="carousel3d-item"
    >
      <div class="model-container" style="min-height: 70vh;">
        <GLTFModel
          :model="'../models/manta/scene.gltf'"
          :link="'https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8'"
          :attribution="'Modelo 3D CC BY-NC por misaooo'"
          :inputEnabled="false"
        />
      </div>
      <div class="carousel3d-label">
        {{ item.name }}
      </div>
    </div>
    </div>
  </section>
</template>

<script>
import GLTFModel from '~/components/GLTFModelB.vue';

export default {
  components: {
    GLTFModel
  },

  props: {
  },

  data () {
    return {
      objects: [
        {
          name: 'Raia Manta',
          model: '../models/manta/scene.gltf',
          link: 'https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8',
          attribution: 'Modelo 3D CC BY-NC por misaooo'
        },
        {
          name: 'Bodião',
          model: '../models/manta/scene.gltf',
          link: 'https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8',
          attribution: 'Modelo 3D CC BY-NC por misaooo'
        }
      ]
    };
  },

  computed: {
    base () { return this.$router.options.base; }
  }

};
</script>
<style lang="less" scoped>
.carousel3d-container {
  width: 100%;

  .carousel3d-item {
    display: inline-block;
    width: 300px;
    height: 400px;
  }

  .carousel3d-label {
    font-size: 180%;
    text-align: center;
  }
}
</style>
