const MOUSE_LEFT_CLICK = 0;
const MOUSE_WHEEL_CLICK = 1;
const MOUSE_RIGHT_CLICK = 2;

export function isLeftClick(e: MouseEvent | TouchEvent): boolean {
  if (e instanceof TouchEvent) return true;
  return e.button === MOUSE_LEFT_CLICK;
}

export function isWheelClick(e: MouseEvent | TouchEvent): boolean {
  if (e instanceof TouchEvent) return false;
  return e.button === MOUSE_WHEEL_CLICK;
}

export function isRightClick(e: MouseEvent | TouchEvent): boolean {
  if (e instanceof TouchEvent) return false;
  return e.button === MOUSE_RIGHT_CLICK;
}
