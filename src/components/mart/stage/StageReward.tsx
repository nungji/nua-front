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

const NUA_MASCOT = require('../../../assets/mart/nua-mascot.png');

export function StageReward({ word, cornerCleared }: StageRewardProps) {
  const { go, back } = useStageRouter();

  return (
    <View className="flex-1 items-center justify-between py-6">
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <OceanBigStar size={40} />
        <OceanBigStar size={48} />
        <OceanBigStar size={40} />
      </View>
      <MartWordCard label={word} imageSrc={getMartWordImage(word)} />
      <Image source={NUA_MASCOT} resizeMode="contain" style={{ width: 180, height: 180 }} />
      <View style={{ flexDirection: 'row', gap: 24 }}>
        <OceanBookButton accessibilityLabel="단어장" onPress={() => go('/games/mart/wordbook')} />
        <OceanHomeButton
          onPress={() => (cornerCleared ? go('/games/mart/corner-clear') : back())}
        />
      </View>
    </View>
  );
}
