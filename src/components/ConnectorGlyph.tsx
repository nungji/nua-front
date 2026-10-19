import { View } from 'react-native';

import { ConnectorKind } from '@/repairmanPuzzle';

type ConnectorGlyphProps = {
  kind: ConnectorKind;
  filled: boolean;
  size?: number;
};

export function ConnectorGlyph({ kind, filled, size = 12 }: ConnectorGlyphProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: kind === 'round' ? size / 2 : 2,
        borderWidth: 2,
        borderColor: '#64748B',
        backgroundColor: filled ? '#FFFFFF' : 'transparent',
        transform: kind === 'diamond' ? [{ rotate: '45deg' }] : []
      }}
    />
  );
}
