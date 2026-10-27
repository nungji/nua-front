import { create } from 'zustand';

import { CURTAIN_HOLD, StagePeek } from '@/stage';

type StagePhase = 'open' | 'closed';

type StageState = {
  phase: StagePhase;
  peek: StagePeek;
  pending: (() => void) | null;
  enter: (peek: StagePeek, action: () => void) => void;
  settle: (phase: StagePhase) => void;
};

export const useStageStore = create<StageState>((set, get) => ({
  phase: 'open',
  peek: 'selector',
  pending: null,

  enter: (peek, action) => {
    // already covered: swap the scene in place instead of waiting for another close
    if (get().phase === 'closed') {
      set({ peek, pending: null });
      action();
      return;
    }

    set({ phase: 'closed', peek, pending: action });
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
