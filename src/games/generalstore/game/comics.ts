import { ComicCut, PanelBg, ProblemId, Stage } from './types';

/** Where the "using the item" cuts happen, so the object is seen in its own place. */
export const USE_BG: Record<ProblemId, PanelBg> = {
  dryFlower: 'yard',
  rainWalk: 'rain',
  hotPot: 'window',
  leafYard: 'yard',
  highFruit: 'yard'
};

/**
 * Four-cut situation comics. Only stages 1 and 2 are drawn by hand so far; the rest fall back
 * to a generic four-cut built from the problem art until their scripts are written.
 */
const HAND_DRAWN: Record<number, ComicCut[]> = {
  1: [
    { bg: 'yard', customer: 'squirrel', mood: 'sad', side: 'right', problem: 'dryFlower' },
    { bg: 'pond', customer: 'squirrel', mood: 'sad', side: 'left', effect: 'shine' },
    { bg: 'pond', customer: 'squirrel', mood: 'sad', side: 'center', effect: 'splash' },
    { bg: 'door', customer: 'squirrel', mood: 'sad', side: 'right', need: 'water' }
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
