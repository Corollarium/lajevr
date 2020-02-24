<template>
  <header :class="{'main-header': true, 'header-overlay': $nuxt.$route.path == '/'}">
    <!-- <input id="menu" v-model="isExpanded" type="checkbox" class="custom-wrapper"> -->
    <div class="main-menu pure-menu pure-menu-horizontal" role="navigation" aria-label="main navigation">
      <a class="pure-menu-heading" href="/" rel="home">
        <span class="logo-main" />
      </a>

      <!-- <label
        for="menu"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
      >
        <span />
        <span />
        <span />
      </label> -->

      <ul @click="isExpanded = false" class="pure-menu-list main-nav">
        <li class="pure-menu-item pure-menu-selected">
          <nuxt-link to="/" class="pure-menu-link">
            <i18n>Conheça</i18n>
          </nuxt-link>
        </li>
        <li class="pure-menu-item">
          <nuxt-link to="/mergulho-virtual" class="pure-menu-link">
            <i18n>Mergulho Virtual</i18n>
          </nuxt-link>
        </li>
        <li class="pure-menu-item">
          <nuxt-link to="/especies" class="pure-menu-link">
            <i18n>Espécies</i18n>
          </nuxt-link>
        </li>
        <li class="pure-menu-item">
          <nuxt-link to="/pontos-de-mergulho" class="pure-menu-link">
            <i18n>Pontos de Mergulho</i18n>
          </nuxt-link>
        </li>
        <li class="pure-menu-item">
          <nuxt-link to="/galeria" class="pure-menu-link">
            <i18n>Galeria</i18n>
          </nuxt-link>
        </li>
        <li class="pure-menu-item">
          <nuxt-link to="/sobre" class="pure-menu-link">
            <i18n>Sobre</i18n>
          </nuxt-link>
        </li>
        <li class="pure-menu-item">
          <LanguagePicker />
        </li>
        <li class="pure-menu-item">
          <a
            class="pure-menu-link"
            href="https://corollarium.com"
            title="Corollarium"
            target="_blank"
          >
            <span class="logo-corollarium" />
            <span class>Corollarium</span>
          </a>
        </li>
      </ul>
    </div>
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
