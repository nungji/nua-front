import { useEffect, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGeneralStore } from '@/store/useGeneralStore';

import { ComicPanel, CutDots, SceneCut } from './art/Comic';
import { FallingDrops, Sparkles, SteamWisps } from './art/Effects';
import { BackIcon, CheckIcon, CrossIcon, ForwardIcon } from './art/Icons';
import { Mart } from './art/Mart';
import { ACCENT, ACCENT_SOFT, BG, INK, LINE, MUTED, WATER } from './art/colors';
import { useComic } from './game/comics';
import { findStage, STAGES, stageComic } from './game/stages';
import type { ItemId } from './game/types';

/** How long the result cut waits before it commits the answer. */
const VERDICT_DELAY = 900;
/** How long a failed attempt stays on screen before the shop comes back. */
const FAIL_DELAY = 1600;
const GAP = 12;

type Phase = 'comic' | 'shelf' | 'use' | 'result';

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
  const { width, height } = useWindowDimensions();
  const landscape = width > height;

  const cleared = useGeneralStore((state) => state.cleared);
  const misses = useGeneralStore((state) => state.misses[stageId] ?? 0);
  const openStage = useGeneralStore((state) => state.openStage);
  const clearStage = useGeneralStore((state) => state.clearStage);
  const reject = useGeneralStore((state) => state.reject);

  const [phase, setPhase] = useState<Phase>('comic');
  const [cut, setCut] = useState(0);
  const [step, setStep] = useState(0);
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
      setStep(0);
      setPhase('shelf');
    }, FAIL_DELAY);

    return () => clearTimeout(timer);
  }, [outcome, picked]);

  const hintItem = misses >= 2 ? stage.answer : null;

  const bodyWidth = width - 32;
  const bodyHeight = Math.max(150, height - (landscape ? 92 : 172));
  // Cuts are 1:1, so a page holds two squares that fit the shorter axis.
  const panel = landscape
    ? Math.min(bodyHeight, (bodyWidth - GAP) / 2)
    : Math.min(bodyWidth, (bodyHeight - GAP) / 2);

  const useCuts = picked === null ? [] : useComic(stage, picked);
  const useLead = useCuts.slice(0, Math.max(0, useCuts.length - 1));
  const resultCut = useCuts[useCuts.length - 1];

  function nextPage() {
    if (phase === 'comic') {
      if (cut + 2 <= cuts.length - 1) {
        setCut(cut + 2);
      } else {
        setPhase('shelf');
      }
      return;
    }

    if (phase === 'use') {
      if (step + 2 <= useLead.length - 1) {
        setStep(step + 2);
      } else {
        setPhase('result');
      }
    }
  }

  function pick(item: ItemId) {
    setPicked(item);
    setOutcome('pending');
    setStep(0);
    setPhase('use');
  }

  function renderResultOverlay() {
    if (picked === null) {
      return null;
    }

    return (
      <>
        {outcome === 'fail' && stage.failEffect === 'leak' ? (
          <View style={{ position: 'absolute', left: '46%', bottom: '18%' }}>
            <FallingDrops color={WATER} travel={46} />
          </View>
        ) : null}

        {outcome === 'fail' && stage.failEffect === 'soak' ? (
          <View style={{ position: 'absolute', left: '46%', top: '22%' }}>
            <FallingDrops color="#7FB6D6" travel={42} />
          </View>
        ) : null}

        {outcome === 'fail' && stage.failEffect === 'steam' ? (
          <View style={{ position: 'absolute', left: '48%', top: '16%' }}>
            <SteamWisps />
          </View>
        ) : null}

        {outcome === 'success' ? (
          <View style={{ position: 'absolute', left: '42%', top: '10%' }}>
            <Sparkles />
          </View>
        ) : null}

        {outcome === 'pending' ? null : (
          <Animated.View entering={ZoomIn.duration(200)} style={{ position: 'absolute', right: 14, top: 14 }}>
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: outcome === 'success' ? '#4FAE80' : '#D9695E' }}
            >
              {outcome === 'success' ? <CheckIcon size={18} /> : <CrossIcon size={16} />}
            </View>
          </Animated.View>
        )}
      </>
    );
  }

  function nextButton(label: string) {
    return (
      <Pressable
        onPress={nextPage}
        accessibilityRole="button"
        accessibilityLabel={label}
        className="items-center justify-center rounded-full"
        style={{ width: 46, height: 46, backgroundColor: ACCENT }}
      >
        <ForwardIcon size={20} />
      </Pressable>
    );
  }

  function renderFooter() {
    if (phase === 'comic' || phase === 'use') {
      const total = phase === 'comic' ? cuts.length : useCuts.length;
      const index = phase === 'comic' ? cut : step;

      return (
        <View className="flex-row items-center px-4 pb-2 pt-1" style={{ justifyContent: 'space-between' }}>
          <View style={{ width: 46 }} />
          <CutDots count={total} index={index} color={ACCENT} />
          {nextButton('다음 컷')}
        </View>
      );
    }

    if (phase === 'shelf') {
      return (
        <View className="items-center pb-2 pt-1">
          <Text className="text-sm" style={{ color: MUTED }}>
            손님에게 줄 물건을 골라 주세요
          </Text>
        </View>
      );
    }

    if (outcome === 'success') {
      return (
        <View className="items-center pb-2 pt-1">
          <Pressable
            onPress={onExit}
            accessibilityRole="button"
            accessibilityLabel="가게로"
            className="flex-row items-center justify-center rounded-full px-6 py-2"
            style={{ backgroundColor: ACCENT, gap: 8 }}
          >
            <Text className="text-base font-bold text-white">가게로</Text>
            <ForwardIcon size={16} />
          </Pressable>
        </View>
      );
    }

    return (
      <View className="flex-row items-center px-4 pb-2 pt-1" style={{ justifyContent: 'center' }}>
        <CutDots count={useCuts.length} index={useCuts.length - 1} color={ACCENT} />
      </View>
    );
  }

  const comicPage =
    phase === 'comic'
      ? cuts.slice(cut - (cut % 2), cut - (cut % 2) + 2)
      : useLead.slice(step - (step % 2), step - (step % 2) + 2);

  return (
    <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: BG }}>
      <View className="flex-row items-center justify-between px-4 pb-1 pt-2">
        <Pressable onPress={onExit} hitSlop={16} accessibilityRole="button" accessibilityLabel="나가기">
          <BackIcon size={22} />
        </Pressable>
        <Text className="text-lg font-bold" style={{ color: INK }}>
          {stage.name} 손님
        </Text>
        <Progress cleared={cleared} current={stageId} />
      </View>

      <View className="mx-4 flex-1">
        {phase === 'comic' || phase === 'use' ? (
          <View
            className="flex-1 items-center justify-center"
            style={{ flexDirection: landscape ? 'row' : 'column', gap: GAP }}
          >
            {comicPage.map((item, index) => (
              <ComicPanel key={`cut-${phase}-${index}`} cut={item} width={panel} height={panel} />
            ))}
          </View>
        ) : null}

        {phase === 'shelf' ? (
          <View
            className="flex-1 overflow-hidden rounded-[22px] border-[3px]"
            style={{ borderColor: LINE, backgroundColor: ACCENT_SOFT }}
          >
            <Mart
              width={bodyWidth}
              height={bodyHeight}
              landscape={landscape}
              customer={stage.customer}
              items={stage.shelf}
              tried={tried}
              hintItem={hintItem}
              onPick={pick}
              entering={!hasEntered}
            />
          </View>
        ) : null}

        {phase === 'result' && resultCut ? (
          <SceneCut
            cut={resultCut}
            width={bodyWidth}
            height={bodyHeight}
            fixed={outcome === 'success'}
            overlay={renderResultOverlay()}
          />
        ) : null}
      </View>

      {renderFooter()}
    </SafeAreaView>
  );
}
