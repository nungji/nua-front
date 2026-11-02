import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FourPanelComic } from '@/components/mart/FourPanelComic';
import { MartTopBar } from '@/components/mart/MartTopBar';

export default function MartEnding() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title="엔딩" onBack={() => router.replace('/mart/map')} />
      <FourPanelComic
        panels={[undefined, undefined, undefined, undefined]}
        onNext={() => router.replace('/mart/map')}
      />
    </SafeAreaView>
  );
}
