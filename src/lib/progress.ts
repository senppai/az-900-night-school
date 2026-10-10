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

export type ProgressState = {
  lessons: Record<string, LessonProgress>;
  flashSeen: string[];
  practiceBest: number | null;
  xp: number;
  examBest: Record<string, number>;
  examSaved: Record<string, SavedExamRun>;
  lessonStats: Record<string, Tally>;
};

const KEY = "az900-night-school-progress-v1";

export const EMPTY_PROGRESS: ProgressState = {
  lessons: {},
  flashSeen: [],
  practiceBest: null,
  xp: 0,
  examBest: {},
  examSaved: {},
  lessonStats: {},
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

export function rankForXp(xp: number) {
  if (xp >= 1800) return { title: "Pearson-ready", emoji: "🎓", next: null };
  if (xp >= 1200) return { title: "Azure intern", emoji: "🛠️", next: 1800 };
  if (xp >= 600) return { title: "Cloud tourist", emoji: "🧳", next: 1200 };
  return { title: "First day", emoji: "🌱", next: 600 };
}
