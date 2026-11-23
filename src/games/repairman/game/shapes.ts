import {
  circlePath,
  circlePolygon,
  rectPath,
  rectPolygon,
  semicirclePath,
  semicirclePolygon
} from './geometry';
import { Piece, PieceEdges, Point } from './types';

export function piecePath(piece: Piece, edges: PieceEdges) {
  if (piece.shape === 'dome') {
    return `M0,${piece.height} A${piece.width / 2},${piece.height} 0 0 1 ${piece.width},${piece.height} Z`;
  }

  if (piece.shape === 'circle') {
    return circlePath(piece.width, piece.height);
  }

  if (piece.shape === 'semicircle') {
    return semicirclePath(piece.width, edges);
  }

  return rectPath(piece.width, piece.height, edges, piece.chamfers);
}

export function piecePolygon(piece: Piece) {
  if (piece.shape === 'dome') {
    return semicirclePolygon(piece.width, piece.edges)
      .map(point => ({ x: point.x, y: piece.height - point.y }))
      .reverse();
  }

  if (piece.shape === 'circle') {
    return circlePolygon(piece.width, piece.height);
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
