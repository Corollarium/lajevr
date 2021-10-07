<template>
  <section
    @click="focused = !focused"
    :class="{focused: focused}"
    class="card"
  >
    <figure class="gallery-figure">
      <img v-if="type == 'image' && absoluteurl" class="gallery-image">
      <thumb-img v-if="type == 'image' && !absoluteurl" :src="suburl" class="fauna-image" />
      <video ref="video" v-if="type == 'video'" :controls="focused" class="gallery-video" preload="metadata">
        <source :src="absoluteurl ? absoluteurl : base + url">
      </video>
      <figcaption class="gallery-name">
        {{ name }}
      </figcaption>
    </figure>
    <p class="gallery-creator">
      <i18n>foto por</i18n> <a :href="creatorLink" target="_blank">{{ creator }}</a> {{ license }}
    </p>
    <p class="gallery-description">
      {{ description }}
    </p>
  </section>
</template>

<script>
import ThumbImg from '~/components/ThumbImg.vue';

export default {
  components: { ThumbImg },
  props: {
    name: {
      type: String,
      default: '',
      required: false
    },
    creator: {
      type: String,
      required: true
    },
    creatorLink: {
      type: String,
      default: undefined,
      required: false
    },
    license: {
      type: String,
      default: undefined,
      required: false
    },
    url: {
      type: String,
      required: false,
      default: null
    },
    suburl: {
      type: String,
      required: false,
      default: null
    },
    absoluteurl: {
      type: String,
      required: false,
      default: null
    },
    description: {
      type: String,
      default: '',
      required: false
    },
    type: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      focused: false
    };
  },

  computed: {
    base () { return this.$router.options.base; }
  },

  watch: {
    focused (newval) {
      // block scrolling
      if (newval) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
        if (this.type === 'video') {
          this.$refs.video.pause();
        }
      }
    }
  }

};
</script>
<style lang="less">
.gallery-card {
  display: inline-grid;
  vertical-align: top;

  .gallery-name {
    font-size: 120%;
    font-weight: bold;
  }

  .gallery-creator {
    font-size: 90%;
    font-style: italic;
    margin: 0;
  }
  .gallery-description {
    font-size: 90%;
    line-height: 1.5em;
    margin: 0;
  }
  .gallery-figure {
    pointer-events: none;
  }

  &.focused {
    position: fixed;
    top: 10px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    z-index: 100;
    background: rgba(0, 37, 66, 0.97);

    img {
      max-height: 90vh;
      max-width: 100%;
    }
    .gallery-figure {
      pointer-events: auto;
    }
  }
}
</style>
