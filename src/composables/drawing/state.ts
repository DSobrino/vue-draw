import { ref } from 'vue';
import { CanvasDrawing, CanvasDrawingStroke, CanvasDrawingPoint } from '@/composables/drawing/models';

export function useDrawingState() {
  const isDrawing = ref(false);
  const currentStroke = ref<CanvasDrawingStroke | null>(null);
  const drawing = ref<CanvasDrawing>([]);

  function startDrawingState(): void {
    isDrawing.value = true;
  }

  function stopDrawingState(): void {
    isDrawing.value = false;

    saveCurrentStroke();
    clearCurrentStroke();
  }

  function addDrawingPoint(point: CanvasDrawingPoint): void {
    if (!currentStroke.value) currentStroke.value = [point];

    currentStroke.value.push(point);
  }

  function saveCurrentStroke(): void {
    if (!currentStroke.value) return;

    drawing.value.push(currentStroke.value);
  }

  function clearCurrentStroke(): void {
    currentStroke.value = null;
  }

  return {
    isDrawing,
    currentStroke,
    drawing,
    startDrawingState,
    stopDrawingState,
    addDrawingPoint,
  };
}
