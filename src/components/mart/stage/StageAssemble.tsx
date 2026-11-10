import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import type { MartJamoSlot, MartSyllableSlots } from '@/data/martWords';
import { pickDistractorJamo } from '@/utils/hangul';
import { MartImagePlaceholder } from '../MartImagePlaceholder';
import { MartRoundButton } from '../MartRoundButton';
import { MartTile } from '../MartTile';

interface StageAssembleProps {
  syllables: MartSyllableSlots[];
  onCorrect: () => void;
}

interface FlatSlot {
  syllableIndex: number;
  jamoIndex: number;
  jamo: string;
  given: boolean;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function flattenSlots(syllables: MartSyllableSlots[]): FlatSlot[] {
  return syllables.flatMap((syllable, syllableIndex) =>
    syllable.map((slot, jamoIndex) => ({ syllableIndex, jamoIndex, jamo: slot.jamo, given: slot.given }))
  );
}

function slotKey(slot: { syllableIndex: number; jamoIndex: number }): string {
  return `${slot.syllableIndex}-${slot.jamoIndex}`;
}

export function StageAssemble({ syllables, onCorrect }: StageAssembleProps) {
  const blankSlots = useMemo(() => flattenSlots(syllables).filter((slot) => !slot.given), [syllables]);

  const [filled, setFilled] = useState<Record<string, string>>({});
  const [bank, setBank] = useState(() => {
    const needed = blankSlots.map((slot) => slot.jamo);
    const distractor = pickDistractorJamo(new Set(needed));
    return shuffle([...needed, distractor]);
  });
  const [showIncorrect, setShowIncorrect] = useState(false);

  function handleTilePress(tileIndex: number, jamo: string) {
    const nextEmpty = blankSlots.find((slot) => filled[slotKey(slot)] === undefined);
    if (!nextEmpty) return;

    const key = slotKey(nextEmpty);
    const nextFilled = { ...filled, [key]: jamo };
    setFilled(nextFilled);
    setBank((current) => current.filter((_, i) => i !== tileIndex));

    const isComplete = blankSlots.every((slot) => nextFilled[slotKey(slot)] !== undefined);
    if (!isComplete) return;

    const allCorrect = blankSlots.every((slot) => nextFilled[slotKey(slot)] === slot.jamo);
    if (allCorrect) {
      onCorrect();
      return;
    }
    setShowIncorrect(true);
  }

  function handleRetry() {
    const correctedFilled: Record<string, string> = {};
    const returnedTiles: string[] = [];
    blankSlots.forEach((slot) => {
      const key = slotKey(slot);
      if (filled[key] === slot.jamo) {
        correctedFilled[key] = filled[key];
      } else if (filled[key] !== undefined) {
        returnedTiles.push(filled[key]);
      }
    });
    setFilled(correctedFilled);
    setBank((current) => shuffle([...current, ...returnedTiles]));
    setShowIncorrect(false);
  }

  if (showIncorrect) {
    return (
      <View className="flex-1 items-center justify-between py-6">
        <SlotRow syllables={syllables} filled={filled} showErrors />
        <MartImagePlaceholder className="w-[350px] h-[300px] rounded-2xl" />
        <MartRoundButton variant="primary" icon="retry" onPress={handleRetry} />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-between py-6">
      <MartImagePlaceholder className="w-[350px] h-[130px] rounded-2xl" />
      <SlotRow syllables={syllables} filled={filled} />
      <View className="flex-row flex-wrap gap-3 w-[320px] justify-center">
        {bank.map((jamo, index) => (
          <MartTile key={`${jamo}-${index}`} glyph={jamo} onPress={() => handleTilePress(index, jamo)} />
        ))}
      </View>
    </View>
  );
}

function SlotRow({
  syllables,
  filled,
  showErrors,
}: {
  syllables: MartSyllableSlots[];
  filled: Record<string, string>;
  showErrors?: boolean;
}) {
  return (
    <View className="flex-row flex-wrap gap-3 justify-center">
      {syllables.map((syllable, syllableIndex) => (
        <View key={syllableIndex} className="w-[84px] gap-1">
          {syllable.map((slot, jamoIndex) => (
            <JamoSlot
              key={jamoIndex}
              slot={slot}
              filledJamo={filled[`${syllableIndex}-${jamoIndex}`]}
              showErrors={showErrors}
            />
          ))}
        </View>
      ))}
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
