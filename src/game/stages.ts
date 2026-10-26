import { buildSilhouettePath } from './silhouette';
import { shiftedPolygon } from './shapes';
import {
  BoardSize,
  Chamfers,
  PartSpec,
  Piece,
  PieceEdges,
  Puzzle,
  StageConfig
} from './types';

export const PIECE_PAD = 10;

export function tiltFor(index: number) {
  return ((index * 37) % 9) - 4;
}
export const SNAP_RADIUS = 52;

const NO_CHAMFERS: Chamfers = [0, 0, 0, 0];

const TONES = ['#C9C2B6', '#9FB4D6', '#E3A9A0', '#A3C2B0', '#B5AECD', '#D8C89A', '#AEB7C4', '#CBB6C9', '#A9C6C6'];
const COLORS = ['#F05A28', '#2F6FED', '#E5553F', '#3D3D4E', '#6B4FA8', '#E0A400', '#2B7A5E', '#B03A6B', '#1F7A8C'];
const INITIAL_TURNS = [3, 2, 1, 2, 3, 1, 2, 3, 1];
const INITIAL_FLIPS = [true, false, false, true, false, false, true, false, true];

const FLOOR_MARGIN = 14;
const FLOOR_GAP = 8;

function box(
  id: string,
  width: number,
  height: number,
  x: number,
  y: number,
  chamfers: Chamfers = NO_CHAMFERS
): PartSpec {
  return { id, shape: 'rect', width, height, slot: { x, y }, chamfers };
}

function dome(id: string, diameter: number, x: number, y: number): PartSpec {
  return { id, shape: 'semicircle', width: diameter, height: diameter / 2, slot: { x, y } };
}

function disc(id: string, diameter: number, x: number, y: number): PartSpec {
  return { id, shape: 'circle', width: diameter, height: diameter, slot: { x, y } };
}

const CUP: PartSpec[] = [
  box('saucer', 96, 12, 0, 138, [8, 8, 0, 0]),
  box('cup', 64, 66, 16, 72, [0, 0, 14, 0]),
  box('lid', 64, 10, 16, 62, [10, 10, 0, 0]),
  box('handle', 22, 30, 80, 94, [0, 10, 10, 0])
];

const CHAIR: PartSpec[] = [
  box('rail', 84, 10, 8, 60, [6, 6, 0, 0]),
  box('back', 84, 50, 8, 70, [0, 0, 0, 0]),
  box('seat', 84, 14, 8, 120, [8, 0, 0, 0]),
  box('legLeft', 14, 46, 14, 134, [0, 0, 0, 4]),
  box('legRight', 14, 46, 72, 134, [0, 0, 4, 0])
];

const CAR: PartSpec[] = [
  box('cabin', 80, 46, 55, 74, [0, 18, 0, 0]),
  box('chassis', 170, 50, 15, 120, [16, 0, 0, 0]),
  box('bumper', 15, 20, 0, 140, [6, 0, 0, 0]),
  dome('wheelFront', 48, 35, 170),
  dome('wheelRear', 48, 117, 170)
];

const PLANE: PartSpec[] = [
  box('tail', 20, 40, 16, 70, [8, 0, 0, 0]),
  box('windshield', 24, 20, 50, 90, [0, 8, 0, 0]),
  box('fuselage', 190, 36, 10, 110, [0, 18, 0, 0]),
  box('wing', 120, 24, 45, 146, [12, 0, 0, 0]),
  dome('wheelLeft', 34, 60, 170),
  dome('wheelRight', 34, 130, 170)
];

const TRAIN: PartSpec[] = [
  box('chimney', 24, 42, 44, 58, [8, 0, 0, 0]),
  box('cab', 64, 64, 136, 36, [0, 22, 0, 0]),
  box('lamp', 20, 20, 96, 80, [6, 0, 0, 0]),
  box('body', 180, 70, 20, 100, [30, 0, 0, 0]),
  disc('wheelLeft', 52, 44, 144),
  disc('wheelRight', 52, 130, 144)
];

const DESK: PartSpec[] = [
  box('top', 160, 12, 10, 110, [12, 0, 0, 0]),
  box('legLeft', 12, 50, 10, 122, [0, 0, 0, 4]),
  box('drawer', 86, 30, 47, 122, [0, 0, 6, 0]),
  box('divider', 10, 30, 133, 122, [0, 0, 4, 0]),
  box('legRight', 12, 50, 158, 122, [0, 0, 4, 0]),
  box('shelf', 60, 8, 93, 152, [0, 6, 0, 0])
];

const ROBOT: PartSpec[] = [
  box('antenna', 8, 18, 61, 42, [0, 4, 0, 0]),
  box('head', 46, 40, 42, 60, [8, 8, 0, 0]),
  box('armLeft', 16, 50, 14, 106, [0, 0, 6, 0]),
  box('armRight', 16, 50, 100, 106, [0, 0, 0, 6]),
  box('torso', 70, 70, 30, 100, [0, 10, 0, 0]),
  box('legLeft', 20, 36, 38, 170, [0, 0, 0, 6]),
  box('legRight', 20, 36, 72, 170, [0, 0, 6, 0])
];

const TRUCK: PartSpec[] = [
  box('container', 120, 66, 0, 70, [10, 0, 0, 0]),
  box('exhaust', 10, 30, 124, 46, [0, 4, 0, 0]),
  box('cab', 60, 60, 120, 76, [0, 16, 0, 0]),
  box('chassis', 180, 16, 0, 136, [10, 0, 0, 0]),
  box('bumper', 16, 18, 180, 140, [0, 6, 0, 0]),
  disc('wheelFront', 44, 24, 120),
  disc('wheelMiddle', 44, 86, 120),
  disc('wheelRear', 44, 130, 120)
];

const HOUSE: PartSpec[] = [
  box('chimney', 22, 30, 96, 50, [0, 8, 0, 0]),
  box('roof', 140, 44, 10, 66, [30, 30, 0, 0]),
  box('wall', 120, 80, 20, 110, [16, 0, 0, 0]),
  box('fenceLeft', 30, 40, 0, 190, [0, 6, 0, 0]),
  box('door', 30, 40, 44, 190, [8, 0, 0, 0]),
  box('window', 26, 26, 96, 190, [0, 6, 0, 0]),
  box('fenceRight', 30, 40, 130, 190, [0, 0, 0, 6]),
  box('step', 40, 10, 39, 230, [0, 6, 0, 0])
];

const ROCKET: PartSpec[] = [
  box('antenna', 8, 20, 76, 24, [4, 0, 0, 0]),
  box('nose', 56, 36, 52, 44, [22, 22, 0, 0]),
  box('body', 56, 110, 52, 80, [0, 10, 0, 0]),
  box('boosterLeft', 20, 60, 32, 130, [0, 0, 8, 0]),
  box('boosterRight', 20, 60, 108, 130, [0, 0, 0, 8]),
  box('finLeft', 18, 46, 34, 144, [0, 0, 10, 0]),
  box('finRight', 18, 46, 108, 144, [0, 0, 0, 10]),
  box('window', 24, 24, 68, 96, [0, 8, 8, 0]),
  box('hatch', 26, 18, 67, 150, [0, 0, 0, 6])
];

export const STAGES: StageConfig[] = [
  { id: 1, name: '컵', parts: CUP, slots: true, connectors: true, rotate: false, flip: false, dependency: false },
  { id: 2, name: '의자', parts: CHAIR, slots: true, connectors: true, rotate: false, flip: false, dependency: false },
  { id: 3, name: '자동차', parts: CAR, slots: false, connectors: false, rotate: false, flip: false, dependency: false },
  { id: 4, name: '비행기', parts: PLANE, slots: false, connectors: false, rotate: false, flip: false, dependency: false },
  { id: 5, name: '기차', parts: TRAIN, slots: false, connectors: false, rotate: true, flip: false, dependency: false },
  { id: 6, name: '책상', parts: DESK, slots: false, connectors: false, rotate: true, flip: false, dependency: false },
  { id: 7, name: '로봇', parts: ROBOT, slots: false, connectors: false, rotate: false, flip: true, dependency: false },
  { id: 8, name: '트럭', parts: TRUCK, slots: false, connectors: false, rotate: false, flip: true, dependency: false },
  { id: 9, name: '집', parts: HOUSE, slots: false, connectors: false, rotate: true, flip: false, dependency: false },
  { id: 10, name: '우주선', parts: ROCKET, slots: false, connectors: false, rotate: true, flip: true, dependency: true }
];

function emptyEdges(): PieceEdges {
  return { top: [], right: [], bottom: [], left: [] };
}

function connectVertical(upper: Piece, lower: Piece) {
  const start = Math.max(upper.slot.x, lower.slot.x);
  const end = Math.min(upper.slot.x + upper.width, lower.slot.x + lower.width);

  if (end - start < 24) {
    return;
  }

  const centerX = (start + end) / 2;

  upper.edges.bottom.push({ at: upper.width - (centerX - upper.slot.x), kind: 'socket' });
  lower.edges.top.push({ at: centerX - lower.slot.x, kind: 'tab' });
}

function connectHorizontal(left: Piece, right: Piece) {
  const start = Math.max(left.slot.y, right.slot.y);
  const end = Math.min(left.slot.y + left.height, right.slot.y + right.height);

  if (end - start < 24) {
    return;
  }

  const centerY = (start + end) / 2;

  left.edges.right.push({ at: centerY - left.slot.y, kind: 'socket' });
  right.edges.left.push({ at: right.height - (centerY - right.slot.y), kind: 'tab' });
}

function autoEdges(pieces: Piece[]) {
  for (let i = 0; i < pieces.length; i += 1) {
    for (let j = i + 1; j < pieces.length; j += 1) {
      const first = pieces[i];
      const second = pieces[j];

      if (first.shape !== 'rect' || second.shape !== 'rect') {
        continue;
      }

      if (Math.abs(first.slot.y + first.height - second.slot.y) < 0.5) {
        connectVertical(first, second);
      } else if (Math.abs(second.slot.y + second.height - first.slot.y) < 0.5) {
        connectVertical(second, first);
      }

      if (Math.abs(first.slot.x + first.width - second.slot.x) < 0.5) {
        connectHorizontal(first, second);
      } else if (Math.abs(second.slot.x + second.width - first.slot.x) < 0.5) {
        connectHorizontal(second, first);
      }
    }
  }
}

function layoutScatter(pieces: Piece[], size: BoardSize, floorTop: number) {
  const ordered = [...pieces].sort(
    (left, right) => right.height - left.height || right.width - left.width
  );
  const right = size.width - FLOOR_MARGIN;
  let cursorX = FLOOR_MARGIN;
  let cursorY = floorTop;
  let rowHeight = 0;

  for (const piece of ordered) {
    if (cursorX + piece.width > right) {
      cursorX = FLOOR_MARGIN;
      cursorY += rowHeight + FLOOR_GAP;
      rowHeight = 0;
    }

    piece.start = { x: cursorX, y: cursorY };
    cursorX += piece.width + FLOOR_GAP;
    rowHeight = Math.max(rowHeight, piece.height);
  }
}

export function initialPieces(stage: StageConfig) {
  return stage.parts.map((part, index) => ({
    id: part.id,
    initialTurns: stage.rotate ? INITIAL_TURNS[index % INITIAL_TURNS.length] : 0,
    initialFlipped: stage.flip ? INITIAL_FLIPS[index % INITIAL_FLIPS.length] : false
  }));
}

export function stageHint(stage: StageConfig) {
  const features: string[] = [];

  if (stage.connectors) {
    features.push('연결부');
  }

  if (!stage.slots) {
    features.push('실루엣');
  }

  if (stage.rotate) {
    features.push('회전');
  }

  if (stage.flip) {
    features.push('뒤집기');
  }

  if (stage.dependency) {
    features.push('부품 의존');
  }

  return features.join(' · ');
}

export function findStage(stageId: number) {
  return STAGES.find((stage) => stage.id === stageId) ?? STAGES[0];
}

export function buildPuzzle(stage: StageConfig, size: BoardSize): Puzzle {
  const parts = stage.parts;
  const minX = Math.min(...parts.map((part) => part.slot.x));
  const maxX = Math.max(...parts.map((part) => part.slot.x + part.width));
  const shiftX = (size.width - (maxX - minX)) / 2 - minX;

  const pieces: Piece[] = parts.map((part, index) => ({
    id: part.id,
    shape: part.shape,
    width: part.width,
    height: part.height,
    tone: TONES[index % TONES.length],
    color: COLORS[index % COLORS.length],
    start: { x: 0, y: 0 },
    slot: { x: part.slot.x + shiftX, y: part.slot.y },
    edges: emptyEdges(),
    chamfers: part.chamfers ?? NO_CHAMFERS,
    requires: stage.dependency ? part.requires : undefined,
    initialTurns: stage.rotate ? INITIAL_TURNS[index % INITIAL_TURNS.length] : 0,
    initialFlipped: stage.flip ? INITIAL_FLIPS[index % INITIAL_FLIPS.length] : false
  }));

  if (stage.connectors) {
    autoEdges(pieces);
  }

  const objectBottom = Math.max(...pieces.map((piece) => piece.slot.y + piece.height));
  layoutScatter(pieces, size, objectBottom + 34);

  return {
    stageId: stage.id,
    stageName: stage.name,
    pieces,
    silhouette: buildSilhouettePath(pieces.map(shiftedPolygon)),
    slots: stage.slots,
    rotate: stage.rotate,
    flip: stage.flip
  };
}

export const FLAT_EDGES: PieceEdges = { top: [], right: [], bottom: [], left: [] };
