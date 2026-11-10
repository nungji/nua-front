import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStageRouter } from '@/hooks/useStageRouter';
import { MartImagePlaceholder } from '@/components/mart/MartImagePlaceholder';
import { MartRoundButton } from '@/components/mart/MartRoundButton';
import { MartTopBar } from '@/components/mart/MartTopBar';
import { getWordCorner, MART_CORNERS } from '@/data/martWords';
import { useMartStore } from '@/store/useMartStore';

export default function MartCornerClear() {
  const { go } = useStageRouter();
  const activeWord = useMartStore((state) => state.activeWord);
  const cornerId = activeWord ? getWordCorner(activeWord) : null;
  const corner = cornerId ? MART_CORNERS[cornerId] : null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title="코너 클리어" onBack={() => go('/games/mart/map')} />
      <View className="flex-1 items-center justify-between py-10">
        <Text className="text-2xl font-bold">{corner ? `${corner.title} 코너 완료!` : '코너 완료!'}</Text>
        <MartImagePlaceholder className="w-[220px] h-[220px] rounded-full" />
        <MartRoundButton variant="primary" icon="next" onPress={() => go('/games/mart/map')} />
      </View>
    </SafeAreaView>
  );
}
