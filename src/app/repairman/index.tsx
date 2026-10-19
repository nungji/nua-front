import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RepairmanPiece } from '@/components/RepairmanPiece';
import { BOARD_HEIGHT, BOARD_WIDTH, PIECES, Piece } from '@/repairmanPuzzle';
import { useRepairmanStore } from '@/store/useRepairmanStore';

export default function RepairmanScreen() {
  const placed = useRepairmanStore((state) => state.placed);
  const snaps = useRepairmanStore((state) => state.snaps);
  const misses = useRepairmanStore((state) => state.misses);
  const snap = useRepairmanStore((state) => state.snap);
  const unsnap = useRepairmanStore((state) => state.unsnap);
  const miss = useRepairmanStore((state) => state.miss);
  const reset = useRepairmanStore((state) => state.reset);

  const placedCount = PIECES.filter((piece) => placed[piece.id]).length;
  const completed = placedCount === PIECES.length;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-2">
        <Pressable onPress={() => router.back()} hitSlop={16}>
          <Text className="text-base text-gray-500">나가기</Text>
        </Pressable>
        <Text className="text-base font-semibold text-gray-900">수리공</Text>
        <Pressable onPress={reset} hitSlop={16}>
          <Text className="text-base text-gray-500">다시</Text>
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center">
        <View
          className="overflow-hidden rounded-3xl bg-slate-50"
          style={{
            width: BOARD_WIDTH,
            height: BOARD_HEIGHT,
            borderWidth: completed ? 3 : 0,
            borderColor: '#F05A28'
          }}
        >
          {PIECES.map((piece) => (
            <Slot key={piece.id} piece={piece} />
          ))}
          {PIECES.map((piece, index) => (
            <RepairmanPiece
              key={piece.id}
              piece={piece}
              index={index}
              placed={placed[piece.id]}
              onSnap={snap}
              onUnsnap={unsnap}
              onMiss={miss}
            />
          ))}
        </View>
      </View>

      <View className="items-center pb-5">
        <Text className="text-sm text-gray-500">
          놓은 조각 {placedCount}/{PIECES.length} · 시도 {snaps + misses}
        </Text>
        {completed ? (
          <Text className="mt-1 text-2xl font-bold text-orange-500">뿌우뿌우!</Text>
        ) : (
          <Text className="mt-1 text-sm text-gray-400">조각을 설계도 위로 옮겨 보자</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

function Slot({ piece }: { piece: Piece }) {
  const radius = piece.shape === 'circle' ? piece.width / 2 : 8;

  return (
    <View
      style={{
        position: 'absolute',
        left: piece.slotX,
        top: piece.slotY,
        width: piece.width,
        height: piece.height,
        borderRadius: radius,
        backgroundColor: '#CBD5E1'
      }}
    />
  );
}
