import { ClipPath, Defs, Ellipse, G, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

import { piecePath } from '@/games/repairman/game/shapes';
import { PIECE_PAD } from '@/games/repairman/game/stages';
import { Piece, PieceEdges } from '@/games/repairman/game/types';
import { COLORS, shade } from '@/theme';

type PieceGraphicProps = {
  piece: Piece;
  edges: PieceEdges;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  /** Silhouette-only rendering for slots and ghosts. */
  plain?: boolean;
};

const OUTLINE = 5;

export function PieceGraphic({
  piece,
  edges,
  fill,
  stroke,
  strokeWidth,
  opacity,
  plain = false
}: PieceGraphicProps) {
  const width = piece.width + PIECE_PAD * 2;
  const height = piece.height + PIECE_PAD * 2;
  const path = piecePath(piece, edges);
  const gradientId = `piece-grad-${piece.id}`;
  const clipId = `piece-clip-${piece.id}`;

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`${-PIECE_PAD} ${-PIECE_PAD} ${width} ${height}`}
      style={{ opacity }}
    >
      {plain ? (
        <Path d={path} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      ) : (
        <>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={shade(fill, 0.22)} />
              <Stop offset="1" stopColor={shade(fill, -0.16)} />
            </LinearGradient>
            <ClipPath id={clipId}>
              <Path d={path} />
            </ClipPath>
          </Defs>

          <Path
            d={path}
            fill={`url(#${gradientId})`}
            stroke={COLORS.white}
            strokeWidth={OUTLINE}
            strokeLinejoin="round"
          />

          {/* gloss band, clipped so it never spills past the outline */}
          <G clipPath={`url(#${clipId})`}>
            <Ellipse
              cx={piece.width * 0.34}
              cy={piece.height * 0.2}
              rx={piece.width * 0.3}
              ry={piece.height * 0.16}
              fill="rgba(255, 255, 255, 0.45)"
            />
            <Ellipse
              cx={piece.width * 0.72}
              cy={piece.height * 0.78}
              rx={piece.width * 0.26}
              ry={piece.height * 0.14}
              fill="rgba(10, 44, 107, 0.10)"
            />
          </G>
        </>
      )}
    </Svg>
  );
}
