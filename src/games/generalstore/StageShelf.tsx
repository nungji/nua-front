import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGeneralStore } from '@/store/useGeneralStore';

import { Awning } from './art/Awning';
import { Customer } from './art/Customer';
import { BackIcon, CheckIcon } from './art/Icons';
import { ACCENT_SOFT, BG, CARD, INK, LINE, MUTED, WOOD } from './art/colors';
import { STAGES } from './game/stages';
import type { Stage } from './game/types';

const COLUMNS = 2;

type StageShelfProps = {
  accent: string;
  onStart: (stageId: number) => void;
  onExit: () => void;
};

function StageCard({
  stage,
  done,
  accent,
  onPress
}: {
  stage: Stage;
  done: boolean;
  accent: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${stage.id}번 손님 ${stage.name}`}
      className="flex-1 items-center rounded-[26px] border-[3px] pb-3 pt-4"
      style={{ backgroundColor: done ? ACCENT_SOFT : CARD, borderColor: done ? accent : LINE }}
    >
      <Customer id={stage.customer} mood={done ? 'happy' : 'sad'} width={82} />

      <View className="mt-2 flex-row items-center" style={{ gap: 6 }}>
        <View
          className="h-6 w-6 items-center justify-center rounded-full"
          style={{ backgroundColor: WOOD }}
        >
          <Text className="text-[11px] font-bold text-white">{stage.id}</Text>
        </View>
        <Text className="text-base font-bold" style={{ color: INK }}>
          {stage.name}
        </Text>
      </View>

      {done ? (
        <View
          className="absolute right-2.5 top-2.5 h-7 w-7 items-center justify-center rounded-full"
          style={{ backgroundColor: accent }}
        >
          <CheckIcon size={14} />
        </View>
      ) : null}
    </Pressable>
  );
}

export function StageShelf({ accent, onStart, onExit }: StageShelfProps) {
  const { width } = useWindowDimensions();
  const cleared = useGeneralStore((state) => state.cleared);

  const rows: Stage[][] = [];
  for (let index = 0; index < STAGES.length; index += COLUMNS) {
    rows.push(STAGES.slice(index, index + COLUMNS));
  }

  return (
    <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: BG }}>
      <Awning width={width} />

      <View className="flex-row items-center justify-between px-6 pb-1 pt-3">
        <Pressable onPress={onExit} hitSlop={16} accessibilityRole="button" accessibilityLabel="나가기">
          <BackIcon />
        </Pressable>
        <Text className="text-3xl font-bold" style={{ color: INK }}>
          만물상
        </Text>
        <View style={{ width: 26 }} />
      </View>

      <View className="flex-row items-center justify-center pb-3" style={{ gap: 5 }}>
        {STAGES.map((stage) => (
          <View
            key={stage.id}
            className="h-2 rounded-full"
            style={{
              width: cleared.includes(stage.id) ? 16 : 8,
              backgroundColor: cleared.includes(stage.id) ? accent : LINE
            }}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {rows.map((row, rowIndex) => (
          <View key={`shelf-${rowIndex}`} className="px-5 pt-3">
            <View className="flex-row items-end" style={{ gap: 12 }}>
              {row.map((stage) => (
                <StageCard
                  key={stage.id}
                  stage={stage}
                  done={cleared.includes(stage.id)}
                  accent={accent}
                  onPress={() => onStart(stage.id)}
                />
              ))}
              {row.length < COLUMNS ? <View className="flex-1" /> : null}
            </View>

            <View
              style={{
                height: 14,
                marginHorizontal: -6,
                borderRadius: 7,
                backgroundColor: WOOD
              }}
            />
            <View
              style={{
                height: 5,
                marginHorizontal: 4,
                marginTop: 3,
                borderRadius: 3,
                backgroundColor: '#E0CDB0'
              }}
            />
          </View>
        ))}

        <Text className="px-6 pt-6 text-center text-sm" style={{ color: MUTED }}>
          손님이 원하는 것을 보고 물건을 골라 주세요
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
