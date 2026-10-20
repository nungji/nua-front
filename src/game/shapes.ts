import {
  circlePath,
  circlePolygon,
  rectPath,
  rectPolygon,
  semicirclePath,
  semicirclePolygon
} from './geometry';
import { Piece, PieceEdges, Point } from './types';

export const WHEEL_FLAT_CENTER = -45;
export const WHEEL_FLAT_HALF = 30;

export function piecePath(piece: Piece, edges: PieceEdges) {
  if (piece.shape === 'circle') {
    return circlePath(piece.width, piece.height, WHEEL_FLAT_CENTER, WHEEL_FLAT_HALF);
  }

  if (piece.shape === 'semicircle') {
    return semicirclePath(piece.width, edges);
  }

  return rectPath(piece.width, piece.height, edges, piece.chamfers);
}

export function piecePolygon(piece: Piece) {
  if (piece.shape === 'circle') {
    return circlePolygon(piece.width, piece.height, WHEEL_FLAT_CENTER, WHEEL_FLAT_HALF);
  }

  if (piece.shape === 'semicircle') {
    return semicirclePolygon(piece.width, piece.edges);
  }

  return rectPolygon(piece.width, piece.height, piece.edges, piece.chamfers);
}

export function shiftedPolygon(piece: Piece): Point[] {
  return piecePolygon(piece).map((point) => ({
    x: point.x + piece.slot.x,
    y: point.y + piece.slot.y
  }));
}
