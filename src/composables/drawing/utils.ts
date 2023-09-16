import { CanvasDrawingOptions, CanvasDrawingPoint, CursorCoords } from '@/composables/drawing/models';

export function useDrawingUtils() {
  function getCursorCoords(e: MouseEvent | TouchEvent): CursorCoords {
    if (e instanceof MouseEvent) return getMouseCoords(e);
    if (e instanceof TouchEvent) return getTouchCoords(e);
    throw new Error('Invalid event type');
  }

  function getMouseCoords(e: MouseEvent): CursorCoords {
    if (!(e.target instanceof HTMLElement)) {
      return { x: e?.pageX, y: e?.pageY };
    }

    const { left, top } = e.target.getBoundingClientRect();

    return { x: e?.pageX - left, y: e?.pageY - top };
  }

  function getTouchCoords(e: TouchEvent): CursorCoords {
    const touch = e.touches[0];

    if (!(e.target instanceof HTMLElement)) {
      return { x: touch?.pageX, y: touch?.pageY };
    }

    const { left, top } = e.target.getBoundingClientRect();

    return { x: touch?.pageX - left, y: touch?.pageY - top };
  }

  function createDrawingPoint(coords: CursorCoords, options: CanvasDrawingOptions): CanvasDrawingPoint {
    return [coords.x, coords.y, options.thickness, options.background, options.color, options.lineCap, options.erase];
  }

  return { getCursorCoords, getMouseCoords, getTouchCoords, createDrawingPoint };
}
