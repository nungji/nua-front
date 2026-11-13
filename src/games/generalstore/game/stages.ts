import { ItemId, Stage } from './types';

export const ITEM_LABELS: Record<ItemId, string> = {
  bucket: '양동이',
  sock: '양말',
  basket: '바구니',
  umbrella: '우산',
  fan: '부채',
  towel: '수건',
  mitten: '장갑',
  ladle: '국자',
  broom: '빗자루',
  shovel: '삽',
  longStick: '긴 막대',
  shortStick: '짧은 막대'
};

/**
 * One stage per customer: the property they need, and a shelf where only one item has it.
 * Answers never sit in the same slot twice in a row, and every distractor fails for a
 * visible reason (leak, soak, steam, nothing happens).
 */
export const STAGES: Stage[] = [
  {
    id: 1,
    customer: 'squirrel',
    name: '다람쥐',
    problem: 'dryFlower',
    need: 'water',
    answer: 'bucket',
    shelf: ['sock', 'bucket', 'basket'],
    failEffect: 'leak'
  },
  {
    id: 2,
    customer: 'cat',
    name: '고양이',
    problem: 'rainWalk',
    need: 'rain',
    answer: 'umbrella',
    shelf: ['fan', 'towel', 'umbrella'],
    failEffect: 'soak'
  },
  {
    id: 3,
    customer: 'rabbit',
    name: '토끼',
    problem: 'hotPot',
    need: 'heat',
    answer: 'mitten',
    shelf: ['ladle', 'towel', 'mitten'],
    failEffect: 'steam'
  },
  {
    id: 4,
    customer: 'fox',
    name: '여우',
    problem: 'leafYard',
    need: 'leaves',
    answer: 'broom',
    shelf: ['fan', 'shovel', 'broom'],
    failEffect: 'none'
  },
  {
    id: 5,
    customer: 'monkey',
    name: '원숭이',
    problem: 'highFruit',
    need: 'high',
    answer: 'longStick',
    shelf: ['shortStick', 'longStick', 'basket'],
    failEffect: 'none'
  }
];

export function findStage(stageId: number) {
  return STAGES.find((stage) => stage.id === stageId) ?? STAGES[0];
}
