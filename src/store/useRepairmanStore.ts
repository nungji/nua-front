import { create } from 'zustand';

import { Difficulty, PIECES, Piece, PieceId } from '@/repairmanPuzzle';

type RepairmanState = {
  difficulty: Difficulty;
  placed: Record<PieceId, boolean>;
  turns: Record<PieceId, number>;
  flipped: Record<PieceId, boolean>;
  snaps: number;
  misses: number;
  setDifficulty: (difficulty: Difficulty) => void;
  snap: (id: PieceId) => void;
  unsnap: (id: PieceId) => void;
  rotate: (id: PieceId) => void;
  flip: (id: PieceId) => void;
  miss: () => void;
  reset: () => void;
};

function fill<T>(pick: (piece: Piece) => T): Record<PieceId, T> {
  return PIECES.reduce<Record<PieceId, T>>(
    (accumulator, piece) => ({ ...accumulator, [piece.id]: pick(piece) }),
    {} as Record<PieceId, T>
  );
}

function createBoard(difficulty: Difficulty) {
  return {
    placed: fill(() => false),
    turns: fill((piece) => (difficulty === 'hard' ? piece.initialTurns : 0)),
    flipped: fill((piece) => (difficulty === 'hard' ? piece.initialFlipped : false)),
    snaps: 0,
    misses: 0
  };
}

export const useRepairmanStore = create<RepairmanState>((set, get) => ({
  difficulty: 'easy',
  ...createBoard('easy'),
  setDifficulty: (difficulty) => set({ difficulty, ...createBoard(difficulty) }),
  reset: () => set(createBoard(get().difficulty)),
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
