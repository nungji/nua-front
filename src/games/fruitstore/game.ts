export const ORDER_SIZE = 5;
export const STOCK_SIZE = 11;
export const CUSTOMER_COUNT = 4;
export const REWARD = 3;

export type Correction = 'excess' | 'short' | null;
export type State = {
  screen: number;
  selected: number[];
  completed: number;
  coins: number;
  correction: Correction;
};
export type Action =
  | { type: 'advance' }
  | { type: 'pick'; fruit: number }
  | { type: 'remove' }
  | { type: 'counter' }
  | { type: 'shelf' }
  | { type: 'restart' };

export const initialState: State = { screen: 0, selected: [], completed: 0, coins: 0, correction: null };
export const isShelf = (screen: number) => [7, 8, 9, 10, 16, 17, 20, 21].includes(screen);
export const isSuccess = (screen: number) => [14, 18, 22].includes(screen);

function shelfScreen(count: number, correction: Correction) {
  if (count === ORDER_SIZE) return correction === 'excess' ? 17 : correction === 'short' ? 21 : 9;
  if (correction === 'excess') return 16;
  if (correction === 'short') return 20;
  return count === 0 ? 7 : count > ORDER_SIZE ? 10 : 8;
}

/** All rewards and quantities are driven by the game, never by presentation timers. */
export function gameReducer(state: State, action: Action): State {
  if (action.type === 'restart') return { ...initialState, selected: [] };
  if (action.type === 'pick') {
    if (!isShelf(state.screen) || !Number.isInteger(action.fruit) || action.fruit < 0 || action.fruit >= STOCK_SIZE || state.selected.includes(action.fruit)) return state;
    const selected = [...state.selected, action.fruit];
    return { ...state, selected, screen: shelfScreen(selected.length, state.correction) };
  }
  if (action.type === 'remove') {
    if (!isShelf(state.screen) || state.selected.length === 0) return state;
    const selected = state.selected.slice(0, -1);
    return { ...state, selected, screen: shelfScreen(selected.length, state.correction) };
  }
  if (action.type === 'counter') return isShelf(state.screen) && state.selected.length > 0 ? { ...state, screen: 11 } : state;
  if (action.type === 'shelf') {
    if (![12, 15, 19].includes(state.screen)) return state;
    const correction = state.screen === 15 ? 'excess' : state.screen === 19 ? 'short' : state.correction;
    return { ...state, correction, screen: shelfScreen(state.selected.length, correction) };
  }
  if (action.type !== 'advance') return state;
  if (state.screen <= 6) return { ...state, screen: state.screen + 1 };
  if (state.screen === 11 || state.screen === 12) return { ...state, screen: state.screen + 1 };
  if (state.screen === 13) {
    const count = state.selected.length;
    const screen = count > ORDER_SIZE ? 15 : count < ORDER_SIZE ? 19 : state.correction === 'excess' ? 18 : state.correction === 'short' ? 22 : 14;
    return { ...state, screen };
  }
  if (isSuccess(state.screen)) return { ...state, screen: 23, completed: state.completed + 1, coins: state.coins + REWARD };
  if (state.screen === 23) return state.completed === CUSTOMER_COUNT ? { ...state, screen: 24 } : { ...state, screen: 0, selected: [], correction: null };
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
