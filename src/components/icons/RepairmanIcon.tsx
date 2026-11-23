import { useId } from 'react';
import Svg, { Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';
import type { GameIconProps } from '@/games/types';

export function RepairmanIcon({ width = 64, height = 64 }: GameIconProps) {
  const id = useId();
  const star = 'M25 17Q29 -1 35 7L41 19Q62 16 59 26L48 37Q56 58 45 56L32 48Q11 62 12 49L17 36Q-1 25 8 21Z';
  return <Svg width={width} height={height} viewBox="0 0 64 64">
    <Defs><LinearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%"><Stop stopColor="#FFE88B" /><Stop offset="1" stopColor="#FFAB36" /></LinearGradient></Defs>
    <Path d={star} fill="white" stroke="white" strokeWidth="6" strokeLinejoin="round" />
    <Path d={star} fill={`url(#${id})`} stroke="#ED8546" strokeWidth="2.3" strokeLinejoin="round" />
    <Ellipse cx="29" cy="14" rx="4" ry="6" transform="rotate(22 29 14)" fill="#FFFBE5" />
    <Ellipse cx="13" cy="26" rx="4" ry="2.5" fill="#FFFBE5" />
    <Path d="M31 18L32 34M15 26L27 32M46 26L36 32M21 47L29 38M43 47L35 38" fill="none" stroke="#F18B36" strokeWidth="3" strokeLinecap="round" />
    <Path d="M46 43Q40 39 43 34L46 38L50 37L51 32Q58 36 53 43L49 55Q47 58 44 55Z" fill="#8FECE4" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
  </Svg>;
}
