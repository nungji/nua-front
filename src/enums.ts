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
