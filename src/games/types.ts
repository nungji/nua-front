import type { ComponentType } from 'react';

export type GameSceneProps = {
  game: Game;
  index: number;
};

export type Game = {
  id: string;
  title: string;
  accent: string;
  route: string;
  Scene: ComponentType<GameSceneProps>;
};
