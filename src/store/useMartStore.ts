import { create } from 'zustand';
import { MART_CORNER_ORDER, MART_STAGE_STEPS } from '@/enums';
import type { MartCornerId, MartStageStep, MartWordStatus } from '@/enums';
import { getWordCorner, isCornerCompleted } from '@/data/martWords';

interface MartState {
  hasSeenPrologue: boolean;
  cornerStatus: Record<MartCornerId, MartWordStatus>;
  completedWords: ReadonlySet<string>;
  activeWord: string | null;
  stageStep: MartStageStep;
  seePrologue: () => void;
  startStage: (word: string) => void;
  advanceStep: () => void;
  goBackStep: () => void;
  completeStage: () => void;
}

const INITIAL_CORNER_STATUS: Record<MartCornerId, MartWordStatus> = {
  grocery: 'unlocked',
  household: 'locked',
  electronics: 'locked',
};

export const useMartStore = create<MartState>((set, get) => ({
  hasSeenPrologue: false,
  cornerStatus: INITIAL_CORNER_STATUS,
  completedWords: new Set(),
  activeWord: null,
  stageStep: 'problem',

  seePrologue: () => set({ hasSeenPrologue: true }),

  startStage: (word) => set({ activeWord: word, stageStep: 'problem' }),

  advanceStep: () => {
    const { stageStep } = get();
    const currentIndex = MART_STAGE_STEPS.indexOf(stageStep);
    const nextStep = MART_STAGE_STEPS[currentIndex + 1];
    if (nextStep) set({ stageStep: nextStep });
  },

  goBackStep: () => {
    const { stageStep } = get();
    const currentIndex = MART_STAGE_STEPS.indexOf(stageStep);
    if (currentIndex > 0) {
      const previousStep = MART_STAGE_STEPS[currentIndex - 1];
      set({ stageStep: previousStep });
    }
  },

  completeStage: () => {
    const { activeWord, completedWords, cornerStatus } = get();
    if (!activeWord) return;

    const nextCompleted = new Set(completedWords);
    nextCompleted.add(activeWord);

    const cornerId = getWordCorner(activeWord);
    const nextCornerStatus = { ...cornerStatus };

    if (isCornerCompleted(cornerId, nextCompleted)) {
      nextCornerStatus[cornerId] = 'completed';
      const cornerIndex = MART_CORNER_ORDER.indexOf(cornerId);
      const nextCorner = MART_CORNER_ORDER[cornerIndex + 1];
      if (nextCorner && nextCornerStatus[nextCorner] === 'locked') {
        nextCornerStatus[nextCorner] = 'unlocked';
      }
    }

    set({ completedWords: nextCompleted, cornerStatus: nextCornerStatus });
  },
}));
