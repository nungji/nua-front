import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import type { ProblemId } from '../game/types';

type Props = {
  id: ProblemId;
  fixed?: boolean;
  width?: number;
};

/**
 * Tight crops per prop so a 150px box is mostly drawing, not padding. Heights follow the
 * crop ratio, which is why a yard is a wide strip and a potted plant is tall.
 */
const FRAMES: Record<ProblemId, { box: string; ratio: number }> = {
  dryFlower: { box: '44 16 76 104', ratio: 1.37 },
  rainWalk: { box: '32 10 104 84', ratio: 0.81 },
  hotPot: { box: '22 8 116 106', ratio: 0.91 },
  leafYard: { box: '2 62 156 52', ratio: 0.33 },
  highFruit: { box: '0 6 160 112', ratio: 0.7 }
};

const POT_TERRACOTTA = '#C97B5A';
const POT_DARK = '#B0674A';

function petals(cx: number, cy: number, fill: string) {
  return Array.from({ length: 5 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    return (
      <Circle
        key={`petal-${index}`}
        cx={cx + Math.cos(angle) * 9}
        cy={cy + Math.sin(angle) * 9}
        r={6.4}
        fill={fill}
      />
    );
  });
}

export function ProblemArt({ id, fixed = false, width = 150 }: Props) {
  const frame = FRAMES[id];

  return (
    <Svg width={width} height={Math.round(width * frame.ratio)} viewBox={frame.box}>
      {id === 'dryFlower' ? (
        <>
          <Rect x={52} y={70} width={56} height={11} rx={5} fill={POT_DARK} />
          <Path d="M56 78 L104 78 L98 113 Q97 117 92 117 L68 117 Q63 117 62 113 Z" fill={POT_TERRACOTTA} />
          <Ellipse cx={80} cy={78} rx={20} ry={4.6} fill={fixed ? '#6B4E38' : '#8A6A4C'} />
          {fixed ? (
            <>
              <Path d="M80 76 Q82 58 84 42" stroke="#5FA36E" strokeWidth={5} strokeLinecap="round" fill="none" />
              <Path d="M81 62 Q70 56 66 46" stroke="#5FA36E" strokeWidth={4} strokeLinecap="round" fill="none" />
              <Path d="M82 66 Q92 60 96 50" stroke="#5FA36E" strokeWidth={4} strokeLinecap="round" fill="none" />
              {petals(84, 36, '#F2A0B5')}
              <Circle cx={84} cy={36} r={5} fill="#F7C94B" />
              <Ellipse cx={60} cy={72} rx={3.4} ry={4.6} fill="#5BB3E0" />
              <Ellipse cx={104} cy={72} rx={3.4} ry={4.6} fill="#5BB3E0" />
            </>
          ) : (
            <>
              <Path d="M80 76 Q78 62 88 56 Q98 50 100 60" stroke="#A8B57F" strokeWidth={5} strokeLinecap="round" fill="none" />
              <Path d="M80 68 Q68 64 62 72" stroke="#A8B57F" strokeWidth={4} strokeLinecap="round" fill="none" />
              {petals(102, 58, '#CFC08E')}
              <Circle cx={102} cy={58} r={4.6} fill="#B7A46F" />
            </>
          )}
        </>
      ) : null}

      {id === 'rainWalk' ? (
        <>
          <Path
            d="M40 52 Q40 30 60 30 Q66 14 84 18 Q106 16 110 36 Q128 38 126 52 Q124 66 106 66 L54 66 Q38 66 40 52 Z"
            fill={fixed ? '#C3D2E0' : '#9FB0C4'}
          />
          {fixed ? null : (
            <>
              <Path d="M58 74 L52 90" stroke="#5BB3E0" strokeWidth={4.4} strokeLinecap="round" />
              <Path d="M80 74 L74 90" stroke="#5BB3E0" strokeWidth={4.4} strokeLinecap="round" />
              <Path d="M102 74 L96 90" stroke="#5BB3E0" strokeWidth={4.4} strokeLinecap="round" />
              <Path d="M70 96 L65 110" stroke="#5BB3E0" strokeWidth={4.4} strokeLinecap="round" opacity={0.7} />
              <Path d="M92 96 L87 110" stroke="#5BB3E0" strokeWidth={4.4} strokeLinecap="round" opacity={0.7} />
            </>
          )}
        </>
      ) : null}

      {id === 'hotPot' ? (
        <>
          <Path d="M40 62 q-13 8 0 17" stroke="#6F727B" strokeWidth={5} fill="none" strokeLinecap="round" />
          <Path d="M120 62 q13 8 0 17" stroke="#6F727B" strokeWidth={5} fill="none" strokeLinecap="round" />
          <Path d="M44 58 h72 l-6 44 q-1 9 -10 9 h-40 q-9 0 -10 -9 Z" fill="#8C8F98" />
          <Rect x={38} y={48} width={84} height={11} rx={5} fill="#6F727B" />
          <Rect x={70} y={36} width={20} height={11} rx={5} fill="#6F727B" />
          {fixed ? null : (
            <>
              <Path d="M64 28 q-6 -10 2 -16" stroke="#C9D3DE" strokeWidth={4.4} strokeLinecap="round" fill="none" />
              <Path d="M84 28 q-6 -10 2 -16" stroke="#C9D3DE" strokeWidth={4.4} strokeLinecap="round" fill="none" />
              <Path d="M104 28 q-6 -10 2 -16" stroke="#C9D3DE" strokeWidth={4.4} strokeLinecap="round" fill="none" />
            </>
          )}
        </>
      ) : null}

      {id === 'leafYard' ? (
        <>
          <Rect x={6} y={94} width={148} height={16} rx={8} fill="#C9B79A" />
          {fixed ? (
            <Path d="M58 94 q12 -14 24 -9 q13 5 20 9 Z" fill="#C08A5E" />
          ) : (
            <>
              <Path d="M30 92 q10 -16 24 -7 q-9 15 -24 7 Z" fill="#D9773F" />
              <Path d="M56 90 q3 -16 18 -13 q3 15 -18 13 Z" fill="#E0A83C" />
              <Path d="M84 92 q13 -13 24 -4 q-11 13 -24 4 Z" fill="#B9603B" />
              <Path d="M110 88 q6 -15 21 -11 q-2 15 -21 11 Z" fill="#D9944A" />
              <Path d="M44 100 q12 -8 22 -2 q-10 9 -22 2 Z" fill="#C97B3C" />
              <Path d="M96 102 q12 -8 22 -3 q-10 10 -22 3 Z" fill="#E0A83C" />
            </>
          )}
        </>
      ) : null}

      {id === 'highFruit' ? (
        <>
          <Path d="M8 24 Q60 42 152 18" stroke="#8A6446" strokeWidth={8} strokeLinecap="round" fill="none" />
          <Path d="M52 30 Q58 22 66 24" stroke="#5FA36E" strokeWidth={5} strokeLinecap="round" fill="none" />
          {fixed ? (
            <>
              <Rect x={6} y={100} width={148} height={13} rx={6} fill="#C9B79A" />
              <Circle cx={118} cy={92} r={11} fill="#E5553F" />
              <Path d="M118 81 q2 -7 9 -8" stroke="#5FA36E" strokeWidth={3.4} strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <Circle cx={96} cy={40} r={11.5} fill="#E5553F" />
              <Path d="M96 28 q2 -7 9 -8" stroke="#5FA36E" strokeWidth={3.4} strokeLinecap="round" fill="none" />
              <Circle cx={126} cy={30} r={9.5} fill="#E5553F" />
              <Path d="M126 20 q2 -6 8 -7" stroke="#5FA36E" strokeWidth={3.4} strokeLinecap="round" fill="none" />
            </>
          )}
        </>
      ) : null}
    </Svg>
  );
}
