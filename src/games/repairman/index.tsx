import { useState } from 'react';

import { useStageRouter } from '@/hooks/useStageRouter';

import type { GameSceneProps } from '../types';
import { PlayScreen } from './PlayScreen';
import { StageMap } from './StageMap';

export function RepairmanScene({ game }: GameSceneProps) {
  const [stageId, setStageId] = useState<number | null>(null);
  const { back } = useStageRouter();

  if (stageId === null) {
    return <StageMap accent={game.accent} onStart={setStageId} onExit={back} />;
  }

  return <PlayScreen stageId={stageId} onExit={() => setStageId(null)} />;
}
