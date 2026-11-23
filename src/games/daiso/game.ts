export type Item = 'bucket' | 'sock';
export type Phase = 'map' | 'story' | 'choose' | 'result' | 'complete';
export type State = { phase: Phase; page: number; item: Item | null; completed: boolean };
export type Action = { type: 'start' | 'next' | 'back' | 'map' | 'restart' } | { type: 'choose'; item: Item };
export const INITIAL: State = { phase: 'map', page: 0, item: null, completed: false };
export function transition(state: State, action: Action): State {
  switch (action.type) {
    case 'start': case 'restart': return { ...state, phase: 'story', page: 0, item: null };
    case 'map': return { ...state, phase: 'map', page: 0, item: null };
    case 'choose': return state.phase === 'choose' ? { ...state, phase: 'result', page: 0, item: action.item } : state;
    case 'back':
      if (state.phase === 'story' && state.page > 0) return { ...state, page: state.page - 1 };
      if (state.phase === 'choose') return { ...state, phase: 'story', page: 1 };
      if (state.phase === 'result') return { ...state, phase: 'choose', page: 0, item: null };
      return { ...state, phase: 'map', page: 0, item: null };
    case 'next':
      if (state.phase === 'story') return state.page === 0 ? { ...state, page: 1 } : { ...state, phase: 'choose', page: 0 };
      if (state.phase === 'result') {
        const last = state.item === 'bucket' ? 3 : 2;
        if (state.page < last) return { ...state, page: state.page + 1 };
        return state.item === 'bucket' ? { ...state, phase: 'complete', completed: true, page: 0 } : { ...state, phase: 'choose', page: 0, item: null };
      }
      return state;
  }
}
