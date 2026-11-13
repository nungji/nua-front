import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { MartJamoSlot, MartSyllableSlots } from '@/data/martWords';
import { getMartWordImage } from '@/data/martWordImages';
import { pickDistractorJamo, vowelSitsBelow } from '@/utils/hangul';
import { OceanBackground } from '../OceanBackground';
import { OceanRetryButton } from '../OceanCircleButton';
import { OceanProgressPill } from '../OceanDecor';
import { MartImagePlaceholder } from '../MartImagePlaceholder';

interface StageAssembleProps {
  word: string;
  syllables: MartSyllableSlots[];
  onCorrect: () => void;
}

interface FlatSlot {
  syllableIndex: number;
  jamoIndex: number;
  jamo: string;
  given: boolean;
}

// 뜻·소리 익히기 6단계 중 다섯 번째("글자 조립").
const STEP_INDEX = 4;

const TILE_GRADIENTS: [string, string][] = [
  ['#FF9CCB', '#FF4F9A'],
  ['#FFC7DE', '#FF8FB8'],
  ['#FFE3F0', '#FFB3D1'],
];

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

export function StageAssemble({ word, syllables, onCorrect }: StageAssembleProps) {
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

  return (
    <OceanBackground>
      <View style={{ paddingHorizontal: 14, paddingTop: 10 }}>
        <OceanProgressPill stepIndex={STEP_INDEX} />
      </View>
      {showIncorrect ? (
        <View className="flex-1 items-center justify-between py-6">
          <ProductTagCard syllables={syllables} filled={filled} showErrors />
          <View
            style={{
              width: 350,
              height: 260,
              borderRadius: 28,
              backgroundColor: 'rgba(255,255,255,0.94)',
              borderWidth: 4,
              borderColor: '#BFE3FF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MartImagePlaceholder imageSrc={getMartWordImage(word)} className="w-[280px] h-[200px] rounded-2xl" />
          </View>
          <OceanRetryButton onPress={handleRetry} />
        </View>
      ) : (
        <View className="flex-1 items-center justify-between py-6">
          <View
            style={{
              width: 350,
              height: 110,
              borderRadius: 24,
              backgroundColor: 'rgba(255,255,255,0.94)',
              borderWidth: 4,
              borderColor: '#BFE3FF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MartImagePlaceholder imageSrc={getMartWordImage(word)} className="w-[300px] h-[80px] rounded-xl" />
          </View>
          <ProductTagCard syllables={syllables} filled={filled} />
          <View className="flex-row flex-wrap gap-3 w-[320px] justify-center">
            {bank.map((jamo, index) => (
              <Pressable
                key={`${jamo}-${index}`}
                onPress={() => handleTilePress(index, jamo)}
                style={{
                  width: 64,
                  height: 60,
                  borderRadius: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: TILE_GRADIENTS[index % TILE_GRADIENTS.length][1],
                  borderWidth: 3,
                  borderColor: '#FF5F9A',
                }}
              >
                <Text style={{ fontSize: 22, fontWeight: '800', color: 'white' }}>{jamo}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </OceanBackground>
  );
}

function ProductTagCard({
  syllables,
  filled,
  showErrors,
}: {
  syllables: MartSyllableSlots[];
  filled: Record<string, string>;
  showErrors?: boolean;
}) {
  return (
    <View
      style={{
        minWidth: 260,
        borderRadius: 22,
        backgroundColor: 'white',
        borderWidth: 5,
        borderColor: '#FF8A1F',
        paddingVertical: 14,
        paddingHorizontal: 16,
      }}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
        {syllables.map((syllable, syllableIndex) => (
          <SyllableBlock
            key={syllableIndex}
            syllable={syllable}
            syllableIndex={syllableIndex}
            filled={filled}
            showErrors={showErrors}
          />
        ))}
      </View>
    </View>
  );
}

function SyllableBlock({
  syllable,
  syllableIndex,
  filled,
  showErrors,
}: {
  syllable: MartSyllableSlots;
  syllableIndex: number;
  filled: Record<string, string>;
  showErrors?: boolean;
}) {
  const [cho, jung, jong] = syllable;
  const belowLayout = vowelSitsBelow(jung.jamo);

  const choSlot = <JamoSlot slot={cho} filledJamo={filled[`${syllableIndex}-0`]} showErrors={showErrors} />;
  const jungSlot = <JamoSlot slot={jung} filledJamo={filled[`${syllableIndex}-1`]} showErrors={showErrors} />;
  const jongSlot = jong ? (
    <JamoSlot slot={jong} filledJamo={filled[`${syllableIndex}-2`]} showErrors={showErrors} />
  ) : null;

  return (
    <View style={{ width: 84, gap: 4 }}>
      {belowLayout ? (
        <>
          {choSlot}
          {jungSlot}
          {jongSlot}
        </>
      ) : (
        <>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <View style={{ flex: 1 }}>{choSlot}</View>
            <View style={{ flex: 1 }}>{jungSlot}</View>
          </View>
          {jongSlot}
        </>
      )}
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

  let backgroundColor = 'white';
  let borderColor = '#FF7EB6';
  let borderStyle: 'solid' | 'dashed' = 'dashed';
  let textColor = '#1B3A6B';

  if (slot.given) {
    backgroundColor = '#A9DBFF';
    borderColor = '#A9DBFF';
    borderStyle = 'solid';
  } else if (display) {
    if (showErrors) {
      const correct = filledJamo === slot.jamo;
      backgroundColor = correct ? '#D7F5DD' : '#FFD9D9';
      borderColor = correct ? '#33C24D' : '#FF5C5C';
    } else {
      backgroundColor = '#FFC7DE';
      borderColor = '#FF8FB8';
    }
    borderStyle = 'solid';
    textColor = '#1B3A6B';
  }

  return (
    <View
      style={{
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        borderWidth: 2.5,
        borderColor,
        borderStyle,
      }}
    >
      {display ? <Text style={{ fontSize: 17, fontWeight: '800', color: textColor }}>{display}</Text> : null}
    </View>
  );
}
