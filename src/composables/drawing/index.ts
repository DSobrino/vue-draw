import { useDrawingCanvas } from '@/composables/drawing/canvas';
import { useDrawingState } from '@/composables/drawing/state';
import { useDrawingUtils } from '@/composables/drawing/utils';
import { CanvasDrawingOptions, CanvasDrawingPoint, CursorCoords, CanvasEvent } from '@/composables/drawing/models';
import mitt from 'mitt';

export function useDrawingComponent() {
  const { canvasRef, DrawingCanvasStroke, DrawingCanvas, renderCanvas, clearCanvas, on: onCanvas } = useDrawingCanvas();
  const { isDrawing, currentStroke, drawing, startDrawingState, stopDrawingState, addDrawingPoint } = useDrawingState();
  const { createDrawingPoint } = useDrawingUtils();

  let options: CanvasDrawingOptions = {
    thickness: 5,
    color: '#000000',
    lineCap: 'round',
    erase: false,
  };

  const { on, emit } = mitt<CanvasEvent>();

  onCanvas('cursor:start', (coords: CanvasEvent) => {
    if (isDrawing.value) return;

    startDrawingState();
    drawCoords(coords as CursorCoords);
  });

  onCanvas('cursor:stop', () => {
    if (!isDrawing.value) return;

    stopDrawingState();
    DrawingCanvas(drawing.value);
  });

  onCanvas('cursor:move', (coords: CanvasEvent) => {
    if (!isDrawing.value) return;

    drawCoords(coords as CursorCoords);
  });

  onCanvas('cursor:cancel', () => {
    if (!isDrawing.value) return;

    stopDrawingState();
  });

  onCanvas('resize', () => DrawingCanvas(drawing.value));

  function draw(point: CanvasDrawingPoint): void {
    if (!isDrawing.value) return;

    addDrawingPoint(point);

    if (!currentStroke.value) return;

    DrawingCanvasStroke(currentStroke.value);

    emit('drawing', { point, drawing: drawing.value });
  }

  function drawCoords(coords: CursorCoords): void {
    if (!isDrawing.value) return;

    const point: CanvasDrawingPoint = createDrawingPoint(coords, options);

    draw(point);
  }

  function setOptions(opts: CanvasDrawingOptions): void {
    options = { ...options, ...opts };
  }

  function resetCanvas(): void {
    drawing.value = [];
    clearCanvas();
  }

  return {
    canvasRef,
    isDrawing,
    drawing,
    setOptions,
    renderCanvas,
    resetCanvas,
    on,
  };
}
