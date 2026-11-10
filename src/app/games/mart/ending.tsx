import { SafeAreaView } from 'react-native-safe-area-context';
import { useStageRouter } from '@/hooks/useStageRouter';
import { FourPanelComic } from '@/components/mart/FourPanelComic';
import { MartTopBar } from '@/components/mart/MartTopBar';

export default function MartEnding() {
  const { back } = useStageRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title="엔딩" />
      <FourPanelComic panels={[undefined, undefined, undefined, undefined]} onNext={back} />
    </SafeAreaView>
  );
}
