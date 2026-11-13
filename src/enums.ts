export type MartCornerId = 'grocery' | 'household' | 'electronics';

export type MartWordStatus = 'locked' | 'unlocked' | 'completed';

export type MartStageStep =
  | 'meetWord'
  | 'meaningQuiz'
  | 'listen'
  | 'soundQuiz'
  | 'assemble'
  | 'correct'
  | 'reward';

export const MART_CORNER_ORDER: MartCornerId[] = ['grocery', 'household', 'electronics'];

export const MART_STAGE_STEPS: MartStageStep[] = [
  'meetWord',
  'meaningQuiz',
  'listen',
  'soundQuiz',
  'assemble',
  'correct',
  'reward',
];
