<template>
  <div class="number-wrapper">
    <div class="number-info">
      <div class="number-round">
        {{ number2 }}
      </div>
      <div class="number-explanation">
        {{ description }}
      </div>
    </div>
  </div>
  </div>
</template>
<script>
export default {
  props: {
    number: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      number2: -1,
      numberAnimated: 0
    };
  },
  watch: {
    number2 (newValue) {
      console.log('number', newValue);
      if (this.number2 < this.number) {
        const delta = (this.number - this.number2) * 0.001;
        this.number2 += (delta > 1 ? delta : 1);
        if (this.number2 > this.number) {
          this.number2 = this.number;
        }
      }
    }
  },
  mounted () {
    this.number2 = 0;
  }

};
</script>
