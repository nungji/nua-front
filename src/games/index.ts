import { GeneralStoreScene } from './general-store';
import { LostLettersScene } from './lost-letters';
import { OrderScene } from './order';
import { RepairmanScene } from './repairman';

export type { Game, GameSceneProps } from './types';

import type { Game } from './types';

export const GAMES: readonly Game[] = [
  { id: 'repairman', title: '수리공', accent: '#F05A28', route: '/games/repairman', Scene: RepairmanScene },
  { id: 'general-store', title: '만물상', accent: '#D6265C', route: '/games/general-store', Scene: GeneralStoreScene },
  { id: 'lost-letters', title: '글자가 사라진 마을', accent: '#7FE0C0', route: '/games/lost-letters', Scene: LostLettersScene },
  { id: 'order', title: '주문서', accent: '#FFD166', route: '/games/order', Scene: OrderScene }
];

export function gameIndexById(id: string | undefined): number {
  return GAMES.findIndex((game) => game.id === id);
}
