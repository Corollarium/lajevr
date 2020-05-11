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
