import Svg, { Path } from 'react-native-svg';

import type { ArtProps } from './types';

export function Fish({ width = 38, height = 25 }: ArtProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 38 25">
      <Path d="M27.8662 12.5L36.7329 5V20L27.8662 12.5Z" fill="#FFC93C" strokeWidth="2.5" strokeLinejoin="round" stroke="#1B3A6B" />
      <Path d="M16.4665 21.25C24.1617 21.25 30.3999 17.3325 30.3999 12.5C30.3999 7.66751 24.1617 3.75 16.4665 3.75C8.77137 3.75 2.5332 7.66751 2.5332 12.5C2.5332 17.3325 8.77137 21.25 16.4665 21.25Z" fill="#FFC93C" strokeWidth="2.5" stroke="#1B3A6B" />
      <Path d="M19 5C21.5333 10 21.5333 15 19 20" strokeWidth="4" stroke="#FF7A3D" />
      <Path d="M8.8668 12.5C9.91614 12.5 10.7668 11.6605 10.7668 10.625C10.7668 9.58947 9.91614 8.75 8.8668 8.75C7.81746 8.75 6.9668 9.58947 6.9668 10.625C6.9668 11.6605 7.81746 12.5 8.8668 12.5Z" fill="#1B3A6B" />
    </Svg>
  );
}