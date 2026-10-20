import { create } from 'zustand';

import { buildPuzzle, STAGES } from '@/game/stages';
import { Difficulty, Piece } from '@/game/types';

type RepairmanState = {
  stageId: string;
  difficulty: Difficulty;
  placed: Record<string, boolean>;
  turns: Record<string, number>;
  flipped: Record<string, boolean>;
  snaps: number;
  misses: number;
  openStage: (stageId: string) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  reset: () => void;
  snap: (id: string) => void;
  unsnap: (id: string) => void;
  rotate: (id: string) => void;
  flip: (id: string) => void;
  miss: () => void;
};

function fill<T>(pieces: Piece[], pick: (piece: Piece) => T): Record<string, T> {
  return pieces.reduce<Record<string, T>>(
    (accumulator, piece) => ({ ...accumulator, [piece.id]: pick(piece) }),
    {} as Record<string, T>
  );
}

function createSession(stageId: string, difficulty: Difficulty) {
  const { pieces } = buildPuzzle(stageId, difficulty);

  return {
    stageId,
    difficulty,
    placed: fill(pieces, () => false),
    turns: fill(pieces, (piece) => piece.initialTurns),
    flipped: fill(pieces, (piece) => piece.initialFlipped),
    snaps: 0,
    misses: 0
  };
}

export const useRepairmanStore = create<RepairmanState>((set, get) => ({
  ...createSession(STAGES[0].id, 'easy'),
  openStage: (stageId) => set(createSession(stageId, 'easy')),
  setDifficulty: (difficulty) => set(createSession(get().stageId, difficulty)),
  reset: () => set(createSession(get().stageId, get().difficulty)),
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
