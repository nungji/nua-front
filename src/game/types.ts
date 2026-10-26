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
  slot: Point;
  chamfers?: Chamfers;
  requires?: string;
};

export type StageConfig = {
  id: number;
  name: string;
  parts: PartSpec[];
  slots: boolean;
  connectors: boolean;
  rotate: boolean;
  flip: boolean;
  dependency: boolean;
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

export type BoardSize = {
  width: number;
  height: number;
};

export type Puzzle = {
  stageId: number;
  stageName: string;
  pieces: Piece[];
  silhouette: string;
  slots: boolean;
  rotate: boolean;
  flip: boolean;
};
