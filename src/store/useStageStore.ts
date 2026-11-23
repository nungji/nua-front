import { create } from 'zustand';

import { BUBBLE_HOLD_MS } from '@/stage';

type StagePhase = 'open' | 'closed';

type StageState = {
  phase: StagePhase;
  pending: (() => void) | null;
  enter: (action: () => void) => void;
  settle: (phase: StagePhase) => void;
};

export const useStageStore = create<StageState>((set, get) => ({
  phase: 'open',
  pending: null,

  enter: (action) => {
    // already covered: swap the scene in place instead of waiting for another close
    if (get().phase === 'closed') {
      set({ pending: null });
      action();
      return;
    }

    set({ phase: 'closed', pending: action });
  },

  // called by the bubble animation once the screen is covered, so the scene swaps unseen
  settle: (phase) => {
    if (phase !== 'closed' || get().phase !== 'closed') {
      return;
    }

    const pending = get().pending;
    set({ pending: null });
    pending?.();

    setTimeout(() => {
      if (get().phase === 'closed') {
        set({ phase: 'open' });
      }
    }, BUBBLE_HOLD_MS);
  }
}));
