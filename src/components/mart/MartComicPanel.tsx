import { View } from 'react-native';
import { MartImagePlaceholder } from './MartImagePlaceholder';

interface MartComicPanelProps {
  imageSrc?: string;
}

export function MartComicPanel({ imageSrc }: MartComicPanelProps) {
  return (
    <View className="w-[171px] h-[280px] rounded-xl overflow-hidden border-2 border-gray-300">
      <MartImagePlaceholder imageSrc={imageSrc} className="flex-1" />
    </View>
  );
}
