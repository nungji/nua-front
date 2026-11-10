import { MockScene } from '../mock-scene';
import type { GameSceneProps } from '../types';

export function OrderScene(props: GameSceneProps) {
  return <MockScene {...props} />;
}
