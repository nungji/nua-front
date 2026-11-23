import { ComicCut, ItemId, PanelBg, ProblemId, Stage } from './types';

/** Where the "using the item" cuts happen, so the object is seen in its own place. */
export const USE_BG: Record<ProblemId, PanelBg> = {
  dryFlower: 'yard',
  rainWalk: 'rain',
  hotPot: 'window',
  leafYard: 'yard',
  highFruit: 'yard'
};

/**
 * Four-cut intro comics, one square cut at a time.
 * Stage 1 follows the board notes: wilted flower → sparkling lake over the shoulder →
 * scooping water that spills → arriving at the shop with a water pictogram.
 * Stage 2 keeps the same shape for the cat. The rest are placeholders for now.
 */
const HAND_DRAWN: Record<number, ComicCut[]> = {
  1: [
    { bg: 'yard', customer: 'fish', mood: 'sad', side: 'right', problem: 'dryFlower' },
    { bg: 'pond', customer: 'fish', mood: 'sad', side: 'left', effect: 'shine' },
    { bg: 'pond', customer: 'fish', mood: 'sad', side: 'center', effect: 'splash' },
    { bg: 'door', customer: 'fish', mood: 'sad', side: 'right', need: 'water' }
  ],
  2: [
    { bg: 'window', customer: 'cat', mood: 'sad', side: 'left' },
    { bg: 'rain', customer: 'cat', mood: 'sad', side: 'center' },
    { bg: 'rain', customer: 'cat', mood: 'sad', side: 'left', effect: 'wet' },
    { bg: 'door', customer: 'cat', mood: 'sad', side: 'right', need: 'rain' }
  ]
};

function fallbackComic(stage: Stage): ComicCut[] {
  const home: PanelBg = stage.problem === 'rainWalk' ? 'rain' : stage.problem === 'hotPot' ? 'window' : 'yard';

  return [
    { bg: home, customer: stage.customer, mood: 'sad', side: 'right', problem: stage.problem },
    { bg: home, customer: stage.customer, mood: 'sad', side: 'left', problem: stage.problem },
    { bg: home, customer: stage.customer, mood: 'sad', side: 'center' },
    { bg: 'door', customer: stage.customer, mood: 'sad', side: 'right', need: stage.need }
  ];
}

export function comicFor(stage: Stage): ComicCut[] {
  return HAND_DRAWN[stage.id] ?? fallbackComic(stage);
}

/**
 * Post-selection comic. The last cut is the result cut and is the one that animates,
 * so the leading cuts are pure storytelling.
 * Bucket and sock are scripted per the board notes ("물체 2개만 먼저"); everything else
 * gets the generic two-step version.
 */
export function useComic(stage: Stage, item: ItemId): ComicCut[] {
  const carry: ComicCut = {
    bg: stage.problem === 'dryFlower' || stage.problem === 'highFruit' ? 'pond' : USE_BG[stage.problem],
    customer: stage.customer,
    mood: 'sad',
    side: 'left',
    item
  };
  const scoop: ComicCut = { ...carry, side: 'center', effect: 'splash' };
  const pour: ComicCut = {
    bg: USE_BG[stage.problem],
    customer: stage.customer,
    mood: 'sad',
    side: 'right',
    item,
    problem: stage.problem
  };
  const ok: ComicCut = { ...pour, mood: 'happy' };
  const leak: ComicCut = { ...carry, side: 'center', effect: 'wet' };

  if (item === stage.answer) {
    return stage.id === 1 ? [carry, scoop, pour, ok] : [carry, pour, ok];
  }

  return stage.id === 1 ? [carry, scoop, leak] : [carry, pour];
}
