import { View } from 'react-native';
import { useStageRouter } from '@/hooks/useStageRouter';
import type { MartWordConfig } from '@/data/martWords';
import { MartIcon } from '../MartIcon';
import { MartImagePlaceholder } from '../MartImagePlaceholder';
import { MartRoundButton } from '../MartRoundButton';
import { MartWordCard } from '../MartWordCard';

interface StageRewardProps {
  word: MartWordConfig;
}

export function StageReward({ word }: StageRewardProps) {
  const { go, back } = useStageRouter();

  return (
    <View className="flex-1 items-center justify-between py-6">
      <View className="flex-row gap-2">
        <MartIcon name="star" />
        <MartIcon name="star" />
        <MartIcon name="star" />
      </View>
      <MartWordCard label={word.label} imageSrc={word.imageSrc} />
      <MartImagePlaceholder className="w-[300px] h-[150px] rounded-2xl" />
      <View className="flex-row gap-4">
        <MartRoundButton variant="secondary" icon="book" onPress={() => go('/games/mart/wordbook')} />
        <MartRoundButton variant="primary" icon="home" onPress={back} />
      </View>
    </View>
  );
}
