import type { ProgressRecord, TopicId } from './types';

const PROGRESS_KEY = 'kartochki.progress.v1';
const CHECKLIST_KEY = 'kartochki.checklist.v1';
const allowedTopics = new Set(['day-night', 'hygiene', 'clothes-weather', 'food', 'home', 'transport', 'feelings']);

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export function loadProgress(): ProgressRecord {
  const saved = safeParse<unknown>(localStorage.getItem(PROGRESS_KEY), null);
  if (!saved || typeof saved !== 'object') return { completedLessons: 0, completedByTopic: {} };
  const value = saved as { completedLessons?: unknown; completedByTopic?: unknown };
  const completedLessons = typeof value.completedLessons === 'number' && Number.isFinite(value.completedLessons) && value.completedLessons >= 0
    ? Math.floor(value.completedLessons) : 0;
  const completedByTopic: Partial<Record<TopicId, number>> = {};
  if (value.completedByTopic && typeof value.completedByTopic === 'object') {
    for (const [topicId, count] of Object.entries(value.completedByTopic)) {
      if (allowedTopics.has(topicId) && typeof count === 'number' && Number.isFinite(count) && count >= 0) {
        completedByTopic[topicId as TopicId] = Math.floor(count);
      }
    }
  }
  return { completedLessons, completedByTopic };
}

export function recordCompletedLesson(topicId: TopicId): ProgressRecord {
  const progress = loadProgress();
  progress.completedLessons += 1;
  progress.completedByTopic[topicId] = (progress.completedByTopic[topicId] ?? 0) + 1;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  return progress;
}

export function loadChecklistState(): Record<string, boolean> {
  return safeParse<Record<string, boolean>>(localStorage.getItem(CHECKLIST_KEY), {});
}

export function saveChecklistState(state: Record<string, boolean>): void {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state));
}
