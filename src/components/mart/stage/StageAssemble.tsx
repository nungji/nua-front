import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { MartJamoSlot, MartSyllableSlots } from '@/data/martWords';
import { getMartWordImage } from '@/data/martWordImages';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { isVowelJamo, pickDistractorJamo, vowelSitsBelow } from '@/utils/hangul';
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

// 뜻·소리 익히기 5단계 중 네 번째("글자 조립").
const STEP_INDEX = 3;
const STEP_COUNT = 5;

// 피그마 Mart/Jamo/자음(파랑)·Mart/Jamo/모음(분홍) 타일 색.
const JAMO_TILE_COLORS = {
  consonant: { from: '#6CC8FF', to: '#1E78E8', shadow: '#0B5FD0' },
  vowel: { from: '#FF9CCB', to: '#FF4F9A', shadow: '#C42A6E' },
} as const;

const TILE_SIZE = 62;
const TILE_SHADOW = 5;

function JamoTile({ jamo, onPress }: { jamo: string; onPress: () => void }) {
  const kind = isVowelJamo(jamo) ? 'vowel' : 'consonant';
  const colors = JAMO_TILE_COLORS[kind];
  const gradientId = `mart-jamo-${kind}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={jamo}
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE + TILE_SHADOW,
        borderRadius: 18,
        backgroundColor: colors.shadow,
      }}
    >
      <View
        style={{
          width: TILE_SIZE,
          height: TILE_SIZE,
          borderRadius: 18,
          borderWidth: 3,
          borderColor: 'white',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Svg width="100%" height="100%" style={{ position: 'absolute' }}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.from} />
              <Stop offset="1" stopColor={colors.to} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
        </Svg>
        <Text style={{ fontSize: 34, fontWeight: '800', color: 'white' }}>{jamo}</Text>
      </View>
    </Pressable>
  );
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
    <>
      <View style={{ paddingHorizontal: 14, paddingTop: 10 }}>
        <OceanProgressPill stepIndex={STEP_INDEX} stepCount={STEP_COUNT} />
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
              <JamoTile key={`${jamo}-${index}`} jamo={jamo} onPress={() => handleTilePress(index, jamo)} />
            ))}
          </View>
        </View>
      )}
    </>
  );
}

const SLOT_HEIGHT = 36;
const SLOT_GAP = 4;

// belowLayout이면 자모 하나당 한 줄(2~3줄), 옆붙는 레이아웃이면 자음+모음이 한 줄을
// 같이 쓰고 받침만 그 아래 한 줄(1~2줄) — 그래서 음절마다 줄 수가 다를 수 있다.
function rowCount(syllable: MartSyllableSlots, belowLayout: boolean): number {
  if (belowLayout) return syllable.length;
  return syllable.length > 2 ? 2 : 1;
}

function blockHeight(rows: number): number {
  return rows * SLOT_HEIGHT + (rows - 1) * SLOT_GAP;
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
  const rowCounts = syllables.map((syllable) => rowCount(syllable, vowelSitsBelow(syllable[1].jamo)));
  const blockMinHeight = blockHeight(Math.max(...rowCounts));

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
            minHeight={blockMinHeight}
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
  minHeight,
}: {
  syllable: MartSyllableSlots;
  syllableIndex: number;
  filled: Record<string, string>;
  showErrors?: boolean;
  minHeight: number;
}) {
  const [cho, jung, jong] = syllable;
  const belowLayout = vowelSitsBelow(jung.jamo);

  const choSlot = <JamoSlot slot={cho} filledJamo={filled[`${syllableIndex}-0`]} showErrors={showErrors} />;
  const jungSlot = <JamoSlot slot={jung} filledJamo={filled[`${syllableIndex}-1`]} showErrors={showErrors} />;
  const jongSlot = jong ? (
    <JamoSlot slot={jong} filledJamo={filled[`${syllableIndex}-2`]} showErrors={showErrors} />
  ) : null;

  return (
    <View style={{ width: 84, minHeight, justifyContent: 'center', gap: 4 }}>
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
    // 미리 채워진 칸은 자음 조각(파랑)과 헷갈리지 않게 중립 회색으로 둔다.
    backgroundColor = '#E7EDF7';
    borderColor = '#E7EDF7';
    borderStyle = 'solid';
  } else if (display) {
    if (showErrors) {
      const correct = filledJamo === slot.jamo;
      backgroundColor = correct ? '#D7F5DD' : '#FFD9D9';
      borderColor = correct ? '#33C24D' : '#FF5C5C';
    } else if (isVowelJamo(display)) {
      backgroundColor = '#FFC7DE';
      borderColor = '#FF4F9A';
    } else {
      backgroundColor = '#CDE9FF';
      borderColor = '#1E78E8';
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
