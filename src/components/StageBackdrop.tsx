import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { COLORS, withAlpha } from '@/theme';

type Props = {
  /** Darkens the scene so foreground UI stays readable. */
  dim?: number;
};

export function StageBackdrop({ dim = 0 }: Props) {
  const { width, height } = useWindowDimensions();

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
      {/* RN Web ignores percentage sizes on Image, so the frame is passed explicitly. */}
      <Image
        source={require('../assets/design/bg/ocean.png')}
        resizeMode="cover"
        style={{ position: 'absolute', left: 0, top: 0, width, height }}
      />
      {dim > 0 ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: withAlpha(COLORS.oceanDeep, dim) }]} />
      ) : null}
    </View>
  );
}
