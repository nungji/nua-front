import { GameCharacter } from '@/components/GameCharacter';
import { CompletedModel } from './CompletedModel';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';

import { GamePiece } from '@/components/GamePiece';
import { StageBackdrop } from '@/components/StageBackdrop';
import { TopBar } from '@/components/TopBar';
import { PieceGraphic } from '@/components/PieceGraphic';
import { pickPiece } from '@/games/repairman/game/hit';
import {
  createWorld,
  grabBody,
  holdBody,
  placeBody,
  releaseBody,
  setBodyAngle,
  setBodyFlipped,
  stepWorld,
  visualCenter
} from '@/games/repairman/game/physics';
import { piecePolygon } from '@/games/repairman/game/shapes';
import { buildPuzzle, findStage, PIECE_PAD, puzzleScale, SNAP_RADIUS, tiltFor } from '@/games/repairman/game/stages';
import { Piece } from '@/games/repairman/game/types';
import { useRepairmanStore } from '@/store/useRepairmanStore';
import { stageScale } from '@/stage';
import { COLORS, FONT, SHADOW, TOP_BAR_HEIGHT } from '@/theme';

import { ReefCorners } from './OceanDecor';

const FIXED_STEP = 16.666;
const FLIP_HOLD = 200;

type PlayScreenProps = {
  stageId: number;
  onExit: () => void;
};

export function PlayScreen(props: PlayScreenProps) {
  const [round, setRound] = useState(0);
  return <PlayRound key={`${props.stageId}-${round}`} {...props} onRestart={() => setRound(value => value + 1)} />;
}

function PlayRound({ stageId, onExit, onRestart }: PlayScreenProps & { onRestart: () => void }) {
  const stage = useMemo(() => findStage(stageId), [stageId]);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const scale = stageScale(windowWidth, windowHeight);
  const size = useMemo(() => {
    const width = Math.round(Math.max(320, windowWidth - 32 * scale));
    const height = Math.round(Math.max(220, windowHeight - (TOP_BAR_HEIGHT + 104) * scale));
    return { width, height };
  }, [windowWidth, windowHeight, scale]);


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
  const snapRadius = SNAP_RADIUS * puzzleScale(size);
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
    const world = createWorld(pieces, size, flippedRef.current, puzzle.pedestal);
    worldRef.current = world;
    const frozen = new Set<string>();
    let frame = 0;
    let last = Date.now();
    let accumulator = 0;
    let lastActive = -1;

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

      if (active !== lastActive) {
        if (active >= 0 && active < pieces.length && !placedRef.current[pieces[active].id]) {
          grabBody(world, pieces[active].id);
        }

        lastActive = active;
      }

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
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      worldRef.current = null;
    };
  }, [pieces, size, puzzle.pedestal, hits, activeIndex, touchX, touchY, grabDX, grabDY]);

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
      const orientation = (turns[piece.id] ?? 0) % 4;
      const aligned = piece.symmetry[orientation * 2 + (flipped[piece.id] ? 1 : 0)] ?? false;
      const blocked = Boolean(piece.requires && !placed[piece.requires]);

      if (distance <= snapRadius && aligned && !blocked) {
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

      if (stage.rotate) {
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

      if (stage.flip) {
        flip(piece.id);
      }
    },
    [flip, placed, pieces, stage.flip]
  );

  const pan = Gesture.Pan()
    .minDistance(8)
    .onStart((event) => {
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
    .maxDuration(190)
    .onEnd((event, success) => {
      if (!success) return;
      const index = pickPiece(hits.value, shapes, sizes, event.x, event.y);

      if (index >= 0) {
        runOnJS(handleTapIndex)(index);
      }
    });

  const gesture = stage.flip ? Gesture.Exclusive(pan, longPress, tap) : Gesture.Exclusive(pan, tap);

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.oceanDeep }}>
      <StageBackdrop dim={0.06} />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <TopBar
          title={`${stage.id}. ${puzzle.stageName}`}
          onBack={onExit}
          right={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 * scale }}>
            <GameCharacter game="repairman" width={72 * scale} height={72 * scale} />
            <Pressable onPress={() => { reset(); onRestart(); }} hitSlop={8} accessibilityRole="button" accessibilityLabel="다시" style={styles.resetButton}>
              <Text style={styles.resetText}>다시</Text>
            </Pressable>
            </View>
          }
        />

      <View className="flex-1 items-center justify-center" style={{ flexDirection: 'row', gap: 16 * scale, paddingHorizontal: 16 * scale }}>
        <GestureDetector gesture={gesture}>
          <View
            testID="repairman-workbench"
            className="overflow-hidden rounded-3xl"
            style={{
              width: size.width,
              height: size.height,
              borderWidth: completed ? 4 : 0,
              borderColor: '#FFE093',
              backgroundColor: '#DDF8FA',
              boxShadow: '0 6px 0 #238DAA, 0 0 0 4px #FFFFFFB3'
            }}
          >
            <ReefCorners />
            <View testID="repairman-model" pointerEvents="none" style={{ position: 'absolute', left: 12, top: 12, width: size.width * .47, height: size.height * .6, alignItems: 'center', zIndex: 1 }}>
              <Text style={{ fontFamily: FONT, color: '#23748F', fontSize: Math.max(13, 20 * scale) }}>이렇게 만들어요</Text>
              <CompletedModel pieces={pieces} width={size.width * .44} height={size.height * .48} />
            </View>
            <View pointerEvents="none" style={{ position: 'absolute', left: 10, top: 10, width: size.width * .48 - 10, bottom: 12, borderRadius: 20, backgroundColor: '#FFF4D8' }}>
              <Text style={{ fontFamily: FONT, color: '#A77A50', textAlign: 'center', marginTop: size.height * .64, fontSize: 18 * scale }}>조각을 골라요</Text>
            </View>
            {/* assembly pad — the silhouette target sits on top of the workbench */}
            <View
              pointerEvents="none"
              style={[styles.zone, { left: size.width * 0.5 + 6, right: 10, top: 10, bottom: 12, backgroundColor: 'rgba(179, 231, 236, 0.65)' }]}
            />

            {puzzle.slots
              ? pieces.map((piece) => (
                  <Ghost key={piece.id} piece={piece} fill={piece.color} opacity={0.16} />
                ))
              : null}

            {puzzle.slots
              ? pieces.map((piece) => <Slot key={piece.id} piece={piece} />)
              : (
                <Svg width={size.width} height={size.height} style={{ position: 'absolute' }}>
                  <Path
                    d={puzzle.silhouette}
                    fill="none"
                    stroke="#59A6B6"
                    strokeWidth={2}
                    strokeDasharray="7 6"
                  />
                </Svg>
              )}

            {!puzzle.slots
              ? pieces.map((piece) =>
                  piece.needsHint ? (
                    <Hint key={'hint' + piece.id} piece={piece} />
                  ) : null
                )
              : null}

            <View
              style={{
                position: 'absolute',
                left: puzzle.pedestal.x,
                top: puzzle.pedestal.y,
                width: puzzle.pedestal.width,
                height: puzzle.pedestal.height,
                backgroundColor: '#F6D39C'
              }}
              className="rounded-md"
            />

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
        <Text style={{ color: '#175E80', fontFamily: FONT, fontSize: Math.max(12, 16 * scale) }}>
          놓은 조각 {placedCount}/{pieces.length} · 시도 {snaps + misses}
        </Text>
        {completed ? (
          <Text className="mt-1" style={{ color: '#FFE18A', fontFamily: FONT, fontSize: Math.max(20, 30 * scale) }}>완성!</Text>
        ) : (
          <Text className="mt-1" style={{ color: '#246D87', fontFamily: FONT, fontSize: Math.max(12, 16 * scale) }}>
            {stage.rotate && stage.flip
              ? '탭=돌리기 · 200ms 누르면 뒤집기'
              : stage.rotate
                ? '탭해서 돌려 보세요'
                : stage.flip
                  ? '200ms 누르면 뒤집혀요'
                  : '모양을 보고 맞춰 보세요'}
          </Text>
        )}
      </View>
      </SafeAreaView>
    </View>
  );
}

function Hint({ piece }: { piece: Piece }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: piece.slot.x - PIECE_PAD,
        top: piece.slot.y - PIECE_PAD
      }}
    >
      <PieceGraphic
        piece={piece}
        edges={piece.edges}
        fill="none"
        stroke="#FB923C"
        strokeWidth={1.5}
      />
    </View>
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
      <PieceGraphic piece={piece} edges={piece.edges} fill="none" stroke="#59A6B6" strokeWidth={2} />
    </View>
  );
}

const styles = {
  zone: {
    position: 'absolute' as const,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.85)'
  },
  resetButton: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 22,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: COLORS.white,
    borderWidth: 4,
    borderColor: '#7FE6E4',
    ...SHADOW.button
  },
  resetText: {
    fontFamily: FONT,
    fontSize: 18,
    color: '#168AA7'
  }
};
