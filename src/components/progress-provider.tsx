"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  EMPTY_PROGRESS,
  getProgressSnapshot,
  getServerProgressSnapshot,
  rankForXp,
  subscribeProgress,
  writeProgress,
  type ProgressState,
  type SavedExamRun,
  type Tally,
} from "@/lib/progress";

type ProgressContextValue = {
  ready: boolean;
  state: ProgressState;
  markLessonComplete: (slug: string) => void;
  saveQuizScore: (slug: string, correct: number, total: number) => void;
  markFlashSeen: (id: string) => void;
  savePracticeScore: (score: number, total: number) => void;
  saveExamResult: (levelId: string, perLesson: Record<string, Tally>) => void;
  saveExamRun: (levelId: string, run: SavedExamRun | null) => void;
  reset: () => void;
  rank: ReturnType<typeof rankForXp>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function without<T>(record: Record<string, T>, key: string): Record<string, T> {
  const copy = { ...record };
  delete copy[key];
  return copy;
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getServerProgressSnapshot,
  );

  const markLessonComplete = useCallback((slug: string) => {
    const prev = getProgressSnapshot();
    const current = prev.lessons[slug];
    if (current?.completed) return;
    writeProgress({
      ...prev,
      xp: prev.xp + 80,
      lessons: {
        ...prev.lessons,
        [slug]: {
          completed: true,
          quizBest: current?.quizBest ?? 0,
          quizTotal: current?.quizTotal ?? 0,
        },
      },
    });
  }, []);

  const saveQuizScore = useCallback(
    (slug: string, correct: number, total: number) => {
      const prev = getProgressSnapshot();
      const current = prev.lessons[slug];
      const improved = !current || correct > current.quizBest;
      writeProgress({
        ...prev,
        xp: prev.xp + correct * 8 + (improved && correct === total ? 40 : 0),
        lessons: {
          ...prev.lessons,
          [slug]: {
            completed: current?.completed ?? false,
            quizBest: Math.max(current?.quizBest ?? 0, correct),
            quizTotal: total,
          },
        },
      });
    },
    [],
  );

  const markFlashSeen = useCallback((id: string) => {
    const prev = getProgressSnapshot();
    if (prev.flashSeen.includes(id)) return;
    writeProgress({
      ...prev,
      flashSeen: [...prev.flashSeen, id],
      xp: prev.xp + 2,
    });
  }, []);

  const savePracticeScore = useCallback((score: number, total: number) => {
    const prev = getProgressSnapshot();
    writeProgress({
      ...prev,
      practiceBest: Math.max(prev.practiceBest ?? 0, Math.round((score / total) * 100)),
      xp: prev.xp + score * 6,
    });
  }, []);

  const saveExamResult = useCallback(
    (levelId: string, perLesson: Record<string, Tally>) => {
      const prev = getProgressSnapshot();
      const tallies = Object.values(perLesson);
      const correct = tallies.reduce((sum, tally) => sum + tally.correct, 0);
      const total = tallies.reduce((sum, tally) => sum + tally.total, 0);
      if (total === 0) return;
      const lessonStats = { ...prev.lessonStats };
      for (const [slug, tally] of Object.entries(perLesson)) {
        const current = lessonStats[slug] ?? { correct: 0, total: 0 };
        lessonStats[slug] = {
          correct: current.correct + tally.correct,
          total: current.total + tally.total,
        };
      }
      const percent = Math.round((correct / total) * 100);
      writeProgress({
        ...prev,
        xp: prev.xp + correct * 5,
        examBest: { ...prev.examBest, [levelId]: Math.max(prev.examBest[levelId] ?? 0, percent) },
        examSaved: without(prev.examSaved, levelId),
        lessonStats,
      });
    },
    [],
  );

  const saveExamRun = useCallback((levelId: string, run: SavedExamRun | null) => {
    const prev = getProgressSnapshot();
    const rest = without(prev.examSaved, levelId);
    writeProgress({ ...prev, examSaved: run ? { ...rest, [levelId]: run } : rest });
  }, []);

  const reset = useCallback(() => writeProgress(EMPTY_PROGRESS), []);

  const value = useMemo(
    () => ({
      ready: true,
      state,
      markLessonComplete,
      saveQuizScore,
      markFlashSeen,
      savePracticeScore,
      saveExamResult,
      saveExamRun,
      reset,
      rank: rankForXp(state.xp),
    }),
    [
      state,
      markLessonComplete,
      saveQuizScore,
      markFlashSeen,
      savePracticeScore,
      saveExamResult,
      saveExamRun,
      reset,
    ],
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
