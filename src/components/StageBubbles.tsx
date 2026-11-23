import { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';

import {
  BUBBLE_COUNT,
  BUBBLE_COVER_MS,
  BUBBLE_EXIT_EASING,
  BUBBLE_EXIT_MS,
  BUBBLE_EXIT_SPREAD,
  BUBBLE_RISE_EASING,
  BUBBLE_RISE_MS,
  BUBBLE_RISE_SPREAD
} from '@/stage';
import { useStageStore } from '@/store/useStageStore';
import { COLORS } from '@/theme';

type BubbleSpec = {
  radius: number;
  left: number;
  /** Where the bubble sits once the screen is covered. */
  coverY: number;
  /** Where it ends up after the scene swap. */
  exitY: number;
  riseDelay: number;
  exitDelay: number;
  sway: number;
  /** Off-screen parked position below the viewport. */
  startY: number;
};

/** Deterministic jitter so a re-render does not reshuffle the field mid-transition. */
function makeRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;

    return state / 0xffffffff;
  };
}

function buildBubbles(width: number, height: number): BubbleSpec[] {
  const random = makeRandom(0x5eed);
  const columns = Math.ceil(Math.sqrt(BUBBLE_COUNT) * 1.2);
  const perColumn = Math.ceil(BUBBLE_COUNT / columns);
  const columnWidth = width / columns;
  const rowHeight = height / perColumn;
  const bubbles: BubbleSpec[] = [];

  for (let index = 0; index < BUBBLE_COUNT; index += 1) {
    // skewed so most bubbles are small and a few are large, like a real foam wall
    const radius = 20 + Math.pow(random(), 1.7) * 100;
    const column = index % columns;
    const row = Math.floor(index / columns);

    bubbles.push({
      radius,
      left: column * columnWidth + random() * columnWidth - radius * 0.5,
      coverY:
        row * rowHeight + rowHeight * (random() - 0.5) * 1.1 - radius * 0.5,
      exitY: -height * 0.5 - radius * 2 - random() * 260,
      riseDelay: random() * BUBBLE_RISE_SPREAD,
      exitDelay: random() * BUBBLE_EXIT_SPREAD,
      sway: (random() - 0.5) * 110,
      startY: height + radius * 2
    });
  }

  return bubbles;
}

function Bubble({ spec, covered }: { spec: BubbleSpec; covered: boolean }) {
  const travel = useSharedValue(1);

  useEffect(() => {
    if (covered) {
      travel.value = withDelay(
        spec.riseDelay,
        withTiming(0, { duration: BUBBLE_RISE_MS, easing: BUBBLE_RISE_EASING })
      );

      return;
    }

    travel.value = withDelay(
      spec.exitDelay,
      withTiming(-1, { duration: BUBBLE_EXIT_MS, easing: BUBBLE_EXIT_EASING })
    );
  }, [covered, spec.exitDelay, spec.riseDelay, travel]);

  const style = useAnimatedStyle(() => {
    const startY = spec.startY;
    const y =
      travel.value >= 0
        ? interpolate(travel.value, [0, 1], [spec.coverY, startY])
        : interpolate(travel.value, [-1, 0], [spec.exitY, spec.coverY]);
    // rising bubbles wobble sideways the higher they climb
    const x = spec.sway * (1 - Math.min(1, Math.abs(travel.value)));

    return {
      transform: [{ translateY: y }, { translateX: x }],
      opacity: interpolate(travel.value, [-1, 0.4, 1], [0.85, 1, 0])
    };
  });

  const diameter = spec.radius * 2;

  return (
    <Animated.View pointerEvents="none" style={[styles.bubbleSlot, { left: spec.left, width: diameter, height: diameter }, style]}>
      <View
        style={{
          flex: 1,
          borderRadius: spec.radius,
          backgroundColor: 'rgba(255, 255, 255, 0.58)',
          borderWidth: Math.max(2, spec.radius * 0.09),
          borderColor: 'rgba(68, 213, 238, 0.62)'
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: spec.radius * 0.5,
            top: spec.radius * 0.42,
            width: spec.radius * 0.52,
            height: spec.radius * 0.34,
            borderRadius: spec.radius,
            backgroundColor: 'rgba(255, 255, 255, 0.9)'
          }}
        />
      </View>
    </Animated.View>
  );
}

export function StageBubbles() {
  const { width, height } = useWindowDimensions();
  const phase = useStageStore((state) => state.phase);
  const settle = useStageStore((state) => state.settle);

  const bubbles = useMemo(() => buildBubbles(width, height), [width, height]);

  const veil = useSharedValue(0);

  const handleCovered = useCallback(() => settle('closed'), [settle]);

  useEffect(() => {
    if (phase === 'closed') {
      // the wash only arrives once the bubbles are already climbing, so the rise stays visible
      const delay = Math.round(BUBBLE_RISE_MS * 0.55);

      veil.value = withDelay(
        delay,
        withTiming(1, { duration: BUBBLE_COVER_MS - delay, easing: Easing.in(Easing.quad) }, (finished) => {
          if (finished) {
            runOnJS(handleCovered)();
          }
        })
      );

      return;
    }

    veil.value = withTiming(0, { duration: BUBBLE_EXIT_MS, easing: BUBBLE_EXIT_EASING });
  }, [phase, veil, handleCovered]);

  const veilStyle = useAnimatedStyle(() => ({ opacity: veil.value }));

  return (
    <View pointerEvents={phase === 'closed' ? 'auto' : 'none'} style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.veil, veilStyle]} />
      {bubbles.map((spec, index) => (
        <Bubble key={index} spec={spec} covered={phase === 'closed'} />
      ))}
    </View>
  );
}

const styles = {
  container: {
    overflow: 'hidden' as const,
    position: 'absolute' as const,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  veil: {
    backgroundColor: COLORS.foam
  },
  bubbleSlot: {
    position: 'absolute' as const,
    top: 0,
    padding: 0
  }
};
