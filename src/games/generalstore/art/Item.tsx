import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import type { ItemId } from '../game/types';

const METAL = '#8FA8BF';
const METAL_LIGHT = '#A9C0D3';
const METAL_DARK = '#5D7387';
const STICK = '#B07A4E';

export function ItemArt({ id, width = 72 }: { id: ItemId; width?: number }) {
  return (
    <Svg width={width} height={width} viewBox="0 0 100 100">
      {id === 'bucket' ? (
        <>
          <Path d="M24 30 L76 30 L70 88 Q69 92 65 92 L35 92 Q31 92 30 88 Z" fill={METAL} />
          <Ellipse cx={50} cy={30} rx={26} ry={7.5} fill={METAL_LIGHT} />
          <Ellipse cx={50} cy={31} rx={19} ry={4.8} fill={METAL_DARK} />
          <Path
            d="M26 32 Q22 14 50 14 Q78 14 74 32"
            stroke={METAL_DARK}
            strokeWidth={3.6}
            strokeLinecap="round"
            fill="none"
          />
          <Path d="M36 44 L33 78" stroke={METAL_LIGHT} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
        </>
      ) : null}

      {id === 'sock' ? (
        <>
          <Path
            d="M40 12 h20 v36 q0 8 8 8 h8 q10 0 10 10 q0 12 -13 12 h-24 q-9 0 -9 -9 Z"
            fill="#F0A6B8"
          />
          <Path d="M40 12 h20 v10 h-20 Z" fill="#D9839B" />
          <Path d="M72 62 q7 0 7 8" stroke="#D9839B" strokeWidth={3} fill="none" strokeLinecap="round" />
        </>
      ) : null}

      {id === 'basket' ? (
        <>
          <Path d="M20 42 L80 42 L72 88 Q71 92 67 92 L33 92 Q29 92 28 88 Z" fill="#D8A86A" />
          <Path d="M34 54 L32 86 M50 54 L50 86 M66 54 L68 86" stroke="#B98A4E" strokeWidth={2.6} />
          <Rect x={16} y={34} width={68} height={9} rx={4} fill="#B98A4E" />
          <Path
            d="M32 34 Q32 12 50 12 Q68 12 68 34"
            stroke="#B98A4E"
            strokeWidth={4.4}
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : null}

      {id === 'umbrella' ? (
        <>
          <Path
            d="M50 16 Q86 20 88 52 Q78 42 69 52 Q60 42 50 52 Q40 42 31 52 Q22 42 12 52 Q14 20 50 16 Z"
            fill="#E7614F"
          />
          <Path d="M50 20 L50 84 Q50 92 42 92 Q35 92 35 85" stroke="#6B4B36" strokeWidth={4.6} strokeLinecap="round" fill="none" />
          <Circle cx={50} cy={13} r={3.2} fill="#6B4B36" />
        </>
      ) : null}

      {id === 'fan' ? (
        <>
          <Path d="M50 84 L18 32 Q50 -6 82 32 Z" fill="#F2C14E" />
          <Path d="M50 84 L28 28" stroke="#DDA52F" strokeWidth={2.4} />
          <Path d="M50 84 L50 10" stroke="#DDA52F" strokeWidth={2.4} />
          <Path d="M50 84 L72 28" stroke="#DDA52F" strokeWidth={2.4} />
          <Rect x={45} y={80} width={10} height={16} rx={5} fill="#B98A4E" />
        </>
      ) : null}

      {id === 'towel' ? (
        <>
          <Rect x={24} y={20} width={52} height={64} rx={9} fill="#9BD3C6" />
          <Rect x={24} y={20} width={52} height={14} rx={7} fill="#7CBCAE" />
          <Path d="M34 50 h32 M34 62 h32" stroke="#7CBCAE" strokeWidth={3.4} strokeLinecap="round" />
        </>
      ) : null}

      {id === 'mitten' ? (
        <>
          <Rect x={30} y={18} width={40} height={64} rx={20} fill="#E07A3F" />
          <Circle cx={74} cy={54} r={13} fill="#E07A3F" />
          <Rect x={26} y={72} width={48} height={16} rx={8} fill="#B85F2C" />
          <Path d="M42 32 L42 60" stroke="#C9612C" strokeWidth={3} strokeLinecap="round" opacity={0.6} />
        </>
      ) : null}

      {id === 'ladle' ? (
        <>
          <Rect x={46} y={12} width={9} height={54} rx={4.5} fill={METAL} />
          <Path d="M18 62 Q18 94 50 94 Q82 94 82 62 Z" fill={METAL} />
          <Path d="M26 66 Q28 84 44 87" stroke={METAL_LIGHT} strokeWidth={4} strokeLinecap="round" fill="none" />
        </>
      ) : null}

      {id === 'broom' ? (
        <>
          <Path d="M66 10 L48 56" stroke={STICK} strokeWidth={8} strokeLinecap="round" />
          <Path d="M38 52 L20 92 L56 92 L58 52 Z" fill="#E3C25F" />
          <Path d="M30 60 L27 90 M42 58 L41 91 M52 58 L53 91" stroke="#C9A94A" strokeWidth={2.4} />
          <Rect x={35} y={48} width={26} height={9} rx={4} fill={STICK} />
        </>
      ) : null}

      {id === 'shovel' ? (
        <>
          <Path d="M56 10 L45 52" stroke={STICK} strokeWidth={8} strokeLinecap="round" />
          <Path d="M28 50 L60 50 L55 88 Q54 93 48 93 L36 93 Q31 93 30 88 Z" fill={METAL} />
          <Rect x={25} y={47} width={38} height={9} rx={4} fill={METAL_DARK} />
        </>
      ) : null}

      {id === 'longStick' ? (
        <>
          <Path d="M26 86 L74 14" stroke={STICK} strokeWidth={9} strokeLinecap="round" />
          <Path d="M32 80 L70 22" stroke="#C79A6C" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
        </>
      ) : null}

      {id === 'shortStick' ? (
        <>
          <Path d="M38 68 L62 36" stroke={STICK} strokeWidth={9} strokeLinecap="round" />
          <Path d="M42 63 L58 42" stroke="#C79A6C" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
        </>
      ) : null}
    </Svg>
  );
}
