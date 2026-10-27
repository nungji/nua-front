import { useEffect, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { Game } from '@/games';
import { CAROUSEL_DURATION, CAROUSEL_EASING } from '@/stage';

/** Figma selector frame is 1280 x 832. */
const DESIGN = {
  width: 1280,
  active: 249,
  side: 185,
  slot: 369,
  arrow: 139,
  arrowOffset: 200
};
const VISIBLE_SLOTS = 2;

type GameSlotProps = {
  game: Game;
  position: number;
  count: number;
  slot: SharedValue<number>;
  size: number;
  activeSize: number;
  gap: number;
  onPress: () => void;
};

function GameSlot({ game, position, count, slot, size, activeSize, gap, onPress }: GameSlotProps) {
  const style = useAnimatedStyle(() => {
    const wrapped = ((position - slot.value) % count + count) % count;
    const offset = wrapped >= count / 2 ? wrapped - count : wrapped;
    const distance = Math.min(Math.abs(offset), VISIBLE_SLOTS);
    const focus = 1 - distance;

    return {
      opacity: distance >= VISIBLE_SLOTS ? 0 : 0.45 + focus * 0.55,
      transform: [{ translateX: offset * gap }, { scale: 1 + (activeSize / size - 1) * focus }]
    };
  });

  return (
    <Animated.View style={[{ position: 'absolute', width: size, height: size }, style]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={game.title}
        className="flex-1 items-center justify-center rounded-full"
        style={{ backgroundColor: game.accent }}
      >
        <View className="rounded-full bg-white/25" style={{ width: size * 0.34, height: size * 0.34 }} />
      </Pressable>
    </Animated.View>
  );
}

type Props = {
  games: readonly Game[];
  onSelect: (game: Game) => void;
};

export function GameSelector({ games, onSelect }: Props) {
  const { width } = useWindowDimensions();
  const scale = width / DESIGN.width;
  const activeSize = DESIGN.active * scale;
  const sideSize = DESIGN.side * scale;
  const gap = DESIGN.slot * scale;
  const arrowSize = Math.max(DESIGN.arrow * scale, 44);
  const arrowOffset = DESIGN.arrowOffset * scale;

  const [index, setIndex] = useState(0);
  const slot = useSharedValue(0);

  useEffect(() => {
    slot.value = withTiming(index, { duration: CAROUSEL_DURATION, easing: CAROUSEL_EASING });
  }, [index, slot]);

  const count = games.length;
  const active = ((index % count) + count) % count;

  return (
    <View style={{ height: activeSize, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
      {games.map((game, position) => (
        <GameSlot
          key={game.id}
          game={game}
          position={position}
          count={count}
          slot={slot}
          size={sideSize}
          activeSize={activeSize}
          gap={gap}
          onPress={() => (position === active ? onSelect(game) : setIndex(position))}
        />
      ))}

      <Text
        pointerEvents="none"
        style={{ position: 'absolute', top: activeSize + 12, color: 'rgba(255,255,255,0.75)' }}
        className="text-base"
      >
        {games[active].title}
      </Text>

      <Pressable
        onPress={() => setIndex((current) => current - 1)}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="이전 게임"
        style={{ position: 'absolute', left: '50%', marginLeft: -arrowOffset - arrowSize / 2, width: arrowSize, height: arrowSize }}
        className="items-center justify-center"
      >
        <Svg width="75%" height="75%" viewBox="0 0 24 32">
          <Path d="M20 2 L4 16 L20 30 Z" fill="#FFFFFF" fillOpacity={0.85} />
        </Svg>
      </Pressable>

      <Pressable
        onPress={() => setIndex((current) => current + 1)}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="다음 게임"
        style={{ position: 'absolute', left: '50%', marginLeft: arrowOffset - arrowSize / 2, width: arrowSize, height: arrowSize }}
        className="items-center justify-center"
      >
        <Svg width="75%" height="75%" viewBox="0 0 24 32">
          <Path d="M4 2 L20 16 L4 30 Z" fill="#FFFFFF" fillOpacity={0.85} />
        </Svg>
      </Pressable>
    </View>
  );
}
