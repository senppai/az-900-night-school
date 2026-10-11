import type { DomainId } from "@/content/types";

export type LessonProgress = {
  completed: boolean;
  quizBest: number;
  quizTotal: number;
};

export type Tally = { correct: number; total: number };

export type SavedExamRun = {
  questionIds: string[];
  index: number;
  results: Record<string, boolean>;
  lessons: string[];
};

/** "quiz", "practice", or an Exam Prep level id such as "l5". */
export type AnswerSource = string;

export type Mistake = {
  source: AnswerSource;
  lesson?: string;
  /** Times answered wrong, including failed retries. */
  count: number;
  first: number;
  last: number;
  /** Correct retries in a row; the mistake clears at MASTERY_STREAK. */
  streak: number;
};

export type RecentAnswer = { domain: DomainId; correct: boolean; examStyle: boolean };

export type AnswerEvent = {
  questionId: string;
  correct: boolean;
  source: AnswerSource;
  lesson?: string;
  domain?: DomainId;
  /** Answered from the mistake notebook. */
  retry?: boolean;
};

export type ProgressState = {
  lessons: Record<string, LessonProgress>;
  flashSeen: string[];
  practiceBest: number | null;
  xp: number;
  examBest: Record<string, number>;
  examSaved: Record<string, SavedExamRun>;
  lessonStats: Record<string, Tally>;
  mistakes: Record<string, Mistake>;
  /** Newest last, capped at RECENT_LIMIT. Retries are left out so they don't inflate readiness. */
  recent: RecentAnswer[];
  /** Questions answered per local YYYY-MM-DD date. */
  daily: Record<string, number>;
  dailyGoal: number;
  examDate: string | null;
};

const KEY = "az900-night-school-progress-v1";

export const MASTERY_STREAK = 2;
export const RECENT_LIMIT = 300;
const DAILY_KEEP_DAYS = 60;

export const EMPTY_PROGRESS: ProgressState = {
  lessons: {},
  flashSeen: [],
  practiceBest: null,
  xp: 0,
  examBest: {},
  examSaved: {},
  lessonStats: {},
  mistakes: {},
  recent: [],
  daily: {},
  dailyGoal: 20,
  examDate: null,
};

let memory: ProgressState = EMPTY_PROGRESS;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY_PROGRESS;
    return { ...EMPTY_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(state: ProgressState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function subscribeProgress(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getProgressSnapshot() {
  if (!hydrated && typeof window !== "undefined") {
    memory = loadProgress();
    hydrated = true;
  }
  return memory;
}

export function getServerProgressSnapshot() {
  return EMPTY_PROGRESS;
}

export function writeProgress(next: ProgressState) {
  memory = next;
  if (typeof window !== "undefined") saveProgress(next);
  emit();
}

/** Lessons below 70% in Exam Prep (with at least 3 answers) or in their mini-quiz. */
export function weakLessons(state: ProgressState): string[] {
  const weak = new Set<string>();
  for (const [slug, tally] of Object.entries(state.lessonStats)) {
    if (tally.total >= 3 && tally.correct / tally.total < 0.7) weak.add(slug);
  }
  for (const [slug, lesson] of Object.entries(state.lessons)) {
    if (lesson.quizTotal > 0 && lesson.quizBest / lesson.quizTotal < 0.7) weak.add(slug);
  }
  return [...weak];
}

export function localDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Whole days from one YYYY-MM-DD key to another. */
export function daysBetween(from: string, to: string) {
  const parse = (key: string) => {
    const [year, month, day] = key.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  };
  return Math.round((parse(to) - parse(from)) / 86_400_000);
}

export function shiftDateKey(key: string, days: number) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

/** Pure reducer behind `recordAnswers`; `now` is passed in so callers stay in event handlers. */
export function applyAnswers(prev: ProgressState, events: AnswerEvent[], now: Date): ProgressState {
  if (events.length === 0) return prev;
  const stamp = now.getTime();
  const today = localDateKey(now);
  const mistakes = { ...prev.mistakes };
  const recent = [...prev.recent];
  let cleared = 0;

  for (const event of events) {
    const existing = mistakes[event.questionId];
    if (event.retry) {
      if (!existing) continue;
      if (!event.correct) {
        mistakes[event.questionId] = { ...existing, count: existing.count + 1, last: stamp, streak: 0 };
      } else if (existing.streak + 1 >= MASTERY_STREAK) {
        delete mistakes[event.questionId];
        cleared += 1;
      } else {
        mistakes[event.questionId] = { ...existing, streak: existing.streak + 1 };
      }
      continue;
    }
    if (event.domain) {
      recent.push({ domain: event.domain, correct: event.correct, examStyle: event.source !== "quiz" });
    }
    if (!event.correct) {
      mistakes[event.questionId] = {
        source: event.source,
        lesson: event.lesson ?? existing?.lesson,
        count: (existing?.count ?? 0) + 1,
        first: existing?.first ?? stamp,
        last: stamp,
        streak: 0,
      };
    }
  }

  const daily: Record<string, number> = { [today]: (prev.daily[today] ?? 0) + events.length };
  for (const [key, count] of Object.entries(prev.daily)) {
    if (key !== today && daysBetween(key, today) < DAILY_KEEP_DAYS) daily[key] = count;
  }

  return {
    ...prev,
    xp: prev.xp + cleared * 10,
    mistakes,
    recent: recent.slice(-RECENT_LIMIT),
    daily,
  };
}

export function rankForXp(xp: number) {
  if (xp >= 1800) return { title: "Pearson-ready", emoji: "🎓", next: null };
  if (xp >= 1200) return { title: "Azure intern", emoji: "🛠️", next: 1800 };
  if (xp >= 600) return { title: "Cloud tourist", emoji: "🧳", next: 1200 };
  return { title: "First day", emoji: "🌱", next: 600 };
}
