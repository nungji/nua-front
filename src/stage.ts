import { Easing } from 'react-native-reanimated';

/** Figma ease presets carry no control points, these are approximations of SLOW / QUICK. */
export const CURTAIN_DURATION = 417;
export const CURTAIN_HOLD = 100;
export const CURTAIN_EASING = Easing.bezier(0.16, 1, 0.3, 1);
/**
 * cubic-bezier(0.1, 0.9, 0.2, 1) decelerates but never overshoots, so it reads as a snap rather
 * than a spring. These values follow the same profile (fast start, long settle) and add one
 * small overshoot. overshootClamping: true gives back the pure curve.
 */
export const CAROUSEL_SPRING = {
  stiffness: 120,
  damping: 15,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.005,
  restSpeedThreshold: 0.005
};

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
