import { ExampleScene } from './example';
import { MartScene } from './mart';
import type { Game } from './types';

export type { Game, GameSceneProps } from './types';

export const GAMES: readonly Game[] = [
  { id: 'example', title: '예제', accent: '#F05A28', route: '/games/example', Scene: ExampleScene },
  { id: 'mart', title: '마트', accent: '#FB923C', route: '/games/mart', Scene: MartScene }
];

export function gameIndexById(id: string | undefined): number {
  return GAMES.findIndex((game) => game.id === id);
}
