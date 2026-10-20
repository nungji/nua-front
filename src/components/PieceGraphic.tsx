import { Path, Svg } from 'react-native-svg';

import {
  Piece,
  PieceEdges,
  PIECE_PAD,
  WHEEL_FLAT_CENTER,
  WHEEL_FLAT_HALF
} from '@/repairmanPuzzle';
import { buildCirclePath, buildPiecePath, buildSemicirclePath } from '@/repairmanPiecePath';

type PieceGraphicProps = {
  piece: Piece;
  edges: PieceEdges;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
};

function buildPath(piece: Piece, edges: PieceEdges) {
  if (piece.shape === 'circle') {
    return buildCirclePath(piece.width, piece.height, WHEEL_FLAT_CENTER, WHEEL_FLAT_HALF);
  }

  if (piece.shape === 'semicircle') {
    return buildSemicirclePath(piece.width, edges);
  }

  return buildPiecePath(piece.width, piece.height, edges, piece.chamfers);
}

export function PieceGraphic({
  piece,
  edges,
  fill,
  stroke,
  strokeWidth,
  opacity
}: PieceGraphicProps) {
  const width = piece.width + PIECE_PAD * 2;
  const height = piece.height + PIECE_PAD * 2;

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`${-PIECE_PAD} ${-PIECE_PAD} ${width} ${height}`}
      style={{ opacity }}
    >
      <Path d={buildPath(piece, edges)} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </Svg>
  );
}
