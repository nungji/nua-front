import { Text, View } from 'react-native';
import type { MartWordConfig } from '@/data/martWords';
import { MartImagePlaceholder } from '../MartImagePlaceholder';
import { MartRoundButton } from '../MartRoundButton';

interface StageMeetWordProps {
  word: MartWordConfig;
  onNext: () => void;
}

export function StageMeetWord({ word, onNext }: StageMeetWordProps) {
  return (
    <View className="flex-1 items-center justify-between py-6">
      <MartImagePlaceholder imageSrc={word.imageSrc} className="w-[350px] h-[330px] rounded-2xl" />
      <View className="flex-row items-center gap-3">
        <Text className="text-4xl font-bold">{word.label}</Text>
        <MartRoundButton
          variant="small"
          icon="sound"
          onPress={() => {
            // TODO: 오디오 에셋 연결
          }}
        />
      </View>
      <MartRoundButton variant="primary" icon="next" onPress={onNext} />
    </View>
  );
}
