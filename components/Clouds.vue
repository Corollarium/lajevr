<template>
  <div class="cloud-animation">
    <img src="~static/graficos/nuvens.png" draggable="false" alt="Nuvem" class="clouds-a">
    <img src="~static/graficos/nuvens.png" draggable="false" alt="Nuvem" class="clouds-b">
    <img src="~static/graficos/nuvens.png" draggable="false" alt="Nuvem" class="clouds-a slow-clouds">
    <img src="~static/graficos/nuvens.png" draggable="false" alt="Nuvem" class="clouds-b slow-clouds">
  </div>
</template>

<style lang="less" scoped>
@tempoAnimacao: 60s;
.cloud-animation {
  overflow: hidden;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: absolute;
  mask-image:
  linear-gradient(to right,
   rgba(0,0,0,0) 0%,
   rgba(0,0,0,1) 20%,
   rgba(0,0,0,1) 80%,
   rgba(0,0,0,0) 100%);

  .clouds-a,
  .clouds-b {
    top: 0;
    max-width: none;
    min-height: 100%;
    opacity: .7;
    position: absolute;
    animation: cloudsMovement @tempoAnimacao infinite linear;
  }
  .clouds-a {
    left: 0;
  }

  .clouds-b {
    left: 100%;
  }

  .slow-clouds {
    opacity: .4;
    animation: cloudsAppear @tempoAnimacao/4 linear, cloudsMovement-B @tempoAnimacao*.6 infinite linear;
  }
}

@keyframes cloudsMovement {
  0% {
    transform: translate3d(0, 0, 0);
  }

  100% {
    transform: translate3d(-100%, 0, 0);
  }
}

@keyframes cloudsMovement-B {
  0% {
    transform: translate3d(0, 0, 0) scale(-1, -1);
  }

  100% {
    transform: translate3d(-100%, 0, 0) scale(-1, -1);
  }
}

@keyframes cloudsAppear {
  0% {
    opacity: 0;
  }

  100% {
    opacity: .4;
  }
}
</style>
