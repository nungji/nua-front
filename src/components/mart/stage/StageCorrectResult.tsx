import { Image, Text, View } from 'react-native';
import { OceanNextButton } from '../OceanCircleButton';
import { OceanBigStar, OceanProgressPill } from '../OceanDecor';
import { FONT } from '@/theme';

interface StageCorrectResultProps {
  word: string;
  onNext: () => void;
}

// 뜻·소리 익히기 5단계 중 마지막("정답").
const STEP_INDEX = 4;
const STEP_COUNT = 5;

const NUA_MASCOT = require('../../../assets/mart/nua-mascot.png');

export function StageCorrectResult({ word, onNext }: StageCorrectResultProps) {
  return (
    <>
      <View style={{ paddingHorizontal: 14, paddingTop: 10 }}>
        <OceanProgressPill stepIndex={STEP_INDEX} stepCount={STEP_COUNT} />
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
          <Text style={{ fontSize: 34, fontFamily: FONT, color: '#1B3A6B' }}>{word}</Text>
        </View>

        {/* 화면 높이가 모자라면 마스코트가 줄어들어 아래 버튼이 잘리지 않게 한다. */}
        <Image source={NUA_MASCOT} resizeMode="contain" style={{ flexShrink: 1, width: 220, height: 220, maxHeight: 220, minHeight: 80 }} />

        <OceanNextButton onPress={onNext} />
      </View>
    </>
  );
}
