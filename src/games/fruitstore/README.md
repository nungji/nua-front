# 과일 가게

Figma `FruitStore Mobile FULL (iPhone 16 landscape, v2 style) — 26 screens` 구현.
원본: https://www.figma.com/design/BYbdINz6CV7nB5o1HIGy21/nua?node-id=220-2028

- 실행: `npm ci`, `npm run web`, `/games/fruitstore` 접속. 홈 캐러셀에서도 **과일 가게**를 선택할 수 있다.
- 화면 확인: `/games/fruitstore?screen=1`부터 `?screen=26`까지. 검토 모드는 자동 전환·게임 입력을 멈추며 이전/다음 버튼으로 모든 원본 상태를 볼 수 있다.
- `design.json`: 26개 프레임의 원본 레이어 ID, 순서, 좌표, 도형, 그림자, 글꼴. 스크린샷을 배경으로 쓰지 않고 React Native View/Text로 렌더링한다. GROUP 좌표는 부모 기준으로 정규화했다.
- `Scene.tsx`: 공통 네이티브 레이어 렌더러, 탭·드래그 과일, 주문서와 버튼. 게임 장면은 원본 852×393 비율로 기기에 맞춰 축소/확대한다.
- `game.ts`: 순수 reducer. 4명 × 과일 5개 × 보상 3코인. 수량 초과·부족은 벌점 없이 수정한다.

과일을 누르거나 바구니로 드래그하면 담긴다. 바구니를 누르면 마지막 과일 하나가 원래 자리로 돌아간다. 바구니 밖에 놓은 드래그는 취소된다. 계산대에서 건네준 수량을 비교하며, 오답이면 기존 바구니를 유지한 채 진열대로 돌아간다. 주문표를 누르면 주문을 다시 확인한다. 앱이 배경으로 이동하면 장면 전환 타이머가 멈춘다. 정산의 `가게로`는 새 하루를 시작한다.

원본의 진열대 과일 개수는 화면마다 일관되지 않으므로 실제 플레이에서는 최초 11개 재고를 보존하고, 담은 과일만 숨긴다. 검토 모드는 원본 각 프레임의 개수를 그대로 표시한다. 빈 바구니 이외에는 항상 계산대로 갈 수 있어 부족·초과 분기도 직접 체험할 수 있다.

실제 플레이의 바구니와 계산대 이동 버튼은 오른쪽 아래에 고정하여 원본 Picking 화면의 주문표/버튼 겹침을 해소했다. Safe Area 안에서 비율을 유지해 노치와 홈 인디케이터를 피한다.

기존 Expo 의존성에 포함된 `expo-font`를 사용하며 추가 패키지는 설치하지 않는다. Gaegu Bold는 Google Fonts OFL, 둥근미소 Bold는 작업 환경의 원본 학교안심 글꼴이다. 모든 글꼴은 로컬 번들에 포함한다. 서버·로그인 없이 동작하며 현재 플레이는 화면을 벗어나면 초기화한다.

검증:

```sh
npm run typecheck
node --experimental-strip-types --test src/games/fruitstore/game.test.mjs
npx expo export --platform web
```

브라우저 회귀 검증은 `scripts/fruitstore-browser-test.cjs`에 있다. Expo 웹 서버를 실행한 뒤 Playwright가 설치된 환경에서 실행한다. 기본 주소는 `http://localhost:8082`이며 `BASE_URL`로 변경할 수 있다. 별도 설치된 Chrome을 쓰려면 `CHROME_PATH`를 지정한다. 테스트는 바구니 밖 드롭·원위치 드래그 취소·주문서 포커스 격리·터치/키보드·수량 수정·하루 정산을 검증한다. `game.test.mjs`는 이전 화면에서 뒤늦게 전달된 전환 이벤트도 검사한다.

모바일 가로 플레이를 위해 Expo orientation을 `default`로 열었다. 이 설정은 앱 전체에 적용되며 네이티브 빌드를 다시 만들어야 반영된다. 실제 iOS/Android 기기의 노치·회전·터치 검증은 별도로 필요하다.
