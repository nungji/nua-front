import { Path, Svg } from 'react-native-svg';

import { piecePath } from '@/game/shapes';
import { PIECE_PAD } from '@/game/stages';
import { Piece, PieceEdges } from '@/game/types';

type PieceGraphicProps = {
  piece: Piece;
  edges: PieceEdges;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
};

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
      <Path d={piecePath(piece, edges)} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </Svg>
  );
}
