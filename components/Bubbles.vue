<template>
  <canvas class="bubbles" />
</template>
<script>
export default {
  data () {
    return {
      observer: null
    };
  },

  mounted () {
    const c = this.$el;
    const ctx = c.getContext('2d');
    let cw = c.width = this.$el.parentElement.clientWidth;
    let ch = c.height = this.$el.parentElement.clientHeight;
    const totalBubbles = 75;
    const kappa = 0.5522847498;
    const Rgrd = Math.sqrt(ch * ch + (cw / 2) * (cw / 2));
    let grd = ctx.createRadialGradient(cw / 2, 0, 0, cw / 2, 0, Rgrd); // x0, y0, r0, x1, y1, r1
    grd.addColorStop(0, '#badbf5');
    grd.addColorStop(0.35, '#53a5dd');
    grd.addColorStop(0.75, '#306eab');
    grd.addColorStop(1, '#22417a');
    ctx.fillStyle = 'rgba(0, 0, 200, 0.)';
    let backGrad;

    function buildBackGrad () {
      backGrad = ctx.createLinearGradient(0, 0, 0, ch);
      backGrad.addColorStop(0.0, 'rgba(0, 0, 200, 1)');
      backGrad.addColorStop(0.1, 'rgba(0, 0, 200, 0)');
      backGrad.addColorStop(0.9, 'rgba(0, 0, 200, 0)');
      backGrad.addColorStop(1.0, 'rgba(0, 0, 200, 1)');
    }

    function ElementArray () {
      this.rw = randomIntFromInterval(5, 25);
      this.cx = Math.round(Math.random() * cw) + 1;
      this.cy = Math.round(Math.random() * ch) + 1;
      if (this.cx < this.rw * 1.2) {
        this.cx = this.rw;
      } else if (this.cx > ch - this.rw * 1.2) {
        this.cx = this.rw;
      }
      this.x = this.cx;
      this.y = this.cy;
      const deformation = randomIntFromInterval(75, 95) / 100;
      this.rh = ~~(this.rw * deformation);
      this.a = (Math.round(Math.random() * 360) + 1) * (Math.PI / 180);
      this.driftFlag = !(Math.random() < 0.5);
      this.lift = randomIntFromInterval(2, 10) / 10;
      this.grd = Grd(this.cx, this.cy, this.rw);
    }
    const e1 = []; /* ellipses */

    function buildData () {
      for (let i = 0; i < totalBubbles; i++) {
        e1[i] = new ElementArray();
      }
      buildBackGrad();
    }

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
      ctx.strokeStyle = 'rgba(200,200,200,.3)';
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
      grd.addColorStop(0, 'rgba(186,219,245,.9)');
      grd.addColorStop(1, 'rgba(186,219,245, 0.1)');
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

      ctx.clearRect(0, 0, cw, ch);
      for (let j = 0; j < e1.length; j++) {
      // rotation
        e1[j].a += 0.1;

        // lift
        if (e1[j].cy < -1 * e1[j].rw) {
          e1[j].cy = ch + e1[j].rw;
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
      ctx.fillRect(0, 0, cw, ch);
      ctx.restore();
    }
    // Draw()
    buildData();
    window.requestAnimationFrame(Draw);
    window.addEventListener('resize', () => {
      cw = c.width = this.$el.parentElement.clientWidth;
      ch = c.height = this.$el.parentElement.clientHeight;
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
    // TODO window.addEventListener('resize',
    this.observer.unobserve(this.$el);
    this.observer = null;
    // TODO: handle requestFrame
  }
};
</script>
