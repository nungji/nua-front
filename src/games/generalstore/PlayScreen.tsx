import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGeneralStore } from '@/store/useGeneralStore';

import { Customer } from './art/Customer';
import { FallingDrops, Sparkles, SteamWisps } from './art/Effects';
import { BackIcon, CheckIcon, CrossIcon, ForwardIcon } from './art/Icons';
import { ItemArt } from './art/Item';
import { NeedIcon } from './art/NeedIcon';
import { ProblemArt } from './art/Problem';
import { ACCENT, ACCENT_SOFT, BG, CARD, INK, LINE, MUTED, WATER, WOOD } from './art/colors';
import { findStage, ITEM_LABELS, STAGES } from './game/stages';
import type { ItemId } from './game/types';

/** How long the item sits in the customer's hands before the answer is revealed. */
const USE_DELAY = 900;
/** How long the failed attempt stays on screen before the shelf comes back. */
const FAIL_DELAY = 1500;
const HINT_AFTER_MISSES = 2;

type Phase = 'story' | 'shelf' | 'using' | 'fail' | 'done';

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
              backgroundColor: done ? ACCENT : stage.id === current ? WOOD : LINE
            }}
          />
        );
      })}
    </View>
  );
}

export function PlayScreen({ stageId, onExit }: PlayScreenProps) {
  const stage = findStage(stageId);
  const { width } = useWindowDimensions();
  const cleared = useGeneralStore((state) => state.cleared);
  const misses = useGeneralStore((state) => state.misses[stageId] ?? 0);
  const openStage = useGeneralStore((state) => state.openStage);
  const clearStage = useGeneralStore((state) => state.clearStage);
  const reject = useGeneralStore((state) => state.reject);

  const [phase, setPhase] = useState<Phase>('story');
  const [picked, setPicked] = useState<ItemId | null>(null);
  const [tried, setTried] = useState<ItemId[]>([]);

  useEffect(() => {
    openStage(stageId);
  }, [stageId, openStage]);

  useEffect(() => {
    if (phase !== 'using' || picked === null) {
      return;
    }

    const timer = setTimeout(() => {
      if (picked === stage.answer) {
        clearStage(stageId);
        setPhase('done');
      } else {
        reject(stageId);
        setPhase('fail');
      }
    }, USE_DELAY);

    return () => clearTimeout(timer);
  }, [phase, picked, stage.answer, stageId, clearStage, reject]);

  useEffect(() => {
    if (phase !== 'fail' || picked === null) {
      return;
    }

    const timer = setTimeout(() => {
      setTried((current) => [...current, picked]);
      setPicked(null);
      setPhase('shelf');
    }, FAIL_DELAY);

    return () => clearTimeout(timer);
  }, [phase, picked]);

  const hint = misses >= HINT_AFTER_MISSES && !tried.includes(stage.answer);
  const scale = Math.min(1, (width - 56) / 348);

  /** A yard is a wide strip, a potted plant is tall; give the wide one more room. */
  function propWidth(base: number) {
    return Math.round((stage.problem === 'leafYard' ? base * 1.24 : base) * scale);
  }

  function nextPanel() {
    setPhase('shelf');
  }

  function pick(item: ItemId) {
    setPicked(item);
    setPhase('using');
  }

  function comicFrame(children: ReactNode) {
    return (
      <View
        className="flex-1 flex-row items-center justify-center rounded-[26px] border-2"
        style={{ backgroundColor: '#FFF9EC', borderColor: LINE }}
      >
        {children}
      </View>
    );
  }

  function renderStory() {
    return (
      <Pressable
        className="flex-1 px-3 py-3"
        style={{ gap: 10 }}
        onPress={nextPanel}
        accessibilityRole="button"
        accessibilityLabel="다음"
      >
        {comicFrame(
          <>
            <Customer id={stage.customer} mood="sad" width={Math.round(132 * scale)} />
            <ProblemArt id={stage.problem} width={propWidth(136)} />
          </>
        )}

        {comicFrame(
          <>
            <Customer id={stage.customer} mood="sad" width={Math.round(120 * scale)} />
            <View
              className="ml-1 items-center justify-center rounded-[26px] border-[3px] px-5 py-5"
              style={{ backgroundColor: '#FFFFFF', borderColor: LINE }}
            >
              <NeedIcon need={stage.need} size={Math.round(66 * scale)} />
            </View>
          </>
        )}
      </Pressable>
    );
  }

  function renderShelf() {
    return (
      <View className="flex-1 items-center justify-center">
        <View className="flex-row items-end" style={{ gap: 12 }}>
          <Customer id={stage.customer} mood="sad" width={Math.round(132 * scale)} />
          <View
            className="mb-4 rounded-[28px] border-[3px] px-5 py-5"
            style={{ backgroundColor: '#FFFFFF', borderColor: LINE }}
          >
            <NeedIcon need={stage.need} size={Math.round(62 * scale)} />
          </View>
        </View>
      </View>
    );
  }

  /** The counter lives outside the scene card, so the shelf reads as furniture in front of it. */
  function renderCounter() {
    return (
      <View className="mx-4 mt-3">
        <View className="flex-row items-end justify-center" style={{ gap: 10 }}>
          {stage.shelf.map((item) => {
            const used = tried.includes(item);
            const hinted = hint && item === stage.answer;

            return (
              <Pressable
                key={item}
                disabled={used}
                onPress={() => pick(item)}
                accessibilityRole="button"
                accessibilityLabel={ITEM_LABELS[item]}
                className="items-center justify-center rounded-[24px] border-[3px]"
                style={{
                  width: Math.round(100 * scale) + 8,
                  height: Math.round(100 * scale) + 8,
                  backgroundColor: used ? '#F2EADA' : '#FFF7E7',
                  borderColor: hinted ? '#F2C14E' : used ? '#DCCBAE' : LINE,
                  opacity: used ? 0.7 : 1
                }}
              >
                <ItemArt id={item} width={Math.round(70 * scale)} />
                {used ? (
                  <View
                    className="absolute right-1.5 top-1.5 h-6 w-6 items-center justify-center rounded-full"
                    style={{ backgroundColor: '#C9B79A' }}
                  >
                    <CrossIcon size={12} />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 14, marginHorizontal: 4, marginTop: -1, borderRadius: 7, backgroundColor: WOOD }} />
        <View
          style={{ height: 5, marginHorizontal: 12, marginTop: 3, borderRadius: 3, backgroundColor: '#E0CDB0' }}
        />
      </View>
    );
  }

  function renderUse() {
    const success = phase === 'done';
    const itemSize = Math.round(78 * scale);

    return (
      <View className="flex-1 px-3 py-3">
        {comicFrame(
          <>
            <Customer
              id={stage.customer}
              mood={success ? 'happy' : 'sad'}
              width={Math.round(116 * scale)}
            />

            <View className="items-center justify-center" style={{ width: itemSize + 18 }}>
              {picked === null ? null : (
                <Animated.View entering={ZoomIn.duration(220)}>
                  <ItemArt id={picked} width={itemSize} />
                </Animated.View>
              )}

              {phase === 'fail' && stage.failEffect === 'leak' ? (
                <View style={{ position: 'absolute', bottom: -18, left: 6 }}>
                  <FallingDrops color={WATER} travel={46} />
                </View>
              ) : null}

              {phase === 'fail' && stage.failEffect === 'soak' ? (
                <View style={{ position: 'absolute', top: -24, left: 2 }}>
                  <FallingDrops color="#7FB6D6" travel={42} />
                </View>
              ) : null}

              {phase === 'fail' && stage.failEffect === 'steam' ? (
                <View style={{ position: 'absolute', top: -20, left: 8 }}>
                  <SteamWisps />
                </View>
              ) : null}

              {success ? (
                <View style={{ position: 'absolute', top: -30, left: 0 }}>
                  <Sparkles />
                </View>
              ) : null}
            </View>

            <ProblemArt id={stage.problem} fixed={success} width={propWidth(112)} />
          </>
        )}

        {phase === 'done' || phase === 'fail' ? (
          <Animated.View entering={ZoomIn.duration(200)} style={{ position: 'absolute', right: 26, top: 26 }}>
            <View
              className="h-11 w-11 items-center justify-center rounded-full"
              style={{ backgroundColor: success ? '#4FAE80' : '#D9695E' }}
            >
              {success ? <CheckIcon size={20} /> : <CrossIcon size={18} />}
            </View>
          </Animated.View>
        ) : null}
      </View>
    );
  }

  function renderFooter() {
    if (phase === 'story') {
      return (
        <View className="items-center pb-5 pt-1">
          <Pressable
            onPress={nextPanel}
            accessibilityRole="button"
            accessibilityLabel="다음"
            className="flex-row items-center justify-center rounded-full px-8 py-4"
            style={{ backgroundColor: ACCENT, gap: 10 }}
          >
            <Text className="text-lg font-bold text-white">다음</Text>
            <ForwardIcon size={18} />
          </Pressable>
        </View>
      );
    }

    if (phase === 'shelf') {
      return (
        <View className="items-center pb-5 pt-1">
          <Text className="text-sm" style={{ color: MUTED }}>
            어떤 물건을 줄까요?
          </Text>
        </View>
      );
    }

    if (phase === 'done') {
      return (
        <View className="items-center pb-5 pt-1">
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

    return <View style={{ height: 20 }} />;
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

      <View
        className="mx-4 flex-1 overflow-hidden rounded-[34px] border-[3px]"
        style={{ backgroundColor: phase === 'done' ? ACCENT_SOFT : CARD, borderColor: LINE }}
      >
        {phase === 'story' ? renderStory() : null}
        {phase === 'shelf' ? renderShelf() : null}
        {phase === 'using' || phase === 'fail' || phase === 'done' ? renderUse() : null}
      </View>

      {phase === 'shelf' ? renderCounter() : null}

      {renderFooter()}
    </SafeAreaView>
  );
}
