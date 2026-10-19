export type PieceShape = 'rect' | 'circle';

export type PieceId = 'cab' | 'chimney' | 'body' | 'wheelLeft' | 'wheelRight';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ConnectorKind = 'round' | 'square' | 'diamond';

export type Piece = {
  id: PieceId;
  shape: PieceShape;
  width: number;
  height: number;
  color: string;
  connector: ConnectorKind;
  startX: number;
  startY: number;
  slotX: number;
  slotY: number;
  initialTurns: number;
  initialFlipped: boolean;
};

export const BOARD_WIDTH = 320;
export const BOARD_HEIGHT = 420;
export const SNAP_RADIUS = 48;

export const ASSEMBLED_BOX = {
  x: 40,
  y: 20,
  width: 200,
  height: 176
};

export const PIECES: Piece[] = [
  {
    id: 'cab',
    shape: 'rect',
    width: 70,
    height: 70,
    color: '#2F6FED',
    connector: 'square',
    startX: 20,
    startY: 345,
    slotX: 170,
    slotY: 20,
    initialTurns: 3,
    initialFlipped: false
  },
  {
    id: 'chimney',
    shape: 'rect',
    width: 26,
    height: 46,
    color: '#F05A28',
    connector: 'round',
    startX: 110,
    startY: 360,
    slotX: 70,
    slotY: 44,
    initialTurns: 2,
    initialFlipped: true
  },
  {
    id: 'body',
    shape: 'rect',
    width: 200,
    height: 80,
    color: '#F05A28',
    connector: 'diamond',
    startX: 60,
    startY: 262,
    slotX: 40,
    slotY: 90,
    initialTurns: 1,
    initialFlipped: false
  },
  {
    id: 'wheelLeft',
    shape: 'circle',
    width: 56,
    height: 56,
    color: '#3D3D4E',
    connector: 'round',
    startX: 160,
    startY: 350,
    slotX: 70,
    slotY: 140,
    initialTurns: 1,
    initialFlipped: false
  },
  {
    id: 'wheelRight',
    shape: 'circle',
    width: 56,
    height: 56,
    color: '#3D3D4E',
    connector: 'square',
    startX: 238,
    startY: 350,
    slotX: 180,
    slotY: 140,
    initialTurns: 3,
    initialFlipped: true
  }
];
