import { create } from 'zustand';
import { MART_STAGE_STEPS, MART_WORD_ORDER } from '@/enums';
import type { MartStageStep, MartWordId, MartWordStatus } from '@/enums';

interface MartState {
  hasSeenPrologue: boolean;
  wordStatus: Record<MartWordId, MartWordStatus>;
  activeWord: MartWordId | null;
  stageStep: MartStageStep;
  collectedWords: MartWordId[];
  seePrologue: () => void;
  startStage: (word: MartWordId) => void;
  advanceStep: () => void;
  goBackStep: () => void;
  completeStage: () => void;
}

const INITIAL_WORD_STATUS: Record<MartWordId, MartWordStatus> = {
  milk: 'unlocked',
  cucumber: 'locked',
  grape: 'locked',
  tofu: 'locked',
  meat: 'locked',
};

export const useMartStore = create<MartState>((set, get) => ({
  hasSeenPrologue: false,
  wordStatus: INITIAL_WORD_STATUS,
  activeWord: null,
  stageStep: 'problem',
  collectedWords: [],

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
    const { activeWord, wordStatus, collectedWords } = get();
    if (!activeWord) return;

    const currentIndex = MART_WORD_ORDER.indexOf(activeWord);
    const nextWord = MART_WORD_ORDER[currentIndex + 1];
    const nextWordStatus: Record<MartWordId, MartWordStatus> = {
      ...wordStatus,
      [activeWord]: 'completed',
    };
    if (nextWord && nextWordStatus[nextWord] === 'locked') {
      nextWordStatus[nextWord] = 'unlocked';
    }

    set({
      wordStatus: nextWordStatus,
      collectedWords: collectedWords.includes(activeWord)
        ? collectedWords
        : [...collectedWords, activeWord],
    });
  },
}));
