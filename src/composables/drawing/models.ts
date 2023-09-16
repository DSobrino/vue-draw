export type CursorCoords = {
  x: number;
  y: number;
};

export type CanvasDrawingPoint = any[];

export type CanvasDrawingStroke = CanvasDrawingPoint[];
export type CanvasDrawing = CanvasDrawingStroke[];

export type CanvasDrawingOptions = {
  thickness: number;
  color: string;
  lineCap: CanvasLineCap;
  erase: boolean;
};

export type CanvasDrawingSize = {
  width: number;
  height: number;
};

export type CanvasEvent = any;
