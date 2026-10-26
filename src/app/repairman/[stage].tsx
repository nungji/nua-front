import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';

import { GamePiece } from '@/components/GamePiece';
import { PieceGraphic } from '@/components/PieceGraphic';
import { pickPiece } from '@/game/hit';
import {
  createWorld,
  holdBody,
  placeBody,
  releaseBody,
  setBodyAngle,
  setBodyFlipped,
  stepWorld,
  visualCenter
} from '@/game/physics';
import { piecePolygon } from '@/game/shapes';
import { buildPuzzle, findStage, PIECE_PAD, SNAP_RADIUS, tiltFor } from '@/game/stages';
import { Piece } from '@/game/types';
import { useRepairmanStore } from '@/store/useRepairmanStore';

const FIXED_STEP = 16.666;
const FLIP_HOLD = 600;

export default function RepairmanStage() {
  const params = useLocalSearchParams<{ stage?: string }>();
  const stageId = Number(params.stage ?? 1) || 1;
  const stage = useMemo(() => findStage(stageId), [stageId]);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const size = useMemo(() => {
    const width = Math.min(windowWidth - 24, 440);
    const height = Math.max(440, Math.min(windowHeight - 210, width * 1.65));

    return { width, height };
  }, [windowWidth, windowHeight]);

  const storedStage = useRepairmanStore((state) => state.stageId);
  const placed = useRepairmanStore((state) => state.placed);
  const turns = useRepairmanStore((state) => state.turns);
  const flipped = useRepairmanStore((state) => state.flipped);
  const snaps = useRepairmanStore((state) => state.snaps);
  const misses = useRepairmanStore((state) => state.misses);
  const openStage = useRepairmanStore((state) => state.openStage);
  const snap = useRepairmanStore((state) => state.snap);
  const unsnap = useRepairmanStore((state) => state.unsnap);
  const rotate = useRepairmanStore((state) => state.rotate);
  const flip = useRepairmanStore((state) => state.flip);
  const miss = useRepairmanStore((state) => state.miss);
  const reset = useRepairmanStore((state) => state.reset);

  useEffect(() => {
    if (storedStage !== stageId) {
      openStage(stageId);
    }
  }, [stageId, storedStage, openStage]);

  const puzzle = useMemo(() => buildPuzzle(stage, size), [stage, size]);
  const pieces = puzzle.pieces;
  const placedCount = pieces.filter((piece) => placed[piece.id]).length;
  const completed = placedCount === pieces.length;

  const worldRef = useRef<ReturnType<typeof createWorld> | null>(null);
  const placedRef = useRef(placed);
  const turnsRef = useRef(turns);
  const flippedRef = useRef(flipped);

  placedRef.current = placed;
  turnsRef.current = turns;
  flippedRef.current = flipped;

  const hits = useSharedValue<number[]>([]);
  const activeIndex = useSharedValue(-1);
  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);
  const grabDX = useSharedValue(0);
  const grabDY = useSharedValue(0);

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
  const placedFlags = useMemo(
    () => pieces.map((piece) => Boolean(placed[piece.id])),
    [pieces, placed]
  );

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
    const world = createWorld(pieces, size, flippedRef.current);
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

      pieces.forEach((piece, index) => {
        const entry = world.entries[piece.id];
        const targetFlip = Boolean(flippedRef.current[piece.id]);

        if (entry.flipped !== targetFlip) {
          setBodyFlipped(world, piece, targetFlip);
        }

        const targetAngle =
          (turnsRef.current[piece.id] ?? 0) * 90 +
          (placedRef.current[piece.id] ? 0 : tiltFor(index));

        if (Math.abs(world.entries[piece.id].angle - targetAngle) > 0.01) {
          setBodyAngle(world, piece.id, targetAngle);
        }
      });

      const awake = active >= 0 || pieces.some((piece) => !world.entries[piece.id].body.isSleeping);

      if (awake) {
        const next = hits.value.slice();

        pieces.forEach((piece, index) => {
          if (placedRef.current[piece.id]) {
            next[index * 4] = piece.slot.x + piece.width / 2;
            next[index * 4 + 1] = piece.slot.y + piece.height / 2;
            return;
          }

          const center = visualCenter(world, piece.id);
          next[index * 4] = center.x;
          next[index * 4 + 1] = center.y;
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
  }, [pieces, size, hits, activeIndex, touchX, touchY, grabDX, grabDY]);

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
      const symmetric = piece.shape === 'circle';
      const needTurn = stage.rotate && !symmetric && (turns[piece.id] ?? 0) % 4 !== 0;
      const needFlip = stage.flip && !symmetric && Boolean(flipped[piece.id]);
      const blocked = Boolean(piece.requires && !placed[piece.requires]);

      if (distance <= SNAP_RADIUS && !needTurn && !needFlip && !blocked) {
        snap(piece.id);
        return;
      }

      if (world) {
        releaseBody(world, piece.id, centerX, centerY);
      }

      miss();
    },
    [flipped, miss, pieces, placed, snap, stage.flip, stage.rotate, turns]
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

      if (stage.rotate && piece.shape !== 'circle') {
        rotate(piece.id);
      }
    },
    [placed, pieces, rotate, stage.rotate, unsnap]
  );

  const handleHoldIndex = useCallback(
    (index: number) => {
      const piece = pieces[index];

      if (!piece || placed[piece.id]) {
        return;
      }

      if (stage.flip && piece.shape !== 'circle') {
        flip(piece.id);
      }
    },
    [flip, placed, pieces, stage.flip]
  );

  const pan = Gesture.Pan()
    .onBegin((event) => {
      const values = hits.value;
      const index = pickPiece(values, shapes, sizes, event.x, event.y);

      if (index < 0 || placedFlags[index]) {
        activeIndex.value = -1;
        return;
      }

      const halfWidth = sizes[index][0] / 2;
      const halfHeight = sizes[index][1] / 2;
      const startX = Math.min(size.width - halfWidth - 2, Math.max(halfWidth + 2, event.x));
      const startY = Math.min(size.height - halfHeight - 2, Math.max(halfHeight + 2, event.y));

      activeIndex.value = index;
      grabDX.value = startX - values[index * 4];
      grabDY.value = startY - values[index * 4 + 1];
      touchX.value = startX;
      touchY.value = startY;
    })
    .onUpdate((event) => {
      const index = activeIndex.value;

      if (index < 0) {
        return;
      }

      const halfWidth = sizes[index][0] / 2;
      const halfHeight = sizes[index][1] / 2;

      touchX.value = Math.min(size.width - halfWidth - 2, Math.max(halfWidth + 2, event.x));
      touchY.value = Math.min(size.height - halfHeight - 2, Math.max(halfHeight + 2, event.y));
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
    .minDuration(FLIP_HOLD)
    .enabled(stage.flip)
    .onStart((event) => {
      const index = pickPiece(hits.value, shapes, sizes, event.x, event.y);

      if (index >= 0 && !placedFlags[index]) {
        runOnJS(handleHoldIndex)(index);
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
        <Text className="text-base font-semibold text-gray-900">
          {stage.id}. {puzzle.stageName}
        </Text>
        <Pressable onPress={reset} hitSlop={16}>
          <Text className="text-base text-gray-500">다시</Text>
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center">
        <GestureDetector gesture={gesture}>
          <View
            className="overflow-hidden rounded-3xl bg-slate-50"
            style={{
              width: size.width,
              height: size.height,
              borderWidth: completed ? 3 : 0,
              borderColor: '#F05A28'
            }}
          >
            {puzzle.slots
              ? pieces.map((piece) => (
                  <Ghost key={piece.id} piece={piece} fill={piece.color} opacity={0.16} />
                ))
              : null}

            {puzzle.slots ? (
              pieces.map((piece) => <Slot key={piece.id} piece={piece} />)
            ) : (
              <Svg width={size.width} height={size.height} style={{ position: 'absolute' }}>
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
          <Text className="mt-1 text-2xl font-bold text-orange-500">완성!</Text>
        ) : (
          <Text className="mt-1 text-sm text-gray-400">
            {stage.rotate && stage.flip
              ? '탭=돌리기 · 길게=뒤집기'
              : stage.rotate
                ? '탭=돌리기'
                : stage.flip
                  ? '길게=뒤집기'
                  : '모양을 보고 맞춰 보세요'}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

function Ghost({ piece, fill, opacity }: { piece: Piece; fill: string; opacity: number }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: piece.slot.x - PIECE_PAD,
        top: piece.slot.y - PIECE_PAD
      }}
    >
      <PieceGraphic piece={piece} edges={piece.edges} fill={fill} opacity={opacity} />
    </View>
  );
}

function Slot({ piece }: { piece: Piece }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: piece.slot.x - PIECE_PAD,
        top: piece.slot.y - PIECE_PAD
      }}
    >
      <PieceGraphic piece={piece} edges={piece.edges} fill="none" stroke="#94A3B8" strokeWidth={2} />
    </View>
  );
}
