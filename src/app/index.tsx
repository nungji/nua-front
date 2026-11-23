import { Image, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeOceanLife } from '@/components/HomeOceanLife';
import { GameSelector } from '@/components/GameSelector';
import { StageBackdrop } from '@/components/StageBackdrop';
import { GAMES } from '@/games';
import { useStageRouter } from '@/hooks/useStageRouter';
import { stageScale } from '@/stage';
import { COLORS } from '@/theme';

export default function SelectorScreen() {
  const { go } = useStageRouter();
  const { width, height } = useWindowDimensions();
  const scale = stageScale(width, height);

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.oceanDeep }}>
      <StageBackdrop />
      <HomeOceanLife />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 justify-center">
          <GameSelector games={GAMES} onSelect={(game) => go(game.route)} />
        </View>
      </SafeAreaView>

      <View pointerEvents="none" style={{ position: 'absolute', left: 20 * scale, top: 16 * scale }}>
        <Image source={require('../assets/shellstore/logo.png')} accessibilityLabel="nua" resizeMode="contain" style={{ width: 270 * scale, height: 115 * scale }} />
      </View>

    </View>
  );
}
