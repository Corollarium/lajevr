<template>
  <article class="pagina-vida">
    <article id="turtles" class="article-index">
      <section class="section-container container">
        <h2 class="title-specimen">
          Tartarugas
        </h2>

        <div class="model-container" style="min-height: 70vh;" bp="12 6@md">
          <!-- <babylon
            id="model-babylon"
            :model="'./models/anjoReal.glb'"
            :model="'./models/tartaruga/tartaruga.glb'"
          /> -->
          <GLTFModel
            :model="'./models/frade.glb'"
            :attribution="'Modelo de tartaruga'"
          />
          </GLTFModel>
        </div>
      </section>
    </article>
  </article>
</template>

<script>
// import * as BabylonViewer from '@babylonjs/viewer';
// import '@babylonjs/loaders/glTF';
import page from './page.vue';
import GLTFModel from '~/components/GLTFModelB.vue';

export default {
  components: {
    GLTFModel
  },

  extends: page,

  data () {
    return {
      rellax: null
    };
  },

  mounted () {
    this.head.title = this.$gettext('Vida na Laje de Santos');
    this.head.description = this.$gettext('Sobre seres vivos na Laje de Santos');
    // BabylonViewer.InitTags('babylon');
    // const domElement = document.getElementById('model-container');

    // this.viewer = new BabylonViewer.DefaultViewer(domElement, {
    //   scene: {
    //     debug: true
    //   },
    //   camera: {
    //     behaviors: {
    //       autoRotate: 0
    //     }
    //   },
    //   model: {
    //     url: 'https://playground.babylonjs.com/scenes/Rabbit.babylon'
    //   }
    // });
  }

};
</script>
