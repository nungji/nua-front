import { Text, View } from 'react-native';
import { getMartWordImage } from '@/data/martWordImages';
import { useMartWordSound } from '@/hooks/useMartWordSound';
import { OceanBackground } from '../OceanBackground';
import { OceanNextButton, OceanSoundButton } from '../OceanCircleButton';
import { OceanProgressPill } from '../OceanDecor';
import { MartImagePlaceholder } from '../MartImagePlaceholder';

interface StageMeetWordProps {
  word: string;
  onNext: () => void;
}

// 뜻·소리 익히기 6단계(단어 만나기~소리 퀴즈~조립~정답) 중 첫 번째.
const STEP_INDEX = 0;

export function StageMeetWord({ word, onNext }: StageMeetWordProps) {
  const playWordSound = useMartWordSound(word);

  return (
    <OceanBackground>
      <View style={{ paddingHorizontal: 14, paddingTop: 10 }}>
        <OceanProgressPill stepIndex={STEP_INDEX} />
      </View>
      <View className="flex-1 items-center justify-between py-6">
        <View
          style={{
            width: 350,
            height: 330,
            borderRadius: 32,
            backgroundColor: 'rgba(255,255,255,0.94)',
            borderWidth: 5,
            borderColor: '#BFE3FF',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MartImagePlaceholder imageSrc={getMartWordImage(word)} className="w-[300px] h-[230px] rounded-2xl" />
        </View>
        <View className="flex-row items-center gap-3">
          <Text className="text-4xl font-bold" style={{ color: '#1B3A6B' }}>
            {word}
          </Text>
          <OceanSoundButton onPress={playWordSound} />
        </View>
        <OceanNextButton onPress={onNext} />
      </View>
    </OceanBackground>
  );
}
