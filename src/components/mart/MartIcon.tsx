import { Text } from 'react-native';

export type MartIconName =
  | 'back'
  | 'next'
  | 'sound'
  | 'book'
  | 'retry'
  | 'home'
  | 'check'
  | 'star'
  | 'hand'
  | 'lock';

const ICON_GLYPH: Record<MartIconName, string> = {
  back: '←',
  next: '→',
  sound: '♪',
  book: '책',
  retry: '↻',
  home: '⌂',
  check: '✓',
  star: '★',
  hand: '☞',
  lock: '⚿',
};

interface MartIconProps {
  name: MartIconName;
  size?: number;
}

export function MartIcon({ name, size = 24 }: MartIconProps) {
  return <Text style={{ fontSize: size, lineHeight: size }}>{ICON_GLYPH[name]}</Text>;
}
