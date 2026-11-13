import { View } from 'react-native';
import type { ReactNode } from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import type { ComicCut } from '../game/types';
import { ItemArt } from './Item';
import { PanelBgArt } from './Bgs';
import { Customer } from './Customer';
import { NeedIcon } from './NeedIcon';
import { ProblemArt } from './Problem';
import { LINE, WATER } from './colors';

function Effect({ kind, size }: { kind: NonNullable<ComicCut['effect']>; size: number }) {
  if (kind === 'shine') {
    const sparkles = [
      { left: size * 0.18, top: size * 0.56, size: 18 },
      { left: size * 0.34, top: size * 0.68, size: 24 },
      { left: size * 0.5, top: size * 0.58, size: 15 }
    ];

    return (
      <>
        {sparkles.map((sparkle, index) => (
          <View key={`shine-${index}`} style={{ position: 'absolute', left: sparkle.left, top: sparkle.top }}>
            <Svg width={sparkle.size} height={sparkle.size} viewBox="0 0 24 24">
              <Path d="M12 1 L14 9 L22 12 L14 15 L12 23 L10 15 L2 12 L10 9 Z" fill="#FFFFFF" opacity={0.95} />
            </Svg>
          </View>
        ))}
      </>
    );
  }

  if (kind === 'splash') {
    return (
      <View style={{ position: 'absolute', left: size * 0.1, top: size * 0.46 }}>
        <Svg width={size * 0.3} height={size * 0.2} viewBox="0 0 60 40">
          <Path d="M6 30 Q18 8 30 30 Q42 8 54 30" stroke={WATER} strokeWidth={4} fill="none" strokeLinecap="round" />
          <Circle cx={10} cy={12} r={3} fill={WATER} />
          <Circle cx={30} cy={6} r={3.4} fill={WATER} />
          <Circle cx={50} cy={14} r={2.6} fill={WATER} />
          <Ellipse cx={30} cy={34} rx={22} ry={4} fill={WATER} opacity={0.45} />
        </Svg>
      </View>
    );
  }

  return (
    <View style={{ position: 'absolute', left: size * 0.32, bottom: size * 0.1 }}>
      <Svg width={size * 0.3} height={size * 0.22} viewBox="0 0 70 50">
        <Path d="M12 4 q4 8 0 12 q-4 -4 0 -12 Z" fill={WATER} />
        <Path d="M34 0 q4 8 0 12 q-4 -4 0 -12 Z" fill={WATER} />
        <Path d="M56 6 q4 8 0 12 q-4 -4 0 -12 Z" fill={WATER} />
        <Ellipse cx={34} cy={44} rx={26} ry={5} fill={WATER} opacity={0.4} />
      </Svg>
    </View>
  );
}

type Props = {
  cut: ComicCut;
  size: number;
  overlay?: ReactNode;
};

/** One comic cut. Backgrounds share one horizon, so characters sit in the same place. */
export function ComicPanel({ cut, size, overlay }: Props) {
  const side = cut.side;
  const customerStyle =
    side === 'left'
      ? { left: size * 0.08 }
      : side === 'right'
        ? { right: size * 0.08 }
        : { left: (size - size * 0.36) / 2 };

  const propSide = side === 'left' ? { right: size * 0.06 } : { left: size * 0.06 };

  return (
    <View
      style={{
        width: '100%',
        aspectRatio: 4 / 3,
        borderRadius: 26,
        borderWidth: 3,
        borderColor: LINE,
        overflow: 'hidden',
        backgroundColor: '#F6E7CB'
      }}
    >
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <PanelBgArt id={cut.bg} />
      </View>

      {cut.problem ? (
        <View style={{ position: 'absolute', bottom: size * 0.04, ...propSide, width: size * 0.34 }}>
          <ProblemArt id={cut.problem} width={size * 0.34} />
        </View>
      ) : null}

      {cut.item ? (
        <View style={{ position: 'absolute', left: size * 0.42, bottom: size * 0.02 }}>
          <ItemArt id={cut.item} width={size * 0.2} />
        </View>
      ) : null}

      <View style={{ position: 'absolute', bottom: 0, ...customerStyle }}>
        <Customer id={cut.customer} mood={cut.mood} width={size * 0.36} />
      </View>

      {cut.need ? (
        <View
          style={{
            position: 'absolute',
            bottom: size * 0.42,
            ...(side === 'right' ? { left: size * 0.08 } : { right: size * 0.08 }),
            backgroundColor: '#FFFFFF',
            borderWidth: 3,
            borderColor: LINE,
            borderRadius: 22,
            paddingHorizontal: 12,
            paddingVertical: 10
          }}
        >
          <NeedIcon need={cut.need} size={size * 0.16} />
        </View>
      ) : null}

      {cut.effect ? <Effect kind={cut.effect} size={size} /> : null}
      {overlay}
    </View>
  );
}

type SceneProps = {
  cut: ComicCut;
  size: number;
  fixed?: boolean;
  overlay?: ReactNode;
};

/** Portrait backdrop for the tall use/result card: bands instead of a 4:3 crop. */
function PortraitBackdrop({ id }: { id: ComicCut['bg'] }) {
  const sky = id === 'rain' ? '#A9BCCF' : '#CFE7F6';
  const ground = id === 'rain' ? '#B9C7B0' : '#CBE3B4';
  const horizon = id === 'window' ? 190 : 150;

  return (
    <Svg width="100%" height="100%" viewBox="0 0 200 300" preserveAspectRatio="none">
      <Rect x={0} y={0} width={200} height={horizon} fill={id === 'window' ? '#F3E4CC' : sky} />
      {id === 'window' ? (
        <>
          <Rect x={26} y={30} width={110} height={96} rx={6} fill="#8A6446" />
          <Rect x={33} y={38} width={96} height={80} rx={3} fill="#A9C3D8" />
          <Path d="M33 78 H129 M81 38 V118" stroke="#8A6446" strokeWidth={4} />
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Path
              key={`win-rain-${index}`}
              d={`M${44 + index * 15} ${46 + (index % 2) * 9} l-3 11`}
              stroke="#DCEAF6"
              strokeWidth={2.2}
              strokeLinecap="round"
            />
          ))}
        </>
      ) : (
        <>
          <Ellipse cx={166} cy={38} rx={24} ry={19} fill="#FBE08A" />
          <Path d="M0 118 Q54 92 108 118 Q156 140 200 112 L200 150 L0 150 Z" fill={id === 'rain' ? '#A3B29B' : '#B9D8C4'} />
          <Path d="M0 150 H200" stroke={id === 'rain' ? '#8FA089' : '#A8CE94'} strokeWidth={2} />
        </>
      )}
      {id === 'rain' ? (
        <>
          <Path d="M40 20 Q40 6 54 8 Q58 -2 70 2 Q82 0 85 14 Q96 16 94 26 Q92 34 80 34 L50 34 Q40 34 40 20 Z" fill="#8FA3B8" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <Path
              key={`rain-${index}`}
              d={`M${16 + index * 22} ${62 + (index % 3) * 8} l-4 16`}
              stroke="#DCEAF6"
              strokeWidth={2.6}
              strokeLinecap="round"
            />
          ))}
        </>
      ) : null}
      <Rect x={0} y={horizon} width={200} height={300 - horizon} fill={ground} />
      {[0, 1, 2, 3, 4].map((index) => (
        <Path
          key={`tuft-${index}`}
          d={`M${18 + index * 42} ${horizon + 16} q5 -10 10 0`}
          stroke={id === 'rain' ? '#93A88B' : '#9FC98C'}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </Svg>
  );
}

/** Use / result cut. Same backdrop, laid out for the tall card so it fills the screen. */
export function SceneCut({ cut, size, fixed = false, overlay }: SceneProps) {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 26,
        borderWidth: 3,
        borderColor: LINE,
        overflow: 'hidden',
        backgroundColor: '#F6E7CB'
      }}
    >
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <PortraitBackdrop id={cut.bg} />
      </View>

      {cut.problem ? (
        <View style={{ position: 'absolute', right: size * 0.04, bottom: size * 0.06, width: size * 0.44 }}>
          <ProblemArt id={cut.problem} fixed={fixed} width={size * 0.44} />
        </View>
      ) : null}

      {cut.item ? (
        <View style={{ position: 'absolute', left: size * 0.46, bottom: size * 0.04 }}>
          <ItemArt id={cut.item} width={size * 0.22} />
        </View>
      ) : null}

      <View style={{ position: 'absolute', left: size * 0.04, bottom: 0 }}>
        <Customer id={cut.customer} mood={cut.mood} width={size * 0.44} />
      </View>

      {overlay}
    </View>
  );
}

export function CutDots({ count, index, color }: { count: number; index: number; color: string }) {
  return (
    <View className="flex-row items-center" style={{ gap: 5 }}>
      {Array.from({ length: count }, (_, dot) => (
        <View
          key={`cut-dot-${dot}`}
          className="rounded-full"
          style={{
            width: dot === index ? 14 : 7,
            height: 7,
            backgroundColor: dot === index ? color : LINE
          }}
        />
      ))}
    </View>
  );
}
