import { buildSilhouettePath } from './silhouette';
import { SHAPES, ShapeId } from './shapeset';
import { piecePolygon, shiftedPolygon } from './shapes';
import {
  BoardSize,
  Chamfers,
  PartSpec,
  Pedestal,
  Piece,
  PieceEdges,
  Puzzle,
  StageConfig
} from './types';

export const PIECE_PAD = 10;
export const SNAP_RADIUS = 56;
export const PEDESTAL_HEIGHT = 26;

const TONES = ['#C9C2B6', '#9FB4D6', '#E3A9A0', '#A3C2B0', '#B5AECD', '#D8C89A', '#AEB7C4', '#CBB6C9', '#A9C6C6'];
const COLORS = ['#F05A28', '#2F6FED', '#E5553F', '#3D3D4E', '#6B4FA8', '#E0A400', '#2B7A5E', '#B03A6B', '#1F7A8C'];
const INITIAL_TURNS = [3, 2, 1, 2, 3, 1, 2, 3, 1];
const INITIAL_FLIPS = [true, false, false, true, false, false, true, false, true];

const FLOOR_MARGIN = 10;
const FLOOR_GAP = 7;
const TOP_MARGIN = 8;

function part(id: string, shape: ShapeId, x: number, y: number): PartSpec {
  return { id, shape, slot: { x, y } };
}

const BOOK: PartSpec[] = [
  part('cover', 'bookCover', 0, 60),
  part('spine', 'bookSpine', 0, 70),
  part('pages', 'bookPages', 10, 70)
];

const CUP: PartSpec[] = [
  part('lid', 'cupLid', 16, 66),
  part('cup', 'cupBody', 16, 76),
  part('handle', 'cupHandle', 80, 94),
  part('saucer', 'cupSaucer', 0, 138)
];

const CHAIR: PartSpec[] = [
  part('rail', 'chairRail', 8, 60),
  part('back', 'chairBack', 8, 70),
  part('seat', 'chairSeat', 8, 120),
  part('legLeft', 'chairLegLeft', 14, 134),
  part('legRight', 'chairLegRight', 72, 134)
];

const DOOR: PartSpec[] = [
  part('lintel', 'doorLintel', 0, 50),
  part('trimLeft', 'doorTrimLeft', 0, 62),
  part('panel', 'doorPanel', 10, 62),
  part('trimRight', 'doorTrimRight', 80, 62),
  part('sill', 'doorSill', 0, 152)
];

const PENCIL: PartSpec[] = [
  part('tip', 'pencilTip', 0, 60),
  part('body', 'pencilBody', 22, 60),
  part('eraser', 'pencilEraser', 130, 61)
];

const CAR: PartSpec[] = [
  part('cabin', 'carCabin', 50, 76),
  part('chassis', 'carChassis', 15, 120),
  part('bumper', 'carBumper', 1, 140),
  part('wheelFront', 'carWheelFront', 30, 166),
  part('wheelRear', 'carWheelRear', 110, 166)
];

const PLANE: PartSpec[] = [
  part('tail', 'planeTail', 14, 72),
  part('windshield', 'planeWindshield', 46, 92),
  part('fuselage', 'planeFuselage', 8, 110),
  part('wing', 'planeWing', 40, 144),
  part('wheelMain', 'planeWheelMain', 52, 166),
  part('wheelNose', 'planeWheelNose', 118, 169)
];

const TRAIN: PartSpec[] = [
  part('chimney', 'trainChimney', 38, 60),
  part('cab', 'trainCab', 120, 40),
  part('body', 'trainBody', 16, 100),
  part('wheelLeft', 'trainWheelLeft', 38, 142),
  part('wheelRight', 'trainWheelRight', 116, 144)
];

const DESK: PartSpec[] = [
  part('top', 'deskTop', 5, 110),
  part('legLeft', 'deskLegLeft', 5, 122),
  part('drawer', 'deskDrawer', 40, 122),
  part('divider', 'deskDivider', 122, 122),
  part('legRight', 'deskLegRight', 146, 122),
  part('shelf', 'deskShelf', 84, 150)
];

const ROBOT: PartSpec[] = [
  part('antenna', 'robotAntenna', 56, 44),
  part('head', 'robotHead', 40, 60),
  part('armLeft', 'robotArmLeft', 14, 104),
  part('armRight', 'robotArmRight', 94, 104),
  part('torso', 'robotTorso', 28, 100),
  part('legLeft', 'robotLegLeft', 34, 166),
  part('legRight', 'robotLegRight', 68, 166)
];

const CLOCK: PartSpec[] = [
  part('knob', 'clockKnob', 64, 38),
  part('face', 'clockFace', 25, 44),
  part('pendulum', 'clockPendulum', 68, 138),
  part('base', 'clockBase', 35, 172)
];

const TRUCK: PartSpec[] = [
  part('container', 'truckContainer', 0, 74),
  part('cab', 'truckCab', 108, 80),
  part('chassis', 'truckChassis', 0, 136),
  part('wheelFront', 'truckWheelFront', 22, 120),
  part('wheelMiddle', 'truckWheelMiddle', 78, 122),
  part('wheelRear', 'truckWheelRear', 120, 124)
];

const HOUSE: PartSpec[] = [
  part('chimney', 'houseChimney', 84, 54),
  part('roof', 'houseRoof', 10, 70),
  part('wall', 'houseWall', 20, 112),
  part('fenceLeft', 'houseFenceLeft', 0, 186),
  part('door', 'houseDoor', 40, 186),
  part('window', 'houseWindow', 88, 186),
  part('fenceRight', 'houseFenceRight', 120, 186)
];

const FAN: PartSpec[] = [
  part('head', 'fanHead', 43, 54),
  part('pole', 'fanPole', 69, 118),
  part('button', 'fanButton', 50, 170),
  part('base', 'fanBase', 37, 178)
];

const BED: PartSpec[] = [
  part('headboard', 'bedHeadboard', 0, 96),
  part('blanket', 'bedBlanket', 72, 114),
  part('pillow', 'bedPillow', 26, 118),
  part('mattress', 'bedMattress', 22, 134),
  part('legLeft', 'bedLegLeft', 30, 162),
  part('legRight', 'bedLegRight', 128, 162)
];

const ROCKET: PartSpec[] = [
  part('antenna', 'rocketAntenna', 70, 26),
  part('nose', 'rocketNose', 48, 44),
  part('body', 'rocketBody', 48, 78),
  part('window', 'rocketWindow', 63, 92),
  part('boosterLeft', 'rocketBoosterLeft', 30, 126),
  part('boosterRight', 'rocketBoosterRight', 100, 126),
  part('finLeft', 'rocketFinLeft', 32, 140),
  part('finRight', 'rocketFinRight', 102, 140)
];

const SOFA: PartSpec[] = [
  part('armLeft', 'sofaArmLeft', 0, 104),
  part('back', 'sofaBack', 13, 110),
  part('armRight', 'sofaArmRight', 133, 104),
  part('seat', 'sofaSeat', 13, 164)
];

const PIANO: PartSpec[] = [
  part('lid', 'pianoLid', 0, 100),
  part('body', 'pianoBody', 5, 110),
  part('keys', 'pianoKeys', 15, 160),
  part('legLeft', 'pianoLegLeft', 10, 174),
  part('legRight', 'pianoLegRight', 128, 174),
  part('pedal', 'pianoPedal', 60, 186)
];

const CRANE: PartSpec[] = [
  part('counter', 'craneCounter', 0, 74),
  part('arm', 'craneArm', 20, 76),
  part('cable', 'craneCable', 120, 90),
  part('mast', 'craneMast', 20, 90),
  part('hook', 'craneHook', 115, 130),
  part('load', 'craneLoad', 106, 142),
  part('base', 'craneBase', 0, 200)
];

const CASTLE: PartSpec[] = [
  part('pole', 'castlePole', 76, 70),
  part('flag', 'castleFlag', 82, 70),
  part('keep', 'castleKeep', 60, 100),
  part('roofLeft', 'castleRoofLeft', 0, 104),
  part('roofRight', 'castleRoofRight', 130, 106),
  part('towerLeft', 'castleTowerLeft', 0, 120),
  part('towerRight', 'castleTowerRight', 130, 120),
  part('wall', 'castleWall', 30, 140),
  part('gate', 'castleGate', 66, 166)
];

export const STAGES: StageConfig[] = [
  { id: 1, name: '책', parts: BOOK, slots: true, connectors: true, rotate: false, flip: false, dependency: false },
  { id: 2, name: '컵', parts: CUP, slots: true, connectors: true, rotate: false, flip: false, dependency: false },
  { id: 3, name: '의자', parts: CHAIR, slots: true, connectors: true, rotate: false, flip: false, dependency: false },
  { id: 4, name: '문', parts: DOOR, slots: true, connectors: true, rotate: false, flip: false, dependency: false },
  { id: 5, name: '연필', parts: PENCIL, slots: false, connectors: false, rotate: false, flip: false, dependency: false },
  { id: 6, name: '자동차', parts: CAR, slots: false, connectors: false, rotate: false, flip: false, dependency: false },
  { id: 7, name: '비행기', parts: PLANE, slots: false, connectors: false, rotate: false, flip: false, dependency: false },
  { id: 8, name: '기차', parts: TRAIN, slots: false, connectors: false, rotate: false, flip: false, dependency: false },
  { id: 9, name: '책상', parts: DESK, slots: false, connectors: false, rotate: false, flip: false, dependency: false },
  { id: 10, name: '로봇', parts: ROBOT, slots: false, connectors: false, rotate: false, flip: false, dependency: false },
  { id: 11, name: '시계', parts: CLOCK, slots: false, connectors: false, rotate: true, flip: false, dependency: false },
  { id: 12, name: '트럭', parts: TRUCK, slots: false, connectors: false, rotate: true, flip: false, dependency: false },
  { id: 13, name: '집', parts: HOUSE, slots: false, connectors: false, rotate: true, flip: false, dependency: false },
  { id: 14, name: '선풍기', parts: FAN, slots: false, connectors: false, rotate: false, flip: true, dependency: false },
  { id: 15, name: '침대', parts: BED, slots: false, connectors: false, rotate: false, flip: true, dependency: false },
  { id: 16, name: '우주선', parts: ROCKET, slots: false, connectors: false, rotate: false, flip: true, dependency: false },
  { id: 17, name: '소파', parts: SOFA, slots: false, connectors: false, rotate: true, flip: true, dependency: false },
  { id: 18, name: '피아노', parts: PIANO, slots: false, connectors: false, rotate: true, flip: true, dependency: false },
  { id: 19, name: '크레인', parts: CRANE, slots: false, connectors: false, rotate: true, flip: true, dependency: false },
  { id: 20, name: '성', parts: CASTLE, slots: false, connectors: false, rotate: true, flip: true, dependency: true }
];

export function tiltFor(index: number) {
  return ((index * 37) % 9) - 4;
}

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

function autoRequires(pieces: Piece[]) {
  for (const piece of pieces) {
    let support: Piece | null = null;
    let bestOverlap = 0;

    for (const other of pieces) {
      if (other.id === piece.id) {
        continue;
      }

      if (Math.abs(other.slot.y + other.height - piece.slot.y) > 1) {
        continue;
      }

      const start = Math.max(piece.slot.x, other.slot.x);
      const end = Math.min(piece.slot.x + piece.width, other.slot.x + other.width);
      const overlap = end - start;

      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        support = other;
      }
    }

    piece.requires = support ? support.id : undefined;
  }
}

function keyOf(points: { x: number; y: number }[]) {
  const unique = new Set(
    points.map((point) => `${Math.round(point.x * 100) / 100},${Math.round(point.y * 100) / 100}`)
  );

  return [...unique].sort().join('|');
}

function transformOf(piece: Piece, turns: number, flipped: boolean) {
  const centerX = piece.width / 2;
  const centerY = piece.height / 2;
  const radians = (turns * 90 * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return piecePolygon(piece).map((point) => {
    const offsetX = flipped ? centerX - point.x : point.x - centerX;
    const offsetY = point.y - centerY;

    return {
      x: centerX + offsetX * cos - offsetY * sin,
      y: centerY + offsetX * sin + offsetY * cos
    };
  });
}

function computeSymmetry(piece: Piece) {
  const base = keyOf(piecePolygon(piece));
  const mask: boolean[] = [];

  for (let turns = 0; turns < 4; turns += 1) {
    for (const flipped of [false, true]) {
      mask.push(keyOf(transformOf(piece, turns, flipped)) === base);
    }
  }

  return mask;
}

function markHints(pieces: Piece[]) {
  for (const piece of pieces) {
    const others = pieces.filter((other) => other.id !== piece.id);
    let covered = true;

    for (let column = 1; column < 5 && covered; column += 1) {
      for (let row = 1; row < 5 && covered; row += 1) {
        const x = piece.slot.x + (piece.width * column) / 5;
        const y = piece.slot.y + (piece.height * row) / 5;

        covered = others.some(
          (other) =>
            x > other.slot.x &&
            x < other.slot.x + other.width &&
            y > other.slot.y &&
            y < other.slot.y + other.height
        );
      }
    }

    piece.needsHint = covered || Math.min(piece.width, piece.height) <= 10;
  }
}

function markOverlaps(pieces: Piece[]) {
  for (let i = 0; i < pieces.length; i += 1) {
    for (let j = i + 1; j < pieces.length; j += 1) {
      const first = pieces[i];
      const second = pieces[j];
      const overlapX =
        Math.min(first.slot.x + first.width, second.slot.x + second.width) -
        Math.max(first.slot.x, second.slot.x);
      const overlapY =
        Math.min(first.slot.y + first.height, second.slot.y + second.height) -
        Math.max(first.slot.y, second.slot.y);

      if (overlapX > 6 && overlapY > 6) {
        second.overlaps = true;
      }
    }
  }
}

function layoutScatter(pieces: Piece[], size: BoardSize, zoneWidth: number) {
  const ordered = [...pieces].sort(
    (left, right) => right.height - left.height || right.width - left.width
  );
  const right = zoneWidth - FLOOR_MARGIN;
  let cursorX = FLOOR_MARGIN;
  let cursorY = TOP_MARGIN;
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

export function findStage(stageId: number) {
  return STAGES.find((stage) => stage.id === stageId) ?? STAGES[0];
}

export function initialPieces(stage: StageConfig) {
  return stage.parts.map((part_, index) => ({
    id: part_.id,
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
    features.push('아래부터');
  }

  return features.join(' · ');
}

export function buildPuzzle(stage: StageConfig, size: BoardSize): Puzzle {
  const parts = stage.parts;
  const pedestalTop = size.height - PEDESTAL_HEIGHT;
  const targetX = Math.round(size.width * 0.5);
  const targetWidth = size.width - targetX - 8;
  const minX = Math.min(...parts.map((item) => item.slot.x));
  const maxX = Math.max(...parts.map((item) => item.slot.x + SHAPES[item.shape].width));
  const maxY = Math.max(...parts.map((item) => item.slot.y + SHAPES[item.shape].height));
  const shiftX = targetX + (targetWidth - (maxX - minX)) / 2 - minX;
  const shiftY = pedestalTop - maxY;

  const pieces: Piece[] = parts.map((item, index) => {
    const shape = SHAPES[item.shape];
    return {
      id: item.id,
      shape: shape.kind,
      width: shape.width,
      height: shape.height,
      tone: TONES[index % TONES.length],
      color: COLORS[index % COLORS.length],
      start: { x: 0, y: 0 },
      slot: { x: item.slot.x + shiftX, y: item.slot.y + shiftY },
      edges: emptyEdges(),
      chamfers: shape.chamfers ?? [0, 0, 0, 0],
      requires: undefined,
      overlaps: false,
      needsHint: false,
      symmetry: [],
      initialTurns: stage.rotate ? INITIAL_TURNS[index % INITIAL_TURNS.length] : 0,
      initialFlipped: stage.flip ? INITIAL_FLIPS[index % INITIAL_FLIPS.length] : false
    };
  });

  if (stage.connectors) {
    autoEdges(pieces);
  }

  if (stage.dependency) {
    autoRequires(pieces);
  }

  markOverlaps(pieces);
  markHints(pieces);

  for (const piece of pieces) {
    piece.symmetry = computeSymmetry(piece);
  }

  layoutScatter(pieces, size, targetX);

  const pedestal: Pedestal = {
    x: targetX + 4,
    y: pedestalTop,
    width: Math.max(60, size.width - targetX - 16),
    height: PEDESTAL_HEIGHT
  };

  return {
    stageId: stage.id,
    stageName: stage.name,
    pieces,
    silhouette: buildSilhouettePath(pieces.map(shiftedPolygon)),
    slots: stage.slots,
    rotate: stage.rotate,
    flip: stage.flip,
    pedestal
  };
}

export const FLAT_EDGES: PieceEdges = { top: [], right: [], bottom: [], left: [] };
export type { Chamfers };
