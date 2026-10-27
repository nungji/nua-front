import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MartTopBar } from '@/components/mart/MartTopBar';
import { StageAssemble } from '@/components/mart/stage/StageAssemble';
import { StageCorrectResult } from '@/components/mart/stage/StageCorrectResult';
import { StageListen } from '@/components/mart/stage/StageListen';
import { StageMeaningQuiz } from '@/components/mart/stage/StageMeaningQuiz';
import { StageMeetWord } from '@/components/mart/stage/StageMeetWord';
import { StageProblem } from '@/components/mart/stage/StageProblem';
import { StageReward } from '@/components/mart/stage/StageReward';
import { StageSoundQuiz } from '@/components/mart/stage/StageSoundQuiz';
import { MART_WORDS } from '@/data/martWords';
import { MART_STAGE_STEPS } from '@/enums';
import type { MartWordId } from '@/enums';
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
  const router = useRouter();
  const { word: wordParam } = useLocalSearchParams<{ word: MartWordId }>();
  const word = MART_WORDS[wordParam];
  const activeWord = useMartStore((state) => state.activeWord);
  const stageStep = useMartStore((state) => state.stageStep);
  const startStage = useMartStore((state) => state.startStage);
  const advanceStep = useMartStore((state) => state.advanceStep);
  const goBackStep = useMartStore((state) => state.goBackStep);
  const completeStage = useMartStore((state) => state.completeStage);

  useEffect(() => {
    if (word && activeWord !== wordParam) {
      startStage(wordParam);
    }
  }, [word, wordParam, activeWord, startStage]);

  if (!word) return null;

  const title = STAGE_TITLES[stageStep] === 'mart' ? '마트' : word.label;

  function handleBack() {
    if (stageStep === MART_STAGE_STEPS[0]) {
      router.back();
    } else {
      goBackStep();
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title={title} onBack={handleBack} />
      {stageStep === 'problem' && <StageProblem onNext={advanceStep} />}
      {stageStep === 'meetWord' && <StageMeetWord word={word} onNext={advanceStep} />}
      {stageStep === 'meaningQuiz' && <StageMeaningQuiz word={word} onCorrect={advanceStep} />}
      {stageStep === 'listen' && <StageListen word={word} onNext={advanceStep} />}
      {stageStep === 'soundQuiz' && <StageSoundQuiz word={word} onCorrect={advanceStep} />}
      {stageStep === 'assemble' && <StageAssemble word={word} onCorrect={advanceStep} />}
      {stageStep === 'correct' && (
        <StageCorrectResult
          word={word}
          onNext={() => {
            completeStage();
            advanceStep();
          }}
        />
      )}
      {stageStep === 'reward' && <StageReward word={word} />}
    </SafeAreaView>
  );
}
