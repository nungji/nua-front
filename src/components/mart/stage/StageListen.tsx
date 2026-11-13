import { Text, View } from 'react-native';
import { getMartWordImage } from '@/data/martWordImages';
import { useMartWordSound } from '@/hooks/useMartWordSound';
import { MartImagePlaceholder } from '../MartImagePlaceholder';
import { MartRoundButton } from '../MartRoundButton';

interface StageListenProps {
  word: string;
  onNext: () => void;
}

export function StageListen({ word, onNext }: StageListenProps) {
  const syllables = Array.from(word);
  const playWordSound = useMartWordSound(word);

  return (
    <View className="flex-1 items-center justify-between py-6">
      <MartImagePlaceholder imageSrc={getMartWordImage(word)} className="w-[220px] h-[160px] rounded-2xl" />
      <View className="flex-row flex-wrap justify-center gap-4">
        {syllables.map((syllable, index) => (
          <View key={index} className="w-[120px] h-[120px] rounded-2xl bg-gray-100 items-center justify-center">
            <Text className="text-4xl font-bold">{syllable}</Text>
          </View>
        ))}
      </View>
      <MartRoundButton
        variant="secondary"
        icon="sound"
        onPress={playWordSound}
      />
      <MartRoundButton variant="primary" icon="next" onPress={onNext} />
    </View>
  );
}
