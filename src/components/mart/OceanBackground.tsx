import type { ReactNode } from 'react';
import type { ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { Image, View } from 'react-native';

// Metro의 asset require()는 @/* 별칭을 해석하지 못하므로 상대 경로를 쓴다.
const OCEAN_BG = require('../../assets/mart/ocean-background.png');

interface OceanBackgroundProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

/** 마트 미니게임 재단장 화면 공통 배경: 바다 배경 이미지를 전체에 깔아준다. */
export function OceanBackground({ children, style, imageStyle }: OceanBackgroundProps) {
  return (
    <View style={[{ flex: 1 }, style]}>
      {/* absoluteFill(top/bottom 0)만 쓰면 화면을 돌렸을 때 이미지 높이가 갱신되지 않아 아래가 비므로 크기를 명시한다. */}
      <Image
        source={OCEAN_BG}
        resizeMode="cover"
        style={[{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }, imageStyle]}
      />
      {children}
    </View>
  );
}
