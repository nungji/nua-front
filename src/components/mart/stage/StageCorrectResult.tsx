import { Text, View } from 'react-native';
import type { MartWordConfig } from '@/data/martWords';
import { MartIcon } from '../MartIcon';
import { MartImagePlaceholder } from '../MartImagePlaceholder';
import { MartRoundButton } from '../MartRoundButton';

interface StageCorrectResultProps {
  word: MartWordConfig;
  onNext: () => void;
}

export function StageCorrectResult({ word, onNext }: StageCorrectResultProps) {
  return (
    <View className="flex-1 items-center justify-between py-6">
      <Text className="text-3xl font-bold">{word.label}</Text>
      <View className="flex-row gap-2">
        <MartIcon name="star" />
        <MartIcon name="star" />
        <MartIcon name="star" />
      </View>
      <MartImagePlaceholder imageSrc={word.imageSrc} className="w-[350px] h-[320px] rounded-2xl" />
      <MartRoundButton variant="primary" icon="next" onPress={onNext} />
    </View>
  );
}
