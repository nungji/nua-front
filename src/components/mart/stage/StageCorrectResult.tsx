import { Text, View } from 'react-native';
import { MartIcon } from '../MartIcon';
import { MartImagePlaceholder } from '../MartImagePlaceholder';
import { MartRoundButton } from '../MartRoundButton';

interface StageCorrectResultProps {
  word: string;
  onNext: () => void;
}

export function StageCorrectResult({ word, onNext }: StageCorrectResultProps) {
  return (
    <View className="flex-1 items-center justify-between py-6">
      <Text className="text-3xl font-bold">{word}</Text>
      <View className="flex-row gap-2">
        <MartIcon name="star" />
        <MartIcon name="star" />
        <MartIcon name="star" />
      </View>
      <MartImagePlaceholder className="w-[350px] h-[320px] rounded-2xl" />
      <MartRoundButton variant="primary" icon="next" onPress={onNext} />
    </View>
  );
}
