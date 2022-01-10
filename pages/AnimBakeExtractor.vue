<template>
  <article class="pagina-vida">
    <article id="turtles" class="article-index">
      <section class="section-container container">
        <h2 class="title-specimen">
          Animation Baking Extractor
        </h2>
        <div>
          <p>
            <i18n>Extrai o baking da Textura de Animação de Vértices para um arquivo JSOn, caso ele não exista.</i18n>
            <br>
            <i18n>Ajuste o modelo, a quantidade de quadros e um delta de quadros por segundo.</i18n>
            <br>
            <i18n>Se o arquivo não baixar, significa que ele já existe no servidor.</i18n>
            <br>
            <i18n>Improvisações: Animação não rodando nessa página. Aplicar deslocamento de animação, para animação composta.</i18n>
          </p>
        </div>

        <div class="model-container" style="min-height: 70vh;" bp="12 6@md">
          <!-- <babylon
            id="model-babylon"
            :model="'./models/anjoReal.glb'"
            :model="'./models/tartaruga/tartaruga.glb'"
          /> -->
          <EBA
            id="x1111"
            v-if="engine"
            :model="'./models/salema.glb'"
            :attribution="'Modelo de tartaruga'"
            :babylonEngine="engine"
            :animationInitFrame="1"
            :animationEndFrame="94"
            :autoRotate="false"
          />
        </div>
      </section>
    </article>
  </article>
</template>

<script>
import { Engine } from 'babylonjs';
import page from './page.vue';
import EBA from '~/components/EBA.vue';

export default {
  components: {
    EBA
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
