import { Pressable, Text, View } from 'react-native';
import { getMartWordImage } from '@/data/martWordImages';
import { useMartSyllableSound } from '@/hooks/useMartWordSound';
import { OceanNextButton } from '../OceanCircleButton';
import { OceanProgressPill } from '../OceanDecor';
import { MartImagePlaceholder } from '../MartImagePlaceholder';

interface StageMeetWordProps {
  word: string;
  onNext: () => void;
}

// 뜻·소리 익히기 5단계(단어 만나기~소리 퀴즈~조립~정답) 중 첫 번째.
const STEP_INDEX = 0;
const STEP_COUNT = 5;

/** 누르면 그 음절의 소리가 나는 글자 칸. */
function SyllableTile({ syllable }: { syllable: string }) {
  const playSyllableSound = useMartSyllableSound(syllable);

  return (
    <Pressable
      onPress={playSyllableSound}
      style={{
        width: 120,
        height: 120,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.94)',
        borderWidth: 4,
        borderColor: '#BFE3FF',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 36, fontWeight: '800', color: '#1B3A6B' }}>{syllable}</Text>
    </Pressable>
  );
}

export function StageMeetWord({ word, onNext }: StageMeetWordProps) {
  const syllables = Array.from(word);

  return (
    <>
      <View style={{ paddingHorizontal: 14, paddingTop: 10 }}>
        <OceanProgressPill stepIndex={STEP_INDEX} stepCount={STEP_COUNT} />
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
        <View className="flex-row flex-wrap justify-center gap-4">
          {syllables.map((syllable, index) => (
            <SyllableTile key={index} syllable={syllable} />
          ))}
        </View>
        <OceanNextButton onPress={onNext} />
      </View>
    </>
  );
}
