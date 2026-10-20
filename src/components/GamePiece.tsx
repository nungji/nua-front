import { useEffect } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

import { PieceGraphic } from '@/components/PieceGraphic';
import { PIECE_PAD, SNAP_RADIUS } from '@/game/stages';
import { Piece, PieceEdges } from '@/game/types';

type GamePieceProps = {
  piece: Piece;
  edges: PieceEdges;
  index: number;
  placed: boolean;
  blocked: boolean;
  turns: number;
  flipped: boolean;
  rotatable: boolean;
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
  onAttempt,
  onMiss,
  onTap,
  onLongPress
}: GamePieceProps) {
  const tilt = ((index * 37) % 9) - 4;
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const dropY = useSharedValue(-(90 + index * 14));
  const angle = useSharedValue(piece.initialTurns * 90 + tilt);
  const flipScale = useSharedValue(piece.initialFlipped ? -1 : 1);
  const grabbedX = useSharedValue(0);
  const grabbedY = useSharedValue(0);

  useEffect(() => {
    dropY.value = withTiming(0, { duration: 560, easing: Easing.bounce });
  }, [dropY]);

  useEffect(() => {
    if (placed) {
      offsetX.value = withSpring(piece.slot.x - piece.start.x, { damping: 18 });
      offsetY.value = withSpring(piece.slot.y - piece.start.y, { damping: 18 });
      return;
    }

    offsetX.value = withSpring(0, { damping: 16 });
    offsetY.value = withSpring(0, { damping: 16 });
  }, [placed, offsetX, offsetY, piece.slot.x, piece.slot.y, piece.start.x, piece.start.y]);

  useEffect(() => {
    angle.value = withTiming(turns * 90 + (placed ? 0 : tilt), { duration: 220 });
  }, [turns, placed, tilt, angle]);

  useEffect(() => {
    flipScale.value = withTiming(flipped ? -1 : 1, { duration: 180 });
  }, [flipped, flipScale]);

  const pan = Gesture.Pan()
    .enabled(!placed)
    .onStart(() => {
      grabbedX.value = offsetX.value;
      grabbedY.value = offsetY.value;
    })
    .onUpdate((event) => {
      offsetX.value = grabbedX.value + event.translationX;
      offsetY.value = grabbedY.value + event.translationY;
    })
    .onEnd(() => {
      const deltaX = piece.start.x + offsetX.value - piece.slot.x;
      const deltaY = piece.start.y + offsetY.value - piece.slot.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const aligned = !rotatable || (turns % 4 === 0 && !flipped);

      if (distance <= SNAP_RADIUS && aligned) {
        if (blocked) {
          offsetY.value = withSequence(
            withTiming(offsetY.value + 84, { duration: 200, easing: Easing.in(Easing.quad) }),
            withSpring(0, { damping: 13 })
          );
          runOnJS(onMiss)();
          return;
        }

        runOnJS(onAttempt)(piece.id);
        return;
      }

      offsetX.value = withSpring(0, { damping: 15 });
      offsetY.value = withSpring(0, { damping: 15 });
      runOnJS(onMiss)();
    });

  const tap = Gesture.Tap()
    .maxDuration(300)
    .onEnd(() => {
      runOnJS(onTap)(piece.id);
    });

  const longPress = Gesture.LongPress()
    .minDuration(400)
    .enabled(rotatable && !placed)
    .onEnd(() => {
      runOnJS(onLongPress)(piece.id);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value + dropY.value },
      { rotate: `${angle.value}deg` },
      { scaleX: flipScale.value }
    ]
  }));

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
