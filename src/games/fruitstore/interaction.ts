/** Shared by the visible basket and drag/drop validation, in 852×393 scene coordinates. */
export const BASKET = { x: 690, y: 300, w: 146, h: 50 };
export const TAP_DISTANCE = 8;

export function shouldPickFruit(x: number, y: number, travel: number): boolean {
  if (travel <= TAP_DISTANCE) return true;
  return x >= BASKET.x && x <= BASKET.x + BASKET.w && y >= BASKET.y && y <= BASKET.y + BASKET.h;
}
