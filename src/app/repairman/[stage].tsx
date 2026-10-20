import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';

import { GamePiece } from '@/components/GamePiece';
import { PieceGraphic } from '@/components/PieceGraphic';
import { pickPiece } from '@/game/hit';
import { createWorld, holdBody, placeBody, releaseBody, stepWorld } from '@/game/physics';
import { piecePolygon } from '@/game/shapes';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  buildPuzzle,
  edgesFor,
  PIECE_PAD,
  SNAP_RADIUS,
  STAGES
} from '@/game/stages';
import { Difficulty, Piece, PieceEdges } from '@/game/types';
import { useRepairmanStore } from '@/store/useRepairmanStore';

const FIXED_STEP = 16.666;
const FLIP_DELAY = 450;

const LEVELS: { key: Difficulty; label: string; hint: string }[] = [
  { key: 'easy', label: '하', hint: '연결부 모양을 보고 맞춰 보자' },
  { key: 'medium', label: '중', hint: '실루엣만 보고 맞춰 보자' },
  { key: 'hard', label: '상', hint: '탭=돌리기 · 길게=뒤집기' }
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

  const worldRef = useRef<ReturnType<typeof createWorld> | null>(null);
  const placedRef = useRef(placed);
  const flipTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const hits = useSharedValue<number[]>([]);
  const activeIndex = useSharedValue(-1);
  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);
  const grabDX = useSharedValue(0);
  const grabDY = useSharedValue(0);
  const heldIndex = useSharedValue(-1);

  placedRef.current = placed;

  const shapes = useMemo(
    () =>
      pieces.map((piece) => {
        const flat: number[] = [];

        for (const point of piecePolygon(piece)) {
          flat.push(point.x, point.y);
        }

        return flat;
      }),
    [pieces]
  );

  const sizes = useMemo(() => pieces.map((piece) => [piece.width, piece.height]), [pieces]);
  const placedFlags = useMemo(() => pieces.map((piece) => Boolean(placed[piece.id])), [pieces, placed]);

  useEffect(() => {
    const next: number[] = [];

    for (const piece of pieces) {
      next.push(
        piece.start.x + piece.width / 2,
        piece.start.y + piece.height / 2,
        (turns[piece.id] ?? 0) * 90,
        flipped[piece.id] ? -1 : 1
      );
    }

    hits.value = next;
  }, [pieces, hits]);

  useEffect(() => {
    const next = hits.value.slice();

    pieces.forEach((piece, index) => {
      next[index * 4 + 2] = (turns[piece.id] ?? 0) * 90;
      next[index * 4 + 3] = flipped[piece.id] ? -1 : 1;
    });

    hits.value = next;
  }, [turns, flipped, pieces, hits]);

  useEffect(() => {
    const world = createWorld(pieces, { width: BOARD_WIDTH, height: BOARD_HEIGHT });
    worldRef.current = world;
    const frozen = new Set<string>();
    let frame = 0;
    let last = Date.now();
    let accumulator = 0;

    const loop = () => {
      const now = Date.now();
      accumulator += Math.min(50, Math.max(0, now - last));
      last = now;

      for (const piece of pieces) {
        const isPlaced = placedRef.current[piece.id] ?? false;
        const centerX = piece.slot.x + piece.width / 2;
        const centerY = piece.slot.y + piece.height / 2;

        if (isPlaced && !frozen.has(piece.id)) {
          placeBody(world, piece.id, centerX, centerY);
          frozen.add(piece.id);
        } else if (!isPlaced && frozen.has(piece.id)) {
          releaseBody(world, piece.id, centerX, centerY);
          frozen.delete(piece.id);
        }
      }

      const active = activeIndex.value;

      if (active >= 0 && active < pieces.length && !placedRef.current[pieces[active].id]) {
        holdBody(world, pieces[active].id, touchX.value - grabDX.value, touchY.value - grabDY.value);
      }

      let steps = 0;

      while (accumulator >= FIXED_STEP && steps < 3) {
        stepWorld(world, FIXED_STEP);
        accumulator -= FIXED_STEP;
        steps += 1;
      }

      const awake =
        active >= 0 || pieces.some((piece) => !world.bodies[piece.id].isSleeping);

      if (awake) {
        const next = hits.value.slice();

        pieces.forEach((piece, index) => {
          if (placedRef.current[piece.id]) {
            next[index * 4] = piece.slot.x + piece.width / 2;
            next[index * 4 + 1] = piece.slot.y + piece.height / 2;
            return;
          }

          const body = world.bodies[piece.id];
          next[index * 4] = body.position.x;
          next[index * 4 + 1] = body.position.y;
        });

        hits.value = next;
      }

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      worldRef.current = null;
    };
  }, [pieces, hits, activeIndex, touchX, touchY, grabDX, grabDY]);

  useEffect(() => {
    const timers = flipTimers.current;

    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  const finishDrag = useCallback(
    (index: number, centerX: number, centerY: number) => {
      const piece = pieces[index];

      if (!piece) {
        return;
      }

      const world = worldRef.current;
      const targetX = piece.slot.x + piece.width / 2;
      const targetY = piece.slot.y + piece.height / 2;
      const distance = Math.hypot(centerX - targetX, centerY - targetY);
      const rotatable = difficulty === 'hard' && piece.shape !== 'circle';
      const aligned = !rotatable || ((turns[piece.id] ?? 0) % 4 === 0 && !flipped[piece.id]);
      const blocked = Boolean(piece.requires && !placed[piece.requires]);

      if (distance <= SNAP_RADIUS && aligned && !blocked) {
        snap(piece.id);
        return;
      }

      if (world) {
        releaseBody(world, piece.id, centerX, centerY);
      }

      miss();
    },
    [difficulty, flipped, miss, pieces, placed, snap, turns]
  );

  const handleTapIndex = useCallback(
    (index: number) => {
      const piece = pieces[index];

      if (!piece) {
        return;
      }

      if (placed[piece.id]) {
        unsnap(piece.id);
        return;
      }

      if (difficulty === 'hard' && piece.shape !== 'circle') {
        clearTimeout(flipTimers.current[piece.id]);
        rotate(piece.id);
      }
    },
    [difficulty, placed, pieces, rotate, unsnap]
  );

  const handleLongPressIndex = useCallback(
    (index: number) => {
      const piece = pieces[index];

      if (!piece || placed[piece.id] || difficulty !== 'hard' || piece.shape === 'circle') {
        return;
      }

      clearTimeout(flipTimers.current[piece.id]);
      flipTimers.current[piece.id] = setTimeout(() => {
        flip(piece.id);
      }, FLIP_DELAY);
    },
    [difficulty, flip, placed, pieces]
  );

  const pan = Gesture.Pan()
    .onBegin((event) => {
      const values = hits.value;
      const index = pickPiece(values, shapes, sizes, event.x, event.y);

      if (index < 0 || placedFlags[index]) {
        activeIndex.value = -1;
        return;
      }

      activeIndex.value = index;
      grabDX.value = event.x - values[index * 4];
      grabDY.value = event.y - values[index * 4 + 1];
      touchX.value = event.x;
      touchY.value = event.y;
    })
    .onUpdate((event) => {
      if (activeIndex.value < 0) {
        return;
      }

      touchX.value = event.x;
      touchY.value = event.y;
    })
    .onEnd(() => {
      const index = activeIndex.value;

      if (index < 0) {
        return;
      }

      const centerX = touchX.value - grabDX.value;
      const centerY = touchY.value - grabDY.value;

      activeIndex.value = -1;
      runOnJS(finishDrag)(index, centerX, centerY);
    })
    .onFinalize(() => {
      if (activeIndex.value >= 0) {
        activeIndex.value = -1;
      }
    });

  const longPress = Gesture.LongPress()
    .minDuration(380)
    .onStart((event) => {
      heldIndex.value = pickPiece(hits.value, shapes, sizes, event.x, event.y);
    })
    .onFinalize(() => {
      const index = heldIndex.value;

      heldIndex.value = -1;

      if (index >= 0) {
        runOnJS(handleLongPressIndex)(index);
      }
    });

  const tap = Gesture.Tap()
    .maxDuration(320)
    .onEnd((event) => {
      const index = pickPiece(hits.value, shapes, sizes, event.x, event.y);

      if (index >= 0) {
        runOnJS(handleTapIndex)(index);
      }
    });

  const gesture = Gesture.Exclusive(pan, longPress, tap);

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
        <GestureDetector gesture={gesture}>
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
                turns={turns[piece.id] ?? 0}
                flipped={flipped[piece.id] ?? false}
                hits={hits}
                activeIndex={activeIndex}
                touchX={touchX}
                touchY={touchY}
                grabDX={grabDX}
                grabDY={grabDY}
              />
            ))}
          </View>
        </GestureDetector>
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
