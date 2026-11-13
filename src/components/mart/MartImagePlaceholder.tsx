import { Image, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

interface MartImagePlaceholderProps {
  imageSrc?: ImageSourcePropType;
  className?: string;
}

export function MartImagePlaceholder({ imageSrc, className }: MartImagePlaceholderProps) {
  if (imageSrc) {
    return <Image source={imageSrc} className={className} resizeMode="cover" />;
  }
  return <View className={`bg-gray-300 ${className ?? ''}`} />;
}
