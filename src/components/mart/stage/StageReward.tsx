import { Image, View } from 'react-native';
import { useStageRouter } from '@/hooks/useStageRouter';
import { getMartWordImage } from '@/data/martWordImages';
import { OceanBookButton, OceanHomeButton } from '../OceanCircleButton';
import { OceanBigStar } from '../OceanDecor';
import { MartWordCard } from '../MartWordCard';

interface StageRewardProps {
  word: string;
  cornerCleared: boolean;
}

const NUA_MASCOT = require('../../../assets/characters/mart.png');

export function StageReward({ word, cornerCleared }: StageRewardProps) {
  const { go, back } = useStageRouter();

  return (
    <View className="flex-1 items-center justify-between py-6">
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <OceanBigStar size={40} />
        <OceanBigStar size={48} />
        <OceanBigStar size={40} />
      </View>
      <MartWordCard label={word} imageSrc={getMartWordImage(word)} size={200} />
      {/* 화면 높이가 모자라면 마스코트가 줄어들어 아래 버튼이 잘리지 않게 한다. */}
      <Image source={NUA_MASCOT} resizeMode="contain" style={{ flexShrink: 1, width: 180, height: 180, maxHeight: 180, minHeight: 80 }} />
      <View style={{ flexDirection: 'row', gap: 24 }}>
        <OceanBookButton accessibilityLabel="단어장" onPress={() => go('/games/mart/wordbook')} />
        <OceanHomeButton
          onPress={() => (cornerCleared ? go('/games/mart/corner-clear') : back())}
        />
      </View>
    </View>
  );
}
