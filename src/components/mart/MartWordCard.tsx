import { Text, View } from 'react-native';
import { MartImagePlaceholder } from './MartImagePlaceholder';

interface MartWordCardProps {
  label: string;
  imageSrc?: string;
  locked?: boolean;
}

export function MartWordCard({ label, imageSrc, locked }: MartWordCardProps) {
  return (
    <View
      className={`w-[104px] h-[130px] rounded-2xl overflow-hidden bg-white border-2 border-gray-200 ${
        locked ? 'opacity-30' : ''
      }`}
    >
      <MartImagePlaceholder imageSrc={imageSrc} className="flex-1" />
      <Text className="text-center py-1 font-bold">{locked ? '?' : label}</Text>
    </View>
  );
}
