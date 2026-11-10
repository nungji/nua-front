import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStageRouter } from '@/hooks/useStageRouter';
import { FourPanelComic } from '@/components/mart/FourPanelComic';
import { MartTopBar } from '@/components/mart/MartTopBar';
import { useMartStore } from '@/store/useMartStore';

export default function MartPrologue() {
  const { go } = useStageRouter();
  const hasSeenPrologue = useMartStore((state) => state.hasSeenPrologue);
  const seePrologue = useMartStore((state) => state.seePrologue);

  if (hasSeenPrologue) {
    return <Redirect href="/games/mart/map" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title="상품표가 지워진 마트" />
      <FourPanelComic
        panels={[undefined, undefined, undefined, undefined]}
        onNext={() => {
          seePrologue();
          go('/games/mart/map');
        }}
      />
    </SafeAreaView>
  );
}
