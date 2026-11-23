import { Image, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { COLORS, FONT, SHADOW } from '@/theme';

interface MartWordCardProps {
  label: string;
  imageSrc?: ImageSourcePropType;
  locked?: boolean;
  /** 카드 너비(px). 높이는 너비에 맞춰 정해진다. */
  size?: number;
}

export function MartWordCard({ label, imageSrc, locked, size = 104 }: MartWordCardProps) {
  const imageSize = size * 0.72;

  return (
    <View
      style={[
        SHADOW.card,
        {
          width: size,
          height: size * 1.25,
          borderRadius: size * 0.2,
          backgroundColor: COLORS.white,
          borderWidth: 3,
          borderColor: COLORS.foam,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: locked ? 0.35 : 1,
        },
      ]}
    >
      {imageSrc ? (
        // 이미지 크기를 명시하지 않으면 원본 크기로 그려져 카드 밖으로 잘린다.
        <Image source={imageSrc} resizeMode="contain" style={{ width: imageSize, height: imageSize }} />
      ) : (
        <View style={{ width: imageSize, height: imageSize, borderRadius: 12, backgroundColor: '#D7E3F2' }} />
      )}
      <Text numberOfLines={1} style={{ fontFamily: FONT, fontSize: size * 0.16, color: '#1B3A6B', marginTop: size * 0.04 }}>
        {locked ? '?' : label}
      </Text>
    </View>
  );
}
