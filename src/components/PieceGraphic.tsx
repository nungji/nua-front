import { Circle, Path, Svg } from 'react-native-svg';

import { Piece, PieceEdges, PIECE_PAD } from '@/repairmanPuzzle';
import { buildPiecePath } from '@/repairmanPiecePath';

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
      {piece.shape === 'circle' ? (
        <Circle
          cx={piece.width / 2}
          cy={piece.height / 2}
          r={piece.width / 2}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ) : (
        <Path
          d={buildPiecePath(piece.width, piece.height, edges)}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      )}
    </Svg>
  );
}
