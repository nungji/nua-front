import { OCEAN_STAGES } from './oceanStages';
import { shade } from '@/theme';

import { buildSilhouettePath } from './silhouette';
import { SHAPES } from './shapeset';
import { piecePolygon, shiftedPolygon } from './shapes';
import {
  BoardSize,
  Chamfers,
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
const OBJECT_COLORS = ['#EE6474', '#01A7FC', '#FFC93C', '#995DBE', '#44D5EE', '#FFA24C', '#97E1D1', '#016BEA', '#F9E4A5'];
const INITIAL_TURNS = [3, 2, 1, 2, 3, 1, 2, 3, 1];
const INITIAL_FLIPS = [true, false, false, true, false, false, true, false, true];

const FLOOR_MARGIN = 10;
const FLOOR_GAP = 7;
const TOP_MARGIN = 8;

/** Every part of one object shares a hue so the finished piece reads as a single toy. */
function partColor(stageId: number, index: number): string {
  const base = OBJECT_COLORS[(stageId - 1) % OBJECT_COLORS.length];
  const shift = [0, -0.12, 0.1, -0.06][index % 4];

  return shade(base, shift);
}

export const STAGES: StageConfig[] = [
  { id: 1, name: OCEAN_STAGES[0].name, parts: OCEAN_STAGES[0].parts, slots: true, connectors: true, rotate: false, flip: false, dependency: false },
  { id: 2, name: OCEAN_STAGES[1].name, parts: OCEAN_STAGES[1].parts, slots: true, connectors: true, rotate: false, flip: false, dependency: false },
  { id: 3, name: OCEAN_STAGES[2].name, parts: OCEAN_STAGES[2].parts, slots: true, connectors: true, rotate: false, flip: false, dependency: false },
  { id: 4, name: OCEAN_STAGES[3].name, parts: OCEAN_STAGES[3].parts, slots: true, connectors: true, rotate: false, flip: false, dependency: false },
  { id: 5, name: OCEAN_STAGES[4].name, parts: OCEAN_STAGES[4].parts, slots: false, connectors: false, rotate: false, flip: false, dependency: false },
  { id: 6, name: OCEAN_STAGES[5].name, parts: OCEAN_STAGES[5].parts, slots: false, connectors: false, rotate: false, flip: false, dependency: false },
  { id: 7, name: OCEAN_STAGES[6].name, parts: OCEAN_STAGES[6].parts, slots: false, connectors: false, rotate: false, flip: false, dependency: false },
  { id: 8, name: OCEAN_STAGES[7].name, parts: OCEAN_STAGES[7].parts, slots: false, connectors: false, rotate: false, flip: false, dependency: false },
  { id: 9, name: OCEAN_STAGES[8].name, parts: OCEAN_STAGES[8].parts, slots: false, connectors: false, rotate: false, flip: false, dependency: false },
  { id: 10, name: OCEAN_STAGES[9].name, parts: OCEAN_STAGES[9].parts, slots: false, connectors: false, rotate: false, flip: false, dependency: false },
  { id: 11, name: OCEAN_STAGES[10].name, parts: OCEAN_STAGES[10].parts, slots: false, connectors: false, rotate: true, flip: false, dependency: false },
  { id: 12, name: OCEAN_STAGES[11].name, parts: OCEAN_STAGES[11].parts, slots: false, connectors: false, rotate: true, flip: false, dependency: false },
  { id: 13, name: OCEAN_STAGES[12].name, parts: OCEAN_STAGES[12].parts, slots: false, connectors: false, rotate: true, flip: false, dependency: false },
  { id: 14, name: OCEAN_STAGES[13].name, parts: OCEAN_STAGES[13].parts, slots: false, connectors: false, rotate: false, flip: true, dependency: false },
  { id: 15, name: OCEAN_STAGES[14].name, parts: OCEAN_STAGES[14].parts, slots: false, connectors: false, rotate: false, flip: true, dependency: false },
  { id: 16, name: OCEAN_STAGES[15].name, parts: OCEAN_STAGES[15].parts, slots: false, connectors: false, rotate: false, flip: true, dependency: false },
  { id: 17, name: OCEAN_STAGES[16].name, parts: OCEAN_STAGES[16].parts, slots: false, connectors: false, rotate: true, flip: true, dependency: false },
  { id: 18, name: OCEAN_STAGES[17].name, parts: OCEAN_STAGES[17].parts, slots: false, connectors: false, rotate: true, flip: true, dependency: false },
  { id: 19, name: OCEAN_STAGES[18].name, parts: OCEAN_STAGES[18].parts, slots: false, connectors: false, rotate: true, flip: true, dependency: false },
  { id: 20, name: OCEAN_STAGES[19].name, parts: OCEAN_STAGES[19].parts, slots: false, connectors: false, rotate: true, flip: true, dependency: true }
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

/** Shape specs are authored against a 460px wide board and scaled from there. */
export function puzzleScale(size: BoardSize): number {
  return Math.max(0.85, Math.min(1.7, size.width / 460, size.height / 300));
}

export function buildPuzzle(stage: StageConfig, size: BoardSize): Puzzle {
  const k = puzzleScale(size);
  const parts = stage.parts;
  const pedestalTop = size.height - PEDESTAL_HEIGHT * k;
  const targetX = Math.round(size.width * 0.5);
  const targetWidth = size.width - targetX - 8;
  const minX = Math.min(...parts.map((item) => item.slot.x * k));
  const maxX = Math.max(...parts.map((item) => (item.slot.x + SHAPES[item.shape].width) * k));
  const maxY = Math.max(...parts.map((item) => (item.slot.y + SHAPES[item.shape].height) * k));
  const shiftX = targetX + (targetWidth - (maxX - minX)) / 2 - minX;
  const shiftY = pedestalTop - maxY;

  const pieces: Piece[] = parts.map((item, index) => {
    const shape = SHAPES[item.shape];
    return {
      id: item.id,
      shape: shape.kind,
      width: shape.width * k,
      height: shape.height * k,
      tone: TONES[index % TONES.length],
      color: item.color ?? partColor(stage.id, index),
      start: { x: 0, y: 0 },
      slot: { x: item.slot.x * k + shiftX, y: item.slot.y * k + shiftY },
      edges: emptyEdges(),
      chamfers: (shape.chamfers ?? [0, 0, 0, 0]).map((value) => value * k) as Chamfers,
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
    x: 8,
    y: pedestalTop,
    width: Math.max(60, size.width - 16),
    height: PEDESTAL_HEIGHT * k
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
