# 상품표가 지워진 마트 — 와이어프레임 화면 구현 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Figma 와이어프레임(node 46:47)을 기반으로 "상품표가 지워진 마트" 게임의 화면(프롤로그·마트지도·스테이지 8단계·보상·단어장·엔딩)을 5개 단어(우유·오이·포도·두부·고기) 콘텐츠로 구현한다. 확장 단어(보너스 단어) 기능은 설계 논의 중 전체 제거하기로 결정했다(Task 11b 참고).

**Architecture:** `src/app/mart/` 아래 5개 라우트(index, map, stage/[word], wordbook, ending)로 구성. 스테이지 내부 8단계(B-1~B-7, C-1)는 라우터 전환이 아니라 `stage/[word].tsx` 안에서 zustand 스토어의 `stageStep` 값으로 분기한다. 글자 조립(B-6) 틀림→재도전(B-8) 흐름은 `StageAssemble` 컴포넌트 내부 로컬 state로만 처리해, 맞게 채운 칸은 유지하고 틀린 칸만 다시 채우게 한다.

**Tech Stack:** Expo (SDK 57) + React Native 0.86, TypeScript 6 strict, NativeWind 4(Tailwind 3), zustand 5, expo-router.

**Spec:** `docs/superpowers/specs/2026-10-26-mart-game-design.md`

**Branch:** `feature/mart-wireframe-screens` (이슈 #30). 스펙 문서 커밋이 이미 이 브랜치에 있다 — 아래 태스크들은 이 브랜치에 이어서 커밋한다.

## Global Constraints

- 새 npm 의존성을 추가하지 않는다. 아이콘은 텍스트 글리프, 이미지는 회색 placeholder로 구현한다.
- 레포에 테스트 프레임워크가 없다. 각 태스크의 검증은 `npm run typecheck` + Expo 수동 확인으로 한다.
- 이미지·오디오 에셋이 없다. 이미지는 `imageSrc?: string` prop을 받아 없으면 회색 박스를 렌더하는 공용 컴포넌트로 통일한다. 오디오 재생 버튼은 누를 수 있게 두되 실제 재생 로직은 `// TODO: 오디오 에셋 연결` 주석과 함께 비워둔다.
- 비주얼은 와이어프레임의 레이아웃·구조만 따르고 색상은 Tailwind 기본 팔레트로 가볍게 채운다(Kurzgesagt풍 최종 디자인은 범위 밖).
- 코드 스타일: 작은따옴표, 세미콜론, 2칸 들여쓰기. 경로 별칭 `@/*` → `src/*`.
- 커밋 메시지는 `접두사: 한글 서술문` 형식(`add:`/`edit:`/`fix:`/`refactor:`/`chore:`/`rm:`/`format:`). 이 플랜의 마지막 커밋에만 `Closes #30`을 붙인다.

---

### Task 1: 데이터 모델 (enums, 단어 설정)

**Files:**
- Modify: `src/enums.ts` (현재 빈 파일)
- Create: `src/data/martWords.ts`

**Interfaces:**
- Produces: `MartWordId` (`'milk'|'cucumber'|'grape'|'tofu'|'meat'`), `MartWordStatus` (`'locked'|'unlocked'|'completed'`), `MartStageStep` (9개 리터럴), `MART_WORD_ORDER: MartWordId[]`, `MART_STAGE_STEPS: MartStageStep[]`, `MartJamoSlot { jamo: string; given: boolean }`, `MartWordConfig { id, label, syllables, slots, meaningOptions, imageSrc? }`, `MART_WORDS: Record<MartWordId, MartWordConfig>`.

- [ ] **Step 1: `src/enums.ts` 작성**

```ts
export type MartWordId = 'milk' | 'cucumber' | 'grape' | 'tofu' | 'meat';

export type MartWordStatus = 'locked' | 'unlocked' | 'completed';

export type MartStageStep =
  | 'problem'
  | 'meetWord'
  | 'meaningQuiz'
  | 'listen'
  | 'soundQuiz'
  | 'assemble'
  | 'correct'
  | 'reward';

export const MART_WORD_ORDER: MartWordId[] = ['milk', 'cucumber', 'grape', 'tofu', 'meat'];

export const MART_STAGE_STEPS: MartStageStep[] = [
  'problem',
  'meetWord',
  'meaningQuiz',
  'listen',
  'soundQuiz',
  'assemble',
  'correct',
  'reward',
];
```

- [ ] **Step 2: `src/data/martWords.ts` 작성**

자모 분해는 와이어프레임 A-3의 난이도(채울 칸 수: 우유2/오이2/포도3/두부4/고기4)와 정확히 맞춘 것이다. `given: true`는 이미 채워져 보이는 칸, `given: false`는 아이가 채울 빈칸이다.

```ts
import type { MartWordId } from '@/enums';

export interface MartJamoSlot {
  jamo: string;
  given: boolean;
}

export interface MartWordConfig {
  id: MartWordId;
  label: string;
  syllables: string[];
  slots: MartJamoSlot[];
  meaningOptions: string[];
  imageSrc?: string;
}

export const MART_WORDS: Record<MartWordId, MartWordConfig> = {
  milk: {
    id: 'milk',
    label: '우유',
    syllables: ['우', '유'],
    slots: [
      { jamo: 'ㅇ', given: true },
      { jamo: 'ㅜ', given: false },
      { jamo: 'ㅇ', given: true },
      { jamo: 'ㅠ', given: false },
    ],
    meaningOptions: ['우유', '주스', '물'],
  },
  cucumber: {
    id: 'cucumber',
    label: '오이',
    syllables: ['오', '이'],
    slots: [
      { jamo: 'ㅇ', given: true },
      { jamo: 'ㅗ', given: true },
      { jamo: 'ㅇ', given: false },
      { jamo: 'ㅣ', given: false },
    ],
    meaningOptions: ['오이', '당근', '감자'],
  },
  grape: {
    id: 'grape',
    label: '포도',
    syllables: ['포', '도'],
    slots: [
      { jamo: 'ㅍ', given: false },
      { jamo: 'ㅗ', given: true },
      { jamo: 'ㄷ', given: false },
      { jamo: 'ㅗ', given: false },
    ],
    meaningOptions: ['포도', '사과', '수박'],
  },
  tofu: {
    id: 'tofu',
    label: '두부',
    syllables: ['두', '부'],
    slots: [
      { jamo: 'ㄷ', given: false },
      { jamo: 'ㅜ', given: false },
      { jamo: 'ㅂ', given: false },
      { jamo: 'ㅜ', given: false },
    ],
    meaningOptions: ['두부', '계란', '김치'],
  },
  meat: {
    id: 'meat',
    label: '고기',
    syllables: ['고', '기'],
    slots: [
      { jamo: 'ㄱ', given: false },
      { jamo: 'ㅗ', given: false },
      { jamo: 'ㄱ', given: false },
      { jamo: 'ㅣ', given: false },
    ],
    meaningOptions: ['고기', '생선', '빵'],
  },
};
```

- [ ] **Step 3: 타입 검증**

Run: `npm run typecheck`
Expected: 에러 없음 (아직 아무도 이 파일들을 참조하지 않으므로 컴파일만 통과하면 됨)

- [ ] **Step 4: Commit**

```bash
git add src/enums.ts src/data/martWords.ts
git commit -m "add: 마트 게임 단어 데이터와 enum 타입 추가"
```

---

### Task 2: zustand 스토어

**Files:**
- Create: `src/store/useMartStore.ts`

**Interfaces:**
- Consumes: `MartWordId`, `MartWordStatus`, `MartStageStep`, `MART_WORD_ORDER`, `MART_STAGE_STEPS` (Task 1)
- Produces: `useMartStore` 훅. 상태: `hasSeenPrologue: boolean`, `wordStatus: Record<MartWordId, MartWordStatus>`, `activeWord: MartWordId | null`, `stageStep: MartStageStep`, `collectedWords: MartWordId[]`. 액션: `seePrologue()`, `startStage(word: MartWordId)`, `advanceStep()`, `completeStage()`.

- [ ] **Step 1: `src/store/useMartStore.ts` 작성**

```ts
import { create } from 'zustand';
import { MART_STAGE_STEPS, MART_WORD_ORDER } from '@/enums';
import type { MartStageStep, MartWordId, MartWordStatus } from '@/enums';

interface MartState {
  hasSeenPrologue: boolean;
  wordStatus: Record<MartWordId, MartWordStatus>;
  activeWord: MartWordId | null;
  stageStep: MartStageStep;
  collectedWords: MartWordId[];
  seePrologue: () => void;
  startStage: (word: MartWordId) => void;
  advanceStep: () => void;
  completeStage: () => void;
}

const INITIAL_WORD_STATUS: Record<MartWordId, MartWordStatus> = {
  milk: 'unlocked',
  cucumber: 'locked',
  grape: 'locked',
  tofu: 'locked',
  meat: 'locked',
};

export const useMartStore = create<MartState>((set, get) => ({
  hasSeenPrologue: false,
  wordStatus: INITIAL_WORD_STATUS,
  activeWord: null,
  stageStep: 'problem',
  collectedWords: [],

  seePrologue: () => set({ hasSeenPrologue: true }),

  startStage: (word) => set({ activeWord: word, stageStep: 'problem' }),

  advanceStep: () => {
    const { stageStep } = get();
    const currentIndex = MART_STAGE_STEPS.indexOf(stageStep);
    const nextStep = MART_STAGE_STEPS[currentIndex + 1];
    if (nextStep) set({ stageStep: nextStep });
  },

  completeStage: () => {
    const { activeWord, wordStatus, collectedWords } = get();
    if (!activeWord) return;

    const currentIndex = MART_WORD_ORDER.indexOf(activeWord);
    const nextWord = MART_WORD_ORDER[currentIndex + 1];
    const nextWordStatus: Record<MartWordId, MartWordStatus> = {
      ...wordStatus,
      [activeWord]: 'completed',
    };
    if (nextWord && nextWordStatus[nextWord] === 'locked') {
      nextWordStatus[nextWord] = 'unlocked';
    }

    set({
      wordStatus: nextWordStatus,
      collectedWords: collectedWords.includes(activeWord)
        ? collectedWords
        : [...collectedWords, activeWord],
    });
  },
}));
```

- [ ] **Step 2: 타입 검증**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 3: Commit**

```bash
git add src/store/useMartStore.ts
git commit -m "add: 마트 게임 진행 상태 zustand 스토어 추가"
```

---

### Task 3: 공용 기초 컴포넌트 (이미지 placeholder, 아이콘)

**Files:**
- Create: `src/components/mart/MartImagePlaceholder.tsx`
- Create: `src/components/mart/MartIcon.tsx`

**Interfaces:**
- Produces: `MartImagePlaceholder({ imageSrc?, className? })`, `MartIconName` 유니언 타입, `MartIcon({ name: MartIconName, size?: number })`.

- [ ] **Step 1: `src/components/mart/MartImagePlaceholder.tsx` 작성**

```tsx
import { Image, View } from 'react-native';

interface MartImagePlaceholderProps {
  imageSrc?: string;
  className?: string;
}

export function MartImagePlaceholder({ imageSrc, className }: MartImagePlaceholderProps) {
  if (imageSrc) {
    return <Image source={{ uri: imageSrc }} className={className} resizeMode="cover" />;
  }
  return <View className={`bg-gray-300 ${className ?? ''}`} />;
}
```

- [ ] **Step 2: `src/components/mart/MartIcon.tsx` 작성**

새 아이콘 라이브러리 의존성을 추가하지 않기로 했으므로 텍스트 글리프로 구현한다(스펙 참고).

```tsx
import { Text } from 'react-native';

export type MartIconName =
  | 'back'
  | 'next'
  | 'sound'
  | 'book'
  | 'retry'
  | 'home'
  | 'check'
  | 'star'
  | 'hand'
  | 'lock';

const ICON_GLYPH: Record<MartIconName, string> = {
  back: '←',
  next: '→',
  sound: '♪',
  book: '책',
  retry: '↻',
  home: '⌂',
  check: '✓',
  star: '★',
  hand: '☞',
  lock: '⚿',
};

interface MartIconProps {
  name: MartIconName;
  size?: number;
}

export function MartIcon({ name, size = 24 }: MartIconProps) {
  return <Text style={{ fontSize: size, lineHeight: size }}>{ICON_GLYPH[name]}</Text>;
}
```

- [ ] **Step 3: 타입 검증**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 4: Commit**

```bash
git add src/components/mart/MartImagePlaceholder.tsx src/components/mart/MartIcon.tsx
git commit -m "add: 마트 게임 이미지 placeholder와 아이콘 컴포넌트 추가"
```

---

### Task 4: 공용 UI — TopBar, RoundButton

**Files:**
- Create: `src/components/mart/MartTopBar.tsx`
- Create: `src/components/mart/MartRoundButton.tsx`

**Interfaces:**
- Consumes: `MartIcon`, `MartIconName` (Task 3)
- Produces: `MartTopBar({ title, onBack?, rightIcon?: MartIconName, onPressRight? })`, `MartRoundButton({ variant: 'primary'|'secondary'|'small', icon: MartIconName, onPress, disabled? })`.

- [ ] **Step 1: `src/components/mart/MartTopBar.tsx` 작성**

```tsx
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { MartIcon, type MartIconName } from './MartIcon';

interface MartTopBarProps {
  title: string;
  onBack?: () => void;
  rightIcon?: MartIconName;
  onPressRight?: () => void;
}

export function MartTopBar({ title, onBack, rightIcon, onPressRight }: MartTopBarProps) {
  const router = useRouter();

  return (
    <View className="h-[60px] flex-row items-center justify-between px-4 bg-amber-100">
      <Pressable onPress={onBack ?? (() => router.back())} hitSlop={8} accessibilityLabel="뒤로가기">
        <MartIcon name="back" />
      </Pressable>
      <Text className="text-base font-bold">{title}</Text>
      {rightIcon ? (
        <Pressable onPress={onPressRight} hitSlop={8} accessibilityLabel={rightIcon}>
          <MartIcon name={rightIcon} />
        </Pressable>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  );
}
```

- [ ] **Step 2: `src/components/mart/MartRoundButton.tsx` 작성**

```tsx
import { Pressable } from 'react-native';
import { MartIcon, type MartIconName } from './MartIcon';

type MartRoundButtonVariant = 'primary' | 'secondary' | 'small';

interface MartRoundButtonProps {
  variant: MartRoundButtonVariant;
  icon: MartIconName;
  onPress: () => void;
  disabled?: boolean;
}

const SIZE_BY_VARIANT: Record<MartRoundButtonVariant, number> = {
  primary: 72,
  secondary: 72,
  small: 44,
};

const BG_BY_VARIANT: Record<MartRoundButtonVariant, string> = {
  primary: 'bg-orange-400',
  secondary: 'bg-sky-300',
  small: 'bg-gray-200',
};

export function MartRoundButton({ variant, icon, onPress, disabled }: MartRoundButtonProps) {
  const size = SIZE_BY_VARIANT[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`items-center justify-center rounded-full ${BG_BY_VARIANT[variant]} ${disabled ? 'opacity-40' : ''}`}
      style={{ width: size, height: size }}
    >
      <MartIcon name={icon} size={variant === 'small' ? 18 : 28} />
    </Pressable>
  );
}
```

- [ ] **Step 3: 타입 검증**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 4: Commit**

```bash
git add src/components/mart/MartTopBar.tsx src/components/mart/MartRoundButton.tsx
git commit -m "add: 마트 게임 TopBar, RoundButton 컴포넌트 추가"
```

---

### Task 5: 공용 UI — Option, Tile, WordCard, ComicPanel, FourPanelComic

**Files:**
- Create: `src/components/mart/MartOptionRow.tsx`
- Create: `src/components/mart/MartTile.tsx`
- Create: `src/components/mart/MartWordCard.tsx`
- Create: `src/components/mart/MartComicPanel.tsx`
- Create: `src/components/mart/FourPanelComic.tsx`

**Interfaces:**
- Consumes: `MartImagePlaceholder` (Task 3), `MartRoundButton` (Task 4)
- Produces: `MartOptionRow({ label, selected?, onPress })`, `MartTile({ glyph, used?, onPress })`, `MartWordCard({ label, imageSrc?, locked? })`, `MartComicPanel({ imageSrc? })`, `FourPanelComic({ panels: (string|undefined)[], onNext })`.

- [ ] **Step 1: `src/components/mart/MartOptionRow.tsx` 작성**

```tsx
import { Pressable, Text } from 'react-native';

interface MartOptionRowProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export function MartOptionRow({ label, selected, onPress }: MartOptionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`h-[56px] rounded-2xl px-4 flex-row items-center justify-center border-2 ${
        selected ? 'bg-orange-100 border-orange-400' : 'bg-white border-gray-200'
      }`}
    >
      <Text className="text-base font-semibold">{label}</Text>
    </Pressable>
  );
}
```

- [ ] **Step 2: `src/components/mart/MartTile.tsx` 작성**

```tsx
import { Pressable, Text } from 'react-native';

interface MartTileProps {
  glyph: string;
  used?: boolean;
  onPress: () => void;
}

export function MartTile({ glyph, used, onPress }: MartTileProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={used}
      className={`w-[60px] h-[60px] rounded-xl items-center justify-center ${
        used ? 'bg-gray-100 opacity-40' : 'bg-yellow-200'
      }`}
    >
      <Text className="text-2xl font-bold">{glyph}</Text>
    </Pressable>
  );
}
```

- [ ] **Step 3: `src/components/mart/MartWordCard.tsx` 작성**

```tsx
import { Text, View } from 'react-native';
import { MartImagePlaceholder } from './MartImagePlaceholder';

interface MartWordCardProps {
  label: string;
  imageSrc?: string;
  locked?: boolean;
}

export function MartWordCard({ label, imageSrc, locked }: MartWordCardProps) {
  return (
    <View
      className={`w-[104px] h-[130px] rounded-2xl overflow-hidden bg-white border-2 border-gray-200 ${
        locked ? 'opacity-30' : ''
      }`}
    >
      <MartImagePlaceholder imageSrc={imageSrc} className="flex-1" />
      <Text className="text-center py-1 font-bold">{locked ? '?' : label}</Text>
    </View>
  );
}
```

- [ ] **Step 4: `src/components/mart/MartComicPanel.tsx` 작성**

```tsx
import { View } from 'react-native';
import { MartImagePlaceholder } from './MartImagePlaceholder';

interface MartComicPanelProps {
  imageSrc?: string;
}

export function MartComicPanel({ imageSrc }: MartComicPanelProps) {
  return (
    <View className="w-[171px] h-[280px] rounded-xl overflow-hidden border-2 border-gray-300">
      <MartImagePlaceholder imageSrc={imageSrc} className="flex-1" />
    </View>
  );
}
```

- [ ] **Step 5: `src/components/mart/FourPanelComic.tsx` 작성**

```tsx
import { View } from 'react-native';
import { MartComicPanel } from './MartComicPanel';
import { MartRoundButton } from './MartRoundButton';

interface FourPanelComicProps {
  panels: (string | undefined)[];
  onNext: () => void;
}

export function FourPanelComic({ panels, onNext }: FourPanelComicProps) {
  return (
    <View className="flex-1 items-center justify-between py-6">
      <View className="flex-row flex-wrap w-[350px] justify-between">
        {panels.map((src, index) => (
          <View key={index} className="mb-2">
            <MartComicPanel imageSrc={src} />
          </View>
        ))}
      </View>
      <MartRoundButton variant="primary" icon="next" onPress={onNext} />
    </View>
  );
}
```

- [ ] **Step 6: 타입 검증**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 7: Commit**

```bash
git add src/components/mart/MartOptionRow.tsx src/components/mart/MartTile.tsx src/components/mart/MartWordCard.tsx src/components/mart/MartComicPanel.tsx src/components/mart/FourPanelComic.tsx
git commit -m "add: 마트 게임 옵션, 타일, 단어카드, 4컷 컴포넌트 추가"
```

---

### Task 6: 마트 레이아웃 + 프롤로그 (A-1)

**Files:**
- Create: `src/app/mart/_layout.tsx`
- Create: `src/app/mart/index.tsx`

**Interfaces:**
- Consumes: `FourPanelComic`, `MartTopBar` (Task 4, 5), `useMartStore` (Task 2)

- [ ] **Step 1: `src/app/mart/_layout.tsx` 작성**

```tsx
import { Stack } from 'expo-router';

export default function MartLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

- [ ] **Step 2: `src/app/mart/index.tsx` 작성**

```tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FourPanelComic } from '@/components/mart/FourPanelComic';
import { MartTopBar } from '@/components/mart/MartTopBar';
import { useMartStore } from '@/store/useMartStore';

export default function MartPrologue() {
  const router = useRouter();
  const hasSeenPrologue = useMartStore((state) => state.hasSeenPrologue);
  const seePrologue = useMartStore((state) => state.seePrologue);

  useEffect(() => {
    if (hasSeenPrologue) {
      router.replace('/mart/map');
    }
  }, [hasSeenPrologue, router]);

  if (hasSeenPrologue) return null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title="상품표가 지워진 마트" />
      <FourPanelComic
        panels={[undefined, undefined, undefined, undefined]}
        onNext={() => {
          seePrologue();
          router.replace('/mart/map');
        }}
      />
    </SafeAreaView>
  );
}
```

- [ ] **Step 3: 타입 검증**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 4: 수동 확인**

`npm start`로 Expo 실행 후 브라우저/디바이스에서 `/mart` 경로로 이동. 4컷 placeholder와 다음 버튼이 보이고, 누르면 `/mart/map`으로 이동(아직 map.tsx 없으니 404/에러는 정상 — Task 7에서 해결).

- [ ] **Step 5: Commit**

```bash
git add src/app/mart/_layout.tsx src/app/mart/index.tsx
git commit -m "add: 마트 게임 프롤로그 화면(A-1) 추가"
```

---

### Task 7: 마트 지도 (A-2)

**Files:**
- Create: `src/app/mart/map.tsx`

**Interfaces:**
- Consumes: `MartTopBar`, `MartImagePlaceholder`, `MartIcon`, `MartRoundButton` (Task 3, 4, 5), `MART_WORDS`, `MART_WORD_ORDER` (Task 1), `useMartStore` (Task 2)

- [ ] **Step 1: `src/app/mart/map.tsx` 작성**

```tsx
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MartIcon } from '@/components/mart/MartIcon';
import { MartImagePlaceholder } from '@/components/mart/MartImagePlaceholder';
import { MartRoundButton } from '@/components/mart/MartRoundButton';
import { MartTopBar } from '@/components/mart/MartTopBar';
import { MART_WORDS } from '@/data/martWords';
import { MART_WORD_ORDER } from '@/enums';
import { useMartStore } from '@/store/useMartStore';

export default function MartMap() {
  const router = useRouter();
  const wordStatus = useMartStore((state) => state.wordStatus);
  const startStage = useMartStore((state) => state.startStage);
  const allCompleted = MART_WORD_ORDER.every((id) => wordStatus[id] === 'completed');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title="마트 지도" rightIcon="book" onPressRight={() => router.push('/mart/wordbook')} />
      <View className="flex-1 flex-row flex-wrap p-4 justify-between content-start">
        {MART_WORD_ORDER.map((wordId) => {
          const word = MART_WORDS[wordId];
          const locked = wordStatus[wordId] === 'locked';
          return (
            <Pressable
              key={wordId}
              disabled={locked}
              onPress={() => {
                startStage(wordId);
                router.push(`/mart/stage/${wordId}`);
              }}
              className={`w-[140px] h-[146px] mb-4 rounded-2xl p-2 items-center bg-gray-50 ${
                locked ? 'opacity-50' : ''
              }`}
            >
              <View className="w-[80px] h-[24px] rounded bg-gray-200 items-center justify-center mb-1">
                <Text className="text-xs">{locked ? '' : word.label}</Text>
              </View>
              <MartImagePlaceholder imageSrc={word.imageSrc} className="w-[120px] h-[70px] rounded" />
              <View className="mt-1">
                <MartIcon name={locked ? 'lock' : 'hand'} size={20} />
              </View>
            </Pressable>
          );
        })}
      </View>
      {allCompleted ? (
        <View className="items-center pb-6">
          <MartRoundButton variant="primary" icon="next" onPress={() => router.push('/mart/ending')} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}
```

- [ ] **Step 2: 타입 검증**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 3: 수동 확인**

Expo에서 `/mart`를 거쳐 지도 화면 진입. 우유만 밝게(해금) 표시되고 나머지 4개는 흐리게 + 자물쇠 아이콘인지 확인. 우유 진열대를 누르면 `/mart/stage/milk`로 이동 시도(아직 화면 없음 — Task 12에서 완성).

- [ ] **Step 4: Commit**

```bash
git add src/app/mart/map.tsx
git commit -m "add: 마트 지도 화면(A-2) 추가"
```

---

### Task 8: 스테이지 단계 — 문제 상황 · 단어 만나기 · 뜻 퀴즈 (B-1~B-3)

**Files:**
- Create: `src/components/mart/stage/StageProblem.tsx`
- Create: `src/components/mart/stage/StageMeetWord.tsx`
- Create: `src/components/mart/stage/StageMeaningQuiz.tsx`

**Interfaces:**
- Consumes: `FourPanelComic`, `MartImagePlaceholder`, `MartRoundButton`, `MartOptionRow` (Task 4, 5), `MartWordConfig` (Task 1)
- Produces: `StageProblem({ onNext })`, `StageMeetWord({ word: MartWordConfig, onNext })`, `StageMeaningQuiz({ word: MartWordConfig, onCorrect })`.

- [ ] **Step 1: `src/components/mart/stage/StageProblem.tsx` 작성**

```tsx
import { FourPanelComic } from '../FourPanelComic';

interface StageProblemProps {
  onNext: () => void;
}

export function StageProblem({ onNext }: StageProblemProps) {
  return <FourPanelComic panels={[undefined, undefined, undefined, undefined]} onNext={onNext} />;
}
```

- [ ] **Step 2: `src/components/mart/stage/StageMeetWord.tsx` 작성**

```tsx
import { Text, View } from 'react-native';
import type { MartWordConfig } from '@/data/martWords';
import { MartImagePlaceholder } from '../MartImagePlaceholder';
import { MartRoundButton } from '../MartRoundButton';

interface StageMeetWordProps {
  word: MartWordConfig;
  onNext: () => void;
}

export function StageMeetWord({ word, onNext }: StageMeetWordProps) {
  return (
    <View className="flex-1 items-center justify-between py-6">
      <MartImagePlaceholder imageSrc={word.imageSrc} className="w-[350px] h-[330px] rounded-2xl" />
      <View className="flex-row items-center gap-3">
        <Text className="text-4xl font-bold">{word.label}</Text>
        <MartRoundButton
          variant="small"
          icon="sound"
          onPress={() => {
            // TODO: 오디오 에셋 연결
          }}
        />
      </View>
      <MartRoundButton variant="primary" icon="next" onPress={onNext} />
    </View>
  );
}
```

- [ ] **Step 3: `src/components/mart/stage/StageMeaningQuiz.tsx` 작성**

```tsx
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
```

- [ ] **Step 4: 타입 검증**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 5: Commit**

```bash
git add src/components/mart/stage/StageProblem.tsx src/components/mart/stage/StageMeetWord.tsx src/components/mart/stage/StageMeaningQuiz.tsx
git commit -m "add: 마트 스테이지 문제상황·단어만나기·뜻퀴즈 단계(B-1~B-3) 추가"
```

---

### Task 9: 스테이지 단계 — 소리 듣기 · 소리 퀴즈 (B-4, B-5)

**Files:**
- Create: `src/components/mart/stage/StageListen.tsx`
- Create: `src/components/mart/stage/StageSoundQuiz.tsx`

**Interfaces:**
- Consumes: `MartImagePlaceholder`, `MartRoundButton`, `MartOptionRow`, `MartWordConfig`
- Produces: `StageListen({ word, onNext })`, `StageSoundQuiz({ word, onCorrect })`.

- [ ] **Step 1: `src/components/mart/stage/StageListen.tsx` 작성**

```tsx
import { Text, View } from 'react-native';
import type { MartWordConfig } from '@/data/martWords';
import { MartImagePlaceholder } from '../MartImagePlaceholder';
import { MartRoundButton } from '../MartRoundButton';

interface StageListenProps {
  word: MartWordConfig;
  onNext: () => void;
}

export function StageListen({ word, onNext }: StageListenProps) {
  return (
    <View className="flex-1 items-center justify-between py-6">
      <MartImagePlaceholder imageSrc={word.imageSrc} className="w-[220px] h-[160px] rounded-2xl" />
      <View className="flex-row gap-4">
        {word.syllables.map((syllable, index) => (
          <View key={index} className="w-[120px] h-[120px] rounded-2xl bg-gray-100 items-center justify-center">
            <Text className="text-4xl font-bold">{syllable}</Text>
          </View>
        ))}
      </View>
      <MartRoundButton
        variant="secondary"
        icon="sound"
        onPress={() => {
          // TODO: 오디오 에셋 연결
        }}
      />
      <MartRoundButton variant="primary" icon="next" onPress={onNext} />
    </View>
  );
}
```

- [ ] **Step 2: `src/components/mart/stage/StageSoundQuiz.tsx` 작성**

```tsx
import { useState } from 'react';
import { View } from 'react-native';
import type { MartWordConfig } from '@/data/martWords';
import { MartOptionRow } from '../MartOptionRow';
import { MartRoundButton } from '../MartRoundButton';

interface StageSoundQuizProps {
  word: MartWordConfig;
  onCorrect: () => void;
}

export function StageSoundQuiz({ word, onCorrect }: StageSoundQuizProps) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(option: string) {
    setSelected(option);
    if (option === word.label) {
      onCorrect();
    }
  }

  return (
    <View className="flex-1 items-center justify-between py-6">
      <MartRoundButton
        variant="secondary"
        icon="sound"
        onPress={() => {
          // TODO: 오디오 에셋 연결
        }}
      />
      <View className="w-[300px] gap-3">
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
```

- [ ] **Step 3: 타입 검증**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 4: Commit**

```bash
git add src/components/mart/stage/StageListen.tsx src/components/mart/stage/StageSoundQuiz.tsx
git commit -m "add: 마트 스테이지 소리듣기·소리퀴즈 단계(B-4, B-5) 추가"
```

---

### Task 10: 스테이지 단계 — 글자 조립하기 (B-6, 오답 재시도 포함)

**Files:**
- Create: `src/components/mart/stage/StageAssemble.tsx`

**Interfaces:**
- Consumes: `MartImagePlaceholder`, `MartRoundButton`, `MartTile`, `MartWordConfig`, `MartJamoSlot`
- Produces: `StageAssemble({ word: MartWordConfig, onCorrect: () => void })`. 틀렸을 때 전역 스토어를 건드리지 않고, 컴포넌트 내부 state로 결과 화면(B-8)을 보여주고 재시도 버튼으로 틀린 칸만 초기화한다.

와이어프레임의 "자음 칸/모음 칸" 구조를 단순화해, 음절당 [자음, 모음] 2칸으로만 다룬다(이 5개 단어는 모두 받침이 없다).

- [ ] **Step 1: `src/components/mart/stage/StageAssemble.tsx` 작성**

```tsx
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
        <SlotRow word={word} filled={filled} />
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

function SlotRow({ word, filled }: { word: MartWordConfig; filled: Record<number, string> }) {
  return (
    <View className="flex-row gap-3">
      {word.syllables.map((_, syllableIndex) => {
        const consonantIndex = syllableIndex * 2;
        const vowelIndex = syllableIndex * 2 + 1;
        return (
          <View key={syllableIndex} className="w-[84px] h-[84px] gap-1">
            <JamoSlot slot={word.slots[consonantIndex]} filledJamo={filled[consonantIndex]} />
            <JamoSlot slot={word.slots[vowelIndex]} filledJamo={filled[vowelIndex]} />
          </View>
        );
      })}
    </View>
  );
}

function JamoSlot({ slot, filledJamo }: { slot: MartJamoSlot; filledJamo?: string }) {
  const display = slot.given ? slot.jamo : filledJamo;
  return (
    <View
      className={`h-[32px] rounded-lg items-center justify-center ${
        slot.given ? 'bg-gray-200' : display ? 'bg-green-100' : 'bg-white border-2 border-dashed border-gray-300'
      }`}
    >
      {display ? <Text className="text-lg font-bold">{display}</Text> : null}
    </View>
  );
}
```

- [ ] **Step 2: 타입 검증**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 3: Commit**

```bash
git add src/components/mart/stage/StageAssemble.tsx
git commit -m "add: 마트 스테이지 글자조립 단계(B-6) 추가"
```

---

### Task 11: 스테이지 단계 — 정답 결과 · 보상 (B-7, C-1)

> **수정 이력:** 원래 계획은 B-9(확장 단어) 단계를 포함했으나, 사용자 요청으로 보너스 단어 기능 전체를 제거했다(아래 Task 11b 참고). 이 섹션은 `StageBonusWords`를 뺀 최종 형태다.

**Files:**
- Create: `src/components/mart/stage/StageCorrectResult.tsx`
- Create: `src/components/mart/stage/StageReward.tsx`

**Interfaces:**
- Consumes: `MartImagePlaceholder`, `MartIcon`, `MartRoundButton`, `MartWordCard`, `MartWordConfig`
- Produces: `StageCorrectResult({ word, onNext })`, `StageReward({ word })`.

- [ ] **Step 1: `src/components/mart/stage/StageCorrectResult.tsx` 작성**

```tsx
import { Text, View } from 'react-native';
import type { MartWordConfig } from '@/data/martWords';
import { MartIcon } from '../MartIcon';
import { MartImagePlaceholder } from '../MartImagePlaceholder';
import { MartRoundButton } from '../MartRoundButton';

interface StageCorrectResultProps {
  word: MartWordConfig;
  onNext: () => void;
}

export function StageCorrectResult({ word, onNext }: StageCorrectResultProps) {
  return (
    <View className="flex-1 items-center justify-between py-6">
      <Text className="text-3xl font-bold">{word.label}</Text>
      <View className="flex-row gap-2">
        <MartIcon name="star" />
        <MartIcon name="star" />
        <MartIcon name="star" />
      </View>
      <MartImagePlaceholder imageSrc={word.imageSrc} className="w-[350px] h-[320px] rounded-2xl" />
      <MartRoundButton variant="primary" icon="next" onPress={onNext} />
    </View>
  );
}
```

- [ ] **Step 2: `src/components/mart/stage/StageReward.tsx` 작성**

```tsx
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import type { MartWordConfig } from '@/data/martWords';
import { MartIcon } from '../MartIcon';
import { MartImagePlaceholder } from '../MartImagePlaceholder';
import { MartRoundButton } from '../MartRoundButton';
import { MartWordCard } from '../MartWordCard';

interface StageRewardProps {
  word: MartWordConfig;
}

export function StageReward({ word }: StageRewardProps) {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-between py-6">
      <View className="flex-row gap-2">
        <MartIcon name="star" />
        <MartIcon name="star" />
        <MartIcon name="star" />
      </View>
      <MartWordCard label={word.label} imageSrc={word.imageSrc} />
      <MartImagePlaceholder className="w-[300px] h-[150px] rounded-2xl" />
      <View className="flex-row gap-4">
        <MartRoundButton variant="secondary" icon="book" onPress={() => router.push('/mart/wordbook')} />
        <MartRoundButton variant="primary" icon="home" onPress={() => router.replace('/mart/map')} />
      </View>
    </View>
  );
}
```

- [ ] **Step 3: 타입 검증**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 4: Commit**

```bash
git add src/components/mart/stage/StageCorrectResult.tsx src/components/mart/stage/StageReward.tsx
git commit -m "add: 마트 스테이지 정답결과·보상 단계(B-7, C-1) 추가"
```

---

### Task 11b: 확장 단어(보너스 단어) 기능 제거

> **배경:** 사용자가 설계 논의 중 모든 코너(식료품 포함)에서 확장 단어/보너스 단어 기능을 없애기로 결정했다. Task 1에서 추가한 `bonusWords` 데이터와 Task 11에서 만든 `StageBonusWords` 컴포넌트, Task 1·2의 `MartStageStep`에 있던 `bonusWords` 단계를 제거한다. 이 태스크는 Task 1·2·11의 이미 커밋된 코드를 수정한다.

**Files:**
- Modify: `src/enums.ts` — `MartStageStep`에서 `'bonusWords'` 제거, `MART_STAGE_STEPS` 배열에서도 제거(이미 위 Task 1 섹션이 수정된 최종본을 반영하고 있다 — 이 태스크 실행 시점에 실제 커밋된 파일에는 아직 `'bonusWords'`가 남아있으므로 지운다)
- Modify: `src/data/martWords.ts` — `MartBonusWord` 인터페이스 삭제, `MartWordConfig`에서 `bonusWords` 필드 삭제, 5개 단어 데이터에서 `bonusWords: [...]` 라인 삭제
- Delete: `src/components/mart/stage/StageBonusWords.tsx`

- [ ] **Step 1: `src/enums.ts`에서 `'bonusWords'` 제거**

`MartStageStep` 유니언과 `MART_STAGE_STEPS` 배열 양쪽에서 `'bonusWords'` 항목을 지운다. 수정 후 `MartStageStep`은 `'problem' | 'meetWord' | 'meaningQuiz' | 'listen' | 'soundQuiz' | 'assemble' | 'correct' | 'reward'` 8개 값이 되어야 한다.

- [ ] **Step 2: `src/data/martWords.ts`에서 보너스 단어 제거**

`MartBonusWord` 인터페이스를 삭제하고, `MartWordConfig`에서 `bonusWords: MartBonusWord[];` 필드를 삭제한다. `MART_WORDS`의 milk/cucumber/grape/tofu/meat 5개 항목에서 각각의 `bonusWords: [...]` 라인을 삭제한다.

- [ ] **Step 3: `StageBonusWords.tsx` 삭제**

```bash
git rm src/components/mart/stage/StageBonusWords.tsx
```

- [ ] **Step 4: 타입 검증**

Run: `npm run typecheck`
Expected: 에러 없음 (이 시점에는 아직 아무도 `MartStageStep`의 `'bonusWords'`나 `StageBonusWords`를 참조하지 않으므로 컴파일만 통과하면 된다 — Task 12가 오케스트레이터를 새로 연결한다)

- [ ] **Step 5: Commit**

```bash
git add src/enums.ts src/data/martWords.ts
git commit -m "rm: 마트 게임 확장 단어(보너스 단어) 기능 제거"
```

---

### Task 12: 스테이지 오케스트레이터 라우트 (`stage/[word].tsx`)

**Files:**
- Create: `src/app/mart/stage/[word].tsx`

**Interfaces:**
- Consumes: 모든 `Stage*` 컴포넌트(Task 8~11), `MART_WORDS` (Task 1), `useMartStore` (Task 2)

- [ ] **Step 1: `src/app/mart/stage/[word].tsx` 작성**

```tsx
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MartTopBar } from '@/components/mart/MartTopBar';
import { StageAssemble } from '@/components/mart/stage/StageAssemble';
import { StageCorrectResult } from '@/components/mart/stage/StageCorrectResult';
import { StageListen } from '@/components/mart/stage/StageListen';
import { StageMeaningQuiz } from '@/components/mart/stage/StageMeaningQuiz';
import { StageMeetWord } from '@/components/mart/stage/StageMeetWord';
import { StageProblem } from '@/components/mart/stage/StageProblem';
import { StageReward } from '@/components/mart/stage/StageReward';
import { StageSoundQuiz } from '@/components/mart/stage/StageSoundQuiz';
import { MART_WORDS } from '@/data/martWords';
import type { MartWordId } from '@/enums';
import { useMartStore } from '@/store/useMartStore';

export default function MartStageScreen() {
  const { word: wordParam } = useLocalSearchParams<{ word: MartWordId }>();
  const word = MART_WORDS[wordParam];
  const stageStep = useMartStore((state) => state.stageStep);
  const advanceStep = useMartStore((state) => state.advanceStep);
  const completeStage = useMartStore((state) => state.completeStage);

  if (!word) return null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title={word.label} />
      {stageStep === 'problem' && <StageProblem onNext={advanceStep} />}
      {stageStep === 'meetWord' && <StageMeetWord word={word} onNext={advanceStep} />}
      {stageStep === 'meaningQuiz' && <StageMeaningQuiz word={word} onCorrect={advanceStep} />}
      {stageStep === 'listen' && <StageListen word={word} onNext={advanceStep} />}
      {stageStep === 'soundQuiz' && <StageSoundQuiz word={word} onCorrect={advanceStep} />}
      {stageStep === 'assemble' && <StageAssemble word={word} onCorrect={advanceStep} />}
      {stageStep === 'correct' && (
        <StageCorrectResult
          word={word}
          onNext={() => {
            completeStage();
            advanceStep();
          }}
        />
      )}
      {stageStep === 'reward' && <StageReward word={word} />}
    </SafeAreaView>
  );
}
```

- [ ] **Step 2: 타입 검증**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 3: 수동 확인 — 우유 스테이지 전체 플로우**

Expo에서 지도 → 우유 진열대 → 8단계를 끝까지 눌러본다: 4컷 → 단어 만나기 → 뜻 퀴즈(정답 선택) → 소리 듣기 → 소리 퀴즈(정답 선택) → 글자 조립(ㅜ, ㅠ 타일을 올바른 빈칸에 채우기) → 정답 결과 → 보상. 글자 조립에서 일부러 틀린 타일을 넣어 오답 화면이 뜨는지, 재시도 버튼을 누르면 맞았던 칸은 유지되고 틀린 칸만 다시 빈칸이 되는지 확인한다.

- [ ] **Step 4: Commit**

```bash
git add src/app/mart/stage/
git commit -m "add: 마트 스테이지 화면 라우트(stage/[word]) 추가"
```

---

### Task 13: 나의 단어장 (C-2)

**Files:**
- Create: `src/app/mart/wordbook.tsx`

**Interfaces:**
- Consumes: `MartTopBar`, `MartWordCard` (Task 4, 5), `MART_WORDS`, `MART_WORD_ORDER` (Task 1), `useMartStore` (Task 2)

- [ ] **Step 1: `src/app/mart/wordbook.tsx` 작성**

```tsx
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MartTopBar } from '@/components/mart/MartTopBar';
import { MartWordCard } from '@/components/mart/MartWordCard';
import { MART_WORDS } from '@/data/martWords';
import { MART_WORD_ORDER } from '@/enums';
import { useMartStore } from '@/store/useMartStore';

export default function MartWordbook() {
  const collectedWords = useMartStore((state) => state.collectedWords);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title="나의 단어장" />
      <View className="flex-1 flex-row flex-wrap p-4 gap-4 justify-center content-start">
        {MART_WORD_ORDER.map((wordId) => {
          const word = MART_WORDS[wordId];
          const collected = collectedWords.includes(wordId);
          return <MartWordCard key={wordId} label={word.label} imageSrc={word.imageSrc} locked={!collected} />;
        })}
      </View>
    </SafeAreaView>
  );
}
```

- [ ] **Step 2: 타입 검증**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 3: 수동 확인**

우유 스테이지를 완료한 뒤 단어장에 들어가면 우유 카드만 라벨이 보이고 나머지 4개는 "?"로 잠겨 보이는지 확인.

- [ ] **Step 4: Commit**

```bash
git add src/app/mart/wordbook.tsx
git commit -m "add: 나의 단어장 화면(C-2) 추가"
```

---

### Task 14: 엔딩 (C-3)

**Files:**
- Create: `src/app/mart/ending.tsx`

**Interfaces:**
- Consumes: `FourPanelComic`, `MartTopBar` (Task 4, 5)

- [ ] **Step 1: `src/app/mart/ending.tsx` 작성**

```tsx
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FourPanelComic } from '@/components/mart/FourPanelComic';
import { MartTopBar } from '@/components/mart/MartTopBar';

export default function MartEnding() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title="엔딩" onBack={() => router.replace('/mart/map')} />
      <FourPanelComic
        panels={[undefined, undefined, undefined, undefined]}
        onNext={() => router.replace('/mart/map')}
      />
    </SafeAreaView>
  );
}
```

- [ ] **Step 2: 타입 검증**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 3: Commit**

```bash
git add src/app/mart/ending.tsx
git commit -m "$(cat <<'EOF'
add: 마트 게임 엔딩 화면(C-3) 추가

Closes #30
EOF
)"
```

---

### Task 15: 5개 단어 전체 플로우 수동 검증

**Files:** (코드 변경 없음, 검증 전용 — 문제 발견 시 해당 태스크의 파일을 고친다)

- [ ] **Step 1: 전체 타입 검증**

Run: `npm run typecheck`
Expected: 에러 없음

- [ ] **Step 2: 5개 단어 전부 끝까지 플레이**

`npm start`로 Expo 실행. 프롤로그 → 지도 → 우유 → 오이 → 포도 → 두부 → 고기 순서로 각 단어의 8단계를 전부 완료한다. 각 단어의 글자 조립 단계에서 빈칸 개수가 스펙과 일치하는지 확인한다(우유 2 / 오이 2 / 포도 3 / 두부 4 / 고기 4). 포도를 완료한 뒤 단어장에 우유·오이·포도까지 보이는지, 두부가 그제서야 해금되는지 확인한다.

- [ ] **Step 3: 전체 완료 후 엔딩 확인**

고기까지 완료한 뒤 지도 화면 하단에 엔딩 진입 버튼이 나타나는지, 눌러서 엔딩 화면(4컷)이 보이는지 확인한다.

- [ ] **Step 4: 앱 재시작 후 프롤로그 스킵 확인**

Expo를 새로고침(fast refresh가 아니라 앱 재시작)한 뒤 `/mart`로 들어가면 — 주의: zustand 상태는 영속화하지 않으므로 앱을 완전히 재시작하면 `hasSeenPrologue`도 초기화되어 프롤로그가 다시 보이는 게 정상이다. 같은 세션 내에서 `/mart`로 다시 이동했을 때만 지도로 바로 넘어가는지 확인한다.

- [ ] **Step 5: 수정 사항이 있으면 커밋**

검증 중 문제를 발견해 코드를 고쳤을 때만 커밋한다. 아무것도 고치지 않았다면 이 태스크는 커밋 없이 종료한다(이슈 종료는 이미 Task 14 커밋의 `Closes #30`으로 처리됨).

```bash
git status --short
# 변경된 파일이 있을 때만:
git add -A
git commit -m "fix: 5단어 전체 플로우 수동 검증 중 발견한 문제 수정"
```
