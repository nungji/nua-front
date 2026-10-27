import { router } from 'expo-router';

import { useStageStore } from '@/store/useStageStore';

/** Scene changes are always played behind the curtains; callers only pick the route. */
export function useStageRouter() {
  const enter = useStageStore((state) => state.enter);

  return {
    go: (route: string) => enter(() => router.push(route)),
    back: () =>
      enter(() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/');
        }
      })
  };
}
