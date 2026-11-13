import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { WATER } from './colors';

type DropsProps = {
  count?: number;
  color?: string;
  travel?: number;
  width?: number;
};

function Drop({ index, color, travel }: { index: number; color: string; travel: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * 170,
      withRepeat(withTiming(1, { duration: 900, easing: Easing.linear }), -1, false)
    );
  }, [index, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value > 0.82 ? 0 : 1,
    transform: [{ translateY: progress.value * travel }]
  }));

  return (
    <Animated.View style={[{ position: 'absolute', left: index * 22, top: 0 }, style]}>
      <Svg width={14} height={18} viewBox="0 0 14 18">
        <Path d="M7 0 Q14 10 14 12.5 A7 7 0 0 1 0 12.5 Q0 10 7 0 Z" fill={color} />
      </Svg>
    </Animated.View>
  );
}

/** Water escaping the item, or rain hitting it. Same drawing, different colour. */
export function FallingDrops({ count = 3, color = WATER, travel = 52, width = 80 }: DropsProps) {
  return (
    <View pointerEvents="none" style={{ width, height: 20 }}>
      {Array.from({ length: count }, (_, index) => (
        <Drop key={`drop-${index}`} index={index} color={color} travel={travel} />
      ))}
    </View>
  );
}

function Wisp({ index }: { index: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * 260,
      withRepeat(withTiming(1, { duration: 1200, easing: Easing.out(Easing.ease) }), -1, false)
    );
  }, [index, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value > 0.7 ? (1 - progress.value) / 0.3 : 1,
    transform: [{ translateY: -progress.value * 34 }, { scale: 1 + progress.value * 0.3 }]
  }));

  return (
    <Animated.View style={[{ position: 'absolute', left: index * 26, top: 0 }, style]}>
      <Svg width={22} height={28} viewBox="0 0 22 28">
        <Path
          d="M11 26 q-8 -6 -2 -12 q6 -6 1 -12"
          stroke="#C9D3DE"
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
}

export function SteamWisps({ count = 2 }: { count?: number }) {
  return (
    <View pointerEvents="none" style={{ width: 60, height: 24 }}>
      {Array.from({ length: count }, (_, index) => (
        <Wisp key={`wisp-${index}`} index={index} />
      ))}
    </View>
  );
}

const SPARKLES = [
  { left: 0, top: 8, size: 16 },
  { left: 28, top: 0, size: 22 },
  { left: 56, top: 14, size: 14 },
  { left: 38, top: 30, size: 16 }
];

function Sparkle({ left, top, size, index }: { left: number; top: number; size: number; index: number }) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withDelay(
      index * 120,
      withRepeat(withTiming(1, { duration: 620, easing: Easing.inOut(Easing.ease) }), -1, true)
    );
  }, [index, pulse]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.45 + pulse.value * 0.55,
    transform: [{ scale: 0.84 + pulse.value * 0.3 }]
  }));

  return (
    <Animated.View style={[{ position: 'absolute', left, top }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12 1 L14 9 L22 12 L14 15 L12 23 L10 15 L2 12 L10 9 Z" fill="#F7C94B" />
      </Svg>
    </Animated.View>
  );
}

export function Sparkles() {
  return (
    <View pointerEvents="none" style={{ width: 72, height: 48 }}>
      {SPARKLES.map((sparkle, index) => (
        <Sparkle
          key={`sparkle-${index}`}
          left={sparkle.left}
          top={sparkle.top}
          size={sparkle.size}
          index={index}
        />
      ))}
    </View>
  );
}

/** Soft glow behind the solved object. */
export function Glow({ size = 130, color = '#F7E2A6' }: { size?: number; color?: string }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx={50} cy={50} r={48} fill={color} opacity={0.55} />
        <Ellipse cx={50} cy={50} rx={34} ry={30} fill="#FFFFFF" opacity={0.7} />
      </Svg>
    </View>
  );
}
