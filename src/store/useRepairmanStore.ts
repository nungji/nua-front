import { create } from 'zustand';

import { PIECES, PieceId } from '@/repairmanPuzzle';

type RepairmanState = {
  placed: Record<PieceId, boolean>;
  snaps: number;
  misses: number;
  snap: (id: PieceId) => void;
  unsnap: (id: PieceId) => void;
  miss: () => void;
  reset: () => void;
};

const initialPlaced = PIECES.reduce<Record<PieceId, boolean>>(
  (accumulator, piece) => ({ ...accumulator, [piece.id]: false }),
  {} as Record<PieceId, boolean>
);

export const useRepairmanStore = create<RepairmanState>((set) => ({
  placed: initialPlaced,
  snaps: 0,
  misses: 0,
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
  miss: () => set((state) => ({ misses: state.misses + 1 })),
  reset: () => set({ placed: initialPlaced, snaps: 0, misses: 0 })
}));
