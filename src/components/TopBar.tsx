import type { ReactNode } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { stageScale } from '@/stage';
import { COLORS, FONT, SHADOW, TOP_BAR_HEIGHT } from '@/theme';

type Props = {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
};

export function TopBar({ title, onBack, right }: Props) {
  const { width, height } = useWindowDimensions();
  const scale = stageScale(width, height);
  const buttonSize = 48 * scale;

  return (
    <View
      style={{
        height: TOP_BAR_HEIGHT * scale,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20 * scale,
        gap: 12 * scale
      }}
    >
      <View style={{ minWidth: buttonSize, flexDirection: 'row', alignItems: 'center' }}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="뒤로"
            hitSlop={8}
            style={[styles.circle, SHADOW.button, { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2, borderWidth: 4 * scale }]}
          >
            <Svg width={24 * scale} height={24 * scale} viewBox="0 0 24 24">
              <Path
                d="M15 4 L7 12 L15 20"
                stroke={COLORS.ocean}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </Pressable>
        ) : null}
      </View>

      <View
        style={[
          styles.capsule,
          SHADOW.button,
          {
            height: 48 * scale,
            borderRadius: 24 * scale,
            paddingHorizontal: 24 * scale,
            borderWidth: 4 * scale,
            maxWidth: 420 * scale
          }
        ]}
      >
        <Text numberOfLines={1} style={{ fontFamily: FONT, fontSize: 22 * scale, color: COLORS.white }}>
          {title}
        </Text>
      </View>

      <View style={{ minWidth: buttonSize, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
        {right}
      </View>
    </View>
  );
}

export function TopBarButton({ onPress, label, children }: { onPress: () => void; label: string; children?: ReactNode }) {
  const { width, height } = useWindowDimensions();
  const scale = stageScale(width, height);
  const buttonSize = 48 * scale;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={[styles.circle, SHADOW.button, { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2, borderWidth: 4 * scale }]}
    >
      {children}
    </Pressable>
  );
}

const styles = {
  circle: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: COLORS.white,
    borderColor: COLORS.oceanMid
  },
  capsule: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: COLORS.ocean,
    borderColor: COLORS.white
  }
};
