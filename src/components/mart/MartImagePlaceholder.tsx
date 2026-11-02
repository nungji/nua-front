import { Image, View } from 'react-native';

interface MartImagePlaceholderProps {
  imageSrc?: string;
  className?: string;
}

export function MartImagePlaceholder({ imageSrc, className }: MartImagePlaceholderProps) {
  if (imageSrc) {
    return <Image source={{ uri: imageSrc }} className={className} resizeMode="cover" />;
  }
  return <View className={`bg-gray-300 ${className ?? ''}`} />;
}
