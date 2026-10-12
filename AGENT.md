# AGENT.md — nua 프론트엔드

## 프로젝트

**nua** — 5세 유아의 컴퓨팅 사고능력 향상을 위한 게이미피케이션 앱.

- 유아가 기초적인 골드버그 장치를 직접 만드는 놀이가 중심이다. 구슬이 굴러갈 트랙을 배치해 목표 지점까지 도달시키는 것이 기본 목표다.
- 운반 대상은 구슬로 고정되지 않는다. 물류 상자, 고양이 등으로 바뀔 수 있고, 그에 맞춰 에스컬레이터·컨베이어 벨트 같은 장치가 주어진다.
- 배경(집, 물류창고, 어린이집 등)이 있고, 배경마다 등장하는 상황과 사물이 달라진다.
- 최종 목표는 게임 자체가 아니라 컴퓨팅 사고능력이다. 복잡한 문제를 작게 나누고 논리적인 순서로 해결하는 경험을 놀이로 전달한다.

### 타깃 사용자

사용자는 5세다. 다음이 전제다.

- 7 * 7 같은 계산은 하지 못한다.
- 보이는 것을 그대로 믿는다. 화면에 보이지 않는 상태 변화를 추론하지 않는다.
- 덧셈은 알아도 역연산을 모른다. 3+1=4는 알지만 4-3=1은 모른다.

따라서 읽기를 요구하는 UI, 숫자 입력, 여러 단계를 기억해야 하는 조작은 성립하지 않는다. 조작 결과는 즉시 눈에 보여야 하고, 되돌리기는 언제나 한 번에 가능해야 하며, 실패에 벌을 주지 않는다.

### 팀

| 이름 | 역할 |
|---|---|
| 김주연 | 디자인, 캐릭터 디자인 |
| 곽영빈 | 프론트엔드 개발, 세부 UX 개발, 백엔드 리뷰 |
| 전지원 | 백엔드 주 개발 |

### 프론트엔드가 맡는 것 (문서 기준, 확정 전)

- 트랙 배치와 그 결과가 눈에 보이는 화면
- 배경, 사물, 장치(에스컬레이터·컨베이어 벨트) 표현과 캐릭터 디자인 반영
- 유아가 직접 만지는 조작 UI — 배치, 옮기기, 되돌리기
- 세부 UX 설계

## 기술 스택

| 영역 | 선택 |
|---|---|
| 플랫폼 | Expo (SDK 57) + React Native 0.86 |
| 언어 | TypeScript 6 (strict) |
| 스타일링 | Tailwind CSS 3 (NativeWind 4 경유) |
| 상태 관리 | zustand 5 |
| 네비게이션 | expo-router (파일 기반) |
| 경로 별칭 | `@/*` → `src/*` |

```bash
npm install
npm start              # Expo 개발 서버
npm run android        # 안드로이드에서 열기
npm run typecheck      # tsc --noEmit
```

네비게이션, 빌드·배포는 아직 확정되지 않았다. 통신은 백엔드가 노출하는 `/openapi.json`에서 타입을 생성하는 방향이다. 라이브러리를 추가하기 전에 먼저 확인받는다.

## 디렉터리 구조

`lwyd-webfront`의 구조를 따른다. 웹 전용 파일(index.html, vite·nginx·Dockerfile)은 Expo에 맞는 대응물로 바꾼다.

- 화면은 `src/app/`의 라우트 파일이 담당한다. `pages/` 같은 별도 화면 디렉터리를 두지 않는다.
- 라우트 루트는 `src/app`이다(expo-router가 `src` 아래의 `app`을 라우트 루트로 인식한다).

```text
nua-front/
├── app.json               # Expo 설정 (scheme, expo-router 플러그인)
├── package.json           # main: expo-router/entry
├── babel.config.js        # babel-preset-expo + nativewind jsx
├── metro.config.js        # withNativeWind
├── tailwind.config.js     # Tailwind CSS
├── nativewind-env.d.ts    # NativeWind 타입 참조
├── tsconfig.json          # strict, @/* → src/*
├── .env.example
└── src/
    ├── app/               # expo-router 라우트 (파일 기반)
    │   ├── _layout.tsx    # 루트 레이아웃 (Stack, SafeAreaProvider, global.css)
    │   └── index.tsx
    ├── api/               # 통신 클라이언트 + 도메인별 요청 함수
    ├── assets/
    ├── components/        # 단일 파일 컴포넌트는 .tsx, 디렉터리 래핑 없음
    │   └── icons/
    ├── hooks/
    ├── store/             # zustand 스토어 (use<도메인>Store.ts)
    ├── enums.ts           # 백엔드 enum 값과 맞춘 상수 + 유니언 타입
    ├── global.css         # Tailwind 진입
    └── utils.ts
```

## 도구

- 실행은 `npm install` 뒤 `npm start`. 타입 확인은 `npm run typecheck`.
- 린터·포맷터 도구는 두지 않는다(백엔드와 동일). 포맷은 기존 코드의 형태를 따른다.
- 환경변수는 `.env`에 두고 `EXPO_PUBLIC_` 접두사를 붙인다. 예시는 `.env.example`에 있다.

## 코드 컨벤션

프론트엔드 코드 컨벤션은 아직 합의된 바 없다. 정해지기 전까지는 기존 코드의 형태를 따르고, 새 규칙을 임의로 만들지 않는다.

지금까지 확정된 것:

- 작은따옴표, 세미콜론, 2칸 들여쓰기(Expo 템플릿 형태).

### 스타일링

- Tailwind 클래스는 `className`으로 쓴다. NativeWind가 React Native 스타일로 변환한다.
- 클래스 스캔 대상은 `src/**/*.{ts,tsx}`(`tailwind.config.js`)이다. 새 폴더를 `src/` 밖에 만들면 클래스가 생성되지 않는다.
- Tailwind 진입은 `src/global.css`이고, `metro.config.js`의 `withNativeWind` input이 이 파일을 가리킨다.

## Git 컨벤션

### 커밋 메시지

`접두사: 한글 서술문` 형식. 접두사는 아래 표의 영어를 그대로 쓰고, 서술은 한글로 쓴다. 서술은 무엇을 했는지가 아니라 왜 했는지가 드러나는 문장으로 쓴다.

| 접두사 | 용도 |
|---|---|
| add: | 새 기능·파일 추가 |
| edit: | 기존 동작 수정 |
| fix: | 버그 수정 |
| refactor: | 구조·설계 재작업. 동작 변경(큰 변경 포함)을 수반할 수 있다 |
| rm: | 삭제 |
| format: | 포맷팅만 변경 |

예:

- add: 스테이지 화면에 트랙 드래그 배치 추가
- fix: 시작 이후에 놓은 트랙을 구슬이 통과하던 문제 수정
- refactor: 스테이지 상태를 화면 컴포넌트에서 스토어로 이동

### 커밋 분리

한 번에 여러 논리 단위를 지시받으면 논리 단위별로 커밋을 나눈다. 화면 구현, 상태 관리, 리팩토링은 서로 다른 커밋이다.

### 브랜치와 워크플로우

`main`이 주축이다. `develop`는 쓰지 않는다. 작업 단위마다 워킹 브랜치를 분리한다.

1. 시작할 작업 하나를 설명하는 GitHub 이슈를 만든다. `.github/ISSUE_TEMPLATE/`의 `feature request`, `problem` 템플릿을 쓴다.
2. `main`에서 그 이슈에 연결된 워킹 브랜치를 딴다. 이름은 `.github/CONTRIBUTING.md` 규칙(`<prefix>/<작업내용>`, 번호 없음)을 따른다.
3. 워킹 브랜치에서 작업을 마친 뒤 워킹 브랜치 → `main` 방향으로 PR을 연다. 본문에 `Closes #이슈번호`를 적는다.
4. **PR 머지는 사람이 직접 한다. 에이전트는 머지하지 않는다.**

`main`에 직접 push하지 않는다.

### 스테이징 위생

- `git add -A`를 습관적으로 쓰지 않는다. `git status --short`로 확인하고 커밋 단위에 해당하는 경로만 올린다.
- `node_modules/`, 빌드 산출물, 로컬 설정 파일이 `.gitignore`에 있는지 먼저 확인한다.

## 미정 사항

- 컴포넌트 분리 기준
- 백엔드와의 통신 규약(경로 규칙, 에러 응답 형식). **당분간 백엔드와 연결하지 않고 프론트 단독으로 진행한다** — 붙이는 시점에 정한다
- Tailwind 버전. 지금은 Tailwind 3 + NativeWind 4 정식이고, Tailwind 4를 쓰려면 NativeWind 5(RC)가 필요하다
- 빌드·배포 방식
- 린터·포맷터 도구 도입 여부
