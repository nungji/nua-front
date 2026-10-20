import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';

import { GamePiece } from '@/components/GamePiece';
import { PieceGraphic } from '@/components/PieceGraphic';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  buildPuzzle,
  edgesFor,
  PIECE_PAD,
  STAGES
} from '@/game/stages';
import { Difficulty, Piece, PieceEdges } from '@/game/types';
import { useRepairmanStore } from '@/store/useRepairmanStore';

const LEVELS: { key: Difficulty; label: string; hint: string }[] = [
  { key: 'easy', label: '하', hint: '연결부 모양을 보고 맞춰 보자' },
  { key: 'medium', label: '중', hint: '실루엣만 보고 맞춰 보자' },
  { key: 'hard', label: '상', hint: '탭=뒤집기 · 길게=돌리기' }
];

export default function RepairmanGame() {
  const params = useLocalSearchParams<{ stage?: string }>();
  const stageParam = typeof params.stage === 'string' ? params.stage : STAGES[0].id;

  const stageId = useRepairmanStore((state) => state.stageId);
  const difficulty = useRepairmanStore((state) => state.difficulty);
  const placed = useRepairmanStore((state) => state.placed);
  const turns = useRepairmanStore((state) => state.turns);
  const flipped = useRepairmanStore((state) => state.flipped);
  const snaps = useRepairmanStore((state) => state.snaps);
  const misses = useRepairmanStore((state) => state.misses);
  const openStage = useRepairmanStore((state) => state.openStage);
  const setDifficulty = useRepairmanStore((state) => state.setDifficulty);
  const snap = useRepairmanStore((state) => state.snap);
  const unsnap = useRepairmanStore((state) => state.unsnap);
  const rotate = useRepairmanStore((state) => state.rotate);
  const flip = useRepairmanStore((state) => state.flip);
  const miss = useRepairmanStore((state) => state.miss);
  const reset = useRepairmanStore((state) => state.reset);

  useEffect(() => {
    if (stageId !== stageParam) {
      openStage(stageParam);
    }
  }, [stageParam, stageId, openStage]);

  const puzzle = useMemo(() => buildPuzzle(stageId, difficulty), [stageId, difficulty]);
  const pieces = puzzle.pieces;
  const placedCount = pieces.filter((piece) => placed[piece.id]).length;
  const completed = placedCount === pieces.length;
  const level = LEVELS.find((item) => item.key === difficulty) ?? LEVELS[0];

  const handleTap = (id: string) => {
    if (placed[id]) {
      unsnap(id);
      return;
    }

    if (difficulty === 'hard') {
      flip(id);
    }
  };

  const handleLongPress = (id: string) => {
    if (difficulty === 'hard' && !placed[id]) {
      rotate(id);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-2">
        <Pressable onPress={() => router.back()} hitSlop={16}>
          <Text className="text-base text-gray-500">나가기</Text>
        </Pressable>
        <Text className="text-base font-semibold text-gray-900">{puzzle.stageName}</Text>
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
            ? pieces.map((piece) => (
                <Ghost key={piece.id} piece={piece} edges={edgesFor(piece, difficulty)} />
              ))
            : null}

          {difficulty === 'easy' ? (
            pieces.map((piece) => (
              <Slot key={piece.id} piece={piece} edges={edgesFor(piece, difficulty)} />
            ))
          ) : (
            <Svg width={BOARD_WIDTH} height={BOARD_HEIGHT} style={{ position: 'absolute' }}>
              <Path
                d={puzzle.silhouette}
                fill="none"
                stroke="#94A3B8"
                strokeWidth={2}
                strokeDasharray="7 6"
              />
            </Svg>
          )}

          {pieces.map((piece, index) => (
            <GamePiece
              key={piece.id}
              piece={piece}
              edges={edgesFor(piece, difficulty)}
              index={index}
              placed={placed[piece.id] ?? false}
              blocked={Boolean(piece.requires && !placed[piece.requires])}
              turns={turns[piece.id] ?? 0}
              flipped={flipped[piece.id] ?? false}
              rotatable={difficulty === 'hard'}
              onAttempt={snap}
              onMiss={miss}
              onTap={handleTap}
              onLongPress={handleLongPress}
            />
          ))}
        </View>
      </View>

      <View className="items-center pb-5">
        <Text className="text-sm text-gray-500">
          놓은 조각 {placedCount}/{pieces.length} · 시도 {snaps + misses}
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

function Ghost({ piece, edges }: { piece: Piece; edges: PieceEdges }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: piece.slot.x - PIECE_PAD,
        top: piece.slot.y - PIECE_PAD
      }}
    >
      <PieceGraphic piece={piece} edges={edges} fill={piece.color} opacity={0.16} />
    </View>
  );
}

function Slot({ piece, edges }: { piece: Piece; edges: PieceEdges }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: piece.slot.x - PIECE_PAD,
        top: piece.slot.y - PIECE_PAD
      }}
    >
      <PieceGraphic piece={piece} edges={edges} fill="none" stroke="#94A3B8" strokeWidth={2} />
    </View>
  );
}
