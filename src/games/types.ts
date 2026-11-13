import type { ComponentType } from 'react';

export type GameSceneProps = {
  game: Game;
  index: number;
};

export type GameIconProps = { width?: number; height?: number };

export type Game = {
  id: string;
  title: string;
  accent: string;
  route: string;
  Scene: ComponentType<GameSceneProps>;
  /** Figma card icon. Cards fall back to the title's first letter until the asset lands. */
  icon?: ComponentType<GameIconProps>;
};
