const CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

const JUNGSEONG = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ',
];

const JONGSEONG = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

const SYLLABLE_BASE = 0xac00;

export interface HangulSyllable {
  cho: string;
  jung: string;
  jong: string | null;
}

export function decomposeSyllable(char: string): HangulSyllable {
  const code = char.charCodeAt(0) - SYLLABLE_BASE;
  const jongIndex = code % 28;
  const jungIndex = ((code - jongIndex) / 28) % 21;
  const choIndex = ((code - jongIndex) / 28 - jungIndex) / 21;

  return {
    cho: CHOSEONG[choIndex],
    jung: JUNGSEONG[jungIndex],
    jong: jongIndex === 0 ? null : JONGSEONG[jongIndex],
  };
}

export function decomposeWord(word: string): HangulSyllable[] {
  return Array.from(word).map(decomposeSyllable);
}

export function syllableJamoList(syllable: HangulSyllable): string[] {
  return syllable.jong ? [syllable.cho, syllable.jung, syllable.jong] : [syllable.cho, syllable.jung];
}

const DISTRACTOR_POOL = [...CHOSEONG, ...JUNGSEONG, ...JONGSEONG.filter(Boolean)];

export function pickDistractorJamo(excluding: ReadonlySet<string>): string {
  const candidates = DISTRACTOR_POOL.filter((jamo) => !excluding.has(jamo));
  const pool = candidates.length > 0 ? candidates : DISTRACTOR_POOL;
  return pool[Math.floor(Math.random() * pool.length)];
}
