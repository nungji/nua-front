import { useId } from 'react';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';
import type { GameIconProps } from '@/games/types';

/** A shell treasure chest, using the selector's outlined glossy ocean icon style. */
export function DaisoIcon({ width = 64, height = 64 }: GameIconProps) {
  const id = useId();
  return <Svg width={width} height={height} viewBox="0 0 64 64">
    <Defs><LinearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%"><Stop stopColor="#C6A5FF" /><Stop offset="1" stopColor="#8054E1" /></LinearGradient></Defs>
    <Path d="M7 31Q3 20 12 19Q10 8 23 12Q32 0 41 12Q54 8 52 20Q63 19 57 32L52 52Q32 64 12 52Z" fill="white" stroke="white" strokeWidth="7" strokeLinejoin="round" />
    <Path d="M8 31Q4 20 13 20Q11 9 24 13Q32 2 40 13Q53 9 51 21Q62 20 56 32Z" fill={`url(#${id})`} stroke="#7551BD" strokeWidth="2" />
    <Path d="M18 19L23 30M31 13V29M45 19L40 30" stroke="#DABEFF" strokeWidth="3" strokeLinecap="round" />
    <Path d="M8 32Q32 23 56 32L51 51Q32 61 13 51Z" fill={`url(#${id})`} stroke="#7551BD" strokeWidth="2" />
    <Path d="M9 33Q32 43 55 33" stroke="#FFE398" strokeWidth="5" fill="none" strokeLinecap="round" />
    <Path d="M28 34H37V46Q32 51 28 46Z" fill="#FFD061" stroke="#FFF1B7" strokeWidth="2" />
    <Circle cx="32.5" cy="40" r="2" fill="#B88D43" /><Ellipse cx="18" cy="43" rx="3" ry="4" fill="#EBDCFF" />
    <Path d="M50 5L52 11L58 13L52 15L50 21L48 15L42 13L48 11Z" fill="#FFE186" stroke="white" strokeWidth="2" />
  </Svg>;
}
