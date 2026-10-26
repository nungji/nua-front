import { useEffect, useRef } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { PieceGraphic } from '@/components/PieceGraphic';
import { PIECE_PAD, tiltFor } from '@/game/stages';
import { Piece } from '@/game/types';

type GamePieceProps = {
  piece: Piece;
  index: number;
  placed: boolean;
  turns: number;
  flipped: boolean;
  hits: SharedValue<number[]>;
  activeIndex: SharedValue<number>;
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
  grabDX: SharedValue<number>;
  grabDY: SharedValue<number>;
};

export function GamePiece({
  piece,
  index,
  placed,
  turns,
  flipped,
  hits,
  activeIndex,
  touchX,
  touchY,
  grabDX,
  grabDY
}: GamePieceProps) {
  const tilt = tiltFor(index);
  const centerX = piece.start.x + piece.width / 2;
  const centerY = piece.start.y + piece.height / 2;
  const slotCenterX = piece.slot.x + piece.width / 2;
  const slotCenterY = piece.slot.y + piece.height / 2;

  const spin = useSharedValue(piece.initialTurns * 90);
  const tiltAmount = useSharedValue(tilt);
  const flipScale = useSharedValue(piece.initialFlipped ? -1 : 1);
  const snap = useSharedValue(1);
  const snapFromX = useSharedValue(0);
  const snapFromY = useSharedValue(0);
  const previousTurns = useRef(piece.initialTurns);
  const spinTarget = useRef(piece.initialTurns * 90);
  const wasPlaced = useRef(false);

  useEffect(() => {
    const delta = ((turns - previousTurns.current) % 4 + 4) % 4;

    previousTurns.current = turns;

    if (delta === 0) {
      return;
    }

    spinTarget.current += delta * 90;
    spin.value = withTiming(spinTarget.current, { duration: 220 });
  }, [spin, turns]);

  useEffect(() => {
    tiltAmount.value = withTiming(placed ? 0 : tilt, { duration: 200 });
  }, [placed, tilt, tiltAmount]);

  useEffect(() => {
    flipScale.value = withTiming(flipped ? -1 : 1, { duration: 180 });
  }, [flipped, flipScale]);

  useEffect(() => {
    if (placed) {
      const values = hits.value;
      snapFromX.value = values[index * 4] ?? slotCenterX;
      snapFromY.value = values[index * 4 + 1] ?? slotCenterY;
      snap.value = 0;
      snap.value = withTiming(1, { duration: 200 });
      wasPlaced.current = true;
      return;
    }

    if (wasPlaced.current) {
      wasPlaced.current = false;
      snap.value = 1;
    }
  }, [placed, hits, index, slotCenterX, slotCenterY, snap, snapFromX, snapFromY]);

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = `${spin.value + tiltAmount.value}deg`;
    let offsetX: number;
    let offsetY: number;

    if (placed) {
      const progress = snap.value;
      const targetX = snapFromX.value + (slotCenterX - snapFromX.value) * progress;
      const targetY = snapFromY.value + (slotCenterY - snapFromY.value) * progress;
      offsetX = targetX - centerX;
      offsetY = targetY - centerY;
    } else if (activeIndex.value === index) {
      offsetX = touchX.value - grabDX.value - centerX;
      offsetY = touchY.value - grabDY.value - centerY;
    } else {
      offsetX = (hits.value[index * 4] ?? centerX) - centerX;
      offsetY = (hits.value[index * 4 + 1] ?? centerY) - centerY;
    }

    return {
      transform: [
        { translateX: offsetX },
        { translateY: offsetY },
        { rotate: rotation },
        { scaleX: flipScale.value }
      ]
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: piece.start.x - PIECE_PAD,
          top: piece.start.y - PIECE_PAD,
          width: piece.width + PIECE_PAD * 2,
          height: piece.height + PIECE_PAD * 2
        },
        animatedStyle
      ]}
    >
      <PieceGraphic
        piece={piece}
        edges={piece.edges}
        fill={placed ? piece.color : piece.tone}
        stroke="#FFFFFF"
        strokeWidth={1.5}
      />
    </Animated.View>
  );
}
