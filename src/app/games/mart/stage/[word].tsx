import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStageRouter } from '@/hooks/useStageRouter';
import { MartTopBar } from '@/components/mart/MartTopBar';
import { StageAssemble } from '@/components/mart/stage/StageAssemble';
import { StageCorrectResult } from '@/components/mart/stage/StageCorrectResult';
import { StageListen } from '@/components/mart/stage/StageListen';
import { StageMeaningQuiz } from '@/components/mart/stage/StageMeaningQuiz';
import { StageMeetWord } from '@/components/mart/stage/StageMeetWord';
import { StageProblem } from '@/components/mart/stage/StageProblem';
import { StageReward } from '@/components/mart/stage/StageReward';
import { StageSoundQuiz } from '@/components/mart/stage/StageSoundQuiz';
import { buildWordSyllables, getWordCorner, getWordRow, pickQuizOptions } from '@/data/martWords';
import { MART_STAGE_STEPS } from '@/enums';
import { useMartStore } from '@/store/useMartStore';

const STAGE_TITLES: Record<(typeof MART_STAGE_STEPS)[number], 'mart' | 'word'> = {
  problem: 'mart',
  meetWord: 'word',
  meaningQuiz: 'mart',
  listen: 'word',
  soundQuiz: 'mart',
  assemble: 'mart',
  correct: 'word',
  reward: 'word',
};

export default function MartStageScreen() {
  const { back } = useStageRouter();
  const { word } = useLocalSearchParams<{ word: string }>();
  const activeWord = useMartStore((state) => state.activeWord);
  const stageStep = useMartStore((state) => state.stageStep);
  const cornerStatus = useMartStore((state) => state.cornerStatus);
  const startStage = useMartStore((state) => state.startStage);
  const advanceStep = useMartStore((state) => state.advanceStep);
  const goBackStep = useMartStore((state) => state.goBackStep);
  const completeStage = useMartStore((state) => state.completeStage);

  const row = word ? getWordRow(word) : null;
  const syllables = useMemo(() => (word && row ? buildWordSyllables(word, row.blankRule) : []), [word, row]);
  const meaningOptions = useMemo(() => (word ? pickQuizOptions(word, 2) : []), [word]);
  const soundOptions = useMemo(() => (word ? pickQuizOptions(word, 2) : []), [word]);

  useEffect(() => {
    if (word && activeWord !== word) {
      startStage(word);
    }
  }, [word, activeWord, startStage]);

  if (!word || !row) return null;

  const title = STAGE_TITLES[stageStep] === 'mart' ? '마트' : word;
  const cornerCleared = cornerStatus[getWordCorner(word)] === 'completed';

  function handleBack() {
    if (stageStep === MART_STAGE_STEPS[0]) {
      back();
    } else {
      goBackStep();
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title={title} onBack={handleBack} />
      {stageStep === 'problem' && <StageProblem onNext={advanceStep} />}
      {stageStep === 'meetWord' && <StageMeetWord word={word} onNext={advanceStep} />}
      {stageStep === 'meaningQuiz' && (
        <StageMeaningQuiz word={word} options={meaningOptions} onCorrect={advanceStep} />
      )}
      {stageStep === 'listen' && <StageListen word={word} onNext={advanceStep} />}
      {stageStep === 'soundQuiz' && (
        <StageSoundQuiz word={word} options={soundOptions} onCorrect={advanceStep} />
      )}
      {stageStep === 'assemble' && <StageAssemble syllables={syllables} onCorrect={advanceStep} />}
      {stageStep === 'correct' && (
        <StageCorrectResult
          word={word}
          onNext={() => {
            completeStage();
            advanceStep();
          }}
        />
      )}
      {stageStep === 'reward' && <StageReward word={word} cornerCleared={cornerCleared} />}
    </SafeAreaView>
  );
}
