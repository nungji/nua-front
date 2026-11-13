export const COLORS = {
  oceanDeep: '#0158C8',
  ocean: '#016BEA',
  oceanMid: '#01A7FC',
  cyan: '#44D5EE',
  foam: '#E4F3FC',
  sand: '#FDD480',
  sandLight: '#F9E4A5',
  orange: '#FFA24C',
  orangeDeep: '#FF5A1F',
  yellow: '#FFC93C',
  coral: '#EE6474',
  purple: '#995DBE',
  mint: '#97E1D1',
  white: '#FFFFFF',
  shadow: '#0A2C6B',
  curtain: '#E05757'
} as const;

export const FONT = 'Jua';

export const TOP_BAR_HEIGHT = 72;

export const RADIUS = {
  card: 28,
  button: 24
} as const;

export const SHADOW = {
  card: {
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6
  },
  button: {
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  }
} as const;

/** Card and mascot frames in the design sit one shade lighter than their accent. */
export const CARD_COLORS = [COLORS.sand, COLORS.purple, COLORS.mint, COLORS.cyan, COLORS.coral, COLORS.oceanMid];

export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
