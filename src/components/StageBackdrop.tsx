import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

const STAGE_COLOR = '#0B1026';

export function StageBackdrop() {
  const { width, height } = useWindowDimensions();
  const size = Math.max(width, height) * 1.2;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: STAGE_COLOR }]}>
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', left: (width - size) / 2, top: (height - size) / 2 }}
      >
        <Defs>
          <RadialGradient id="spotlight" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#7C93DE" stopOpacity={0.5} />
            <Stop offset="0.45" stopColor="#35487F" stopOpacity={0.22} />
            <Stop offset="1" stopColor={STAGE_COLOR} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width={size} height={size} fill="url(#spotlight)" />
      </Svg>
    </View>
  );
}
