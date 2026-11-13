import { ExampleIcon } from '@/components/icons/ExampleIcon';
import { RepairmanIcon } from '@/components/icons/RepairmanIcon';

import { ExampleScene } from './example';
import { RepairmanScene } from './repairman';
import type { Game } from './types';

export type { Game, GameSceneProps } from './types';

export const GAMES: readonly Game[] = [
  {
    id: 'example',
    title: '예제',
    accent: '#5AA9E6',
    route: '/games/example',
    Scene: ExampleScene,
    icon: ExampleIcon
  },
  {
    id: 'repairman',
    title: '수리공',
    accent: '#F05A28',
    route: '/games/repairman',
    Scene: RepairmanScene,
    icon: RepairmanIcon
  }
];

export function gameIndexById(id: string | undefined): number {
  return GAMES.findIndex((game) => game.id === id);
}
