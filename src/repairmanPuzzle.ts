export type PieceShape = 'rect' | 'circle';

export type PieceId = 'cab' | 'chimney' | 'body' | 'wheelLeft' | 'wheelRight';

export type Piece = {
  id: PieceId;
  shape: PieceShape;
  width: number;
  height: number;
  color: string;
  startX: number;
  startY: number;
  slotX: number;
  slotY: number;
};

export const BOARD_WIDTH = 320;
export const BOARD_HEIGHT = 450;
export const SNAP_RADIUS = 48;

export const PIECES: Piece[] = [
  {
    id: 'cab',
    shape: 'rect',
    width: 70,
    height: 70,
    color: '#2F6FED',
    startX: 20,
    startY: 370,
    slotX: 170,
    slotY: 20
  },
  {
    id: 'chimney',
    shape: 'rect',
    width: 26,
    height: 46,
    color: '#F05A28',
    startX: 110,
    startY: 385,
    slotX: 70,
    slotY: 44
  },
  {
    id: 'body',
    shape: 'rect',
    width: 200,
    height: 80,
    color: '#F05A28',
    startX: 60,
    startY: 272,
    slotX: 40,
    slotY: 90
  },
  {
    id: 'wheelLeft',
    shape: 'circle',
    width: 56,
    height: 56,
    color: '#3D3D4E',
    startX: 160,
    startY: 370,
    slotX: 70,
    slotY: 140
  },
  {
    id: 'wheelRight',
    shape: 'circle',
    width: 56,
    height: 56,
    color: '#3D3D4E',
    startX: 238,
    startY: 370,
    slotX: 180,
    slotY: 140
  }
];
