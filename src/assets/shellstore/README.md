# 조개 상점 그래픽

원본: Figma `design images / 조개가게`, 노드 `348:2251` (390×844).
사용자는 2026-11-23 분리 원본이 없음을 확인하고 시안 기준 개별 그래픽 재제작을 승인했다.

도구: 내장 `image_gen` (CLI/API fallback 사용 안 함). 배경은 불투명 PNG, 캐릭터와 로고는 투명 PNG. 게임에서는 이 로컬 파일만 참조한다. 원본 전체 화면 이미지는 구현 자산으로 포함하지 않는다. SVG UI는 `PortraitArt.tsx`에서 상태에 맞춰 렌더링한다.

| 파일 | 참고 이미지 | 사용 위치 |
| --- | --- | --- |
| ocean.png | 348:2255, 진열대 시안 | 390×844 장면 배경 |
| cashier.png | 348:2256, 계산대 시안 | 진열대/계산대 점원, 정산 |
| customer.png | 348:2256, 계산대 시안 | 시작 화면, 손님, 진행 표시 |
| logo.png | 348:2254, 시작 시안 | 시작 화면 상단 |

최종 생성 프롬프트:

## ocean.png

Edit this supplied game screenshot into a clean reusable portrait game background asset, aspect ratio 390:844. Preserve exactly the bright glossy cartoon ocean, turquoise water rays, blue rocks, pink coral, yellow sand and decorative starfish. REMOVE all foreground game UI: top back button, progress bar, order badge, entire shelving unit and all red shells, basket, shopkeeper character, purple counter, computer, bottom button, all text and numerals. Fill removed areas with coherent continuous underwater scenery. Sea water top 45 percent, open yellow sandy floor lower55 percent, rocky/coral borders at bottom corners. Keep central areas quiet and empty for separately coded interactive objects. No text, no logo, no UI, no characters, no red collectible shells. This is a production background for the user's existing game, matching the supplied art.

## cashier.png

Create ONE isolated transparent-background game sprite from supplied reference: the blue baby shark SHOPKEEPER on the LEFT, wearing a white sailor cap with blue stripe and gold star, blue apron and small fish badge, huge glossy black eyes, cream face, pink cheeks, joyful open smiling mouth with tiny teeth. Wave one fin. Show head and upper body down to apron hem only, as in reference behind counter, centered and tightly framed with 5% transparent padding. Preserve exact reference identity, silhouette, bright glossy 2D game illustration style and thin white outline. Remove ALL background, counter, computer, other shark, shell, UI and text. Actual transparent alpha; no ground, shadow background, no checkerboard. This is a production sprite to overlay on a separate purple counter.

## customer.png

Recreate as ONE isolated transparent-background game character sprite the cute blue shark CUSTOMER on the RIGHT of the reference image. Full body including blue-and-white shoes and tail. Blue shark hood with pointed dorsal fin, white/cream round face, giant glossy black eyes, little pink cheeks, happy open smile with small teeth, white belly, yellow backpack with star emblem and yellow straps. Both small blue fins near chest, delighted friendly expression. Preserve exact character identity and glossy colorful 2D game illustration, thin white silhouette outline. Centered tightly with 5% transparent margin. No background, counter, other character, shelf, shells, UI, lettering, buttons, or floor. Actual transparent alpha.

## logo.png

Recreate ONLY the 'nua' logo near the top of this supplied reference as an isolated transparent PNG asset. Precisely reproduce its rounded lowercase bubble typography: n and u cyan with shiny white reflections, a bright yellow with shiny reflection, thick deep navy outline, outer white outline. Yellow star above the u, small white-outlined splash flourishes on both sides. Keep letters exactly 'nua'. Tight horizontal composition about 2.4:1 aspect ratio, artwork fills frame with only small transparent margin. No Korean subtitle, no character, no bubble shell, no background, no button, no other text. Transparent alpha, crisp colorful game logo.
