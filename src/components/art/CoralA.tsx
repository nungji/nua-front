import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import type { ArtProps } from './types';

export function CoralA({ width = 58, height = 64 }: ArtProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 58 64">
      <G clipPath="url(#clip0_261_2425)">
        <Path d="M28.9998 63.9982V40.7255M28.9998 40.7255L16.2398 26.7619M28.9998 40.7255L41.7598 24.4346M28.9998 40.7255V20.9437M16.2398 26.7619L12.7598 11.6346M16.2398 26.7619L5.7998 20.9437M41.7598 24.4346L46.3998 9.30732M41.7598 24.4346L53.3598 19.78M28.9998 20.9437L24.3598 5.81641M28.9998 20.9437L34.7998 6.98004" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" stroke="#FFA24C" />
      </G>
      <Defs >
        <ClipPath id="clip0_261_2425">
          <Rect width="58" height="64" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}