import { Pressable, Text, View } from 'react-native';

import { COLORS, FONT, RADIUS, SHADOW, withAlpha } from '@/theme';

import type { Game } from '@/games';

type Props = {
  game: Game;
  width: number;
  height: number;
  color: string;
  onPress: () => void;
};

export function GameCard({ game, width, height, color, onPress }: Props) {
  const Icon = game.icon;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={game.title}
      style={({ pressed }) => [
        styles.card,
        SHADOW.card,
        {
          width,
          height,
          backgroundColor: color,
          borderColor: COLORS.white,
          transform: [{ scale: pressed ? 0.97 : 1 }]
        }
      ]}
    >
      <View style={styles.iconSlot}>
        {Icon ? (
          <Icon width={height * 0.46} height={height * 0.46} />
        ) : (
          <View style={[styles.iconFallback, { width: height * 0.42, height: height * 0.42 }]}>
            <Text style={[styles.initial, { fontSize: height * 0.2 }]}>{game.title.slice(0, 1)}</Text>
          </View>
        )}
      </View>

      <View style={[styles.label, SHADOW.button]}>
        <Text numberOfLines={1} style={styles.labelText}>
          {game.title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = {
  card: {
    borderRadius: RADIUS.card,
    borderWidth: 6,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 10,
    padding: 14
  },
  iconSlot: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const
  },
  iconFallback: {
    borderRadius: 999,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: withAlpha(COLORS.white, 0.55)
  },
  initial: {
    fontFamily: FONT,
    color: COLORS.oceanDeep
  },
  label: {
    alignSelf: 'stretch' as const,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: withAlpha(COLORS.white, 0.8)
  },
  labelText: {
    fontFamily: FONT,
    fontSize: 20,
    textAlign: 'center' as const,
    color: COLORS.oceanDeep
  }
};
