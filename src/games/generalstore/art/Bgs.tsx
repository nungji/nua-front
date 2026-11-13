import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import type { PanelBg } from '../game/types';
import { WATER } from './colors';

/**
 * Panel backdrops for the story comic. 200x150 units, stretched to the panel box, so every
 * background shares one horizon and the characters can be placed in the same spots.
 */
export function PanelBgArt({ id }: { id: PanelBg }) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice">
      {id === 'yard' ? (
        <>
          <Rect x={0} y={0} width={200} height={92} fill="#CFE7F6" />
          <Circle cx={172} cy={22} r={13} fill="#FBE08A" />
          <Path d="M0 74 Q40 56 78 74 Q120 92 200 70 L200 92 L0 92 Z" fill="#B9D8C4" />
          <Rect x={0} y={92} width={200} height={58} fill="#CBE3B4" />
          <Path d="M0 92 H200" stroke="#A8CE94" strokeWidth={2} />
          <Rect x={0} y={34} width={54} height={58} fill="#F2E3CB" />
          <Path d="M-4 36 L27 14 L58 36 Z" fill="#D98C6A" />
          <Rect x={12} y={48} width={20} height={18} rx={3} fill="#A9C3D8" />
          <Path d="M12 57 H32 M22 48 V66" stroke="#F2E3CB" strokeWidth={2} />
          <Path d="M40 74 q6 -10 12 0" stroke="#9FC98C" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M104 92 q4 -8 9 0 M120 92 q4 -8 9 0 M148 92 q4 -8 9 0" stroke="#9FC98C" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M74 92 q10 -26 26 -26 q16 0 26 26 Z" fill="#B7D6A2" opacity={0.65} />
        </>
      ) : null}

      {id === 'pond' ? (
        <>
          <Rect x={0} y={0} width={200} height={64} fill="#CFE7F6" />
          <Circle cx={28} cy={20} r={11} fill="#FBE08A" />
          <Path d="M0 58 Q50 44 104 58 Q154 72 200 56 L200 64 L0 64 Z" fill="#A9CFB7" />
          <Rect x={0} y={64} width={200} height={86} fill="#BFDCA8" />
          <Ellipse cx={104} cy={114} rx={82} ry={28} fill="#6FBEDF" />
          <Ellipse cx={104} cy={112} rx={82} ry={26} fill={WATER} />
          <Path d="M46 104 q16 -8 34 -2 M92 118 q18 -8 36 -2 M120 100 q14 -6 28 -1" stroke="#BFE4F5" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M14 92 q4 -18 6 0 M22 94 q5 -14 7 0 M176 96 q5 -16 7 0" stroke="#6BA86B" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M182 74 q12 -12 18 -2 q-10 8 -18 2 Z" fill="#7FB86E" />
        </>
      ) : null}

      {id === 'door' ? (
        <>
          <Rect x={0} y={0} width={200} height={132} fill="#EFDCC0" />
          <Rect x={0} y={0} width={200} height={22} fill="#FFFFFF" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            <Circle key={`hem-${index}`} cx={12 + index * 25} cy={22} r={12.5} fill={index % 2 === 0 ? '#2F8F72' : '#FFFFFF'} />
          ))}
          <Rect x={0} y={0} width={200} height={10} fill="#2F8F72" />
          <Rect x={22} y={40} width={62} height={92} rx={4} fill="#8A6446" />
          <Rect x={28} y={46} width={50} height={80} rx={3} fill="#FBE7C0" />
          <Rect x={28} y={46} width={50} height={80} rx={3} fill="#F2A649" opacity={0.25} />
          <Circle cx={74} cy={88} r={3.2} fill="#8A6446" />
          <Rect x={102} y={46} width={84} height={34} rx={8} fill="#2F8F72" />
          <Path d="M118 66 h18 l-2 10 h-14 Z" fill="#FFFFFF" />
          <Path d="M121 62 q6 -6 12 0" stroke="#FFFFFF" strokeWidth={2.4} fill="none" />
          <Rect x={112} y={58} width={10} height={8} rx={2} fill="#FFFFFF" opacity={0.85} />
          <Rect x={0} y={132} width={200} height={18} fill="#C9B79A" />
          <Path d="M20 132 v-6 M180 132 v-6" stroke="#B0A085" strokeWidth={3} />
        </>
      ) : null}

      {id === 'rain' ? (
        <>
          <Rect x={0} y={0} width={200} height={104} fill="#A9BCCF" />
          <Path d="M22 34 Q22 16 40 18 Q46 4 62 8 Q80 6 84 24 Q100 26 98 40 Q96 52 80 52 L36 52 Q22 52 22 34 Z" fill="#8FA3B8" />
          <Path d="M120 62 Q120 48 134 50 Q139 40 151 43 Q165 42 168 56 Q180 58 178 68 Q176 76 164 76 L132 76 Q120 76 120 62 Z" fill="#9BAFC3" opacity={0.9} />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
            <Path
              key={`rain-${index}`}
              d={`M${14 + index * 20} ${66 + (index % 3) * 6} l-4 14`}
              stroke="#DCEAF6"
              strokeWidth={2.6}
              strokeLinecap="round"
            />
          ))}
          <Rect x={0} y={104} width={200} height={46} fill="#B9C7B0" />
          <Ellipse cx={54} cy={128} rx={26} ry={7} fill="#9FB6AD" />
          <Ellipse cx={148} cy={134} rx={32} ry={8} fill="#9FB6AD" />
          <Path d="M0 104 H200" stroke="#A3B29B" strokeWidth={2} />
          <Rect x={166} y={44} width={6} height={62} fill="#8A6446" />
          <Path d="M160 42 h18" stroke="#8A6446" strokeWidth={5} strokeLinecap="round" />
        </>
      ) : null}

      {id === 'window' ? (
        <>
          <Rect x={0} y={0} width={200} height={150} fill="#F3E4CC" />
          <Rect x={0} y={122} width={200} height={28} fill="#E4CFAF" />
          <Rect x={34} y={24} width={112} height={82} rx={6} fill="#8A6446" />
          <Rect x={40} y={30} width={100} height={70} rx={3} fill="#A9C3D8" />
          <Path d="M40 60 H140 M90 30 V100" stroke="#8A6446" strokeWidth={4} />
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Path
              key={`pane-rain-${index}`}
              d={`M${48 + index * 16} ${36 + (index % 2) * 8} l-3 10`}
              stroke="#DCEAF6"
              strokeWidth={2.2}
              strokeLinecap="round"
            />
          ))}
          <Path d="M44 74 q10 -8 20 0" stroke="#9FB6AD" strokeWidth={2.4} fill="none" />
          <Rect x={30} y={106} width={120} height={7} rx={3} fill="#B58A63" />
          <Rect x={158} y={92} width={26} height={30} rx={4} fill="#C97B5A" />
          <Path d="M171 92 q-2 -14 -10 -18 M171 92 q4 -14 12 -16" stroke="#5FA36E" strokeWidth={3} fill="none" strokeLinecap="round" />
        </>
      ) : null}
    </Svg>
  );
}
