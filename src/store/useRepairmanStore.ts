import { create } from 'zustand';

import { findStage, initialPieces, STAGES } from '@/game/stages';

type RepairmanState = {
  stageId: number;
  placed: Record<string, boolean>;
  turns: Record<string, number>;
  flipped: Record<string, boolean>;
  snaps: number;
  misses: number;
  openStage: (stageId: number) => void;
  reset: () => void;
  snap: (id: string) => void;
  unsnap: (id: string) => void;
  rotate: (id: string) => void;
  flip: (id: string) => void;
  miss: () => void;
};

function createSession(stageId: number) {
  const pieces = initialPieces(findStage(stageId));
  const placed: Record<string, boolean> = {};
  const turns: Record<string, number> = {};
  const flipped: Record<string, boolean> = {};

  for (const piece of pieces) {
    placed[piece.id] = false;
    turns[piece.id] = piece.initialTurns;
    flipped[piece.id] = piece.initialFlipped;
  }

  return { stageId, placed, turns, flipped, snaps: 0, misses: 0 };
}

export const useRepairmanStore = create<RepairmanState>((set, get) => ({
  ...createSession(STAGES[0].id),
  openStage: (stageId) => set(createSession(stageId)),
  reset: () => set(createSession(get().stageId)),
  snap: (id) =>
    set((state) => ({
      placed: { ...state.placed, [id]: true },
      snaps: state.snaps + 1
    })),
  unsnap: (id) =>
    set((state) => ({
      placed: { ...state.placed, [id]: false },
      snaps: Math.max(0, state.snaps - 1)
    })),
  rotate: (id) =>
    set((state) => ({
      turns: { ...state.turns, [id]: (state.turns[id] + 1) % 4 }
    })),
  flip: (id) =>
    set((state) => ({
      flipped: { ...state.flipped, [id]: !state.flipped[id] }
    })),
  miss: () => set((state) => ({ misses: state.misses + 1 }))
}));
