<template>
  <article>
    <section>
      <h1><i18n>Mergulho virtual</i18n></h1>
      <p>
        <i18n>
          Experimente um mergulho virtual na Laje de Santos e veja o naufrágio Moreia e a vida.
          É preciso que seu aparelho tenha suporte a 3D para executar este ambiente com bom
          desempenho. Expectativa de desempenho:
        </i18n>
        <span v-show="!gpuTierLoaded"><i18n>Testando desempenho...</i18n></span>
        <span v-show="gpuTierLoaded" style="font-weight: bold">
          <span v-if="gpuTier.tier === 0"><i18n>Muito baixo desempenho, muito devagar ou não funcionará</i18n></span>
          <span v-if="gpuTier.tier === 1"><i18n>Baixo desempenho, devagar</i18n></span>
          <span v-if="gpuTier.tier === 2"><i18n>Médio desempenho</i18n></span>
          <span v-if="gpuTier.tier === 3"><i18n>Ótimo desempenho</i18n></span>
        </span>
      </p>
      <Underwater />
    </section>
  </article>
</template>

<script>
import { getGPUTier } from 'detect-gpu';
import page from './page.vue';
import Underwater from '~/components/Underwaterb.vue';

export default {

  components: {
    Underwater
  },

  extends: page,

  data () {
    return {
      gpuTierLoaded: false,
      gpuTier: {
        'tier': -1,
        'isMobile': false,
        'type': '',
        'fps': 0,
        'gpu': ''
      }
    };
  },

  mounted () {
    this.head.title = this.$gettext('Mergulho virtual');
    this.head.description = this.$gettext('Mergulho em realidade virtual na Laje de Santos');
    this.getGpuTier();
  },

  methods: {
    async getGpuTier () {
      const t = await getGPUTier();
      this.$set(this, 'gpuTier', t);
      this.gpuTierLoaded = true;
    }
  }
};
</script>
