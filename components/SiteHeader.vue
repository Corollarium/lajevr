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
        <div class="navbar-end" @click="isExpanded = false">
          <nuxt-link to="/" class="navbar-item">
            Início
          </nuxt-link>
          <nuxt-link to="/dive" class="navbar-item">
            Mergulho
          </nuxt-link>
          <nuxt-link to="/vida" class="navbar-item">
            Vida
          </nuxt-link>
          <nuxt-link to="/fauna" class="navbar-item">
            Catálogo
          </nuxt-link>
          <nuxt-link to="/about" class="navbar-item">
            Sobre
          </nuxt-link>
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
export default {
  data () {
    return {
      isExpanded: false,
      overlay: false
    };
  }
};
</script>

<style lang="less" scoped>
@import '~assets/css/index.less';

.logo-main {
  // background: url("/assets/images/logo-videowall.svg") no-repeat left center;
  background-size: contain;
  height: 30px;
  width: 110px;
}

.logo-corollarium {
  background: url("/assets/images/logo-mobi.svg") no-repeat left center;
  background-size: contain;
  height: 30px;
  width: 30px;
}

@media screen and (min-width:1024px) {
  header.main-header {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    display: block;
    margin-bottom: 30px;
  }

.navbar {
    background-color: @grayBackground;
  }
}

#main-navigation,
.navbar.navbar-admin {
  .navbar-link,
  a.navbar-item {
    color: #3273dc;
    font-weight: bold;

    &:hover,
    &.is-active,
    &.nuxt-link-exact-active {
      // something?
    }
  }
}

.burger {
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
}

/** Hamburgers **/
.custom-wrapper {
  display: none;

  .navbar-brand > .navbar-burger > span {
    transition: transform 0.6s;
  }

  &:checked {
    ~ .navbar-menu {
      display: block;
    }

    ~ .navbar-brand > .navbar-burger > span {
      &:nth-child(1) {
        -webkit-transform: translateY(5px) rotate(45deg);
        transform: translateY(5px) rotate(45deg);
      }

      &:nth-child(2) {
        opacity: 0;
      }

      &:nth-child(3) {
        -webkit-transform: translateY(-5px) rotate(-45deg);
        transform: translateY(-5px) rotate(-45deg);
      }
    }
  }
}

header.main-header.header-overlay {
  position: absolute;
  background: transparent;
  .navbar {
    background: transparent;
  }
  width: 100%;
}
</style>
