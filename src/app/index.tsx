import { Image, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GameSelector } from '@/components/GameSelector';
import { StageBackdrop } from '@/components/StageBackdrop';
import { GAMES } from '@/games';
import { useStageRouter } from '@/hooks/useStageRouter';
import { peekPixels, stageScale } from '@/stage';
import { COLORS, FONT, TEXT_SHADOW } from '@/theme';

export default function SelectorScreen() {
  const { go } = useStageRouter();
  const { width, height } = useWindowDimensions();
  const scale = stageScale(width, height);
  const peek = peekPixels('/', width);

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.oceanDeep }}>
      <StageBackdrop />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 justify-center">
          <GameSelector games={GAMES} onSelect={(game) => go(game.route)} />
        </View>
      </SafeAreaView>

      <View pointerEvents="none" style={{ position: 'absolute', left: peek + 20 * scale, top: 16 * scale }}>
        <Text style={[styles.wordmark, TEXT_SHADOW, { fontSize: 60 * scale }]}>바다 탐험대</Text>
        <Text style={[styles.subtitle, TEXT_SHADOW, { fontSize: 26 * scale }]}>게임 선택</Text>
      </View>

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: peek + 8 * scale,
          bottom: 8 * scale,
          width: 190 * scale,
          height: 190 * scale
        }}
      >
        <Image
          source={require('../assets/design/mascot/hello.png')}
          resizeMode="contain"
          style={{ width: '100%', height: '100%' }}
        />
      </View>
    </View>
  );
}

const styles = {
  wordmark: {
    fontFamily: FONT,
    color: COLORS.white
  },
  subtitle: {
    fontFamily: FONT,
    marginTop: 2,
    color: COLORS.yellow
  }
};
