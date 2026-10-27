import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FourPanelComic } from '@/components/mart/FourPanelComic';
import { MartTopBar } from '@/components/mart/MartTopBar';
import { useMartStore } from '@/store/useMartStore';

export default function MartPrologue() {
  const router = useRouter();
  const hasSeenPrologue = useMartStore((state) => state.hasSeenPrologue);
  const seePrologue = useMartStore((state) => state.seePrologue);

  useEffect(() => {
    if (hasSeenPrologue) {
      router.replace('/mart/map');
    }
  }, [hasSeenPrologue, router]);

  if (hasSeenPrologue) return null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title="상품표가 지워진 마트" />
      <FourPanelComic
        panels={[undefined, undefined, undefined, undefined]}
        onNext={() => {
          seePrologue();
          router.replace('/mart/map');
        }}
      />
    </SafeAreaView>
  );
}
