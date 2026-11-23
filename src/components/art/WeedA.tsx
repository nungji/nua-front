import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import type { ArtProps } from './types';

export function WeedA({ width = 40, height = 108 }: ArtProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 108">
      <G clipPath="url(#clip0_261_2422)">
        <Path d="M13.3334 108.001C2.66674 87.7508 22.6667 75.6008 12.0001 56.7008C1.3334 37.8008 20.0001 27.0008 10.6667 4.05078" strokeWidth="12" strokeLinecap="round" stroke="#2FBF71" />
        <Path d="M27.9996 108C18.6662 91.8 34.6662 79.65 26.6662 64.8C18.6662 49.95 33.3329 43.2 27.9996 27" strokeWidth="10" strokeLinecap="round" stroke="#1E9E5A" />
      </G>
      <Defs >
        <ClipPath id="clip0_261_2422">
          <Rect width="40" height="108" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}