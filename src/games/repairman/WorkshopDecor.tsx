import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { FONT } from '@/theme';

function Wrench({ size }: { size: number }) {
  return <Svg width={size} height={size} viewBox="0 0 48 48"><Path d="M18 5L25 12L20 18L13 11C6 22 16 31 25 26L37 40Q43 44 45 37L31 23C36 12 28 3 18 5Z" fill="#C6D8FA" stroke="white" strokeWidth={6} strokeLinejoin="round" /><Path d="M18 5L25 12L20 18L13 11C6 22 16 31 25 26L37 40Q43 44 45 37L31 23C36 12 28 3 18 5Z" fill="#C6D8FA" stroke="#163D8C" strokeWidth={2.5} strokeLinejoin="round" /></Svg>;
}

export function WorkshopHeader({ title, scale, onExit, onReset }: { title: string; scale: number; onExit: () => void; onReset: () => void }) {
  const button = (label: string, glyph: string, action: () => void, accessibilityLabel: string) => <Pressable onPress={action} accessibilityRole="button" accessibilityLabel={accessibilityLabel} hitSlop={8} style={{ backgroundColor: '#00BDEC', borderColor: '#D5FFFF', borderWidth: 4 * scale, borderRadius: 40, paddingHorizontal: 20 * scale, paddingVertical: 9 * scale, boxShadow: `0 ${6 * scale}px 0 #0078DE` }}><Text style={{ color: 'white', fontFamily: FONT, fontSize: Math.max(14, 25 * scale) }}>{glyph} {label}</Text></Pressable>;
  return <View style={{ height: 114 * scale, paddingHorizontal: 28 * scale, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 * scale }}>
    {button('나가기', '‹', onExit, '뒤로')}
    <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}><Wrench size={58 * scale} /><View style={{ backgroundColor: '#FFF7DA', borderRadius: 40, borderWidth: 4 * scale, borderColor: '#B9F5FF', paddingHorizontal: 28 * scale, paddingVertical: 10 * scale, flexShrink: 1, boxShadow: `0 ${7 * scale}px 0 #008BE7` }}><Text numberOfLines={1} style={{ fontFamily: FONT, color: '#123B83', fontSize: 30 * scale }}>{title}</Text></View><Wrench size={58 * scale} /></View>
    {button('다시', '↻', onReset, '다시')}
  </View>;
}

function Bubble({ index, height }: { index: number; height: number }) {
  const progress = useSharedValue(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!reduced) progress.value = withRepeat(withTiming(1, { duration: 15000 + index * 1900, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(progress);
  }, [progress, reduced, index]);
  const style = useAnimatedStyle(() => {
    const phase = (progress.value + index / 8) % 1;
    return { opacity: reduced ? 0 : .42 * Math.sin(phase * Math.PI), transform: [{ translateY: -phase * (height + 80) }, { translateX: Math.sin(phase * Math.PI * 4 + index) * 15 }] };
  });
  const size = 12 + index % 3 * 12;
  return <Animated.View style={[{ position: 'absolute', bottom: -50, left: `${index < 4 ? 4 + index * 4 : 79 + (index - 4) * 5}%`, width: size, height: size, borderRadius: size, borderWidth: 2, borderColor: '#DDFFFF', backgroundColor: '#BCF8FF30' }, style]}><View style={{ position: 'absolute', top: 4, left: 5, width: size * .25, height: size * .15, borderRadius: 8, backgroundColor: 'white' }} /></Animated.View>;
}

export function WorkshopWater({ height }: { height: number }) {
  const glow = useSharedValue(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!reduced) glow.value = withRepeat(withTiming(1, { duration: 7000, easing: Easing.inOut(Easing.sin) }), -1, true);
    return () => cancelAnimation(glow);
  }, [glow, reduced]);
  const style = useAnimatedStyle(() => ({ opacity: .06 + glow.value * .07, transform: [{ rotate: `${-12 + glow.value * 5}deg` }] }));
  return <View pointerEvents="none" accessible={false} style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}><Animated.View style={[{ position: 'absolute', top: -height * .3, left: '32%', width: '28%', height: height * 1.3, backgroundColor: '#C6FFFF' }, style]} />{Array.from({ length: 8 }, (_, i) => <Bubble key={i} index={i} height={height} />)}</View>;
}
