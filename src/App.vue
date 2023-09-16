<template>
  <DrawingCanvas class="canvas" background="black" color="white" />
</template>

<script setup lang="ts">
import DrawingCanvas from '@/components/DrawingCanvas.vue';
</script>

<style scoped lang="scss">
.canvas {
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
