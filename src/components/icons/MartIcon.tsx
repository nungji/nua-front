import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { GameIconProps } from '@/games/types';

/** Seaweed basket carrying a pearl shell and a little fish. */
export function MartIcon({ width = 64, height = 64 }: GameIconProps) {
  return <Svg width={width} height={height} viewBox="0 0 64 64">
    <Path d="M17 31Q16 6 32 6Q48 6 47 31" fill="none" stroke="white" strokeWidth="9" strokeLinecap="round" />
    <Path d="M17 31Q16 6 32 6Q48 6 47 31" fill="none" stroke="#70E9CC" strokeWidth="5" strokeLinecap="round" />
    <Path d="M13 32Q5 20 16 22Q13 12 23 17Q29 10 33 20Q42 17 40 27L31 36Z" fill="#FF9CB9" stroke="white" strokeWidth="2" strokeLinejoin="round" />
    <Path d="M24 32L20 21M28 32L29 21" stroke="#ED638E" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="26" cy="29" r="5" fill="#FFF5D9" />
    <Path d="M34 27Q43 15 53 25L60 20L59 33L53 29Q44 39 34 27Z" fill="#FFD15E" stroke="white" strokeWidth="2" strokeLinejoin="round" />
    <Circle cx="41" cy="26" r="1.5" fill="#19477C" />
    <Path d="M9 33H55L50 55Q32 62 14 55Z" fill="#49CEBD" stroke="white" strokeWidth="3" strokeLinejoin="round" />
    <Path d="M22 39L24 52M32 39V54M42 39L40 52" stroke="#BAFFF0" strokeWidth="3" strokeLinecap="round" />
    <Rect x="7" y="31" width="50" height="7" rx="3.5" fill="#96F2DD" stroke="white" strokeWidth="2" />
    <Circle cx="55" cy="9" r="4" fill="#B4F6FF55" stroke="white" strokeWidth="2" />
  </Svg>;
}
