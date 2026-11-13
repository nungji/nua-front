import Svg, { Circle, Path } from 'react-native-svg';

import type { NeedId } from '../game/types';

/** What the customer needs, drawn as a picture. Never the answer itself. */
export function NeedIcon({ need, size = 52 }: { need: NeedId; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {need === 'water' ? (
        <>
          <Path d="M24 6 Q37 22 37 30 A13 13 0 0 1 11 30 Q11 22 24 6 Z" fill="#5BB3E0" />
          <Path d="M18 30 Q18 25 22 23" stroke="#BFE4F5" strokeWidth={3} strokeLinecap="round" fill="none" />
        </>
      ) : null}

      {need === 'rain' ? (
        <>
          <Path d="M12 24 Q12 14 22 15 Q26 7 34 10 Q42 10 41 19 Q46 20 45 25 Q44 31 36 31 L17 31 Q11 31 12 24 Z" fill="#9FB0C4" />
          <Path d="M17 36 L14 43" stroke="#5BB3E0" strokeWidth={3.4} strokeLinecap="round" />
          <Path d="M26 36 L23 43" stroke="#5BB3E0" strokeWidth={3.4} strokeLinecap="round" />
          <Path d="M35 36 L32 43" stroke="#5BB3E0" strokeWidth={3.4} strokeLinecap="round" />
        </>
      ) : null}

      {need === 'heat' ? (
        <>
          <Path d="M24 6 Q36 20 31 31 Q29 40 24 40 Q19 40 17 31 Q12 20 24 6 Z" fill="#F2873C" />
          <Path d="M24 20 Q30 28 26 34 Q24 37 22 34 Q18 28 24 20 Z" fill="#F7C04A" />
        </>
      ) : null}

      {need === 'leaves' ? (
        <>
          <Path d="M10 32 q4 -20 24 -16 q-4 20 -24 16 Z" fill="#D9773F" />
          <Path d="M20 44 q2 -18 20 -18 q0 18 -20 18 Z" fill="#E0A83C" />
          <Path d="M14 30 L30 20" stroke="#B9603B" strokeWidth={2} strokeLinecap="round" />
        </>
      ) : null}

      {need === 'high' ? (
        <>
          <Path d="M24 42 L24 16" stroke="#2F8F72" strokeWidth={5} strokeLinecap="round" />
          <Path d="M24 4 L36 18 L12 18 Z" fill="#2F8F72" />
        </>
      ) : null}
    </Svg>
  );
}
