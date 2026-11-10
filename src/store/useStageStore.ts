import { create } from 'zustand';

import { CURTAIN_HOLD } from '@/stage';

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

  // called by the curtain animation once it stops, so the scene swaps while fully covered
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
    }, CURTAIN_HOLD);
  }
}));
