import { nextTick, onMounted, ref, watch } from 'vue';
import mitt from 'mitt';
import { useDrawingUtils } from '@/composables/drawing/utils';
import {
  CanvasDrawingOptions,
  CanvasDrawingStroke,
  CanvasDrawingPoint,
  CanvasDrawing,
  CanvasDrawingSize,
} from '@/composables/drawing/models';
import { useResizeObserver } from '@vueuse/core';
import { isLeftClick } from '@/utils/cursor';
import { hasTouch } from '@/utils/screen';
import { getDevicePixelRatio } from '@/utils/screen';

const { getCursorCoords } = useDrawingUtils();

const DEFAULT_BACKGROUND_COLOR = '#ffffff';

export const DEFAULT_DRAW_OPTIONS: CanvasDrawingOptions = {
  thickness: 5,
  color: '#000000',
  lineCap: 'round',
  erase: false,
};

export function useDrawingCanvas() {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const ctxRef = ref<CanvasRenderingContext2D | null>(null);

  const { on, off, emit } = mitt();

  onMounted(() => {
    if (!canvasRef.value) {
      throw new Error('Canvas ref is null');
    }

    setContext();

    useResizeObserver(canvasRef.value.parentElement, (entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;

      resizeCanvas({ width, height });

      nextTick(registerEvents);
    });
  });

  function setContext(canvas?: HTMLCanvasElement): void {
    const ctx = canvas?.getContext('2d') || canvasRef.value?.getContext('2d');
    if (ctx) ctxRef.value = ctx;
  }

  function registerEvents(): void {
    unregisterEvents();

    if (hasTouch()) return registerTouchEvents();

    registerMouseEvents();
  }

  function unregisterEvents(): void {
    unregisterMouseEvents();
    unregisterTouchEvents();
  }

  function registerMouseEvents(): void {
    if (!canvasRef.value) return;

    canvasRef.value.addEventListener('mousedown', onDrawStart);
    canvasRef.value.addEventListener('mouseup', onDrawEnd);
    canvasRef.value.addEventListener('mouseout', onDrawCancel);
    canvasRef.value.addEventListener('mousemove', onDrawMove);
  }

  function unregisterMouseEvents(): void {
    if (!canvasRef.value) return;

    canvasRef.value.removeEventListener('mousedown', onDrawStart);
    canvasRef.value.removeEventListener('mouseup', onDrawEnd);
    canvasRef.value.removeEventListener('mouseout', onDrawCancel);
    canvasRef.value.removeEventListener('mousemove', onDrawMove);
  }

  function registerTouchEvents(): void {
    if (!canvasRef.value) return;

    canvasRef.value.addEventListener('touchstart', onDrawStart, {
      passive: true,
    });
    canvasRef.value.addEventListener('touchend', onDrawEnd, {
      passive: true,
    });
    canvasRef.value.addEventListener('touchcancel', onDrawCancel, {
      passive: true,
    });
    canvasRef.value.addEventListener('touchmove', onDrawMove, {
      passive: true,
    });
  }

  function unregisterTouchEvents(): void {
    if (!canvasRef.value) return;

    canvasRef.value.removeEventListener('touchstart', onDrawStart);
    canvasRef.value.removeEventListener('touchend', onDrawEnd);
    canvasRef.value.removeEventListener('touchcancel', onDrawCancel);
    canvasRef.value.removeEventListener('touchmove', onDrawMove);
  }

  function onDrawStart(e: MouseEvent | TouchEvent): void {
    dispatchIf(isLeftClick(e), 'cursor:start', e);
  }

  function onDrawEnd(e: MouseEvent | TouchEvent): void {
    dispatchIf(isLeftClick(e), 'cursor:stop', e);
  }

  function onDrawCancel(e: MouseEvent | TouchEvent): void {
    dispatch('cursor:cancel', e);
  }

  function onDrawMove(e: MouseEvent | TouchEvent): void {
    dispatch('cursor:move', e);
  }

  function DrawingCanvasStroke(stroke: CanvasDrawingStroke): void {
    if (!ctxRef.value) return;

    const firstDrawPoint = stroke[0];
    const [firstX, firstY] = firstDrawPoint;

    ctxRef.value.beginPath();
    ctxRef.value.moveTo(firstX, firstY);

    for (let i = 1; i < stroke.length; i++) {
      const drawPoint: CanvasDrawingPoint = stroke[i];
      const [x, y, thickness, color, lineCap] = drawPoint;

      // Estilo del trazo.
      ctxRef.value.lineWidth = thickness || DEFAULT_DRAW_OPTIONS.thickness;
      ctxRef.value.strokeStyle = color || DEFAULT_DRAW_OPTIONS.color;
      ctxRef.value.lineCap = lineCap || DEFAULT_DRAW_OPTIONS.lineCap;

      const nextDrawPoint = stroke[i + 1];

      if (!nextDrawPoint) break;

      const [nextX, nextY] = nextDrawPoint;

      const xc = (x + nextX) / 2;
      const yc = (y + nextY) / 2;
      ctxRef.value.quadraticCurveTo(x, y, xc, yc);
    }

    const lastDrawPoint = stroke[stroke.length - 1];
    const [lastX, lastY] = lastDrawPoint;

    ctxRef.value.lineTo(lastX, lastY);
    ctxRef.value.stroke();
  }

  function DrawingCanvas(drawing: CanvasDrawing): void {
    if (!ctxRef.value) return;

    clearCanvas();

    drawing.forEach((stroke: CanvasDrawingStroke) => {
      DrawingCanvasStroke(stroke);
    });
  }

  function clearCanvas(): void {
    if (!canvasRef.value || !ctxRef.value) return;

    ctxRef.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  }

  function resizeCanvas({ width, height }: CanvasDrawingSize): void {
    if (!canvasRef.value) return;

    const ratio = getDevicePixelRatio();

    canvasRef.value.width = width * ratio;
    canvasRef.value.height = height * ratio;

    canvasRef.value.style.width = `${width}px`;
    canvasRef.value.style.height = `${height}px`;

    emit('resize', { width, height });

    if (!ctxRef.value) return;

    ctxRef.value.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function dispatch(eventName: string, e: MouseEvent | TouchEvent): void {
    emit(eventName, getCursorCoords(e));
  }

  function dispatchIf(condition: boolean, eventName: string, e: MouseEvent | TouchEvent): void {
    if (!condition) return;
    dispatch(eventName, e);
  }

  function renderCanvas(format = 'image/png', quality = 1): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!canvasRef.value || !ctxRef.value) return reject('Canvas ref is null');

      // Color de fondo.
      ctxRef.value.globalCompositeOperation = 'destination-over';
      ctxRef.value.fillStyle = DEFAULT_BACKGROUND_COLOR;
      ctxRef.value.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
      ctxRef.value.globalCompositeOperation = 'source-over';

      canvasRef.value?.toBlob(
        (blob: Blob | null) => {
          if (!blob) return reject('Blob is null');

          resolve(blob);
        },
        format,
        quality
      );
    });
  }

  return {
    canvasRef,
    ctxRef,
    DrawingCanvasStroke,
    DrawingCanvas,
    clearCanvas,
    resizeCanvas,
    renderCanvas,
    on,
    off,
  };
}
