import { Redirect } from 'expo-router';

import type { GameSceneProps } from '../types';

/**
 * 마트는 하위 경로가 있는 게임이라 실제 화면은 `src/app/games/mart/`의 정적 라우트가 맡는다.
 * 이 Scene은 레지스트리 타입(`Game.Scene`)을 채우기 위한 자리일 뿐, 정적 라우트가 항상
 * 먼저 매칭되므로 실제로는 렌더되지 않는다.
 */
export function MartScene({ game }: GameSceneProps) {
  return <Redirect href={game.route} />;
}
