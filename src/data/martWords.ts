import type { MartCornerId } from '@/enums';
import { decomposeWord, syllableJamoList } from '@/utils/hangul';

export type MartBlankRule = 'lastSyllable' | 'trickyVowel' | 'lastTwoSyllables' | 'all';

export interface MartRowConfig {
  tier: number;
  label: string;
  blankRule: MartBlankRule;
  words: string[];
}

export interface MartCornerConfig {
  id: MartCornerId;
  title: string;
  rows: MartRowConfig[];
}

export const MART_CORNERS: Record<MartCornerId, MartCornerConfig> = {
  grocery: {
    id: 'grocery',
    title: '식료품',
    rows: [
      {
        tier: 1,
        label: '받침 없는 두 글자, 기본 모음',
        blankRule: 'lastSyllable',
        words: ['우유', '오이', '포도', '두부', '고기', '자두', '가지', '치즈'],
      },
      {
        tier: 2,
        label: '받침 없음, 헷갈리는 모음',
        blankRule: 'trickyVowel',
        words: ['사과', '과자', '배추', '새우'],
      },
      {
        tier: 3,
        label: '받침 없는 세 글자',
        blankRule: 'lastTwoSyllables',
        words: ['바나나', '토마토', '고구마', '요거트'],
      },
      {
        tier: 4,
        label: '받침 있음',
        blankRule: 'all',
        words: ['수박', '당근', '김치', '사탕'],
      },
    ],
  },
  household: {
    id: 'household',
    title: '생활용품',
    rows: [
      {
        tier: 1,
        label: '받침 없는 두 글자, 기본 모음',
        blankRule: 'lastSyllable',
        words: ['비누', '휴지', '모자', '바지', '치마'],
      },
      {
        tier: 2,
        label: '받침 없음, 헷갈리는 모음',
        blankRule: 'trickyVowel',
        words: ['세제', '베개', '가위', '의자'],
      },
      {
        tier: 3,
        label: '받침 없는 세 글자',
        blankRule: 'lastTwoSyllables',
        words: ['수세미', '바구니', '기저귀'],
      },
      {
        tier: 4,
        label: '받침 있음',
        blankRule: 'all',
        words: ['칫솔', '치약', '수건', '우산', '양말', '장갑', '거울', '그릇'],
      },
    ],
  },
  electronics: {
    id: 'electronics',
    title: '전자제품',
    rows: [
      {
        tier: 1,
        label: '받침 없음',
        blankRule: 'lastSyllable',
        words: ['시계', '라디오', '카메라', '마이크', '스피커', '다리미', '마우스', '키보드', '게임기', '드라이기'],
      },
      {
        tier: 2,
        label: '받침 있음',
        blankRule: 'all',
        words: ['전구', '밥솥', '이어폰', '리모컨', '노트북', '선풍기', '냉장고', '세탁기', '청소기', '전화기'],
      },
    ],
  },
};

export function getCornerWords(cornerId: MartCornerId): string[] {
  return MART_CORNERS[cornerId].rows.flatMap((row) => row.words);
}

export function getWordCorner(word: string): MartCornerId {
  const found = (Object.keys(MART_CORNERS) as MartCornerId[]).find((cornerId) =>
    getCornerWords(cornerId).includes(word)
  );
  if (!found) {
    throw new Error(`알 수 없는 마트 단어: ${word}`);
  }
  return found;
}

export function getWordRow(word: string): MartRowConfig {
  const cornerId = getWordCorner(word);
  const row = MART_CORNERS[cornerId].rows.find((candidate) => candidate.words.includes(word));
  if (!row) {
    throw new Error(`알 수 없는 마트 단어: ${word}`);
  }
  return row;
}

export function isRowUnlocked(cornerId: MartCornerId, tier: number, completed: ReadonlySet<string>): boolean {
  if (tier <= 1) return true;
  const previousRow = MART_CORNERS[cornerId].rows.find((row) => row.tier === tier - 1);
  if (!previousRow) return true;
  return previousRow.words.every((word) => completed.has(word));
}

export function isCornerCompleted(cornerId: MartCornerId, completed: ReadonlySet<string>): boolean {
  return getCornerWords(cornerId).every((word) => completed.has(word));
}

export function pickQuizOptions(correctWord: string, count: number): string[] {
  const cornerId = getWordCorner(correctWord);
  const pool = getCornerWords(cornerId).filter((word) => word !== correctWord);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const options = [correctWord, ...shuffled.slice(0, count)];
  return options.sort(() => Math.random() - 0.5);
}

export interface MartJamoSlot {
  jamo: string;
  given: boolean;
}

export type MartSyllableSlots = MartJamoSlot[];

function computeGivenMask(blankRule: MartBlankRule, syllableCount: number, jungList: string[]): boolean[] {
  switch (blankRule) {
    case 'lastSyllable':
      return Array.from({ length: syllableCount }, (_, i) => i !== syllableCount - 1);
    case 'lastTwoSyllables':
      return Array.from({ length: syllableCount }, (_, i) => i < syllableCount - 2);
    case 'all':
      return Array.from({ length: syllableCount }, () => false);
    case 'trickyVowel': {
      const trickyVowels = new Set(['ㅐ', 'ㅘ', 'ㅔ', 'ㅟ', 'ㅢ']);
      const mask = jungList.map((jung) => !trickyVowels.has(jung));
      return mask.includes(false) ? mask : mask.map((_, i) => i !== syllableCount - 1);
    }
    default:
      return Array.from({ length: syllableCount }, () => true);
  }
}

export function buildWordSyllables(word: string, blankRule: MartBlankRule): MartSyllableSlots[] {
  const decomposed = decomposeWord(word);
  const givenMask = computeGivenMask(
    blankRule,
    decomposed.length,
    decomposed.map((syllable) => syllable.jung)
  );

  return decomposed.map((syllable, index) => {
    const given = givenMask[index];
    return syllableJamoList(syllable).map((jamo) => ({ jamo, given }));
  });
}
