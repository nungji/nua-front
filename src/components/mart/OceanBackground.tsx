import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image, StyleSheet, View } from 'react-native';

// Metro의 asset require()는 @/* 별칭을 해석하지 못하므로 상대 경로를 쓴다.
const OCEAN_BG = require('../../assets/mart/ocean-background.png');

interface OceanBackgroundProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** 마트 미니게임 재단장 화면 공통 배경: 바다 배경 이미지를 전체에 깔아준다. */
export function OceanBackground({ children, style }: OceanBackgroundProps) {
  return (
    <View style={[{ flex: 1 }, style]}>
      <Image source={OCEAN_BG} resizeMode="cover" style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
}
