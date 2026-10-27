import { Easing } from 'react-native-reanimated';

/** Figma ease presets carry no control points, these are approximations of SLOW / QUICK. */
export const CURTAIN_DURATION = 417;
export const CURTAIN_HOLD = 100;
export const CURTAIN_EASING = Easing.bezier(0.45, 0, 0.55, 1);
export const CAROUSEL_DURATION = 620;
export const CAROUSEL_EASING = Easing.bezier(0.15, 0, 0.1, 1);

/** How much curtain stays on screen while open. In-game scenes hide it entirely. */
export type StagePeek = 'selector' | 'game';
export const PEEK_WIDTH = 45;
export const PEEK_REFERENCE_WIDTH = 1280;

export function peekPixels(peek: StagePeek, width: number): number {
  if (peek === 'game') {
    return 0;
  }

  return Math.round((PEEK_WIDTH * width) / PEEK_REFERENCE_WIDTH);
}
