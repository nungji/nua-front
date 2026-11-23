/** All targets use the same 390×844 coordinates as the visible board. */
export const BASKET = { x: 68, y: 618, w: 130, h: 94 };
export const SHELF = { x: 15, y: 147, w: 360, h: 266 };
export const FLOOR = { x: 20, y: 426, w: 350, h: 136 };
export const FLOOR_SLOTS = Array.from({ length: 6 }, (_, index) => ({
  x: 27 + (index % 3) * 115,
  y: 438 + Math.floor(index / 3) * 64,
  w: 106,
  h: 59,
}));
export const TAP_DISTANCE = 8;
export const containsPoint = (rect: { x: number; y: number; w: number; h: number }, x: number, y: number) => x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;

export function floorSlotAt(x: number, y: number): number | null {
  if (!containsPoint(FLOOR, x, y)) return null;
  const column = Math.max(0, Math.min(2, Math.floor((x - FLOOR.x) / (FLOOR.w / 3))));
  const row = y < FLOOR.y + FLOOR.h / 2 ? 0 : 1;
  return row * 3 + column;
}
