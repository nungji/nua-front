export const ORDER_SIZES = [5, 4, 6, 7] as const;
export const SHELL_PACKS = [2, 3, 4, 6, 7, 1, 2, 3, 4] as const;
export const STOCK_SIZE = SHELL_PACKS.reduce<number>((sum, size) => sum + size, 0);
export const packShells = (pack: number): number[] => {
  if (!Number.isInteger(pack) || pack < 0 || pack >= SHELL_PACKS.length) return [];
  const start = SHELL_PACKS.slice(0, pack).reduce<number>((sum, size) => sum + size, 0);
  return Array.from({ length: SHELL_PACKS[pack] }, (_, i) => start + i);
};
export const CUSTOMER_COUNT = ORDER_SIZES.length;
export const REWARD = 3;

export type Correction = 'excess' | 'short' | null;
export type State = {
  screen: number;
  selected: number[];
  floor: number[][];
  completed: number;
  coins: number;
  correction: Correction;
};
/** Reward screens still show the order just completed, not the next customer's order. */
export const orderSize = (state: Pick<State, 'screen' | 'completed'>): number =>
  ORDER_SIZES[Math.min(ORDER_SIZES.length - 1, Math.max(0, state.completed - (state.screen >= 23 ? 1 : 0)))];

export type Action =
  | { type: 'advance'; fromScreen: number }
  | { type: 'stage-pack'; pack: number; slot: number }
  | { type: 'move-floor'; from: number; to: number }
  | { type: 'basket-floor'; slot: number }
  | { type: 'split-floor'; slot: number }
  | { type: 'return-floor'; slot: number }
  | { type: 'unbasket'; slot: number }
  | { type: 'counter' }
  | { type: 'shelf' }
  | { type: 'restart' };

export const emptyFloor = (): number[][] => Array.from({ length: 6 }, () => []);
export const initialState: State = { screen: 0, selected: [], floor: emptyFloor(), completed: 0, coins: 0, correction: null };
export const availablePack = (state: State, pack: number) => {
  const occupied = new Set([...state.selected, ...state.floor.flat()]);
  return packShells(pack).filter(id => !occupied.has(id));
};
const validSlot = (slot: number) => Number.isInteger(slot) && slot >= 0 && slot < 6;
export const isShelf = (screen: number) => [7, 8, 9, 10, 16, 17, 20, 21].includes(screen);
export const isSuccess = (screen: number) => [14, 18, 22].includes(screen);

function shelfScreen(count: number, correction: Correction, target: number) {
  if (count === target) return correction === 'excess' ? 17 : correction === 'short' ? 21 : 9;
  if (correction === 'excess') return 16;
  if (correction === 'short') return 20;
  return count === 0 ? 7 : count > target ? 10 : 8;
}

/** All rewards and quantities are driven by the game, never by presentation timers. */
export function gameReducer(state: State, action: Action): State {
  const target = orderSize(state);
  if (action.type === 'restart') return { ...initialState, selected: [], floor: emptyFloor() };
  if (action.type === 'stage-pack') {
    if (!isShelf(state.screen)) return state;
    const slot = action.slot;
    if (!validSlot(slot)) return state;
    const added = availablePack(state, action.pack);
    if (added.length === 0) return state;
    const floor = state.floor.map((group, i) => i === slot ? [...group, ...added] : group);
    return { ...state, floor };
  }
  if (['move-floor', 'basket-floor', 'split-floor', 'return-floor'].includes(action.type)) {
    if (!isShelf(state.screen)) return state;
    const slot = action.type === 'move-floor' ? action.from : 'slot' in action ? action.slot : -1;
    if (!validSlot(slot) || state.floor[slot].length === 0) return state;
    const floor = state.floor.map(group => [...group]);
    if (action.type === 'move-floor') {
      if (!validSlot(action.to) || action.to === slot) return state;
      floor[action.to].push(...floor[slot]);
      floor[slot] = [];
    } else if (action.type === 'basket-floor') {
      const selected = [...state.selected, ...floor[slot]];
      floor[slot] = [];
      return { ...state, floor, selected, screen: shelfScreen(selected.length, state.correction, target) };
    } else if (action.type === 'split-floor') {
      const empty = floor.findIndex(group => group.length === 0);
      if (floor[slot].length < 2 || empty < 0) return state;
      floor[empty] = [floor[slot].pop()!];
    } else {
      floor[slot] = [];
    }
    return { ...state, floor };
  }
  if (action.type === 'unbasket') {
    if (!isShelf(state.screen) || state.selected.length === 0 || !validSlot(action.slot)) return state;
    const floor = state.floor.map((group, i) => i === action.slot ? [...group, ...state.selected] : group);
    return { ...state, selected: [], floor, screen: shelfScreen(0, state.correction, target) };
  }
  if (action.type === 'counter') return isShelf(state.screen) && state.selected.length > 0 ? { ...state, screen: 11 } : state;
  if (action.type === 'shelf') {
    if (![12, 15, 19].includes(state.screen)) return state;
    const correction = state.screen === 15 ? 'excess' : state.screen === 19 ? 'short' : state.correction;
    return { ...state, correction, screen: shelfScreen(state.selected.length, correction, target) };
  }
  // Ignore callbacks from a screen that has already transitioned (double taps or queued timers).
  if (action.type !== 'advance' || action.fromScreen !== state.screen) return state;
  if (state.screen <= 6) return { ...state, screen: state.screen + 1 };
  if (state.screen === 11 || state.screen === 12) return { ...state, screen: state.screen + 1 };
  if (state.screen === 13) {
    const count = state.selected.length;
    const screen = count > target ? 15 : count < target ? 19 : state.correction === 'excess' ? 18 : state.correction === 'short' ? 22 : 14;
    return { ...state, screen };
  }
  if (isSuccess(state.screen)) return { ...state, screen: 23, completed: state.completed + 1, coins: state.coins + REWARD };
  if (state.screen === 23) return state.completed === CUSTOMER_COUNT ? { ...state, screen: 24 } : { ...state, screen: 0, selected: [], floor: emptyFloor(), correction: null };
  if (state.screen === 24) return { ...state, screen: 25 };
  return state;
}

export function transitionDelay(screen: number): number | null {
  if ([0, 1, 2].includes(screen)) return 1100;
  if ([3, 5, 6, 11].includes(screen)) return 650;
  if (screen === 13) return 900;
  if (isSuccess(screen)) return 1500;
  return null;
}
