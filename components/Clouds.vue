<template>
  <div class="cloud-animation">
    <img src="~static/images/graficos/nuvens.png" draggable="false" alt="Nuvem" class="clouds-a">
    <img src="~static/images/graficos/nuvens.png" draggable="false" alt="Nuvem" class="clouds-b">
  </div>
</template>

<style lang="less" scoped>

.cloud-animation {
  overflow-x: hidden;
  width: 100%;
  height: auto;
  position: relative;

   .clouds-a, .clouds-b {
     top: 0;
     position: absolute;
     animation: cloudsMovement 5s infinite;
   }
   .clouds-b {
     right: 0;
   }
}

@keyframes cloudsMovement {
  0% {
    transform: translate3d(0,0,0);
  }

  100% {
    transform: translate3d(-100%,0,0);
  }
}
</style>
