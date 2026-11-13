import Svg, { Path } from 'react-native-svg';

import type { GameIconProps } from '@/games/types';

/** Four point sparkle used by the template scene. */
export function ExampleIcon({ width = 64, height = 64 }: GameIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 64">
      <Path
        d="M32 4 C35 20 44 29 60 32 C44 35 35 44 32 60 C29 44 20 35 4 32 C20 29 29 20 32 4 Z"
        fill="#FFC93C"
        stroke="#FFFFFF"
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path d="M45 14 C46 21 49 24 56 25 C49 26 46 29 45 36 C44 29 41 26 34 25 C41 24 44 21 45 14 Z" fill="#FFFFFF" fillOpacity={0.75} />
    </Svg>
  );
}
