import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGeneralStore } from '@/store/useGeneralStore';

import { BackIcon, CheckIcon } from './art/Icons';
import { ProblemArt } from './art/Problem';
import { CustomerArt, RockRing, SeabedBackdrop } from './art/Sea';
import { INK, MUTED } from './art/colors';
import { STAGES } from './game/stages';

const RING = 196;
const STEP = 212;
/** Where each stage sits across the scroll, so the rings snake down the sand. */
const ACROSS = [0.24, 0.7, 0.32, 0.74, 0.4];
const TOP = 132;

type StageShelfProps = {
  accent: string;
  onStart: (stageId: number) => void;
  onExit: () => void;
};

export function StageShelf({ accent, onStart, onExit }: StageShelfProps) {
  const { width } = useWindowDimensions();
  const cleared = useGeneralStore((state) => state.cleared);
  const contentHeight = TOP + STAGES.length * STEP + 120;

  return (
    <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: '#EFDCB0' }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ height: contentHeight }}
        showsVerticalScrollIndicator={false}
      >
        <SeabedBackdrop width={width} height={contentHeight} />

        {STAGES.map((stage, index) => {
          const done = cleared.includes(stage.id);
          const centerX = Math.max(RING / 2 + 12, Math.min(width - RING / 2 - 12, ACROSS[index] * width));
          const top = TOP + index * STEP;

          return (
            <Pressable
              key={stage.id}
              onPress={() => onStart(stage.id)}
              accessibilityRole="button"
              accessibilityLabel={`${stage.id}번 스테이지 ${stage.name}`}
              style={{ position: 'absolute', left: centerX - RING / 2, top, width: RING, height: RING }}
            >
              <RockRing size={RING} />

              <View
                style={{
                  position: 'absolute',
                  left: RING * 0.17,
                  top: RING * 0.19,
                  width: RING * 0.66,
                  height: RING * 0.62,
                  borderRadius: 10,
                  backgroundColor: '#FFFDF7',
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                }}
              >
                <View style={{ position: 'absolute', top: 2, left: 2 }}>
                  <CustomerArt id={stage.customer} mood={done ? 'happy' : 'sad'} width={RING * 0.4} />
                </View>
                <View style={{ position: 'absolute', right: 0, bottom: -2 }}>
                  <ProblemArt id={stage.problem} width={RING * 0.34} />
                </View>

                {done ? (
                  <View
                    className="absolute right-1 top-1 h-6 w-6 items-center justify-center rounded-full"
                    style={{ backgroundColor: accent }}
                  >
                    <CheckIcon size={12} />
                  </View>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View
        className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-4 pb-2 pt-3"
        style={{ backgroundColor: 'rgba(239,220,176,0.86)' }}
      >
        <Pressable onPress={onExit} hitSlop={16} accessibilityRole="button" accessibilityLabel="나가기">
          <BackIcon size={22} />
        </Pressable>
        <Text className="text-lg font-bold" style={{ color: INK }}>
          만물상
        </Text>
        <View className="flex-row items-center" style={{ gap: 4 }}>
          {STAGES.map((stage) => (
            <View
              key={`dot-${stage.id}`}
              className="rounded-full"
              style={{
                width: cleared.includes(stage.id) ? 12 : 8,
                height: 8,
                backgroundColor: cleared.includes(stage.id) ? accent : 'rgba(74,58,42,0.25)'
              }}
            />
          ))}
        </View>
      </View>

      <Text
        pointerEvents="none"
        className="absolute bottom-3 left-0 right-0 text-center text-xs"
        style={{ color: MUTED }}
      >
        바위에 둘러싸인 사진을 눌러 주세요
      </Text>

    </SafeAreaView>
  );
}
