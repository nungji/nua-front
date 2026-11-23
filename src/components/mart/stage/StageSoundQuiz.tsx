import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useMartWordSound } from '@/hooks/useMartWordSound';
import { OceanSoundButton } from '../OceanCircleButton';
import { OceanProgressPill } from '../OceanDecor';
import { FONT } from '@/theme';

interface StageSoundQuizProps {
  word: string;
  options: string[];
  onCorrect: () => void;
}

// 뜻·소리 익히기 5단계 중 세 번째("소리 퀴즈").
const STEP_INDEX = 2;
const STEP_COUNT = 5;

export function StageSoundQuiz({ word, options, onCorrect }: StageSoundQuizProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const playWordSound = useMartWordSound(word);

  useEffect(() => {
    playWordSound();
  }, [word]);

  function handleSelect(option: string) {
    setSelected(option);
    if (option === word) {
      onCorrect();
    }
  }

  return (
    <>
      <View style={{ paddingHorizontal: 14, paddingTop: 10 }}>
        <OceanProgressPill stepIndex={STEP_INDEX} stepCount={STEP_COUNT} />
      </View>
      <View className="flex-1 items-center justify-between py-6">
        <OceanSoundButton onPress={playWordSound} />
        <View className="w-[280px] gap-3">
          {options.map((option) => {
            const isSelected = selected === option;
            return (
              <Pressable
                key={option}
                onPress={() => handleSelect(option)}
                style={{
                  height: 64,
                  borderRadius: 32,
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  borderWidth: 3,
                  borderColor: isSelected ? '#FF8A1F' : '#8FD0FF',
                }}
              >
                <Text style={{ fontSize: 20, fontFamily: FONT, color: '#1B3A6B' }}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  );
}
