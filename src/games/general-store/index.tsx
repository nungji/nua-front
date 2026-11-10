import { MockScene } from '../mock-scene';
import type { GameSceneProps } from '../types';

export function GeneralStoreScene(props: GameSceneProps) {
  return <MockScene {...props} />;
}
