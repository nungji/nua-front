import { useState } from 'react';
import { View } from 'react-native';
import type { MartWordConfig } from '@/data/martWords';
import { MartImagePlaceholder } from '../MartImagePlaceholder';
import { MartOptionRow } from '../MartOptionRow';

interface StageMeaningQuizProps {
  word: MartWordConfig;
  onCorrect: () => void;
}

export function StageMeaningQuiz({ word, onCorrect }: StageMeaningQuizProps) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(option: string) {
    setSelected(option);
    if (option === word.label) {
      onCorrect();
    }
  }

  return (
    <View className="flex-1 items-center justify-between py-6">
      <MartImagePlaceholder imageSrc={word.imageSrc} className="w-[300px] h-[250px] rounded-2xl" />
      <View className="w-[306px] gap-3">
        {word.meaningOptions.map((option) => (
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
