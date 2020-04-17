<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
export default {
  components: {
  },

  mounted () {
    // We listen to the resize event
    window.addEventListener('resize', () => {
      // We execute the same script as before
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', vh + 'px');
    });
  }
};
</script>

<style lang="less">
@import '~assets/css/index.less';
</style>
