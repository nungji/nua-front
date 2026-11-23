import Svg, { Path } from 'react-native-svg';

import type { ArtProps } from './types';

export function Pearl({ width = 26, height = 26 }: ArtProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 26 26">
      <Path d="M12.9996 23.4016C18.7434 23.4016 23.3996 18.7453 23.3996 13.0016C23.3996 7.2578 18.7434 2.60156 12.9996 2.60156C7.25585 2.60156 2.59961 7.2578 2.59961 13.0016C2.59961 18.7453 7.25585 23.4016 12.9996 23.4016Z" fill="#FFF7FB" strokeWidth="2" stroke="#E6C9DA" />
      <Path d="M9.09961 12.3516C10.8945 12.3516 12.3496 10.8965 12.3496 9.10156C12.3496 7.30664 10.8945 5.85156 9.09961 5.85156C7.30468 5.85156 5.84961 7.30664 5.84961 9.10156C5.84961 10.8965 7.30468 12.3516 9.09961 12.3516Z" fill="white" />
    </Svg>
  );
}