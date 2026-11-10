import { usePathname } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { CURTAIN_DURATION, CURTAIN_EASING, peekPixels } from '@/stage';
import { useStageStore } from '@/store/useStageStore';

const CURTAIN_COLOR = '#E05757';
const FOLDS = 8;

type PanelProps = {
  width: number;
  height: number;
  progress: SharedValue<number>;
  openX: number;
  closedX: number;
  side: 'left' | 'right';
};

function CurtainPanel({ width, height, progress, openX, closedX, side }: PanelProps) {
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.value, [0, 1], [openX, closedX]) }]
  }));
  const foldWidth = width / FOLDS;

  return (
    <Animated.View
      style={[styles.panel, { width, height, backgroundColor: CURTAIN_COLOR, [side]: 0 }, style]}
    >
      <View style={styles.folds}>
        {Array.from({ length: FOLDS }, (_, fold) => (
          <View
            key={fold}
            style={{
              width: foldWidth,
              backgroundColor: fold % 2 === 0 ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.07)'
            }}
          />
        ))}
      </View>
      <View
        style={[
          styles.seam,
          side === 'left' ? { right: 0 } : { left: 0 },
          { backgroundColor: 'rgba(0,0,0,0.22)' }
        ]}
      />
    </Animated.View>
  );
}

export function StageCurtains() {
  const { width, height } = useWindowDimensions();
  const phase = useStageStore((state) => state.phase);
  const settle = useStageStore((state) => state.settle);
  const pathname = usePathname();

  const progress = useSharedValue(0);
  const inset = Math.max(width - peekPixels(pathname, width), width / 2);
  const edge = width / 2;

  const handleSettled = useCallback(
    (value: number) => settle(value === 1 ? 'closed' : 'open'),
    [settle]
  );

  useEffect(() => {
    progress.value = withTiming(phase === 'closed' ? 1 : 0, { duration: CURTAIN_DURATION, easing: CURTAIN_EASING }, (finished) => {
      if (finished) {
        runOnJS(handleSettled)(phase === 'closed' ? 1 : 0);
      }
    });
  }, [phase, progress, handleSettled]);

  return (
    <View pointerEvents={phase === 'closed' ? 'auto' : 'none'} style={styles.container}>
      <CurtainPanel
        width={width}
        height={height}
        progress={progress}
        openX={-inset}
        closedX={-edge}
        side="left"
      />
      <CurtainPanel
        width={width}
        height={height}
        progress={progress}
        openX={inset}
        closedX={edge}
        side="right"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    zIndex: 20
  },
  panel: {
    position: 'absolute',
    top: 0
  },
  folds: {
    flex: 1,
    flexDirection: 'row'
  },
  seam: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 6
  }
});
