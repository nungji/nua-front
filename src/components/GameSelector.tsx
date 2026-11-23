import { useEffect, useState } from 'react';
import { Image, Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { GAME_CHARACTERS } from './GameCharacter';

import { Game } from '@/games';
import { CAROUSEL_SPRING, stageScale } from '@/stage';
import { COLORS, FONT, SHADOW, TEXT_SHADOW, withAlpha } from '@/theme';

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
  scale: number;
  onPress: () => void;
};

function GameSlot({ game, position, count, slot, size, activeSize, gap, scale, onPress }: GameSlotProps) {
  const Icon = game.icon;

  const style = useAnimatedStyle(() => {
    const wrapped = ((position - slot.value) % count + count) % count;
    const offset = wrapped >= count / 2 ? wrapped - count : wrapped;
    const distance = Math.min(Math.abs(offset), VISIBLE_SLOTS);
    const focus = 1 - Math.min(distance, 1);

    return {
      // fades out over the whole second slot so the spring overshoot cannot pop it back in
      opacity: distance <= 1 ? 1 - 0.25 * distance : Math.max(0, 0.75 * (VISIBLE_SLOTS - distance)),
      transform: [{ translateX: offset * gap }, { scale: 1 + (activeSize / size - 1) * focus }]
    };
  });

  return (
    <Animated.View style={[{ position: 'absolute', width: size, height: size }, style]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={game.title}
        style={[
          styles.circle,
          SHADOW.card,
          { backgroundColor: withAlpha('#2D8CF0', 0.16), borderWidth: 3 * scale }
        ]}
      >
        <View pointerEvents="none" style={{ position: 'absolute', inset: 5 * scale, borderRadius: 9999, borderWidth: scale, borderColor: '#FFFFFF40' }} />
        <View pointerEvents="none" style={{ position: 'absolute', left: size * 0.18, top: size * 0.12, width: size * 0.35, height: size * 0.10, borderRadius: 9999, backgroundColor: '#FFFFFF80', transform: [{ rotate: '-30deg' }] }} />
        {Icon ? (
          <Icon width={size * 0.55} height={size * 0.55} />
        ) : (
          <View className="rounded-full bg-white/25" style={{ width: size * 0.34, height: size * 0.34 }} />
        )}
      </Pressable>
    </Animated.View>
  );
}

type Props = {
  games: readonly Game[];
  onSelect: (game: Game) => void;
};

export function GameSelector({ games, onSelect }: Props) {
  const { width, height } = useWindowDimensions();
  const scale = stageScale(width, height);
  const activeSize = DESIGN.active * scale;
  const sideSize = DESIGN.side * scale;
  const gap = DESIGN.slot * scale;
  const arrowSize = Math.max(DESIGN.arrow * scale, 44);
  const arrowOffset = DESIGN.arrowOffset * scale;

  const [index, setIndex] = useState(0);
  const slot = useSharedValue(0);

  useEffect(() => {
    slot.value = withSpring(index, CAROUSEL_SPRING);
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
          scale={scale}
          onPress={() => (position === active ? onSelect(game) : setIndex(position))}
        />
      ))}

      {/* Keep the entire mascot outside the animated cards: no crop or moving mask. */}
      <View testID="selector-mascot" pointerEvents="none" style={{ position: 'absolute', top: -172 * scale, width: 160 * scale, height: 190 * scale, zIndex: 10, overflow: 'visible' }}>
        <Image source={GAME_CHARACTERS[games[active].id]} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
      </View>

      <Text
        pointerEvents="none"
        numberOfLines={1}
        style={[styles.label, TEXT_SHADOW, { top: activeSize + 14 * scale, fontSize: 28 * scale }]}
      >
        {games[active].title}
      </Text>

      <Pressable
        onPress={() => setIndex((current) => current - 1)}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="이전 게임"
        style={{
          position: 'absolute',
          left: '50%',
          marginLeft: -arrowOffset - arrowSize / 2,
          width: arrowSize,
          height: arrowSize
        }}
        className="items-center justify-center"
      >
        <BubbleArrow previous />
      </Pressable>

      <Pressable
        onPress={() => setIndex((current) => current + 1)}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="다음 게임"
        style={{
          position: 'absolute',
          left: '50%',
          marginLeft: arrowOffset - arrowSize / 2,
          width: arrowSize,
          height: arrowSize
        }}
        className="items-center justify-center"
      >
        <BubbleArrow />
      </Pressable>
    </View>
  );
}

function BubbleArrow({ previous = false }: { previous?: boolean }) {
  return <Svg width="70%" height="70%" viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="43" fill="#23DDF145" stroke="#D5FCFF" strokeWidth="4" />
    <Circle cx="50" cy="50" r="35" fill="#00AADD30" stroke="#FFFFFF70" strokeWidth="2" />
    <Ellipse cx="34" cy="25" rx="14" ry="7" fill="#FFFFFFBB" transform="rotate(-35 34 25)" />
    <Circle cx="25" cy="63" r="5" fill="#DFFFFF" />
    <Path d={previous ? 'M58 34 L40 50 L58 66' : 'M42 34 L60 50 L42 66'} fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

const styles = {
  circle: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 9999,
    borderColor: '#FFFFFFB3'
  },
  label: {
    position: 'absolute' as const,
    fontFamily: FONT,
    color: COLORS.white,
    textAlign: 'center' as const
  }
};
