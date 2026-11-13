import { Image, Text, View } from 'react-native';
import { OceanBackground } from '../OceanBackground';
import { OceanNextButton } from '../OceanCircleButton';
import { OceanBigStar, OceanProgressPill } from '../OceanDecor';

interface StageCorrectResultProps {
  word: string;
  onNext: () => void;
}

// 뜻·소리 익히기 6단계 중 마지막("정답").
const STEP_INDEX = 5;

const NUA_MASCOT = require('../../../assets/mart/nua-mascot.png');

export function StageCorrectResult({ word, onNext }: StageCorrectResultProps) {
  return (
    <OceanBackground>
      <View style={{ paddingHorizontal: 14, paddingTop: 10 }}>
        <OceanProgressPill stepIndex={STEP_INDEX} />
      </View>
      <View className="flex-1 items-center justify-between py-6">
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <OceanBigStar size={40} />
          <OceanBigStar size={48} />
          <OceanBigStar size={40} />
        </View>

        <View
          style={{
            borderRadius: 22,
            backgroundColor: 'white',
            borderWidth: 6,
            borderColor: '#FF8A1F',
            paddingVertical: 18,
            paddingHorizontal: 28,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 34, fontWeight: '800', color: '#1B3A6B' }}>{word}</Text>
        </View>

        <Image source={NUA_MASCOT} resizeMode="contain" style={{ width: 220, height: 220 }} />

        <OceanNextButton onPress={onNext} />
      </View>
    </OceanBackground>
  );
}
