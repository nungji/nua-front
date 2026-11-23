/** Shared by the visible basket and drag/drop validation, in 390×844 scene coordinates. */
export const BASKET = { x: 68, y: 618, w: 130, h: 94 };
export const TAP_DISTANCE = 8;

export function shouldPickFruit(x: number, y: number, travel: number): boolean {
  if (travel <= TAP_DISTANCE) return true;
  return x >= BASKET.x && x <= BASKET.x + BASKET.w && y >= BASKET.y && y <= BASKET.y + BASKET.h;
}
