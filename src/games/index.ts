import { ExampleScene } from './example';
import type { Game } from './types';

export type { Game, GameSceneProps } from './types';

export const GAMES: readonly Game[] = [
  { id: 'example', title: '예제', accent: '#F05A28', route: '/games/example', Scene: ExampleScene }
];

export function gameIndexById(id: string | undefined): number {
  return GAMES.findIndex((game) => game.id === id);
}
