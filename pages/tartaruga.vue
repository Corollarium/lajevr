<template>
  <article class="pagina-vida">
    <article id="turtles" class="article-index">
      <section class="section-container container">
        <h2 class="title-specimen">
          Tartarugas
        </h2>

        <div class="model-container" style="min-height: 70vh;" bp="12 6@md">
          <GLTFModel
            :model="'./models/tartaruga/tartaruga.glb'"
            :attribution="'Modelo'"
            :backgroundColor="'FFFFFF'"
          />
          </GLTFModel>
        </div>
      </section>
    </article>
  </article>
</template>

<script>
import page from './page.vue';
import GLTFModel from '~/components/GLTFModel.vue';

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
  }

};
</script>
