import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';

import { buildPuzzle, STAGES, stageHint } from '@/game/stages';
import { StageConfig } from '@/game/types';

const PREVIEW_BOARD = { width: 400, height: 288 };

type Preview = {
  path: string;
  viewBox: string;
};

function buildPreview(stage: StageConfig): Preview {
  const puzzle = buildPuzzle(stage, PREVIEW_BOARD);
  const minX = Math.min(...puzzle.pieces.map((piece) => piece.slot.x));
  const maxX = Math.max(...puzzle.pieces.map((piece) => piece.slot.x + piece.width));
  const minY = Math.min(...puzzle.pieces.map((piece) => piece.slot.y));
  const maxY = Math.max(...puzzle.pieces.map((piece) => piece.slot.y + piece.height));
  const padding = 8;

  return {
    path: puzzle.silhouette,
    viewBox: `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`
  };
}

export default function RepairmanStages() {
  const [selected, setSelected] = useState<number | null>(null);
  const previews = useMemo(() => {
    const map: Record<number, Preview> = {};

    for (const stage of STAGES) {
      map[stage.id] = buildPreview(stage);
    }

    return map;
  }, []);

  const stage = selected === null ? null : STAGES.find((item) => item.id === selected) ?? null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-6 pt-2">
        <Pressable onPress={() => router.back()} hitSlop={20}>
          <Text className="text-lg text-gray-500">나가기</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-gray-900">수리공</Text>
        <View style={{ width: 52 }} />
      </View>

      <View className="px-6 pt-6">
        <Text className="text-3xl font-bold text-gray-900">스테이지</Text>
        <Text className="mt-2 text-base text-gray-500">고칠 물건을 골라 주세요</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 260 }}>
        <View className="flex-row flex-wrap" style={{ gap: 12 }}>
          {STAGES.map((item) => {
            const active = item.id === selected;

            return (
              <Pressable
                key={item.id}
                onPress={() => setSelected(item.id)}
                style={{ width: 72, height: 72 }}
                className={
                  active
                    ? 'items-center justify-center rounded-3xl bg-orange-500'
                    : 'items-center justify-center rounded-3xl bg-slate-100'
                }
              >
                <Text
                  className={
                    active ? 'text-2xl font-bold text-white' : 'text-2xl font-semibold text-slate-600'
                  }
                >
                  {item.id}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {stage ? (
        <Animated.View
          key={stage.id}
          entering={SlideInDown.duration(220)}
          exiting={SlideOutDown.duration(160)}
          className="absolute bottom-0 left-0 right-0 rounded-t-3xl border-t border-slate-200 bg-white px-6 pb-10 pt-5"
        >
          <View className="flex-row items-center" style={{ gap: 18 }}>
            <View
              className="items-center justify-center rounded-3xl bg-slate-50"
              style={{ width: 132, height: 152 }}
            >
              <Svg width={116} height={136} viewBox={previews[stage.id].viewBox}>
                <Path
                  d={previews[stage.id].path}
                  fill="#E2E8F0"
                  stroke="#94A3B8"
                  strokeWidth={2}
                />
              </Svg>
            </View>

            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                {stage.id}. {stage.name}
              </Text>
              <Text className="mt-2 text-base text-gray-500">{stageHint(stage)}</Text>

              <View className="mt-4 flex-row items-center" style={{ gap: 3 }}>
                {STAGES.map((item) => (
                  <View
                    key={item.id}
                    className={
                      item.id <= stage.id
                        ? 'h-2 flex-1 rounded-full bg-orange-400'
                        : 'h-2 flex-1 rounded-full bg-slate-200'
                    }
                  />
                ))}
              </View>
              <Text className="mt-2 text-sm text-gray-400">
                난이도 {stage.id} / {STAGES.length}
              </Text>
            </View>

            <Pressable
              onPress={() => router.push(`/repairman/${stage.id}`)}
              className="items-center justify-center rounded-full bg-orange-500"
              style={{ width: 76, height: 76 }}
            >
              <Text className="text-2xl font-bold text-white">▶</Text>
            </Pressable>
          </View>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}
