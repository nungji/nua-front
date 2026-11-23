import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import type { ArtProps } from './types';

export function CoralB({ width = 70, height = 78 }: ArtProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 70 78">
      <G clipPath="url(#clip0_261_2420)">
        <Path d="M35 77.9989V49.6353M35 49.6353L19.6 32.6171M35 49.6353L50.4 29.7808M35 49.6353V25.5262M19.6 32.6171L15.4 14.1808M19.6 32.6171L7 25.5262M50.4 29.7808L56 11.3444M50.4 29.7808L64.4 24.108M35 25.5262L29.4 7.08984M35 25.5262L42 8.50803" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" stroke="#FF6F91" />
      </G>
      <Defs >
        <ClipPath id="clip0_261_2420">
          <Rect width="70" height="78" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}