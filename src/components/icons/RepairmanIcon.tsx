import Svg, { Path } from 'react-native-svg';

import type { GameIconProps } from '@/games/types';

/** Open-end wrench with sparkles, drawn for the 64x64 card slot. */
export function RepairmanIcon({ width = 64, height = 64 }: GameIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 64">
      <Path
        d="M15 27 C15 14 22 6 32 6 C42 6 49 14 49 27 L41.5 27 C41.5 18 38 13.5 32 13.5 C26 13.5 22.5 18 22.5 27 Z"
        fill="#44D5EE"
        stroke="#FFFFFF"
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      <Path
        d="M25.5 27 L38.5 27 L38.5 51 C38.5 55.5 35.6 58.5 32 58.5 C28.4 58.5 25.5 55.5 25.5 51 Z"
        fill="#FFA24C"
        stroke="#FFFFFF"
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      <Path d="M30 34 L34 34 L34 48 L30 48 Z" fill="#FFFFFF" fillOpacity={0.55} />

      <Path
        d="M51 12 C52 18 54 20 60 21 C54 22 52 24 51 30 C50 24 48 22 42 21 C48 20 50 18 51 12 Z"
        fill="#FFC93C"
        stroke="#FFFFFF"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <Path
        d="M13 44 C13.7 47.6 14.9 48.8 18.5 49.5 C14.9 50.2 13.7 51.4 13 55 C12.3 51.4 11.1 50.2 7.5 49.5 C11.1 48.8 12.3 47.6 13 44 Z"
        fill="#FFC93C"
        stroke="#FFFFFF"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
