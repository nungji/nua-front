import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStageRouter } from '@/hooks/useStageRouter';
import { OceanBackground } from '@/components/mart/OceanBackground';
import { OceanBookButton } from '@/components/mart/OceanCircleButton';
import { OceanCornerCard } from '@/components/mart/OceanCornerCard';
import { OceanTopBar } from '@/components/mart/OceanTopBar';
import { getCornerWords, MART_CORNERS } from '@/data/martWords';
import { MART_CORNER_ORDER } from '@/enums';
import { useMartStore } from '@/store/useMartStore';

const NUA_MASCOT = require('../../../assets/mart/nua-mascot.png');

export default function MartMap() {
  const { go } = useStageRouter();
  const cornerStatus = useMartStore((state) => state.cornerStatus);
  const completedWords = useMartStore((state) => state.completedWords);

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <OceanBackground>
        <OceanTopBar title="바다 마트" onPressWordbook={() => go('/games/mart/wordbook')} />
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8, gap: 14, alignItems: 'center' }}>
          {MART_CORNER_ORDER.map((cornerId) => {
            const corner = MART_CORNERS[cornerId];
            const status = cornerStatus[cornerId];
            const words = getCornerWords(cornerId);
            const doneCount = words.filter((word) => completedWords.has(word)).length;
            const progress = words.length > 0 ? doneCount / words.length : 0;

            return (
              <OceanCornerCard
                key={cornerId}
                cornerId={cornerId}
                title={corner.title}
                variant="full"
                status={status}
                progress={progress}
                onPress={status === 'locked' ? undefined : () => go(`/games/mart/corner/${cornerId}`)}
              />
            );
          })}
        </View>
        <Image
          source={NUA_MASCOT}
          resizeMode="contain"
          style={{ position: 'absolute', left: 14, bottom: 14, width: 100, height: 100 }}
        />
        <View style={{ alignItems: 'center', paddingBottom: 18 }}>
          <OceanBookButton
            displaySize={78}
            accessibilityLabel="단어장 (크게)"
            onPress={() => go('/games/mart/wordbook')}
          />
        </View>
      </OceanBackground>
    </SafeAreaView>
  );
}
