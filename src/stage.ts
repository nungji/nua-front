import { Easing } from 'react-native-reanimated';

/**
 * Scene changes are hidden behind a rising wall of soap bubbles. The route swaps while the
 * screen is fully covered, then the bubbles keep travelling up and thin out.
 */
export const BUBBLE_COUNT = 72;
export const BUBBLE_RISE_MS = 380;
export const BUBBLE_RISE_SPREAD = 150;
export const BUBBLE_EXIT_MS = 420;
export const BUBBLE_EXIT_SPREAD = 130;
/** How long the screen stays covered after the swap. */
export const BUBBLE_HOLD_MS = 110;
/** Total time from tap until the scene is covered, used to gate the route swap. */
export const BUBBLE_COVER_MS = BUBBLE_RISE_MS + BUBBLE_RISE_SPREAD + 30;
export const BUBBLE_RISE_EASING = Easing.out(Easing.cubic);
export const BUBBLE_EXIT_EASING = Easing.in(Easing.quad);
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

/** Every layout number in the app is authored against this Figma frame. */
export const DESIGN_FRAME = { width: 1280, height: 832 };
const MIN_STAGE_SCALE = 0.28;

/** Fits the design frame into the viewport without overflowing either axis. */
export function stageScale(width: number, height: number): number {
  const scale = Math.min(width / DESIGN_FRAME.width, height / DESIGN_FRAME.height);

  return Math.max(scale, MIN_STAGE_SCALE);
}

