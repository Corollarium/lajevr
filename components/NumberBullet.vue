<template>
  <div class="number-info">
    <div class="number-round">
      <span v-on="$listeners" v-bind="$attrs">{{ tweenedNumber }}</span>
    </div>
    <div class="number-explanation">
      <slot />
    </div>
  </div>
</template>
<script>
import { TweenLite } from 'gsap';

// Returns the number of full stop in given string.
const countFullstops = str => str.replace(/[^.]/g, '').length;

export default {
  name: 'Number',
  props: {
    from: {
      type: [Number, String],
      default: 0
    },
    to: {
      type: [Number, String],
      required: true,
      default: 0
    },
    format: {
      type: Function,
      default: num => new Intl.NumberFormat().format(parseInt(num))
    },
    duration: {
      type: Number,
      default: 2 // Duration of animation in seconds
    },
    easing: {
      type: String,
      default: 'Power1.easeOut'
    },
    delay: {
      type: Number,
      default: 0.4 // Delay the animation in seconds
    },
    animationPaused: Boolean // Stops animation before start
  },
  data () {
    return {
      fromProp: this.from,
      countStarted: false
    };
  },
  computed: {
    tweenedNumber () {
      return this.format(this.fromProp);
    }
  },
  watch: {
    to (newValue) {
      this.tween(newValue);
    }
  },
  mounted () {
    // don't render when not visible
    this.observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.96 && !this.countStarted) {
            this.countStarted = true;
            this.tween(this.to);
          }
        });
      },
      {
        threshold: 0.95
      }
    );
    this.observer.observe(this.$el);
  },
  methods: {
    tween (value) {
      const vm = this;
      const tLite = TweenLite
        .to(vm.$data, vm.duration, {
          fromProp: value,
          paused: vm.animationPaused,
          ease: vm.easeCheck(),
          onStart: () => vm.$emit('start'),
          onComplete: () => vm.$emit('complete'),
          onUpdate: () => vm.$emit('update'),
          delay: vm.delay // In seconds
        });
      vm.tween.tLite = tLite;
    },
    play () {
      this.tween.tLite.play();
    },
    pause () {
      this.tween.tLite.pause();
    },
    restart () {
      this.tween.tLite.restart();
    },
    easeCheck () {
      const vm = this;
      if (countFullstops(vm.easing) !== 1) {
        throw new Error('Invalid ease type. (eg. easing="Power1.easeOut")');
      }
      return vm.easing;
    }
  }
};
</script>
