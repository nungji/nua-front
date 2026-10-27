import { router } from 'expo-router';

import { useStageStore } from '@/store/useStageStore';
import { StagePeek } from '@/stage';

export function useStageRouter() {
  const enter = useStageStore((state) => state.enter);

  return {
    go: (route: string, peek: StagePeek) => enter(peek, () => router.push(route)),
    back: (peek: StagePeek) =>
      enter(peek, () => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/');
        }
      })
  };
}
