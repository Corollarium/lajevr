<template>
  <select
    v-model="current"
    @change="changed()"
    class="language-select"
    name="language"
  >
    <option v-for="(language, key) in available" :value="key">
      {{ language }}
    </option>
  </select>
</template>

<script>
export default {
  data () {
    return {
      current: 'en_US',
      available: {}
    };
  },

  mounted () {
    this.current = this.$language.current;
    this.available = this.$language.available;
  },

  methods: {
    changed () {
      // TODO: window.localStorage.setItem('language', $language.current);
      this.$language.current = this.current;
    }
  }
};
</script>
