import { useState } from 'react';

import { useStageRouter } from '@/hooks/useStageRouter';

import type { GameSceneProps } from '../types';
import { PlayScreen } from './PlayScreen';
import { StageShelf } from './StageShelf';

export function GeneralStoreScene({ game }: GameSceneProps) {
  const [stageId, setStageId] = useState<number | null>(null);
  const { back } = useStageRouter();

  if (stageId === null) {
    return <StageShelf accent={game.accent} onStart={setStageId} onExit={back} />;
  }

  return <PlayScreen key={stageId} stageId={stageId} onExit={() => setStageId(null)} />;
}
