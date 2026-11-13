import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { getMartWordImage } from '@/data/martWordImages';
import { OceanBackground } from '../OceanBackground';
import { OceanProgressPill } from '../OceanDecor';
import { MartImagePlaceholder } from '../MartImagePlaceholder';

interface StageMeaningQuizProps {
  word: string;
  options: string[];
  onCorrect: () => void;
}

// 뜻·소리 익히기 6단계 중 두 번째("뜻 퀴즈").
const STEP_INDEX = 1;

export function StageMeaningQuiz({ word, options, onCorrect }: StageMeaningQuizProps) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(option: string) {
    setSelected(option);
    if (option === word) {
      onCorrect();
    }
  }

  return (
    <OceanBackground>
      <View style={{ paddingHorizontal: 14, paddingTop: 10 }}>
        <OceanProgressPill stepIndex={STEP_INDEX} />
      </View>
      <View className="flex-1 items-center justify-between py-6">
        <View
          style={{
            width: 260,
            height: 230,
            borderRadius: 40,
            backgroundColor: 'rgba(255,255,255,0.94)',
            borderWidth: 5,
            borderColor: '#BFE3FF',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <Svg width={186} height={186} style={{ position: 'absolute' }}>
            <Defs>
              <RadialGradient id="meaning-quiz-glow" cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor="white" />
                <Stop offset="1" stopColor="#9ED8FF" />
              </RadialGradient>
            </Defs>
            <Circle cx={93} cy={93} r={93} fill="url(#meaning-quiz-glow)" />
          </Svg>
          <MartImagePlaceholder imageSrc={getMartWordImage(word)} className="w-[160px] h-[150px] rounded-2xl" />
        </View>
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
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#1B3A6B' }}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </OceanBackground>
  );
}
