# 상품표가 지워진 마트 — 와이어프레임 구현 설계

- 작성일: 2026-10-26
- 관련 이슈: #30
- Figma 참조: `Lmvawqw0ncdQ6USQIAyFmV` 파일, node `46:47` ("글자 마트 와이어프레임")

## 배경

AGENT.md의 3번째 게임("언어·글자 — 상품표가 지워진 마트") 컨셉을 반영한 저충실도 와이어프레임이 Figma에 나왔다. 이 문서는 그 와이어프레임(14개 화면, A/B/C 3개 섹션)을 Expo + NativeWind 코드로 옮기기 위한 설계다.

**참고**: AGENT.md는 "초기 개발 범위는 주문서 게임, 나머지 3개 범주는 후순위"라고 명시한다. 이 작업은 그 문서상 우선순위와 별개로, 팀 지시에 따라 먼저 진행한다.

## 와이어프레임 구조 요약

| 섹션 | 화면 | 비고 |
|---|---|---|
| A | A-1 프롤로그(4컷), A-2 마트 지도, A-3 스테이지 단어·난이도 | A-3은 TopBar가 없어 실제 화면이 아니라 난이도 데이터 스펙으로 판단, 화면 구현 대상에서 제외 |
| B | B-1 문제 상황(4컷) ~ B-7 결과: 정답 (8단계, 예시: 우유) | 5개 단어(우유·오이·포도·두부·고기) 공통 플로우, 단어별 데이터만 다름. B-9(확장 단어)는 설계 논의 중 제거했다. |
| C | C-1 보상, C-2 나의 단어장, C-3 엔딩(4컷) | C-1은 스테이지 완료 직후, C-2/C-3은 상시/최종 화면 |

## 범위

- 와이어프레임 14개 화면 중 A-3(데이터 스펙, 아래 참고)과 B-9(확장 단어, 설계 논의 중 제거)를 제외한 화면 내용을 구현한다. 라우트 파일은 5개(`index`, `map`, `stage/[word]`, `wordbook`, `ending`)로, B-1~B-7과 C-1은 `stage/[word]` 안에서 step으로 처리한다.
- 5개 단어(우유·오이·포도·두부·고기) 콘텐츠를 모두 데이터로 채운다. 단어별 난이도(채울 자모 칸 수): 우유 2 / 오이 2 / 포도 3 / 두부 4(전부) / 고기 4(전부).
- 실제 일러스트·사진·오디오 에셋은 없음 — 플레이스홀더로 구현하고 나중에 쉽게 교체 가능한 구조로 둔다.
- 백엔드 연동 없음(AGENT.md 방침과 동일), 진행 상태는 클라이언트 zustand 상태로만 관리한다.

## 라우트 구조

```
src/app/mart/
  _layout.tsx           # Stack, headerShown: false
  index.tsx             # A-1 프롤로그 (4컷) — hasSeenPrologue=true면 map으로 즉시 replace
  map.tsx                # A-2 마트 지도 (진열대 5개 + 단어장 아이콘)
  stage/[word].tsx        # B-1~B-9 + C-1(보상)을 내부 step으로 처리하는 단일 화면
  wordbook.tsx            # C-2 나의 단어장
  ending.tsx              # C-3 엔딩 (4컷, 5단어 전부 completed일 때만 도달 가능)
```

### B 플로우를 단일 화면으로 묶는 이유

B-8(오답)에서 틀리면 새 화면으로 전환하지 않고 B-6(글자 조립)으로 돌아가 틀린 칸만 다시 채운다 — AGENT.md의 "조립이 틀리면 맞게 넣은 조각은 남기고 틀린 칸만 다시 채운다" 요구사항이다. 이건 라우터 스택보다 화면 내부 step 상태(숫자 인덱스)로 표현하는 쪽이 자연스럽다. "되돌리기는 언제나 한 번에 가능해야 한다"는 요구사항도 라우터 back이 아니라 내부 step을 하나 감소시키는 핸들러로 통일해 구현한다.

C-1(보상)은 스테이지 완료 직후 보여지는 화면이라 `stage/[word].tsx`의 마지막 step(8)으로 둔다. Footer의 두 버튼은 각각 `router.push('/mart/wordbook')`, `router.replace('/mart/map')`으로 연결한다.

## 데이터 모델

```ts
// src/enums.ts
export type MartWordId = 'milk' | 'cucumber' | 'grape' | 'tofu' | 'meat';

export type MartStageStep =
  | 'problem'       // B-1 문제 상황
  | 'meetWord'      // B-2 단어 만나기
  | 'meaningQuiz'   // B-3 뜻 퀴즈
  | 'listen'        // B-4 소리 듣기
  | 'soundQuiz'     // B-5 소리 퀴즈
  | 'assemble'      // B-6 글자 조립하기
  | 'correct'       // B-7 결과: 정답
  | 'reward';       // C-1 보상
```

```ts
// src/data/martWords.ts
export interface MartWordConfig {
  id: MartWordId;
  label: string;           // '우유'
  category: string;        // '유제품'
  syllables: string[];     // ['우', '유']
  slotCount: number;       // 채울 자모 칸 수 (2/2/3/4/4)
  imageSrc?: string;       // placeholder 비워두는 필드
}

export const MART_WORDS: MartWordConfig[] = [ /* 5개 */ ];
```

```ts
// src/store/useMartStore.ts (zustand)
interface MartStore {
  hasSeenPrologue: boolean;
  wordStatus: Record<MartWordId, 'locked' | 'unlocked' | 'completed'>;
  activeWord: MartWordId | null;
  stageStep: MartStageStep;
  filledSlots: boolean[];       // 현재 스테이지의 칸별 채움 여부
  collectedWords: MartWordId[]; // 단어장에 표시할 완료 단어

  seePrologue(): void;
  startStage(word: MartWordId): void;
  advanceStep(): void;
  retryAssemble(): void;        // incorrect -> assemble, 맞은 칸은 유지
  completeStage(): void;        // wordStatus completed + 다음 단어 unlocked + collectedWords 추가
}
```

초기 `wordStatus`: 우유만 `unlocked`, 나머지 `locked`. 순서는 와이어프레임 A-2 배치 순서(우유→오이→포도→두부→고기)를 따른다.

## 컴포넌트 재사용 (`src/components/mart/`)

와이어프레임 `WF/*` 심볼을 1:1로 매핑한다.

| WF 심볼 | 컴포넌트 |
|---|---|
| WF/TopBar | `MartTopBar` (뒤로가기 + 제목 + 보조 아이콘 슬롯) |
| WF/RoundButton/Primary,Secondary,Small | `MartRoundButton` (variant prop) |
| WF/Option | `MartOptionRow` |
| WF/Tile | `MartTile` (글자 조각 바구니) |
| WF/ComicPanel | `MartComicPanel` (4컷 중 1칸, placeholder 회색 박스) |
| WF/PictureBubble, WF/PictureChoice | `MartPictureBubble`, `MartPictureChoice` |
| WF/WordCard | `MartWordCard` |
| WF/Note | 화면 캡션 — 별도 컴포넌트 없이 `Text` 재사용 |
| WF/Icon/* | `src/components/icons/mart/` 아래 텍스트 글리프 기반 placeholder (예: back="←", star="★") |

이미지가 들어갈 자리는 전부 `imageSrc?: string` prop을 받는 공용 `MartImagePlaceholder` 컴포넌트(없으면 회색 박스 렌더)로 통일해, 나중에 실제 에셋 경로만 넣으면 교체되게 한다.

## 비주얼 스타일

구조(레이아웃·간격·컴포넌트 계층)는 와이어프레임을 따르고, 색상·형태는 Tailwind 기본 팔레트로 가볍게 채운다. Kurzgesagt풍 디자인 반영은 범위 밖 — 비주얼 디자인이 확정되면 별도 작업으로 교체한다.

## 에셋 처리

- 이미지·사진: 전부 미확보. `MartImagePlaceholder`로 회색 박스 처리.
- 오디오(B-4 소리 듣기, B-5 소리 퀴즈): 재생 버튼 UI는 두되 실제 재생 로직은 `// TODO: 오디오 에셋 연결` 주석과 함께 비워둔다. 버튼은 활성 상태로 둔다(눌러도 동작은 없음).
- 아이콘: 새 의존성 추가 없이 텍스트 글리프 placeholder로 구현한다.

## 테스트 / 검증

레포에 테스트 프레임워크가 없다(AGENT.md 미정 사항, 새로 추가하지 않음). 검증은 다음으로 한다:

- `npm run typecheck` (`tsc --noEmit`)로 타입 검증.
- `npm start`로 Expo에서 직접 플로우 확인: 프롤로그 → 지도 → 5개 단어 스테이지(각 8단계 + 오답 재시도 1회) → 단어장 → 엔딩.

## 범위 밖

- 실제 일러스트/사진/오디오 에셋 연동
- 백엔드 연동(진행도 저장 등)
- Kurzgesagt풍 비주얼 디자인 최종 적용
- 메인 화면(4개 게임 선택)에서 마트로 진입하는 연결 — 이 작업에서는 `/mart`를 직접 진입점으로 둔다
