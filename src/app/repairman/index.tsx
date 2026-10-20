import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { STAGES } from '@/game/stages';
import { Difficulty } from '@/game/types';

const LEVELS: Difficulty[] = ['easy', 'medium', 'hard'];

function pieceCounts(stageId: string) {
  const stage = STAGES.find((item) => item.id === stageId);

  if (!stage) {
    return [];
  }

  return LEVELS.map(
    (_, rank) => stage.parts.filter((part) => LEVELS.indexOf(part.from) <= rank).length
  );
}

export default function RepairmanStages() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-2">
        <Pressable onPress={() => router.back()} hitSlop={16}>
          <Text className="text-base text-gray-500">나가기</Text>
        </Pressable>
        <Text className="text-base font-semibold text-gray-900">수리공</Text>
        <View style={{ width: 40 }} />
      </View>

      <View className="gap-3 px-5 pt-6">
        {STAGES.map((stage) => {
          const counts = pieceCounts(stage.id);

          return (
            <Pressable
              key={stage.id}
              onPress={() => router.push(`/repairman/${stage.id}`)}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4"
            >
              <Text className="text-lg font-bold text-gray-900">{stage.name}</Text>
              <Text className="mt-1 text-sm text-gray-500">
                조각 {counts.join(' · ')} (하 · 중 · 상)
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
