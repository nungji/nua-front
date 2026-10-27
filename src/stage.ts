import { Easing } from 'react-native-reanimated';

/** Figma ease presets carry no control points, these are approximations of SLOW / QUICK. */
export const CURTAIN_DURATION = 417;
export const CURTAIN_HOLD = 100;
export const CURTAIN_EASING = Easing.bezier(0.45, 0, 0.55, 1);
export const CAROUSEL_DURATION = 620;
export const CAROUSEL_EASING = Easing.bezier(0.15, 0, 0.1, 1);

/** The selector keeps a sliver of curtain on screen, every other scene hides it entirely. */
export const SELECTOR_ROUTE = '/';
export const PEEK_WIDTH = 45;
export const PEEK_REFERENCE_WIDTH = 1280;

export function peekPixels(route: string, width: number): number {
  if (route !== SELECTOR_ROUTE) {
    return 0;
  }

  return Math.round((PEEK_WIDTH * width) / PEEK_REFERENCE_WIDTH);
}
