# 만물상 디자인 원본

Figma file `BYbdINz6CV7nB5o1HIGy21`, section `395:3071` (daiso).
Assets downloaded unchanged through Figma design context, 2026-11-23.

| File | Source node | Usage |
| --- | --- | --- |
| story-1.png | 395:3158 | First two introduction panels (982:384) |
| story-2.png | 395:3161 | Last two introduction panels (982:389) |
| stage-sad.png | 395:3092 | First stage thumbnail and customer |
| stage-happy.png | 395:3147 | Completed stage and completion screen |
| stage-ring.svg | 395:3111 / 395:3127 | Rock circle, native SVG dimensions preserved inside a scaled wrapper |
| item-shelf.png | 395:3166 | In-game shelf (366:46) |

ResultArt.tsx supplies new code-native vector panels for the missing bucket/sock outcome comics, as authorized by the user. No screenshots are used as application assets. Future stages are explicitly unavailable.

## Ocean redesign

The user subsequently requested the shared ocean style and original nua shark throughout the game. The Figma PNG/SVG files above are retained as source references only; they are no longer rendered. `OceanStoryPanel` now composes the existing ocean background and original shell-game shark with code-native sea scenery. The home selector uses the newly user-supplied `characters/daiso.png` unchanged.
