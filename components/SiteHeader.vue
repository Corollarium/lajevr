<template>
  <header :class="{'main-header': true, 'header-overlay': $nuxt.$route.path == '/'}">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <input id="menu" v-model="isExpanded" type="checkbox" class="custom-wrapper">
      <div class="navbar-brand is-marginless">
        <a class="navbar-item" href="/" rel="home">
          <span class="logo-main" />
        </a>

        <label
          for="menu"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
        >
          <span />
          <span />
          <span />
        </label>
      </div>

      <div id="main-navigation" class="navbar-menu is-marginless">
        <div
          @click="isExpanded = false"
          class="navbar-end"
        >
          <nuxt-link to="/" class="navbar-item">
            <i18n>Início</i18n>
          </nuxt-link>
          <nuxt-link to="/dive" class="navbar-item">
            <i18n>Mergulho</i18n>
          </nuxt-link>
          <nuxt-link to="/vida" class="navbar-item">
            <i18n>Vida</i18n>
          </nuxt-link>
          <nuxt-link to="/fauna" class="navbar-item">
            <i18n>Catálogo</i18n>
          </nuxt-link>
          <nuxt-link to="/about" class="navbar-item">
            <i18n>Sobre</i18n>
          </nuxt-link>
          <span class="navbar-item">
            <LanguagePicker />
          </span>
          <a
            class="navbar-item"
            href="https://corollarium.com"
            title="Corollarium"
            target="_blank"
          >
            <span class="logo-corollarium" />
            <span class>Corollarium</span>
          </a>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import LanguagePicker from './LanguagePicker.vue';

export default {
  components: {
    LanguagePicker
  },

  data () {
    return {
      isExpanded: false,
      overlay: false
    };
  }
};
</script>
