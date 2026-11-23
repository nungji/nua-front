import { router, usePathname } from 'expo-router';

import { SELECTOR_ROUTE } from '@/stage';
import { useStageStore } from '@/store/useStageStore';

/**
 * 비눗방울 전환은 셀렉터에서 게임을 고를 때만 재생한다. 게임 안에서의 화면 전환(지도→스테이지
 * 등)과 뒤로가기는 비눗방울 없이 바로 전환된다.
 */
export function useStageRouter() {
  const enter = useStageStore((state) => state.enter);
  const pathname = usePathname();

  return {
    go: (route: string) => {
      if (pathname === SELECTOR_ROUTE) {
        enter(() => router.push(route));
      } else {
        router.push(route);
      }
    },
    back: () => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    }
  };
}
