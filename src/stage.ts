import { Easing } from 'react-native-reanimated';

/** Figma ease presets carry no control points, these are approximations of SLOW / QUICK. */
export const CURTAIN_DURATION = 417;
export const CURTAIN_HOLD = 100;
export const CURTAIN_EASING = Easing.bezier(0.16, 1, 0.3, 1);
export const CAROUSEL_DURATION = 480;
export const CAROUSEL_EASING = Easing.bezier(0.1, 0.9, 0.2, 1);

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
