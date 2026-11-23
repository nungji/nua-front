import { MartIcon } from '@/components/icons/MartIcon';
import { RepairmanIcon } from '@/components/icons/RepairmanIcon';

import { DaisoScene, DaisoIcon } from './daiso';
import { FruitStoreScene } from './fruitstore';
import { MartScene } from './mart';
import { RepairmanScene } from './repairman';
import type { Game } from './types';
import { ShellIcon } from '@/components/icons/ShellIcon';

export type { Game, GameSceneProps } from './types';

export const GAMES: readonly Game[] = [
  { id: 'repairman', title: '수리공', accent: '#F05A28', route: '/games/repairman', Scene: RepairmanScene, icon: RepairmanIcon },
  { id: 'mart', title: '마트', accent: '#FB923C', route: '/games/mart', Scene: MartScene, icon: MartIcon },
  { id: 'fruitstore', title: '조개 상점', accent: '#2D8CF0', route: '/games/fruitstore', Scene: FruitStoreScene, icon: ShellIcon },
  { id: 'daiso', title: '만물상', accent: '#A17EE8', route: '/games/daiso', Scene: DaisoScene, icon: DaisoIcon }

];

export function gameIndexById(id: string | undefined): number {
  return GAMES.findIndex((game) => game.id === id);
}
