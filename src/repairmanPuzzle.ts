export type PieceShape = 'rect' | 'circle' | 'semicircle';

export type PieceId = 'cab' | 'chimney' | 'body' | 'wheelLeft' | 'wheelRight';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ConnectorKind = 'tab' | 'socket';

export type Connector = {
  at: number;
  kind: ConnectorKind;
};

export type PieceEdges = {
  top: Connector[];
  right: Connector[];
  bottom: Connector[];
  left: Connector[];
};

export type Chamfers = [number, number, number, number];

export type Piece = {
  id: PieceId;
  shape: PieceShape;
  width: number;
  height: number;
  color: string;
  tone: string;
  startX: number;
  startY: number;
  slotX: number;
  slotY: number;
  edges: PieceEdges;
  chamfers: Chamfers;
  initialTurns: number;
  initialFlipped: boolean;
};

export type Puzzle = {
  pieces: Piece[];
  silhouette: string;
};

export const BOARD_WIDTH = 320;
export const BOARD_HEIGHT = 420;
export const PIECE_PAD = 10;
export const SNAP_RADIUS = 48;

export const WHEEL_FLAT_CENTER = -45;
export const WHEEL_FLAT_HALF = 30;

export const FLAT_EDGES: PieceEdges = { top: [], right: [], bottom: [], left: [] };
export const NO_CHAMFERS: Chamfers = [0, 0, 0, 0];

const DISJOINT_SILHOUETTE =
  'M70,90 L70,54 L80,44 L96,44 L96,90 L170,90 L170,20 L218,20 L240,42 L240,170 ' +
  'L236,170 A28,28 0 0 1 180,170 L126,170 A28,28 0 0 1 70,170 ' +
  'L40,170 L40,120 Z';

const OVERLAP_SILHOUETTE =
  'M70,90 L70,54 L80,44 L96,44 L96,90 L170,90 L170,20 L218,20 L240,42 L240,170 ' +
  'L235.93,170 A28,28 0 0 1 180.07,170 L125.93,170 A28,28 0 0 1 70.07,170 ' +
  'L40,170 L40,120 Z';

const DISJOINT_PIECES: Piece[] = [
  {
    id: 'cab',
    shape: 'rect',
    width: 70,
    height: 70,
    color: '#2F6FED',
    tone: '#9FB4D6',
    startX: 20,
    startY: 336,
    slotX: 170,
    slotY: 20,
    edges: { top: [], right: [], bottom: [{ at: 35, kind: 'socket' }], left: [] },
    chamfers: [0, 22, 0, 0],
    initialTurns: 3,
    initialFlipped: false
  },
  {
    id: 'chimney',
    shape: 'rect',
    width: 26,
    height: 46,
    color: '#F05A28',
    tone: '#E3A9A0',
    startX: 110,
    startY: 350,
    slotX: 70,
    slotY: 44,
    edges: { top: [], right: [], bottom: [{ at: 13, kind: 'socket' }], left: [] },
    chamfers: [10, 0, 0, 0],
    initialTurns: 2,
    initialFlipped: true
  },
  {
    id: 'body',
    shape: 'rect',
    width: 200,
    height: 80,
    color: '#F05A28',
    tone: '#C9C2B6',
    startX: 60,
    startY: 248,
    slotX: 40,
    slotY: 90,
    edges: {
      top: [
        { at: 43, kind: 'tab' },
        { at: 165, kind: 'tab' }
      ],
      right: [],
      bottom: [
        { at: 32, kind: 'socket' },
        { at: 142, kind: 'socket' }
      ],
      left: []
    },
    chamfers: [30, 0, 0, 0],
    initialTurns: 1,
    initialFlipped: false
  },
  {
    id: 'wheelLeft',
    shape: 'semicircle',
    width: 56,
    height: 28,
    color: '#3D3D4E',
    tone: '#A3C2B0',
    startX: 160,
    startY: 350,
    slotX: 70,
    slotY: 170,
    edges: { top: [{ at: 28, kind: 'tab' }], right: [], bottom: [], left: [] },
    chamfers: NO_CHAMFERS,
    initialTurns: 1,
    initialFlipped: false
  },
  {
    id: 'wheelRight',
    shape: 'semicircle',
    width: 56,
    height: 28,
    color: '#3D3D4E',
    tone: '#B5AECD',
    startX: 238,
    startY: 350,
    slotX: 180,
    slotY: 170,
    edges: { top: [{ at: 28, kind: 'tab' }], right: [], bottom: [], left: [] },
    chamfers: NO_CHAMFERS,
    initialTurns: 3,
    initialFlipped: true
  }
];

const OVERLAP_PIECES: Piece[] = [
  {
    id: 'cab',
    shape: 'rect',
    width: 70,
    height: 70,
    color: '#2F6FED',
    tone: '#9FB4D6',
    startX: 20,
    startY: 348,
    slotX: 170,
    slotY: 20,
    edges: FLAT_EDGES,
    chamfers: [0, 22, 0, 0],
    initialTurns: 3,
    initialFlipped: false
  },
  {
    id: 'chimney',
    shape: 'rect',
    width: 26,
    height: 46,
    color: '#F05A28',
    tone: '#E3A9A0',
    startX: 110,
    startY: 358,
    slotX: 70,
    slotY: 44,
    edges: FLAT_EDGES,
    chamfers: [10, 0, 0, 0],
    initialTurns: 2,
    initialFlipped: true
  },
  {
    id: 'body',
    shape: 'rect',
    width: 200,
    height: 80,
    color: '#F05A28',
    tone: '#C9C2B6',
    startX: 60,
    startY: 250,
    slotX: 40,
    slotY: 90,
    edges: FLAT_EDGES,
    chamfers: [30, 0, 0, 0],
    initialTurns: 1,
    initialFlipped: false
  },
  {
    id: 'wheelLeft',
    shape: 'circle',
    width: 56,
    height: 56,
    color: '#3D3D4E',
    tone: '#A3C2B0',
    startX: 160,
    startY: 350,
    slotX: 70,
    slotY: 140,
    edges: FLAT_EDGES,
    chamfers: NO_CHAMFERS,
    initialTurns: 1,
    initialFlipped: false
  },
  {
    id: 'wheelRight',
    shape: 'circle',
    width: 56,
    height: 56,
    color: '#3D3D4E',
    tone: '#B5AECD',
    startX: 238,
    startY: 350,
    slotX: 180,
    slotY: 140,
    edges: FLAT_EDGES,
    chamfers: NO_CHAMFERS,
    initialTurns: 3,
    initialFlipped: true
  }
];

export const PUZZLES: Record<Difficulty, Puzzle> = {
  easy: { pieces: DISJOINT_PIECES, silhouette: DISJOINT_SILHOUETTE },
  medium: { pieces: DISJOINT_PIECES, silhouette: DISJOINT_SILHOUETTE },
  hard: { pieces: OVERLAP_PIECES, silhouette: OVERLAP_SILHOUETTE }
};

export function edgesFor(piece: Piece, difficulty: Difficulty): PieceEdges {
  if (difficulty !== 'easy') {
    return FLAT_EDGES;
  }

  return piece.edges;
}
