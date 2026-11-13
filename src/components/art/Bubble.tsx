import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import type { ArtProps } from './types';

export function Bubble({ width = 22, height = 22 }: ArtProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 22 22">
      <G clipPath="url(#clip0_261_2427)">
        <Path d="M11.0004 20.3484C16.1643 20.3484 20.3504 16.1623 20.3504 10.9984C20.3504 5.83458 16.1643 1.64844 11.0004 1.64844C5.83653 1.64844 1.65039 5.83458 1.65039 10.9984C1.65039 16.1623 5.83653 20.3484 11.0004 20.3484Z" fill="white" fillOpacity="0.18" strokeWidth="2.5" stroke="white" strokeOpacity="0.85" />
        <Path d="M6.0498 8.24922C6.32427 7.49086 6.76215 6.80213 7.33244 6.23185C7.90272 5.66157 8.59144 5.22368 9.3498 4.94922" strokeWidth="3" strokeLinecap="round" stroke="white" />
      </G>
      <Defs >
        <ClipPath id="clip0_261_2427">
          <Rect width="22" height="22" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}