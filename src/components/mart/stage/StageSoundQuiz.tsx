import { useState } from 'react';
import { View } from 'react-native';
import { useMartWordSound } from '@/hooks/useMartWordSound';
import { MartOptionRow } from '../MartOptionRow';
import { MartRoundButton } from '../MartRoundButton';

interface StageSoundQuizProps {
  word: string;
  options: string[];
  onCorrect: () => void;
}

export function StageSoundQuiz({ word, options, onCorrect }: StageSoundQuizProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const playWordSound = useMartWordSound(word);

  function handleSelect(option: string) {
    setSelected(option);
    if (option === word) {
      onCorrect();
    }
  }

  return (
    <View className="flex-1 items-center justify-between py-6">
      <MartRoundButton
        variant="secondary"
        icon="sound"
        onPress={playWordSound}
      />
      <View className="w-[300px] gap-3">
        {options.map((option) => (
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
