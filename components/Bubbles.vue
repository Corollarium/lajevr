<template>
  <canvas class="bubbles" />
</template>
<script>
export default {
  props: {
    total: {
      type: Number,
      required: false,
      default: 0
    }
  },

  data () {
    return {
      cw: 0, // client width
      ch: 0, // client height
      observer: null
    };
  },

  mounted () {
    const ctx = this.$el.getContext('2d');
    const self = this;
    this.cw = this.$el.width = this.$el.parentElement.clientWidth;
    this.ch = this.$el.height = this.$el.parentElement.clientHeight;
    const totalBubbles = this.total ? this.total : parseInt(this.cw * this.ch / 20000);
    const kappa = 0.5522847498;
    const Rgrd = Math.sqrt(this.ch * this.ch + (this.cw / 2) * (this.cw / 2));
    let grd = ctx.createRadialGradient(this.cw / 2, 0, 0, this.cw / 2, 0, Rgrd); // x0, y0, r0, x1, y1, r1
    grd.addColorStop(0, '#badbf5');
    grd.addColorStop(0.35, '#53a5dd');
    grd.addColorStop(0.75, '#306eab');
    grd.addColorStop(1, '#22417a');
    ctx.fillStyle = 'rgba(0, 0, 200, 0.)';
    let backGrad;

    function buildBackGrad () {
      backGrad = ctx.createLinearGradient(0, 0, 0, self.ch);
      backGrad.addColorStop(0.0, 'rgba(0, 0, 200, 1)');
      backGrad.addColorStop(0.1, 'rgba(0, 0, 200, 0)');
      backGrad.addColorStop(0.9, 'rgba(0, 0, 200, 0)');
      backGrad.addColorStop(1.0, 'rgba(0, 0, 200, 1)');
    }

    function ElementArray () {
      this.cx = Math.round(Math.random() * self.cw) + 1; // center x
      this.cy = Math.round(Math.random() * self.ch) + 1; // center y
      this.x = this.cx;
      this.y = this.cy;
      const deformation = randomIntFromInterval(93, 99) / 100; // ellipse deformation
      this.rw = randomIntFromInterval(5, 25); // radius w
      this.rh = ~~(this.rw * deformation); // radius h
      this.a = (Math.round(Math.random() * 360) + 1) * (Math.PI / 180); // rotation
      this.driftFlag = !(Math.random() < 0.5);
      this.lift = randomIntFromInterval(2, 10) / 18; // lift speed
      this.grd = Grd(this.cx, this.cy, this.rw); // gradient
    }
    const e1 = []; /* ellipses */

    function buildData () {
      for (let i = 0; i < totalBubbles; i++) {
        e1[i] = new ElementArray();
      }
      buildBackGrad();
    }

    /**
     * Draws an ellipse
     * @param cx Center x
     * @param cy Center y
     * @param w Width
     * @param h Height
     * @param a angle
     * @param fill Gradient to fill
     */
    function ellipse (cx, cy, w, h, a, fill) {
      const ox = w * kappa;
      const oy = h * kappa;
      const rw = Math.sqrt(oy * oy + w * w);
      const rh = Math.sqrt(ox * ox + h * h);

      const aw = Math.atan(oy / w);
      const ah = Math.atan(ox / h);

      const x0 = cx + w * Math.cos(a);
      const y0 = cy + w * Math.sin(a);
      const x1 = cx + h * Math.cos(Math.PI / 2 + a);
      const y1 = cy + h * Math.sin(Math.PI / 2 + a);
      const x2 = cx + w * Math.cos(Math.PI + a);
      const y2 = cy + w * Math.sin(Math.PI + a);
      const x3 = cx + h * Math.cos((3 * Math.PI / 2) + a);
      const y3 = cy + h * Math.sin((3 * Math.PI / 2) + a);

      const px1 = cx + rw * Math.cos(aw + a);
      const py1 = cy + rw * Math.sin(aw + a);
      const px2 = cx + rh * Math.cos((Math.PI / 2 - ah) + a);
      const py2 = cy + rh * Math.sin((Math.PI / 2 - ah) + a);
      const px3 = cx + rh * Math.cos((Math.PI / 2 + ah) + a);
      const py3 = cy + rh * Math.sin((Math.PI / 2 + ah) + a);
      const px4 = cx + rw * Math.cos((Math.PI - aw) + a);
      const py4 = cy + rw * Math.sin((Math.PI - aw) + a);
      const px5 = cx + rw * Math.cos((Math.PI + aw) + a);
      const py5 = cy + rw * Math.sin((Math.PI + aw) + a);
      const px6 = cx + rh * Math.cos((3 * Math.PI / 2 - ah) + a);
      const py6 = cy + rh * Math.sin((3 * Math.PI / 2 - ah) + a);
      const px7 = cx + rh * Math.cos((3 * Math.PI / 2 + ah) + a);
      const py7 = cy + rh * Math.sin((3 * Math.PI / 2 + ah) + a);
      const px8 = cx + rw * Math.cos((-aw) + a);
      const py8 = cy + rw * Math.sin((-aw) + a);

      ctx.save();

      ctx.fillStyle = fill;
      ctx.strokeStyle = 'rgba(200,200,200,.1)';
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.bezierCurveTo(px1, py1, px2, py2, x1, y1);
      ctx.bezierCurveTo(px3, py3, px4, py4, x2, y2);
      ctx.bezierCurveTo(px5, py5, px6, py6, x3, y3);
      ctx.bezierCurveTo(px7, py7, px8, py8, x0, y0);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    function Grd (x, y, r) {
      grd = ctx.createRadialGradient(x, y - r / 20 * r, 0, x, y - r / 20 * r, r);
      grd.addColorStop(0, 'rgba(186,219,245, .6)');
      grd.addColorStop(1, 'rgba(186,219,245, 0.05)');
      return grd;
    }

    function randomIntFromInterval (mn, mx) {
      return Math.floor(Math.random() * (mx - mn + 1) + mn);
    }

    let shouldRender = true;
    function Draw () {
      window.requestAnimationFrame(Draw);
      if (!shouldRender) {
        return;
      }

      ctx.clearRect(0, 0, self.cw, self.ch);
      for (let j = 0; j < e1.length; j++) {
        // rotation
        e1[j].a += 0.1;

        // lift
        if (e1[j].cy < -1 * e1[j].rw) {
          e1[j].cy = self.ch + e1[j].rw;
        } else {
          e1[j].cy -= e1[j].lift;
        }

        // drift
        if (e1[j].cx <= e1[j].x - 10) {
          e1[j].driftFlag = true;
        } else if (e1[j].cx >= e1[j].x + 10) {
          e1[j].driftFlag = false;
        }
        if (e1[j].driftFlag) {
          e1[j].cx += 0.15;
        } else {
          e1[j].cx -= 0.15;
        }

        // grd
        e1[j].grd = Grd(e1[j].cx, e1[j].cy, e1[j].rw);

        ellipse(e1[j].cx, e1[j].cy, e1[j].rw, e1[j].rh, e1[j].a, e1[j].grd);
      }

      // dissolve bubbles at top/bottom.
      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = backGrad;
      ctx.fillRect(0, 0, self.cw, self.ch);
      ctx.restore();
    }
    // Draw()
    buildData();
    window.requestAnimationFrame(Draw);
    window.addEventListener('resize', () => {
      this.cw = this.$el.width = this.$el.parentElement.clientWidth;
      this.ch = this.$el.height = this.$el.parentElement.clientHeight;
      buildData();
    }, false);

    // don't render when not visible
    this.observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          shouldRender = (entry.intersectionRatio >= 0.05);
        });
      },
      {
        threshold: [0, 0.05]
      });
    this.observer.observe(this.$el);
  },

  beforeDestroy () {
    // TODO window.removeEventListener('resize',
    this.observer.unobserve(this.$el);
    this.observer = null;
    // TODO: handle requestFrame
  }
};
</script>
