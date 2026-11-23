import { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { cancelAnimation, Easing, type SharedValue, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

type MotionProps = { time: SharedValue<number>; index: number; width: number; height: number };

function Fish({ time, index, width, height }: MotionProps) {
  const size = Math.max(32, Math.min(width, height) * .075);
  const reverse = index % 2 === 1;
  const style = useAnimatedStyle(() => {
    const phase = (time.value * (index % 2 + 2) + index * .23) % 1;
    return { transform: [{ translateX: (reverse ? 1 - phase : phase) * (width + size * 3) - size * 1.5 }, { translateY: Math.sin(phase * Math.PI * 6) * height * .025 }, { scaleX: reverse ? -1 : 1 }] };
  });
  const color = ['#FFD34B', '#FF86BF', '#6EEAD5', '#FFAD58'][index];
  return <Animated.View testID={`home-fish-${index}`} style={[{ position: 'absolute', top: height * [.24, .34, .76, .18][index], width: size * 1.6, height: size }, style]}>
    <Svg width="100%" height="100%" viewBox="0 0 96 60"><Path d="M30 30L5 9Q0 30 5 51Z" fill={color} /><Ellipse cx="55" cy="30" rx="32" ry="23" fill={color} /><Path d="M40 10Q50 30 40 50M55 8Q65 30 55 52" fill="none" stroke="#FFFFFF" strokeWidth="7" opacity=".75" /><Path d="M50 9Q44 -1 66 5L73 13" fill={color} /><Circle cx="75" cy="25" r="5" fill="#173D70" /><Circle cx="76" cy="23" r="1.5" fill="white" /><Path d="M78 37Q83 41 87 35" fill="none" stroke="#D86D65" strokeWidth="2" strokeLinecap="round" /></Svg>
  </Animated.View>;
}

function Coral({ time, index, width, height }: MotionProps) {
  const size = Math.min(width * .17, height * .3);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: size / 2 }, { rotate: `${Math.sin(time.value * Math.PI * 24 + index * 2) * 5}deg` }, { translateY: -size / 2 }] }));
  return <Animated.View testID={`home-coral-${index}`} style={[{ position: 'absolute', bottom: height * .055, left: index === 0 ? -size * .15 : width - size * .8, width: size, height: size }, style]}>
    <Svg width="100%" height="100%" viewBox="0 0 120 150"><Path d="M61 145Q65 108 58 75L52 16M59 97Q23 93 20 60L17 40M60 78Q91 69 96 29M57 55L32 28M63 120Q96 116 109 81" fill="none" stroke={index ? '#FF79B9' : '#C28AF1'} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" /><Path d="M57 140Q61 106 54 78M60 94Q28 90 26 64M64 77Q89 64 91 41" fill="none" stroke={index ? '#FFC1DF' : '#E5BCFF'} strokeWidth="5" strokeLinecap="round" /></Svg>
  </Animated.View>;
}

function Bubble({ time, index, width, height }: MotionProps) {
  const size = 10 + index % 4 * 7;
  const style = useAnimatedStyle(() => {
    const phase = (time.value * 3 + index / 10) % 1;
    return { opacity: Math.sin(phase * Math.PI) * .6, transform: [{ translateY: -phase * (height + 60) }, { translateX: Math.sin(phase * 12 + index) * 16 }] };
  });
  return <Animated.View testID={`home-bubble-${index}`} style={[{ position: 'absolute', bottom: -40, left: width * ((index * .137 + .05) % 1), width: size, height: size, borderRadius: size, borderWidth: 1.5, borderColor: '#DFFFFF', backgroundColor: '#BDF9FF22' }, style]}><View style={{ position: 'absolute', top: 3, left: 4, width: size * .28, height: size * .18, borderRadius: 8, backgroundColor: '#FFFFFFDD' }} /></Animated.View>;
}

/** Decorative layer behind the selector; never intercepts a swipe or tap. */
export function HomeOceanLife() {
  const { width, height } = useWindowDimensions();
  const time = useSharedValue(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!reduced) time.value = withRepeat(withTiming(1, { duration: 60000, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(time);
  }, [reduced, time]);
  const props = { time, width, height };
  return <View pointerEvents="none" accessible={false} style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
    {[0, 1, 2, 3].map(index => <Fish key={`fish-${index}`} {...props} index={index} />)}
    {[0, 1].map(index => <Coral key={`coral-${index}`} {...props} index={index} />)}
    {Array.from({ length: 10 }, (_, index) => <Bubble key={`bubble-${index}`} {...props} index={index} />)}
  </View>;
}
