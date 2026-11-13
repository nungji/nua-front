export type CustomerId = 'squirrel' | 'cat' | 'rabbit' | 'fox' | 'monkey';

export type ItemId =
  | 'bucket'
  | 'sock'
  | 'basket'
  | 'umbrella'
  | 'fan'
  | 'towel'
  | 'mitten'
  | 'ladle'
  | 'broom'
  | 'shovel'
  | 'longStick'
  | 'shortStick';

export type NeedId = 'water' | 'rain' | 'heat' | 'leaves' | 'high';

export type ProblemId = 'dryFlower' | 'rainWalk' | 'hotPot' | 'leafYard' | 'highFruit';

/** Why the wrong item failed, so the use scene can show the effect instead of a sentence. */
export type FailEffect = 'leak' | 'soak' | 'steam' | 'none';

export type Mood = 'sad' | 'happy';

export type PanelBg = 'yard' | 'pond' | 'door' | 'rain' | 'window';

/** One cut of the situation comic: where it happens, who is in it, what is wrong. */
export type ComicCut = {
  bg: PanelBg;
  customer: CustomerId;
  mood: Mood;
  side: 'left' | 'center' | 'right';
  problem?: ProblemId;
  need?: NeedId;
  effect?: 'splash' | 'wet' | 'shine';
  item?: ItemId;
};

export type Stage = {
  id: number;
  customer: CustomerId;
  name: string;
  problem: ProblemId;
  need: NeedId;
  answer: ItemId;
  shelf: ItemId[];
  failEffect: FailEffect;
  comic: ComicCut[];
};
