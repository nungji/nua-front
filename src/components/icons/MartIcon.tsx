import { useId } from 'react';
import Svg, { Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';
import type { GameIconProps } from '@/games/types';

export function MartIcon({ width = 64, height = 64 }: GameIconProps) {
  const id = useId();
  const shell = 'M10 27Q3 16 14 16Q13 6 24 12Q32 0 40 12Q51 6 51 17Q63 17 55 29L49 51Q32 63 15 51Z';
  return <Svg width={width} height={height} viewBox="0 0 64 64">
    <Defs><LinearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%"><Stop stopColor="#9AF2E7" /><Stop offset="1" stopColor="#20C6C8" /></LinearGradient></Defs>
    <Path d={shell} fill="white" stroke="white" strokeWidth="6" strokeLinejoin="round" />
    <Path d={shell} fill={`url(#${id})`} stroke="#16A3AF" strokeWidth="2.3" strokeLinejoin="round" />
    <Path d="M18 24L23 46M28 20L29 47M39 20L36 47M48 25L42 46" stroke="#24B5BF" strokeWidth="3" strokeLinecap="round" />
    <Path d="M17 29Q17 9 32 9Q47 9 47 29" fill="none" stroke="white" strokeWidth="9" strokeLinecap="round" />
    <Path d="M17 29Q17 9 32 9Q47 9 47 29" fill="none" stroke="#FFD87D" strokeWidth="5" strokeLinecap="round" />
    <Path d="M13 29Q32 34 51 29" fill="none" stroke="#FFF1C9" strokeWidth="6" strokeLinecap="round" />
    <Ellipse cx="19" cy="39" rx="3" ry="4" fill="#ECFFFC" />
  </Svg>;
}
