<template>
  <div>
    <SiteHeader />
    <nuxt />
    <SiteFooter />
  </div>
</template>

<script>
import SiteHeader from '~/components/SiteHeader.vue';
import SiteFooter from '~/components/SiteFooter.vue';

export default {
  components: {
    SiteHeader,
    SiteFooter
  }
};
</script>

<style lang="less">
html {
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

html, body {
  margin:0;
  padding:0;
  height:100%;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

figcaption {
  font-size: 0.8em;
  font-style: italic;
}

</style>
