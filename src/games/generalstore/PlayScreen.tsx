import { useEffect, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGeneralStore } from '@/store/useGeneralStore';

import { ComicPanel, CutDots, SceneCut } from './art/Comic';
import { FallingDrops, Sparkles, SteamWisps } from './art/Effects';
import { BackIcon, CheckIcon, CrossIcon, ForwardIcon } from './art/Icons';
import { Stall } from './art/Stall';
import { ACCENT, ACCENT_SOFT, BG, INK, LINE, MUTED, WATER } from './art/colors';
import { USE_BG } from './game/comics';
import { findStage, STAGES, stageComic } from './game/stages';
import type { ItemId } from './game/types';

/** How long the result cut waits before it commits the answer. */
const VERDICT_DELAY = 900;
/** How long a failed attempt stays on screen before the shop comes back. */
const FAIL_DELAY = 1600;

type Phase = 'comic' | 'shelf' | 'hand' | 'use' | 'result';

type PlayScreenProps = {
  stageId: number;
  onExit: () => void;
};

function Progress({ cleared, current }: { cleared: number[]; current: number }) {
  return (
    <View className="flex-row items-center" style={{ gap: 4 }}>
      {STAGES.map((stage) => {
        const done = cleared.includes(stage.id);

        return (
          <View
            key={stage.id}
            className="rounded-full"
            style={{
              width: done ? 14 : 9,
              height: 9,
              backgroundColor: done ? ACCENT : stage.id === current ? '#C08A5E' : LINE
            }}
          />
        );
      })}
    </View>
  );
}

export function PlayScreen({ stageId, onExit }: PlayScreenProps) {
  const stage = findStage(stageId);
  const cuts = stageComic(stage);
  const { width } = useWindowDimensions();
  const cleared = useGeneralStore((state) => state.cleared);
  const misses = useGeneralStore((state) => state.misses[stageId] ?? 0);
  const openStage = useGeneralStore((state) => state.openStage);
  const clearStage = useGeneralStore((state) => state.clearStage);
  const reject = useGeneralStore((state) => state.reject);

  const [phase, setPhase] = useState<Phase>('comic');
  const [cut, setCut] = useState(0);
  const [picked, setPicked] = useState<ItemId | null>(null);
  const [tried, setTried] = useState<ItemId[]>([]);
  const [outcome, setOutcome] = useState<'pending' | 'success' | 'fail'>('pending');
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    openStage(stageId);
  }, [stageId, openStage]);

  useEffect(() => {
    if (phase !== 'shelf' || hasEntered) {
      return;
    }

    const timer = setTimeout(() => setHasEntered(true), 900);
    return () => clearTimeout(timer);
  }, [phase, hasEntered]);

  useEffect(() => {
    if (phase !== 'result' || picked === null) {
      return;
    }

    const timer = setTimeout(() => {
      if (picked === stage.answer) {
        clearStage(stageId);
        setOutcome('success');
      } else {
        reject(stageId);
        setOutcome('fail');
      }
    }, VERDICT_DELAY);

    return () => clearTimeout(timer);
  }, [phase, picked, stage.answer, stageId, clearStage, reject]);

  useEffect(() => {
    if (outcome !== 'fail' || picked === null) {
      return;
    }

    const timer = setTimeout(() => {
      setTried((current) => [...current, picked]);
      setPicked(null);
      setOutcome('pending');
      setPhase('shelf');
    }, FAIL_DELAY);

    return () => clearTimeout(timer);
  }, [outcome, picked]);

  const hintItem = misses >= 2 ? stage.answer : null;
  const size = width - 40;

  function advance() {
    if (phase === 'comic') {
      if (cut + 2 <= cuts.length - 1) {
        setCut(cut + 2);
      } else {
        setPhase('shelf');
      }
      return;
    }

    if (phase === 'shelf') {
      return;
    }

    if (phase === 'hand') {
      setPhase('use');
      return;
    }

    if (phase === 'use') {
      setPhase('result');
    }
  }

  function pick(item: ItemId) {
    setPicked(item);
    setOutcome('pending');
    setPhase('hand');
  }

  const useCut = {
    bg: USE_BG[stage.problem],
    customer: stage.customer,
    mood: (outcome === 'success' ? 'happy' : 'sad') as 'happy' | 'sad',
    side: 'right' as const,
    problem: stage.problem,
    item: picked ?? undefined
  };

  function renderResultOverlay() {
    if (picked === null) {
      return null;
    }

    return (
      <>
        {outcome === 'fail' && stage.failEffect === 'leak' ? (
          <View style={{ position: 'absolute', left: size * 0.44, bottom: size * 0.16 }}>
            <FallingDrops color={WATER} travel={46} />
          </View>
        ) : null}

        {outcome === 'fail' && stage.failEffect === 'soak' ? (
          <View style={{ position: 'absolute', left: size * 0.44, top: size * 0.24 }}>
            <FallingDrops color="#7FB6D6" travel={42} />
          </View>
        ) : null}

        {outcome === 'fail' && stage.failEffect === 'steam' ? (
          <View style={{ position: 'absolute', left: size * 0.46, top: size * 0.18 }}>
            <SteamWisps />
          </View>
        ) : null}

        {outcome === 'success' ? (
          <View style={{ position: 'absolute', left: size * 0.4, top: size * 0.14 }}>
            <Sparkles />
          </View>
        ) : null}

        {outcome === 'pending' ? null : (
          <Animated.View entering={ZoomIn.duration(200)} style={{ position: 'absolute', right: 14, top: 14 }}>
            <View
              className="h-11 w-11 items-center justify-center rounded-full"
              style={{ backgroundColor: outcome === 'success' ? '#4FAE80' : '#D9695E' }}
            >
              {outcome === 'success' ? <CheckIcon size={20} /> : <CrossIcon size={18} />}
            </View>
          </Animated.View>
        )}
      </>
    );
  }

  function renderFooter() {
    if (phase === 'comic') {
      return (
        <View className="flex-row items-center justify-between px-5 pb-5 pt-2">
          <View style={{ width: 52 }} />
          <CutDots count={cuts.length} index={cut} color={ACCENT} />
          <Pressable
            onPress={advance}
            accessibilityRole="button"
            accessibilityLabel="다음 컷"
            className="h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: ACCENT }}
          >
            <ForwardIcon size={22} />
          </Pressable>
        </View>
      );
    }

    if (phase === 'shelf') {
      return (
        <View className="items-center pb-5 pt-2">
          <Text className="text-sm" style={{ color: MUTED }}>
            손님에게 줄 물건을 골라 주세요
          </Text>
        </View>
      );
    }

    if (phase === 'hand' || phase === 'use') {
      const step = phase === 'hand' ? 0 : 1;

      return (
        <View className="flex-row items-center justify-between px-5 pb-5 pt-2">
          <View style={{ width: 52 }} />
          <CutDots count={3} index={step} color={ACCENT} />
          <Pressable
            onPress={advance}
            accessibilityRole="button"
            accessibilityLabel="다음 컷"
            className="h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: ACCENT }}
          >
            <ForwardIcon size={22} />
          </Pressable>
        </View>
      );
    }

    if (outcome === 'success') {
      return (
        <View className="items-center pb-5 pt-2">
          <Pressable
            onPress={onExit}
            accessibilityRole="button"
            accessibilityLabel="가게로"
            className="flex-row items-center justify-center rounded-full px-7 py-3"
            style={{ backgroundColor: ACCENT, gap: 8 }}
          >
            <Text className="text-lg font-bold text-white">가게로</Text>
            <ForwardIcon size={18} />
          </Pressable>
        </View>
      );
    }

    return (
      <View className="flex-row items-center justify-between px-5 pb-5 pt-2">
        <View style={{ width: 52 }} />
        <CutDots count={3} index={2} color={ACCENT} />
        <View style={{ width: 52 }} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: BG }}>
      <View className="flex-row items-center justify-between px-5 pb-2 pt-3">
        <Pressable onPress={onExit} hitSlop={16} accessibilityRole="button" accessibilityLabel="나가기">
          <BackIcon />
        </Pressable>
        <Text className="text-xl font-bold" style={{ color: INK }}>
          {stage.name} 손님
        </Text>
        <Progress cleared={cleared} current={stageId} />
      </View>

      <View className="mx-4 flex-1 justify-center">
        {phase === 'comic'
          ? cuts.slice(cut - (cut % 2), cut - (cut % 2) + 2).map((item, index) => (
              <View key={`cut-${cut}-${index}`} style={{ marginBottom: 10 }}>
                <ComicPanel cut={item} size={size} />
              </View>
            ))
          : null}

        {phase === 'shelf' || phase === 'hand' ? (
          <View
            className="flex-1 overflow-hidden rounded-[26px] border-[3px]"
            style={{ borderColor: LINE, backgroundColor: outcome === 'success' ? ACCENT_SOFT : undefined }}
          >
            <Stall
              width={size}
              customer={stage.customer}
              customerMood="sad"
              items={stage.shelf}
              tried={tried}
              hintItem={hintItem}
              onPick={phase === 'shelf' ? pick : undefined}
              handover={phase === 'hand' ? picked : null}
              entering={phase === 'shelf' && !hasEntered}
            />
          </View>
        ) : null}

        {phase === 'use' || phase === 'result' ? (
          <SceneCut
            cut={useCut}
            size={size}
            fixed={outcome === 'success'}
            overlay={phase === 'result' ? renderResultOverlay() : null}
          />
        ) : null}
      </View>

      {renderFooter()}
    </SafeAreaView>
  );
}
