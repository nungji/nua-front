export type Game = {
  id: string;
  title: string;
  accent: string;
  route: string;
};

export const GAMES: readonly Game[] = [
  { id: 'repairman', title: '\uc218\ub9ac\uacf5', accent: '#F05A28', route: '/games/repairman' },
  { id: 'general-store', title: '\ub9cc\ubb3c\uc0c1', accent: '#D6265C', route: '/games/general-store' },
  { id: 'lost-letters', title: '\uae00\uc790\uac00 \uc0ac\ub77c\uc9c4 \ub9c8\uc744', accent: '#7FE0C0', route: '/games/lost-letters' },
  { id: 'order', title: '\uc8fc\ubb38\uc11c', accent: '#FFD166', route: '/games/order' }
];

export function gameIndexById(id: string | undefined): number {
  return GAMES.findIndex((game) => game.id === id);
}
