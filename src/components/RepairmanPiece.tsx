import { useEffect } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeInDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

import { PieceGraphic } from '@/components/PieceGraphic';
import { Piece, PieceEdges, PieceId, PIECE_PAD, SNAP_RADIUS } from '@/repairmanPuzzle';

type RepairmanPieceProps = {
  piece: Piece;
  edges: PieceEdges;
  index: number;
  placed: boolean;
  turns: number;
  flipped: boolean;
  rotated: boolean;
  onSnap: (id: PieceId) => void;
  onMiss: () => void;
  onTap: (id: PieceId) => void;
  onLongPress: (id: PieceId) => void;
};

export function RepairmanPiece({
  piece,
  edges,
  index,
  placed,
  turns,
  flipped,
  rotated,
  onSnap,
  onMiss,
  onTap,
  onLongPress
}: RepairmanPieceProps) {
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const grabbedX = useSharedValue(0);
  const grabbedY = useSharedValue(0);

  useEffect(() => {
    if (!placed) {
      offsetX.value = withSpring(0);
      offsetY.value = withSpring(0);
    }
  }, [placed, offsetX, offsetY]);

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
      const deltaX = piece.startX + offsetX.value - piece.slotX;
      const deltaY = piece.startY + offsetY.value - piece.slotY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const aligned = !rotated || (turns % 4 === 0 && !flipped);

      if (distance <= SNAP_RADIUS && aligned) {
        offsetX.value = withSpring(piece.slotX - piece.startX);
        offsetY.value = withSpring(piece.slotY - piece.startY);
        runOnJS(onSnap)(piece.id);
        return;
      }

      offsetX.value = withSpring(0);
      offsetY.value = withSpring(0);
      runOnJS(onMiss)();
    });

  const tap = Gesture.Tap()
    .maxDuration(300)
    .onEnd(() => {
      runOnJS(onTap)(piece.id);
    });

  const longPress = Gesture.LongPress()
    .minDuration(400)
    .enabled(rotated && !placed)
    .onEnd(() => {
      runOnJS(onLongPress)(piece.id);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { rotate: `${turns * 90}deg` },
      { scaleX: flipped ? -1 : 1 }
    ]
  }));

  return (
    <GestureDetector gesture={Gesture.Exclusive(pan, longPress, tap)}>
      <Animated.View
        entering={FadeInDown.duration(320).delay(index * 70)}
        style={[
          {
            position: 'absolute',
            left: piece.startX - PIECE_PAD,
            top: piece.startY - PIECE_PAD,
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
