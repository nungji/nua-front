export type PieceShape = 'rect' | 'circle';

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
  initialTurns: number;
  initialFlipped: boolean;
};

export const BOARD_WIDTH = 320;
export const BOARD_HEIGHT = 420;
export const PIECE_PAD = 14;
export const SNAP_RADIUS = 48;

export const FLAT_EDGES: PieceEdges = { top: [], right: [], bottom: [], left: [] };

export const SILHOUETTE_PATH =
  'M40,90 L70,90 L70,44 L96,44 L96,90 L170,90 L170,20 L240,20 L240,170 ' +
  'L235.93,170 A28,28 0 0 1 180.07,170 L125.93,170 A28,28 0 0 1 70.07,170 L40,170 Z';

export const PIECES: Piece[] = [
  {
    id: 'cab',
    shape: 'rect',
    width: 70,
    height: 70,
    color: '#2F6FED',
    tone: '#9FB4D6',
    startX: 20,
    startY: 345,
    slotX: 170,
    slotY: 20,
    edges: { top: [], right: [], bottom: [{ at: 35, kind: 'socket' }], left: [] },
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
    startY: 360,
    slotX: 70,
    slotY: 44,
    edges: { top: [], right: [], bottom: [{ at: 13, kind: 'socket' }], left: [] },
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
    startY: 262,
    slotX: 40,
    slotY: 90,
    edges: {
      top: [
        { at: 43, kind: 'tab' },
        { at: 165, kind: 'tab' }
      ],
      right: [],
      bottom: [],
      left: []
    },
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
    initialTurns: 3,
    initialFlipped: true
  }
];

export function edgesFor(piece: Piece, difficulty: Difficulty): PieceEdges {
  if (difficulty === 'hard') {
    return FLAT_EDGES;
  }

  if (difficulty === 'medium' && piece.id !== 'body') {
    return FLAT_EDGES;
  }

  return piece.edges;
}
