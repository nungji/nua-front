import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { SHADOW, COLORS, FONT, TOP_BAR_HEIGHT } from '@/theme';

type Props = {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
};

function CircleButton({ onPress, label, children }: { onPress: () => void; label: string; children: ReactNode }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={[styles.circle, SHADOW.button]}
    >
      {children}
    </Pressable>
  );
}

export function TopBar({ title, onBack, right }: Props) {
  return (
    <View style={styles.bar}>
      <View style={styles.side}>
        {onBack ? (
          <CircleButton onPress={onBack} label="뒤로">
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path
                d="M15 4 L7 12 L15 20"
                stroke={COLORS.ocean}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </CircleButton>
        ) : null}
      </View>

      <View style={[styles.capsule, SHADOW.button]}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>

      <View style={[styles.side, styles.rightSide]}>{right}</View>
    </View>
  );
}

export function TopBarButton({ onPress, label, children }: { onPress: () => void; label: string; children?: ReactNode }) {
  return (
    <CircleButton onPress={onPress} label={label}>
      {children}
    </CircleButton>
  );
}

const styles = {
  bar: {
    height: TOP_BAR_HEIGHT,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 20,
    gap: 12
  },
  side: {
    minWidth: 56,
    flexDirection: 'row' as const,
    alignItems: 'center' as const
  },
  rightSide: {
    justifyContent: 'flex-end' as const
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: COLORS.white,
    borderWidth: 4,
    borderColor: COLORS.oceanMid
  },
  capsule: {
    flex: 1,
    maxWidth: 420,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: COLORS.ocean,
    borderWidth: 4,
    borderColor: COLORS.white
  },
  title: {
    fontFamily: FONT,
    fontSize: 22,
    color: COLORS.white
  }
};
