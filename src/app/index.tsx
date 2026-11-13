import { Image, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GameCard } from '@/components/GameCard';
import { StageBackdrop } from '@/components/StageBackdrop';
import { GAMES } from '@/games';
import { useStageRouter } from '@/hooks/useStageRouter';
import { CARD_COLORS, COLORS, FONT, SHADOW } from '@/theme';

const MAX_CARD_WIDTH = 232;
const CARD_RATIO = 0.78;
const GAP = 18;

export default function SelectorScreen() {
  const { go } = useStageRouter();
  const { width, height } = useWindowDimensions();

  const columns = Math.min(GAMES.length, 3) || 1;
  const rows = Math.ceil(GAMES.length / columns);
  const gridWidth = Math.min(width * 0.66, columns * MAX_CARD_WIDTH + (columns - 1) * GAP);
  const cardWidth = Math.min((gridWidth - (columns - 1) * GAP) / columns, MAX_CARD_WIDTH);
  const cardHeight = Math.min(cardWidth * CARD_RATIO, (height - 180 - (rows - 1) * GAP) / rows);

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.oceanDeep }}>
      <StageBackdrop />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 flex-row items-center px-8">
          <View style={{ flexBasis: '32%' }} className="justify-center">
            <Text style={[styles.wordmark, SHADOW.card]}>바다 탐험대</Text>
            <Text style={styles.subtitle}>게임 선택</Text>
            <Image
              source={require('../assets/design/mascot/hello.png')}
              resizeMode="contain"
              style={styles.mascot}
            />
          </View>

          <View className="flex-1 flex-row flex-wrap items-center justify-center" style={{ gap: GAP }}>
            {GAMES.map((game, position) => (
              <GameCard
                key={game.id}
                game={game}
                width={cardWidth}
                height={cardHeight}
                color={CARD_COLORS[position % CARD_COLORS.length]}
                onPress={() => go(game.route)}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = {
  wordmark: {
    fontFamily: FONT,
    fontSize: 42,
    color: COLORS.white
  },
  subtitle: {
    fontFamily: FONT,
    fontSize: 22,
    marginTop: 2,
    color: COLORS.yellow
  },
  mascot: {
    width: 168,
    height: 168,
    marginTop: 12,
    marginLeft: -6
  }
};
