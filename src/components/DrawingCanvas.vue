<template>
  <canvas ref="canvasRef" />
</template>

<script setup lang="ts">
import { DrawingAreaProps } from '@/components/models';
import { onMounted, toRefs, watchEffect } from 'vue';
import { useDrawingComponent } from '@/composables/drawing';

const props = withDefaults(defineProps<DrawingAreaProps>(), {
  thickness: 3,
  background: '#ffffff',
  color: '#000000',
  lineCap: 'round',
  erase: false,
});

const { thickness, background, color, erase } = toRefs(props);

const { canvasRef, setOptions, renderCanvas, resetCanvas } = useDrawingComponent();

onMounted(() =>
  watchEffect(() =>
    setOptions({
      thickness: thickness.value,
      background: background.value,
      color: erase.value ? background.value : color.value,
      lineCap: 'round',
      erase: erase.value,
    })
  )
);

defineExpose({
  renderCanvas,
  resetCanvas,
});
</script>
