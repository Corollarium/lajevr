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
            :model="'/models/anjoReal.glb'"
            :model="'/models/tartaruga/tartaruga.glb'"
          /> -->
          <GLTFModel
            id="x1111"
            v-if="engine"
            :model="'/models/tartaruga/tartaruga.glb'"
            :attribution="'Modelo de tartaruga'"
            :babylonEngine="engine"
          />
          <GLTFModel
            id="x22222"
            v-if="engine"
            :model="'/models/frade.glb'"
            :attribution="'Modelo de tartaruga'"
            :babylonEngine="engine"
          />
        </div>
      </section>
    </article>
  </article>
</template>

<script>
import { Engine } from 'babylonjs';
import page from './page.vue';
import GLTFModel from '~/components/GLTFModelB.vue';

export default {
  components: {
    GLTFModel
  },

  extends: page,

  data () {
    return {
      rellax: null,
      engine: null
    };
  },

  mounted () {
    const canvas = document.createElement('canvas');
    this.engine = new Engine(canvas, true);
    this.engine.loadingUIText = 'Mergulho na Laje de Santos';
    this.engine.sceneList = {};
    this.engine.runRenderLoop(() => {
      for (const i in this.engine.sceneList) {
        const s = this.engine.sceneList[i];
        if (this.engine.activeView && this.engine.activeView.target === s.container) {
          s.renderScene();
        }
      }
    });

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
