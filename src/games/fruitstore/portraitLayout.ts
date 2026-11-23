import { SHELL_PACKS } from './game';
import { BASKET } from './interaction';

/** Coordinates from design images / 조개가게 (390 × 844). */
export const PORTRAIT = { width: 390, height: 844 };
export const PORTRAIT_BASKET = BASKET;
export const SHELF_SLOTS = SHELL_PACKS.map((quantity, index) => ({
  quantity,
  x: 42 + (index % 3) * 104,
  y: 204 + Math.floor(index / 3) * 64,
  w: 94,
  h: 58,
}));

export function portraitGeometry(width: number, height: number) {
  const scale = Math.max(0, Math.min(width / PORTRAIT.width, height / PORTRAIT.height));
  return { scale, width: PORTRAIT.width * scale, height: PORTRAIT.height * scale };
}
