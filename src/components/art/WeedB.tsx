import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import type { ArtProps } from './types';

export function WeedB({ width = 46, height = 124 }: ArtProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 46 124">
      <G clipPath="url(#clip0_261_2417)">
        <Path d="M15.3331 123.998C3.06645 100.748 26.0665 86.7984 13.7998 65.0984C1.53312 43.3984 22.9998 30.9984 12.2665 4.64844" strokeWidth="12" strokeLinecap="round" stroke="#2FBF71" />
        <Path d="M32.1999 124C21.4666 105.4 39.8666 91.45 30.6666 74.4C21.4666 57.35 38.3332 49.6 32.1999 31" strokeWidth="10" strokeLinecap="round" stroke="#1E9E5A" />
      </G>
      <Defs >
        <ClipPath id="clip0_261_2417">
          <Rect width="46" height="124" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}