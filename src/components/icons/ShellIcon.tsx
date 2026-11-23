import { Shell } from '@/games/fruitstore/PortraitArt';
import type { GameIconProps } from '@/games/types';

export function ShellIcon({ width = 64, height = 64 }: GameIconProps) {
  return <Shell size={Math.min(width, height)} />;
}
