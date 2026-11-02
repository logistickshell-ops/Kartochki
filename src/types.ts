export type TopicId =
  | 'day-night'
  | 'hygiene'
  | 'clothes-weather'
  | 'food'
  | 'home'
  | 'transport'
  | 'feelings'
  | 'seasons'
  | 'week'
  | 'animals'
  | 'weather';

export interface Topic {
  id: TopicId;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  color: string;
}

export interface AnswerOption {
  id: string;
  label: string;
  icon: string;
}

export interface TaskCard {
  id: string;
  topicId: TopicId;
  prompt: string;
  instruction: string;
  icon: string;
  options: AnswerOption[];
  correctOptionId: string;
  hint: string;
}

export interface ProgressRecord {
  completedLessons: number;
  completedByTopic: Partial<Record<TopicId, number>>;
}
