import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConnectorGlyph } from '@/components/ConnectorGlyph';
import { RepairmanPiece } from '@/components/RepairmanPiece';
import {
  ASSEMBLED_BOX,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  Difficulty,
  PIECES,
  Piece,
  PieceId
} from '@/repairmanPuzzle';
import { useRepairmanStore } from '@/store/useRepairmanStore';

const LEVELS: { key: Difficulty; label: string; hint: string }[] = [
  { key: 'easy', label: '하', hint: '연결부 모양을 보고 맞춰 보자' },
  { key: 'medium', label: '중', hint: '평평한 조각은 실루엣을 보고 맞춰 보자' },
  { key: 'hard', label: '상', hint: '탭=돌리기 · 길게=뒤집기' }
];

export default function RepairmanScreen() {
  const difficulty = useRepairmanStore((state) => state.difficulty);
  const placed = useRepairmanStore((state) => state.placed);
  const turns = useRepairmanStore((state) => state.turns);
  const flipped = useRepairmanStore((state) => state.flipped);
  const snaps = useRepairmanStore((state) => state.snaps);
  const misses = useRepairmanStore((state) => state.misses);
  const setDifficulty = useRepairmanStore((state) => state.setDifficulty);
  const snap = useRepairmanStore((state) => state.snap);
  const unsnap = useRepairmanStore((state) => state.unsnap);
  const rotate = useRepairmanStore((state) => state.rotate);
  const flip = useRepairmanStore((state) => state.flip);
  const miss = useRepairmanStore((state) => state.miss);
  const reset = useRepairmanStore((state) => state.reset);

  const placedCount = PIECES.filter((piece) => placed[piece.id]).length;
  const completed = placedCount === PIECES.length;
  const level = LEVELS.find((item) => item.key === difficulty) ?? LEVELS[0];

  const handleTap = (id: PieceId) => {
    if (placed[id]) {
      unsnap(id);
      return;
    }

    if (difficulty === 'hard') {
      rotate(id);
    }
  };

  const handleLongPress = (id: PieceId) => {
    if (difficulty === 'hard' && !placed[id]) {
      flip(id);
    }
  };

  const hasConnector = (piece: Piece) =>
    difficulty === 'easy' || (difficulty === 'medium' && piece.id === 'body');

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

      <View className="flex-row gap-2 px-5 pt-3">
        {LEVELS.map((item) => {
          const active = item.key === difficulty;

          return (
            <Pressable
              key={item.key}
              onPress={() => setDifficulty(item.key)}
              className={
                active
                  ? 'flex-1 items-center rounded-xl bg-orange-500 py-2'
                  : 'flex-1 items-center rounded-xl bg-slate-100 py-2'
              }
            >
              <Text
                className={
                  active ? 'text-sm font-bold text-white' : 'text-sm font-medium text-slate-500'
                }
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
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
          {difficulty === 'easy'
            ? PIECES.map((piece) => <Ghost key={piece.id} piece={piece} />)
            : null}

          {difficulty === 'hard' ? (
            <View
              style={{
                position: 'absolute',
                left: ASSEMBLED_BOX.x,
                top: ASSEMBLED_BOX.y,
                width: ASSEMBLED_BOX.width,
                height: ASSEMBLED_BOX.height,
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: '#94A3B8',
                borderRadius: 12
              }}
            />
          ) : (
            PIECES.map((piece) => (
              <Slot key={piece.id} piece={piece} connectorVisible={hasConnector(piece)} />
            ))
          )}

          {PIECES.map((piece, index) => (
            <RepairmanPiece
              key={piece.id}
              piece={piece}
              index={index}
              placed={placed[piece.id]}
              turns={turns[piece.id]}
              flipped={flipped[piece.id]}
              rotated={difficulty === 'hard'}
              showConnector={hasConnector(piece)}
              showDetail={difficulty === 'hard'}
              onSnap={snap}
              onMiss={miss}
              onTap={handleTap}
              onLongPress={handleLongPress}
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
          <Text className="mt-1 text-sm text-gray-400">{level.hint}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

function Ghost({ piece }: { piece: Piece }) {
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
        backgroundColor: piece.color,
        opacity: 0.16
      }}
    />
  );
}

function Slot({ piece, connectorVisible }: { piece: Piece; connectorVisible: boolean }) {
  const radius = piece.shape === 'circle' ? piece.width / 2 : 8;

  return (
    <View
      style={{
        position: 'absolute',
        left: piece.slotX,
        top: piece.slotY,
        width: piece.width,
        height: piece.height
      }}
    >
      <View
        style={{
          flex: 1,
          borderRadius: radius,
          borderWidth: 2,
          borderColor: '#94A3B8'
        }}
      />
      {connectorVisible ? (
        <View
          style={{
            position: 'absolute',
            left: piece.width / 2 - 6,
            top: piece.height - 6
          }}
        >
          <ConnectorGlyph kind={piece.connector} filled={false} />
        </View>
      ) : null}
    </View>
  );
}
