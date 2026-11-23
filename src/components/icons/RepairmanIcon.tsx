import Svg, { Circle, Path } from 'react-native-svg';
import type { GameIconProps } from '@/games/types';

/** Coral-handled wrench with a starfish and bubbles. */
export function RepairmanIcon({ width = 64, height = 64 }: GameIconProps) {
  return <Svg width={width} height={height} viewBox="0 0 64 64">
    <Path d="M24 31C10 27 10 10 22 6L21 19L30 23L39 16L37 4C52 9 55 24 42 33L34 55Q30 63 23 58Q18 55 22 48Z" fill="#6DE9E3" stroke="white" strokeWidth="3" strokeLinejoin="round" />
    <Path d="M27 35L35 38L29 54Q27 58 24 54Z" fill="#FF858F" />
    <Path d="M27 43L23 39M30 45L35 43" fill="none" stroke="#FF858F" strokeWidth="3" strokeLinecap="round" />
    <Path d="M49 34L52 41L60 42L54 47L55 55L48 51L41 55L43 47L37 42L46 41Z" fill="#FFC857" stroke="white" strokeWidth="2" strokeLinejoin="round" />
    <Circle cx="48" cy="45" r="1.3" fill="#EE8659" /><Circle cx="51" cy="48" r="1.2" fill="#EE8659" />
    <Circle cx="9" cy="36" r="4" fill="#8EEFFF55" stroke="white" strokeWidth="2" /><Circle cx="12" cy="48" r="2" fill="#D3FCFF" />
  </Svg>;
}
