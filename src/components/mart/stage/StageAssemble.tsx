import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import type { MartJamoSlot, MartWordConfig } from '@/data/martWords';
import { MartImagePlaceholder } from '../MartImagePlaceholder';
import { MartRoundButton } from '../MartRoundButton';
import { MartTile } from '../MartTile';

interface StageAssembleProps {
  word: MartWordConfig;
  onCorrect: () => void;
}

const DISTRACTOR_JAMO = 'ㅏ';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function StageAssemble({ word, onCorrect }: StageAssembleProps) {
  const blankIndices = useMemo(
    () => word.slots.reduce<number[]>((acc, slot, index) => (slot.given ? acc : [...acc, index]), []),
    [word]
  );
  const [filled, setFilled] = useState<Record<number, string>>({});
  const [bank, setBank] = useState(() =>
    shuffle([...blankIndices.map((i) => word.slots[i].jamo), DISTRACTOR_JAMO])
  );
  const [showIncorrect, setShowIncorrect] = useState(false);

  function handleTilePress(tileIndex: number, jamo: string) {
    const nextEmptyIndex = blankIndices.find((i) => filled[i] === undefined);
    if (nextEmptyIndex === undefined) return;

    const nextFilled = { ...filled, [nextEmptyIndex]: jamo };
    setFilled(nextFilled);
    setBank((current) => current.filter((_, i) => i !== tileIndex));

    const isComplete = blankIndices.every((i) => nextFilled[i] !== undefined);
    if (!isComplete) return;

    const allCorrect = blankIndices.every((i) => nextFilled[i] === word.slots[i].jamo);
    if (allCorrect) {
      onCorrect();
      return;
    }
    setShowIncorrect(true);
  }

  function handleRetry() {
    const correctedFilled: Record<number, string> = {};
    const returnedTiles: string[] = [];
    blankIndices.forEach((i) => {
      if (filled[i] === word.slots[i].jamo) {
        correctedFilled[i] = filled[i];
      } else if (filled[i] !== undefined) {
        returnedTiles.push(filled[i]);
      }
    });
    setFilled(correctedFilled);
    setBank((current) => shuffle([...current, ...returnedTiles]));
    setShowIncorrect(false);
  }

  if (showIncorrect) {
    return (
      <View className="flex-1 items-center justify-between py-6">
        <SlotRow word={word} filled={filled} showErrors />
        <MartImagePlaceholder className="w-[350px] h-[300px] rounded-2xl" />
        <MartRoundButton variant="primary" icon="retry" onPress={handleRetry} />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-between py-6">
      <MartImagePlaceholder imageSrc={word.imageSrc} className="w-[350px] h-[130px] rounded-2xl" />
      <SlotRow word={word} filled={filled} />
      <View className="flex-row flex-wrap gap-3 w-[320px] justify-center">
        {bank.map((jamo, index) => (
          <MartTile key={`${jamo}-${index}`} glyph={jamo} onPress={() => handleTilePress(index, jamo)} />
        ))}
      </View>
    </View>
  );
}

function SlotRow({
  word,
  filled,
  showErrors,
}: {
  word: MartWordConfig;
  filled: Record<number, string>;
  showErrors?: boolean;
}) {
  return (
    <View className="flex-row gap-3">
      {word.syllables.map((_, syllableIndex) => {
        const consonantIndex = syllableIndex * 2;
        const vowelIndex = syllableIndex * 2 + 1;
        return (
          <View key={syllableIndex} className="w-[84px] h-[84px] gap-1">
            <JamoSlot
              slot={word.slots[consonantIndex]}
              filledJamo={filled[consonantIndex]}
              showErrors={showErrors}
            />
            <JamoSlot
              slot={word.slots[vowelIndex]}
              filledJamo={filled[vowelIndex]}
              showErrors={showErrors}
            />
          </View>
        );
      })}
    </View>
  );
}

function JamoSlot({
  slot,
  filledJamo,
  showErrors,
}: {
  slot: MartJamoSlot;
  filledJamo?: string;
  showErrors?: boolean;
}) {
  const display = slot.given ? slot.jamo : filledJamo;

  let colorClassName: string;
  if (slot.given) {
    colorClassName = 'bg-gray-200';
  } else if (display) {
    if (showErrors) {
      colorClassName = filledJamo === slot.jamo ? 'bg-green-100' : 'bg-red-100';
    } else {
      colorClassName = 'bg-green-100';
    }
  } else {
    colorClassName = 'bg-white border-2 border-dashed border-gray-300';
  }

  return (
    <View className={`h-[32px] rounded-lg items-center justify-center ${colorClassName}`}>
      {display ? <Text className="text-lg font-bold">{display}</Text> : null}
    </View>
  );
}
