import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StageBackdrop } from '@/components/StageBackdrop';
import { TopBar } from '@/components/TopBar';
import { useStageRouter } from '@/hooks/useStageRouter';
import { COLORS, FONT } from '@/theme';

import type { GameSceneProps } from '../types';

export function ExampleScene({ game }: GameSceneProps) {
  const { back } = useStageRouter();

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.oceanDeep }}>
      <StageBackdrop dim={0.1} />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <TopBar title={game.title} onBack={back} />

        <View className="flex-1 items-center justify-center">
          <Text style={{ fontFamily: FONT, fontSize: 64, color: COLORS.white }}>Scene 1</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
