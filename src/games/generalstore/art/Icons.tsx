import Svg, { Path } from 'react-native-svg';

import { ACCENT, INK, LINE } from './colors';

type IconProps = {
  size?: number;
  color?: string;
};

export function BackIcon({ size = 26, color = INK }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 28">
      <Path
        d="M17 4 L7 14 L17 24"
        stroke={color}
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function ForwardIcon({ size = 26, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 28">
      <Path
        d="M7 4 L17 14 L7 24"
        stroke={color}
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function CheckIcon({ size = 18, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M5 12.5 L10 17.5 L19 6.5"
        stroke={color}
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function CrossIcon({ size = 16, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <Path
        d="M5 5 L15 15 M15 5 L5 15"
        stroke={color}
        strokeWidth={3.2}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export function StoreIcon({ size = 30 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path d="M5 13 L16 5 L27 13 L27 27 L5 27 Z" fill={ACCENT} />
      <Path d="M12 27 L12 19 L20 19 L20 27" fill={LINE} />
    </Svg>
  );
}
