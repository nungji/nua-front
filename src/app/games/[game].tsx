import { Redirect, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StageBackdrop } from '@/components/StageBackdrop';
import { gameIndexById, GAMES } from '@/games';
import { useStageRouter } from '@/hooks/useStageRouter';

export default function MockGameScreen() {
  const { game } = useLocalSearchParams<{ game: string }>();
  const { back } = useStageRouter();
  const index = gameIndexById(game);

  if (index < 0) {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1 bg-[#0B1026]">
      <StageBackdrop />
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center">
          <Text className="text-base" style={{ color: GAMES[index].accent }}>
            {GAMES[index].title}
          </Text>
          <Text className="mt-3 text-6xl font-bold text-white">Scene {index + 1}</Text>
        </View>

        <Pressable
          onPress={() => back('selector')}
          hitSlop={16}
          className="mx-auto mb-6 rounded-full border border-white/30 px-6 py-3"
        >
          <Text className="text-base text-white/80">나가기</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
