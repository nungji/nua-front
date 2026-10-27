import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GameSelector } from '@/components/GameSelector';
import { StageBackdrop } from '@/components/StageBackdrop';
import { GAMES } from '@/games';
import { useStageRouter } from '@/hooks/useStageRouter';

export default function SelectorScreen() {
  const { go } = useStageRouter();

  return (
    <View className="flex-1 bg-[#0B1026]">
      <StageBackdrop />
      <SafeAreaView className="flex-1 items-center justify-center">
        <GameSelector games={GAMES} onSelect={(game) => go(game.route, 'game')} />
      </SafeAreaView>
    </View>
  );
}
