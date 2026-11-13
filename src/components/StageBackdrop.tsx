import { Image, StyleSheet, View } from 'react-native';

import { COLORS, withAlpha } from '@/theme';

type Props = {
  /** Darkens the scene so foreground UI stays readable. */
  dim?: number;
};

export function StageBackdrop({ dim = 0 }: Props) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image
        source={require('../assets/design/bg/ocean.png')}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />
      {dim > 0 ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: withAlpha(COLORS.oceanDeep, dim) }]} />
      ) : null}
    </View>
  );
}
