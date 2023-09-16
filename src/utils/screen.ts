export const getDevicePixelRatio = (): number => window.devicePixelRatio || 1;

export const hasTouch = (): boolean => 'ontouchstart' in window;
