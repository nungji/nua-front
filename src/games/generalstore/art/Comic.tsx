import { View } from 'react-native';
import type { ReactNode } from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import type { ComicCut } from '../game/types';
import { PanelBgArt } from './Bgs';
import { Customer } from './Customer';
import { ItemArt } from './Item';
import { NeedIcon } from './NeedIcon';
import { ProblemArt } from './Problem';
import { LINE, WATER } from './colors';

function Effect({ kind, width, height }: { kind: NonNullable<ComicCut['effect']>; width: number; height: number }) {
  if (kind === 'shine') {
    const sparkles = [
      { left: width * 0.12, top: height * 0.5, size: 18 },
      { left: width * 0.28, top: height * 0.64, size: 24 },
      { left: width * 0.44, top: height * 0.54, size: 15 }
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
      <View style={{ position: 'absolute', left: width * 0.1, top: height * 0.44 }}>
        <Svg width={width * 0.26} height={height * 0.24} viewBox="0 0 60 40">
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
    <View style={{ position: 'absolute', left: width * 0.3, bottom: height * 0.1 }}>
      <Svg width={width * 0.26} height={height * 0.22} viewBox="0 0 70 50">
        <Path d="M12 4 q4 8 0 12 q-4 -4 0 -12 Z" fill={WATER} />
        <Path d="M34 0 q4 8 0 12 q-4 -4 0 -12 Z" fill={WATER} />
        <Path d="M56 6 q4 8 0 12 q-4 -4 0 -12 Z" fill={WATER} />
        <Ellipse cx={34} cy={44} rx={26} ry={5} fill={WATER} opacity={0.4} />
      </Svg>
    </View>
  );
}

type PanelProps = {
  cut: ComicCut;
  width: number;
  height: number;
};

/** One comic cut. Everything is placed from the box size, so it works in landscape and portrait. */
export function ComicPanel({ cut, width, height }: PanelProps) {
  const customerWidth = Math.min(width * 0.44, height * 0.66);
  const propWidth = Math.min(width * 0.34, height * 0.52);
  const bubbleSize = Math.min(width * 0.14, height * 0.26);

  const customerStyle =
    cut.side === 'left'
      ? { left: width * 0.04 }
      : cut.side === 'right'
        ? { right: width * 0.04 }
        : { left: (width - customerWidth) / 2 };

  const propStyle = cut.side === 'left' ? { right: width * 0.03 } : { left: width * 0.03 };
  const bubbleStyle = cut.side === 'right' ? { left: width * 0.06 } : { right: width * 0.06 };

  return (
    <View
      style={{
        width,
        height,
        borderRadius: 22,
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
        <View style={{ position: 'absolute', bottom: 0, ...propStyle, width: propWidth }}>
          <ProblemArt id={cut.problem} width={propWidth} />
        </View>
      ) : null}

      <View style={{ position: 'absolute', bottom: 0, ...customerStyle }}>
        <Customer id={cut.customer} mood={cut.mood} width={customerWidth} />
      </View>

      {cut.need ? (
        <View
          style={{
            position: 'absolute',
            bottom: height * 0.42,
            ...bubbleStyle,
            backgroundColor: '#FFFFFF',
            borderWidth: 3,
            borderColor: LINE,
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 8
          }}
        >
          <NeedIcon need={cut.need} size={bubbleSize} />
        </View>
      ) : null}

      {cut.effect ? <Effect kind={cut.effect} width={width} height={height} /> : null}
    </View>
  );
}

type SceneProps = {
  cut: ComicCut;
  width: number;
  height: number;
  fixed?: boolean;
  overlay?: ReactNode;
};

/** Use / result cut: backdrop fills the card, figures are sized from the card height. */
export function SceneCut({ cut, width, height, fixed = false, overlay }: SceneProps) {
  const customerWidth = Math.min(height * 0.92, width * 0.24, 280);
  const propWidth = Math.min(height * 0.8, width * 0.2, 240);
  const itemWidth = Math.min(height * 0.3, width * 0.09, 92);

  return (
    <View style={{ flex: 1, borderRadius: 22, borderWidth: 3, borderColor: LINE, overflow: 'hidden' }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <PanelBgArt id={cut.bg} />
      </View>

      {cut.problem ? (
        <View style={{ position: 'absolute', right: '3%', bottom: 0 }}>
          <ProblemArt id={cut.problem} fixed={fixed} width={propWidth} />
        </View>
      ) : null}

      <View style={{ position: 'absolute', left: '4%', bottom: 0 }}>
        <Customer id={cut.customer} mood={cut.mood} width={customerWidth} />
      </View>

      {cut.item ? (
        <View style={{ position: 'absolute', left: '44%', bottom: height * 0.06 }}>
          <ItemArt id={cut.item} width={itemWidth} />
        </View>
      ) : null}

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
