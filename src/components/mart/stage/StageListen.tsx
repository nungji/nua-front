import { Pressable, Text, View } from 'react-native';
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
  // 음절별로 쪼갠 발음 파일은 아직 없어서, 글자를 눌러도 일단 단어 전체 발음이 나온다.
  // 음절별 파일이 생기면 음절 인덱스에 맞는 소리로 바꾸면 된다.
  const playWordSound = useMartWordSound(word);

  return (
    <View className="flex-1 items-center justify-between py-6">
      <MartImagePlaceholder imageSrc={getMartWordImage(word)} className="w-[220px] h-[160px] rounded-2xl" />
      <View className="flex-row flex-wrap justify-center gap-4">
        {syllables.map((syllable, index) => (
          <Pressable
            key={index}
            onPress={playWordSound}
            className="w-[120px] h-[120px] rounded-2xl bg-gray-100 items-center justify-center"
          >
            <Text className="text-4xl font-bold">{syllable}</Text>
          </Pressable>
        ))}
      </View>
      <MartRoundButton variant="primary" icon="next" onPress={onNext} />
    </View>
  );
}
