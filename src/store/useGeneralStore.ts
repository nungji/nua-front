import { create } from 'zustand';

type GeneralStoreState = {
  stageId: number;
  cleared: number[];
  misses: Record<number, number>;
  openStage: (stageId: number) => void;
  clearStage: (stageId: number) => void;
  reject: (stageId: number) => void;
  resetProgress: () => void;
};

/** Progress only. The in-scene flow (story → shelf → use → result) lives in PlayScreen. */
export const useGeneralStore = create<GeneralStoreState>((set) => ({
  stageId: 1,
  cleared: [],
  misses: {},

  openStage: (stageId) => set({ stageId }),

  clearStage: (stageId) =>
    set((state) => (state.cleared.includes(stageId) ? state : { cleared: [...state.cleared, stageId] })),

  reject: (stageId) =>
    set((state) => ({ misses: { ...state.misses, [stageId]: (state.misses[stageId] ?? 0) + 1 } })),

  resetProgress: () => set({ cleared: [], misses: {} })
}));
