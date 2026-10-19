import { useEffect } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeInDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

import { Piece, PieceId, SNAP_RADIUS } from '@/repairmanPuzzle';

type RepairmanPieceProps = {
  piece: Piece;
  index: number;
  placed: boolean;
  onSnap: (id: PieceId) => void;
  onUnsnap: (id: PieceId) => void;
  onMiss: () => void;
};

export function RepairmanPiece({
  piece,
  index,
  placed,
  onSnap,
  onUnsnap,
  onMiss
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

      if (distance <= SNAP_RADIUS) {
        offsetX.value = withSpring(piece.slotX - piece.startX);
        offsetY.value = withSpring(piece.slotY - piece.startY);
        runOnJS(onSnap)(piece.id);
      } else {
        offsetX.value = withSpring(0);
        offsetY.value = withSpring(0);
        runOnJS(onMiss)();
      }
    });

  const tap = Gesture.Tap()
    .enabled(placed)
    .onEnd(() => {
      runOnJS(onUnsnap)(piece.id);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }]
  }));

  const radius = piece.shape === 'circle' ? piece.width / 2 : 8;

  return (
    <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>
      <Animated.View
        entering={FadeInDown.duration(320).delay(index * 70)}
        style={[
          {
            position: 'absolute',
            left: piece.startX,
            top: piece.startY,
            width: piece.width,
            height: piece.height,
            borderRadius: radius
          },
          animatedStyle
        ]}
      >
        <View
          style={{
            flex: 1,
            borderRadius: radius,
            backgroundColor: placed ? piece.color : '#B9BEC7'
          }}
        />
      </Animated.View>
    </GestureDetector>
  );
}
