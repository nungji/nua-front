import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import type { ArtProps } from './types';

// figma drop shadow: dy 10.0 blur 10.0 #000000 @0.25
// react-native-svg has no <filter>; apply via style={boxShadow:'0 10.0 10.0 #000000'}
export function ScallopStamp({ width = 220, height = 220 }: ArtProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 220">
      <G clipPath="url(#clip0_261_2817)">
        <G >
          <Path d="M102.049 185.649L40.0059 86.5407C46.5661 49.6587 72.6872 30.9347 118.369 30.3687C162.935 40.4202 184.593 64.1659 183.341 101.606L102.049 185.649Z" fill="white" strokeWidth="5.00433" strokeLinejoin="round" stroke="#FF4F7A" />
          <Path opacity="0.7" d="M160.074 54.8786L102.049 185.648L72.48 45.6722M102.049 185.648L97.8339 34.2476M102.049 185.648L137.649 38.4324M102.049 185.648L118.369 30.3677" strokeWidth="3.50303" stroke="#FF4F7A" />
          <Path d="M74.1785 182.721L129.92 188.579L116.301 203.25L84.4492 199.902L74.1785 182.721Z" fill="white" strokeWidth="4.00347" strokeLinejoin="round" stroke="#FF4F7A" />
        </G>
        <Path d="M112.616 85.1134C102.807 75.0251 80.9305 76.3487 78.2941 101.432C76.2226 121.141 88.8613 138.773 99.6115 139.903C103.195 140.279 105.175 138.676 106.967 138.864C108.758 139.052 110.362 141.032 113.945 141.409C124.695 142.539 140.723 127.92 142.795 108.212C145.431 83.128 124.308 77.2848 112.616 85.1134Z" fill="#FF2D2D" strokeWidth="4.00347" stroke="#1B3A6B" />
        <Path d="M112.615 85.1157C113.369 77.9489 115.725 72.7622 119.874 67.7637" strokeWidth="5.00433" strokeLinecap="round" stroke="#8B4A1C" />
        <Path d="M119.121 74.9299C127.041 68.5164 135.811 71.2496 137.415 73.2296C133.078 80.0198 123.931 80.8699 119.121 74.9299Z" fill="#1E9E45" />
        <Path d="M100.898 196.598C107.495 197.291 113.404 192.505 114.098 185.909C114.791 179.312 110.005 173.402 103.409 172.709C96.8117 172.015 90.9019 176.801 90.2085 183.398C89.5152 189.995 94.3009 195.904 100.898 196.598Z" fill="#FFF7FB" strokeWidth="2.00173" stroke="#E6C9DA" />
        <Path d="M97.7528 183.435C99.8143 183.652 101.661 182.157 101.878 180.095C102.094 178.034 100.599 176.187 98.5374 175.97C96.4759 175.753 94.6291 177.249 94.4124 179.31C94.1957 181.372 95.6913 183.219 97.7528 183.435Z" fill="white" />
      </G>
      <Defs >
        <ClipPath id="clip0_261_2817">
          <Rect width="200" height="200" fill="white" transform="translate(20.9234) scale(1.00087) rotate(6)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}