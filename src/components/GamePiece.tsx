import { useEffect, useRef } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { PieceGraphic } from '@/components/PieceGraphic';
import { PIECE_PAD, SNAP_RADIUS } from '@/game/stages';
import { Piece, PieceEdges } from '@/game/types';

export type PieceHandle = {
  x: SharedValue<number>;
  y: SharedValue<number>;
  dragX: SharedValue<number>;
  dragY: SharedValue<number>;
  mode: SharedValue<number>;
};

type GamePieceProps = {
  piece: Piece;
  edges: PieceEdges;
  index: number;
  placed: boolean;
  blocked: boolean;
  turns: number;
  flipped: boolean;
  rotatable: boolean;
  register: (id: string, handle: PieceHandle) => void;
  onFreeze: (id: string, frozen: boolean) => void;
  onAttempt: (id: string) => void;
  onMiss: () => void;
  onTap: (id: string) => void;
  onLongPress: (id: string) => void;
};

export function GamePiece({
  piece,
  edges,
  index,
  placed,
  blocked,
  turns,
  flipped,
  rotatable,
  register,
  onFreeze,
  onAttempt,
  onMiss,
  onTap,
  onLongPress
}: GamePieceProps) {
  const tilt = ((index * 37) % 9) - 4;
  const startCenterX = piece.start.x + piece.width / 2;
  const startCenterY = piece.start.y + piece.height / 2;

  const x = useSharedValue(startCenterX);
  const y = useSharedValue(startCenterY);
  const dragX = useSharedValue(startCenterX);
  const dragY = useSharedValue(startCenterY);
  const mode = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const grabbedX = useSharedValue(0);
  const grabbedY = useSharedValue(0);
  const spin = useSharedValue(piece.initialTurns * 90);
  const tiltAmount = useSharedValue(tilt);
  const flipScale = useSharedValue(piece.initialFlipped ? -1 : 1);
  const held = useSharedValue(false);
  const previousTurns = useRef(piece.initialTurns);
  const spinTarget = useRef(piece.initialTurns * 90);
  const wasPlaced = useRef(false);

  useEffect(() => {
    register(piece.id, { x, y, dragX, dragY, mode });
  }, [piece.id, register, x, y, dragX, dragY, mode]);

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
      wasPlaced.current = true;
      mode.value = 2;
      offsetX.value = withSpring(piece.slot.x - piece.start.x, { damping: 18 });
      offsetY.value = withSpring(piece.slot.y - piece.start.y, { damping: 18 });
      onFreeze(piece.id, true);
      return;
    }

    if (wasPlaced.current) {
      wasPlaced.current = false;
      const centerX = piece.slot.x + piece.width / 2;
      const centerY = piece.slot.y + piece.height / 2;

      x.value = centerX;
      y.value = centerY;
      dragX.value = centerX;
      dragY.value = centerY;
      offsetX.value = 0;
      offsetY.value = 0;
      onFreeze(piece.id, false);
      mode.value = 0;
    }
  }, [placed, mode, offsetX, offsetY, x, y, dragX, dragY, onFreeze, piece.id, piece.slot.x, piece.slot.y, piece.width, piece.height, piece.start.x, piece.start.y]);

  const pan = Gesture.Pan()
    .enabled(!placed)
    .onStart(() => {
      offsetX.value = x.value - startCenterX;
      offsetY.value = y.value - startCenterY;
      dragX.value = x.value;
      dragY.value = y.value;
      grabbedX.value = offsetX.value;
      grabbedY.value = offsetY.value;
      mode.value = 1;
    })
    .onUpdate((event) => {
      offsetX.value = grabbedX.value + event.translationX;
      offsetY.value = grabbedY.value + event.translationY;
      dragX.value = startCenterX + offsetX.value;
      dragY.value = startCenterY + offsetY.value;
    })
    .onEnd(() => {
      const deltaX = startCenterX + offsetX.value - (piece.slot.x + piece.width / 2);
      const deltaY = startCenterY + offsetY.value - (piece.slot.y + piece.height / 2);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const aligned = !rotatable || (turns % 4 === 0 && !flipped);

      if (distance <= SNAP_RADIUS && aligned && !blocked) {
        runOnJS(onAttempt)(piece.id);
        return;
      }

      x.value = dragX.value;
      y.value = dragY.value;
      mode.value = 0;
      runOnJS(onMiss)();
    });

  const tap = Gesture.Tap()
    .maxDuration(320)
    .onEnd(() => {
      runOnJS(onTap)(piece.id);
    });

  const longPress = Gesture.LongPress()
    .minDuration(380)
    .enabled(rotatable && !placed)
    .onStart(() => {
      held.value = true;
    })
    .onFinalize(() => {
      if (!held.value) {
        return;
      }

      held.value = false;
      runOnJS(onLongPress)(piece.id);
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = `${spin.value + tiltAmount.value}deg`;

    if (mode.value === 0) {
      return {
        transform: [
          { translateX: x.value - startCenterX },
          { translateY: y.value - startCenterY },
          { rotate: rotation },
          { scaleX: flipScale.value }
        ]
      };
    }

    return {
      transform: [
        { translateX: offsetX.value },
        { translateY: offsetY.value },
        { rotate: rotation },
        { scaleX: flipScale.value }
      ]
    };
  });

  return (
    <GestureDetector gesture={Gesture.Exclusive(pan, longPress, tap)}>
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
          edges={edges}
          fill={placed ? piece.color : piece.tone}
          stroke="#FFFFFF"
          strokeWidth={1.5}
        />
      </Animated.View>
    </GestureDetector>
  );
}
