<template>
  <div class="cloud-animation">
    <img src="~static/images/graficos/nuvens.png" draggable="false" alt="Nuvem" class="clouds-a">
    <img src="~static/images/graficos/nuvens.png" draggable="false" alt="Nuvem" class="clouds-b">
  </div>
</template>

<style lang="less" scoped>
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
   rgba(0,0,0,.2) 10%,
   rgba(0,0,0,1) 30%,
   rgba(0,0,0,1) 70%,
   rgba(0,0,0,.5) 80%,
   rgba(0,0,0,0) 100%);

  .clouds-a,
  .clouds-b {
    top: 0;
    position: absolute;
    animation: cloudsMovement 40s infinite linear;
  }
  .clouds-a {
    left: 0;
  }

  .clouds-b {
    left: 100%;
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
</style>
