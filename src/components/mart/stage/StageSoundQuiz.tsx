import { useState } from 'react';
import { View } from 'react-native';
import type { MartWordConfig } from '@/data/martWords';
import { MartOptionRow } from '../MartOptionRow';
import { MartRoundButton } from '../MartRoundButton';

interface StageSoundQuizProps {
  word: MartWordConfig;
  onCorrect: () => void;
}

export function StageSoundQuiz({ word, onCorrect }: StageSoundQuizProps) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(option: string) {
    setSelected(option);
    if (option === word.label) {
      onCorrect();
    }
  }

  return (
    <View className="flex-1 items-center justify-between py-6">
      <MartRoundButton
        variant="secondary"
        icon="sound"
        onPress={() => {
          // TODO: 오디오 에셋 연결
        }}
      />
      <View className="w-[300px] gap-3">
        {word.soundOptions.map((option) => (
          <MartOptionRow
            key={option}
            label={option}
            selected={selected === option}
            onPress={() => handleSelect(option)}
          />
        ))}
      </View>
    </View>
  );
}
