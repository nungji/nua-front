import { buildSilhouettePath } from './silhouette';
import { shiftedPolygon } from './shapes';
import { Chamfers, Difficulty, PartSpec, Piece, PieceEdges, Puzzle, Stage } from './types';

export const BOARD_WIDTH = 320;
export const BOARD_HEIGHT = 470;
export const PIECE_PAD = 10;
export const SNAP_RADIUS = 48;

const LEVELS: Difficulty[] = ['easy', 'medium', 'hard'];

const NO_CHAMFERS: Chamfers = [0, 0, 0, 0];

const TONES = ['#C9C2B6', '#9FB4D6', '#E3A9A0', '#A3C2B0', '#B5AECD', '#D8C89A', '#AEB7C4'];
const COLORS = ['#F05A28', '#2F6FED', '#E5553F', '#3D3D4E', '#6B4FA8', '#E0A400', '#2B7A5E'];
const INITIAL_TURNS = [3, 2, 1, 2, 3, 1, 2];
const INITIAL_FLIPS = [false, true, false, false, true, false, false];

const FLOOR_TOP = 236;
const FLOOR_MARGIN = 14;
const FLOOR_GAP = 8;

const TRAIN_PARTS: PartSpec[] = [
  {
    id: 'body',
    shape: 'rect',
    width: 200,
    height: 80,
    slot: { x: 40, y: 90 },
    chamfers: [30, 0, 0, 0],
    edges: {
      top: [
        { at: 43, kind: 'tab' },
        { at: 165, kind: 'tab' }
      ],
      bottom: [
        { at: 32, kind: 'socket' },
        { at: 142, kind: 'socket' }
      ]
    },
    from: 'easy'
  },
  {
    id: 'cab',
    shape: 'rect',
    width: 70,
    height: 70,
    slot: { x: 170, y: 20 },
    chamfers: [0, 22, 0, 0],
    edges: { bottom: [{ at: 35, kind: 'socket' }] },
    requires: 'body',
    from: 'easy'
  },
  {
    id: 'chimney',
    shape: 'rect',
    width: 26,
    height: 46,
    slot: { x: 70, y: 44 },
    chamfers: [10, 0, 0, 0],
    edges: { bottom: [{ at: 13, kind: 'socket' }] },
    requires: 'body',
    from: 'easy'
  },
  {
    id: 'wheelLeft',
    shape: 'semicircle',
    width: 56,
    height: 28,
    slot: { x: 70, y: 170 },
    edges: { top: [{ at: 28, kind: 'tab' }] },
    overlapShape: { shape: 'circle', width: 56, height: 56 },
    overlapShift: { x: 0, y: -30 },
    requires: 'body',
    from: 'easy'
  },
  {
    id: 'wheelRight',
    shape: 'semicircle',
    width: 56,
    height: 28,
    slot: { x: 180, y: 170 },
    edges: { top: [{ at: 28, kind: 'tab' }] },
    overlapShape: { shape: 'circle', width: 56, height: 56 },
    overlapShift: { x: 0, y: -30 },
    requires: 'body',
    from: 'easy'
  },
  {
    id: 'lamp',
    shape: 'rect',
    width: 24,
    height: 24,
    slot: { x: 120, y: 66 },
    chamfers: [6, 0, 0, 0],
    requires: 'body',
    from: 'medium'
  },
  {
    id: 'coupling',
    shape: 'rect',
    width: 34,
    height: 14,
    slot: { x: 6, y: 136 },
    chamfers: [0, 0, 5, 0],
    from: 'hard'
  }
];

const CAR_PARTS: PartSpec[] = [
  {
    id: 'chassis',
    shape: 'rect',
    width: 190,
    height: 54,
    slot: { x: 65, y: 120 },
    chamfers: [16, 0, 0, 0],
    edges: {
      top: [{ at: 95, kind: 'tab' }],
      bottom: [
        { at: 39, kind: 'socket' },
        { at: 149, kind: 'socket' }
      ]
    },
    from: 'easy'
  },
  {
    id: 'cabin',
    shape: 'rect',
    width: 90,
    height: 50,
    slot: { x: 110, y: 70 },
    chamfers: [0, 14, 0, 0],
    edges: { bottom: [{ at: 40, kind: 'socket' }] },
    requires: 'chassis',
    from: 'easy'
  },
  {
    id: 'wheelLeft',
    shape: 'semicircle',
    width: 52,
    height: 26,
    slot: { x: 80, y: 174 },
    edges: { top: [{ at: 26, kind: 'tab' }] },
    overlapShape: { shape: 'circle', width: 52, height: 52 },
    overlapShift: { x: 0, y: -26 },
    requires: 'chassis',
    from: 'easy'
  },
  {
    id: 'wheelRight',
    shape: 'semicircle',
    width: 52,
    height: 26,
    slot: { x: 190, y: 174 },
    edges: { top: [{ at: 26, kind: 'tab' }] },
    overlapShape: { shape: 'circle', width: 52, height: 52 },
    overlapShift: { x: 0, y: -26 },
    requires: 'chassis',
    from: 'easy'
  },
  {
    id: 'bumper',
    shape: 'rect',
    width: 26,
    height: 18,
    slot: { x: 39, y: 138 },
    chamfers: [0, 0, 6, 0],
    from: 'medium'
  },
  {
    id: 'headlight',
    shape: 'rect',
    width: 20,
    height: 20,
    slot: { x: 200, y: 100 },
    chamfers: [0, 6, 0, 0],
    requires: 'chassis',
    from: 'hard'
  }
];

const PLANE_PARTS: PartSpec[] = [
  {
    id: 'fuselage',
    shape: 'rect',
    width: 200,
    height: 40,
    slot: { x: 60, y: 110 },
    chamfers: [0, 20, 0, 0],
    edges: {
      top: [{ at: 17, kind: 'tab' }],
      bottom: [{ at: 100, kind: 'socket' }]
    },
    from: 'easy'
  },
  {
    id: 'tail',
    shape: 'rect',
    width: 22,
    height: 46,
    slot: { x: 66, y: 64 },
    chamfers: [8, 0, 0, 0],
    edges: { bottom: [{ at: 11, kind: 'socket' }] },
    requires: 'fuselage',
    from: 'easy'
  },
  {
    id: 'wing',
    shape: 'rect',
    width: 130,
    height: 28,
    slot: { x: 95, y: 150 },
    chamfers: [14, 0, 0, 0],
    edges: {
      top: [{ at: 65, kind: 'tab' }],
      bottom: [
        { at: 38, kind: 'socket' },
        { at: 92, kind: 'socket' }
      ]
    },
    requires: 'fuselage',
    from: 'easy'
  },
  {
    id: 'wheelLeft',
    shape: 'semicircle',
    width: 36,
    height: 18,
    slot: { x: 115, y: 178 },
    edges: { top: [{ at: 18, kind: 'tab' }] },
    overlapShape: { shape: 'circle', width: 36, height: 36 },
    overlapShift: { x: 0, y: -18 },
    requires: 'wing',
    from: 'easy'
  },
  {
    id: 'wheelRight',
    shape: 'semicircle',
    width: 36,
    height: 18,
    slot: { x: 169, y: 178 },
    edges: { top: [{ at: 18, kind: 'tab' }] },
    overlapShape: { shape: 'circle', width: 36, height: 36 },
    overlapShift: { x: 0, y: -18 },
    requires: 'wing',
    from: 'easy'
  },
  {
    id: 'windshield',
    shape: 'rect',
    width: 26,
    height: 22,
    slot: { x: 100, y: 88 },
    chamfers: [0, 8, 0, 0],
    requires: 'fuselage',
    from: 'medium'
  },
  {
    id: 'propeller',
    shape: 'rect',
    width: 12,
    height: 40,
    slot: { x: 260, y: 110 },
    chamfers: [0, 0, 4, 0],
    requires: 'fuselage',
    from: 'hard'
  }
];

export const STAGES: Stage[] = [
  { id: 'train', name: '기차', parts: TRAIN_PARTS },
  { id: 'car', name: '자동차', parts: CAR_PARTS },
  { id: 'plane', name: '비행기', parts: PLANE_PARTS }
];

export const FLAT_EDGES: PieceEdges = { top: [], right: [], bottom: [], left: [] };

export function edgesFor(piece: Piece, difficulty: Difficulty): PieceEdges {
  return difficulty === 'easy' ? piece.edges : FLAT_EDGES;
}

export function findStage(stageId: string) {
  return STAGES.find((stage) => stage.id === stageId) ?? STAGES[0];
}

function layoutScatter(pieces: Piece[]) {
  const ordered = [...pieces].sort((left, right) => right.height - left.height || right.width - left.width);
  const right = BOARD_WIDTH - FLOOR_MARGIN;
  let cursorX = FLOOR_MARGIN;
  let cursorY = FLOOR_TOP;
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

export function buildPuzzle(stageId: string, difficulty: Difficulty): Puzzle {
  const stage = findStage(stageId);
  const rank = LEVELS.indexOf(difficulty);
  const overlapping = difficulty === 'hard';
  const parts = stage.parts.filter((part) => LEVELS.indexOf(part.from) <= rank);

  const pieces: Piece[] = parts.map((part, index) => {
    const shape = overlapping && part.overlapShape ? part.overlapShape.shape : part.shape;
    const width = overlapping && part.overlapShape ? part.overlapShape.width : part.width;
    const height = overlapping && part.overlapShape ? part.overlapShape.height : part.height;
    const shift = overlapping ? part.overlapShift ?? { x: 0, y: 0 } : { x: 0, y: 0 };

    return {
      id: part.id,
      shape,
      width,
      height,
      tone: part.tone ?? TONES[index % TONES.length],
      color: part.color ?? COLORS[index % COLORS.length],
      start: { x: 0, y: 0 },
      slot: { x: part.slot.x + shift.x, y: part.slot.y + shift.y },
      edges: {
        top: part.edges?.top ?? [],
        right: part.edges?.right ?? [],
        bottom: part.edges?.bottom ?? [],
        left: part.edges?.left ?? []
      },
      chamfers: part.chamfers ?? NO_CHAMFERS,
      requires: overlapping ? part.requires : undefined,
      initialTurns: overlapping ? INITIAL_TURNS[index % INITIAL_TURNS.length] : 0,
      initialFlipped: overlapping ? INITIAL_FLIPS[index % INITIAL_FLIPS.length] : false
    };
  });

  layoutScatter(pieces);

  return {
    stageId: stage.id,
    stageName: stage.name,
    difficulty,
    pieces,
    silhouette: buildSilhouettePath(pieces.map(shiftedPolygon))
  };
}
