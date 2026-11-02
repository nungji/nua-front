import { Text, View } from 'react-native';
import type { MartWordConfig } from '@/data/martWords';
import { MartImagePlaceholder } from '../MartImagePlaceholder';
import { MartRoundButton } from '../MartRoundButton';

interface StageListenProps {
  word: MartWordConfig;
  onNext: () => void;
}

export function StageListen({ word, onNext }: StageListenProps) {
  return (
    <View className="flex-1 items-center justify-between py-6">
      <MartImagePlaceholder imageSrc={word.imageSrc} className="w-[220px] h-[160px] rounded-2xl" />
      <View className="flex-row gap-4">
        {word.syllables.map((syllable, index) => (
          <View key={index} className="w-[120px] h-[120px] rounded-2xl bg-gray-100 items-center justify-center">
            <Text className="text-4xl font-bold">{syllable}</Text>
          </View>
        ))}
      </View>
      <MartRoundButton
        variant="secondary"
        icon="sound"
        onPress={() => {
          // TODO: 오디오 에셋 연결
        }}
      />
      <MartRoundButton variant="primary" icon="next" onPress={onNext} />
    </View>
  );
}
