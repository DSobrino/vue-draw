<template>
  <canvas ref="canvasRef" class="canvas" />
</template>

<script setup lang="ts">
import { DrawingAreaProps } from '@/components/models';
import { computed, toRefs, watchEffect } from 'vue';
import { useDrawingComponent } from '@/composables/drawing';

const props = withDefaults(defineProps<DrawingAreaProps>(), {
  thickness: 3,
  background: 'white',
  color: 'black',
  lineCap: 'round',
  erase: false,
});

const { thickness, background, color, erase } = toRefs(props);

const { canvasRef, setOptions, renderCanvas, resetCanvas } = useDrawingComponent();

watchEffect(() => {
  setOptions({
    thickness: thickness.value,
    color: erase.value ? 'white' : color.value,
    lineCap: 'round',
    erase: erase.value,
  });
});

defineExpose({
  renderCanvas,
  resetCanvas,
});

const canvasBackgroundColor = computed(() => background.value);
</script>

<style scoped lang="scss">
.canvas {
  background-color: v-bind(canvasBackgroundColor);
}
</style>
