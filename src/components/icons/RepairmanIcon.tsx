import { useId } from 'react';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';
import type { GameIconProps } from '@/games/types';

export function RepairmanIcon({ width = 64, height = 64 }: GameIconProps) {
  const id = useId();
  const star = 'M25 17Q29 -1 35 7L41 19Q62 16 59 26L48 37Q56 58 45 56L32 48Q11 62 12 49L17 36Q-1 25 8 21Z';
  return <Svg width={width} height={height} viewBox="0 0 64 64">
    <Defs><LinearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%"><Stop stopColor="#FFE788" /><Stop offset="1" stopColor="#FF9B43" /></LinearGradient></Defs>
    <Path d={star} fill="white" stroke="white" strokeWidth="7" strokeLinejoin="round" />
    <Path d={star} fill={`url(#${id})`} stroke="#ED8546" strokeWidth="2.3" strokeLinejoin="round" />
    <Ellipse cx="29" cy="14" rx="4" ry="6" transform="rotate(22 29 14)" fill="#FFFBE5" />
    <Ellipse cx="13" cy="26" rx="4" ry="2.5" fill="#FFFBE5" />
    <Circle cx="25" cy="31" r="2.4" fill="#704341" /><Circle cx="38" cy="31" r="2.4" fill="#704341" />
    <Ellipse cx="21" cy="36" rx="4" ry="2.5" fill="#FF8E87" /><Ellipse cx="42" cy="36" rx="4" ry="2.5" fill="#FF8E87" />
    <Path d="M28 36Q32 41 36 36" fill="none" stroke="#9B5142" strokeWidth="2" strokeLinecap="round" />
    <Path d="M46 43Q40 39 43 34L46 38L50 37L51 32Q58 36 53 43L49 55Q47 58 44 55Z" fill="#8FECE4" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
  </Svg>;
}
