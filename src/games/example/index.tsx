import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StageBackdrop } from '@/components/StageBackdrop';
import { useStageRouter } from '@/hooks/useStageRouter';

import type { GameSceneProps } from '../types';

export function ExampleScene({ game }: GameSceneProps) {
  const { back } = useStageRouter();

  return (
    <View className="flex-1 bg-[#0B1026]">
      <StageBackdrop />
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center">
          <Text className="text-base" style={{ color: game.accent }}>
            {game.title}
          </Text>
          <Text className="mt-3 text-6xl font-bold text-white">Scene 1</Text>
        </View>

        <Pressable
          onPress={() => back()}
          hitSlop={16}
          className="mx-auto mb-6 rounded-full border border-white/30 px-6 py-3"
        >
          <Text className="text-base text-white/80">나가기</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
