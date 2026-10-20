export type Difficulty = 'easy' | 'medium' | 'hard';

export type PieceShape = 'rect' | 'circle' | 'semicircle';

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

export type Point = {
  x: number;
  y: number;
};

export type PartSpec = {
  id: string;
  shape: PieceShape;
  width: number;
  height: number;
  tone?: string;
  color?: string;
  slot: Point;
  chamfers?: Chamfers;
  overlapShape?: { shape: PieceShape; width: number; height: number };
  edges?: Partial<PieceEdges>;
  requires?: string;
  from: Difficulty;
  overlapShift?: Point;
};

export type Stage = {
  id: string;
  name: string;
  parts: PartSpec[];
  offsetX?: number;
};

export type Piece = {
  id: string;
  shape: PieceShape;
  width: number;
  height: number;
  tone: string;
  color: string;
  start: Point;
  slot: Point;
  edges: PieceEdges;
  chamfers: Chamfers;
  requires?: string;
  initialTurns: number;
  initialFlipped: boolean;
};

export type Puzzle = {
  stageId: string;
  stageName: string;
  difficulty: Difficulty;
  pieces: Piece[];
  silhouette: string;
};
