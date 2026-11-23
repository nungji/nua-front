import { View } from 'react-native';
import { PieceGraphic } from '@/components/PieceGraphic';
import { PIECE_PAD } from './game/stages';
import type { Piece } from './game/types';

/** Keep the reference at 1:1 scale with the draggable pieces and assembly target. */
export function CompletedModel({ pieces, width, height }: { pieces: Piece[]; width: number; height: number }) {
  const left = Math.min(...pieces.map(p => p.slot.x)) - PIECE_PAD;
  const top = Math.min(...pieces.map(p => p.slot.y)) - PIECE_PAD;
  const modelWidth = Math.max(...pieces.map(p => p.slot.x + p.width)) + PIECE_PAD - left;
  const modelHeight = Math.max(...pieces.map(p => p.slot.y + p.height)) + PIECE_PAD - top;
  return <View pointerEvents="none" style={{ width, height }}>
    <View style={{ position: 'absolute', width: modelWidth, height: modelHeight, left: (width - modelWidth) / 2, top: (height - modelHeight) / 2 }}>
      {pieces.map(piece => <View key={piece.id} style={{ position: 'absolute', left: piece.slot.x - PIECE_PAD - left, top: piece.slot.y - PIECE_PAD - top }}>
        <PieceGraphic piece={piece} edges={piece.edges} fill={piece.color} />
      </View>)}
    </View>
  </View>;
}
