import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { INK_NIGHT } from './colors';

const SKIN = '#F6CBA6';
const HAIR = '#4A3428';
const APRON = '#2F8F72';
const SHIRT = '#F7EEDD';

/** The player: the kid who runs the shop. Flat stand-in for the designed protagonist. */
export function Shopkeeper({ width = 120 }: { width?: number }) {
  return (
    <Svg width={width} height={width} viewBox="0 0 100 100">
      <Path d="M16 100 Q16 72 50 72 Q84 72 84 100 Z" fill={SHIRT} />
      <Path d="M30 100 Q30 82 50 82 Q70 82 70 100 Z" fill={APRON} />
      <Path d="M36 74 L36 86 M64 74 L64 86" stroke={APRON} strokeWidth={4} strokeLinecap="round" />
      <Circle cx={50} cy={50} r={24} fill={SKIN} />
      <Path d="M26 46 Q28 22 50 22 Q72 22 74 46 Q66 34 50 34 Q34 34 26 46 Z" fill={HAIR} />
      <Path d="M26 44 q-6 12 2 18 q-1 -12 4 -18 Z" fill={HAIR} />
      <Path d="M74 44 q6 12 -2 18 q1 -12 -4 -18 Z" fill={HAIR} />
      <Circle cx={41} cy={52} r={3.2} fill={INK_NIGHT} />
      <Circle cx={59} cy={52} r={3.2} fill={INK_NIGHT} />
      <Circle cx={33} cy={60} r={4} fill="#F1998F" opacity={0.4} />
      <Circle cx={67} cy={60} r={4} fill="#F1998F" opacity={0.4} />
      <Path d="M44 62 Q50 68 56 62" stroke={INK_NIGHT} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <Ellipse cx={50} cy={57} rx={2.6} ry={2} fill="#E0A47F" />
    </Svg>
  );
}
