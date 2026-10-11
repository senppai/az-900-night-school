import { lessonsForDomain } from "@/content/lessons";
import type { DomainId } from "@/content/types";
import type { ProgressState } from "@/lib/progress";

/** Midpoints of the official 25–30 / 35–40 / 30–35% domain ranges. */
export const DOMAIN_WEIGHTS: Record<DomainId, number> = {
  cloud: 27.5,
  architecture: 37.5,
  governance: 32.5,
};

export const MIN_ANSWERS = 30;
export const MIN_PER_DOMAIN = 5;
export const PASS_SCORE = 700;
export const READY_SCORE = 780;
export const ALMOST_SCORE = 680;

const RECENT_PER_DOMAIN = 60;
const EXAM_STYLE_WEIGHT = 1;
const QUIZ_WEIGHT = 0.6;
const HISTORY_WEIGHT = 0.25;

export type ReadinessStatus = "insufficient" | "study" | "almost" | "ready";

export type DomainReadiness = {
  domain: DomainId;
  accuracy: number | null;
  answered: number;
};

export type Readiness = {
  status: ReadinessStatus;
  score: number | null;
  answered: number;
  domains: DomainReadiness[];
  weakest: DomainId | null;
  /** Lowest-scoring (or first untested) lesson in the weakest domain. */
  weakestLesson: string | null;
};

/**
 * Recent answers count most (exam-style above lesson quizzes); all-time Exam Prep tallies
 * and quiz bests add a light prior so older progress still counts.
 */
export function estimateReadiness(state: ProgressState): Readiness {
  const domains = (Object.keys(DOMAIN_WEIGHTS) as DomainId[]).map((domain): DomainReadiness => {
    const recent = state.recent.filter((answer) => answer.domain === domain).slice(-RECENT_PER_DOMAIN);
    let earned = 0;
    let possible = 0;
    for (const answer of recent) {
      const weight = answer.examStyle ? EXAM_STYLE_WEIGHT : QUIZ_WEIGHT;
      possible += weight;
      if (answer.correct) earned += weight;
    }
    let history = 0;
    for (const lesson of lessonsForDomain(domain)) {
      const tally = state.lessonStats[lesson.slug];
      if (tally) {
        earned += tally.correct * HISTORY_WEIGHT;
        possible += tally.total * HISTORY_WEIGHT;
        history += tally.total;
      }
      const quiz = state.lessons[lesson.slug];
      if (quiz?.quizTotal) {
        earned += quiz.quizBest * HISTORY_WEIGHT;
        possible += quiz.quizTotal * HISTORY_WEIGHT;
        history += quiz.quizTotal;
      }
    }
    return {
      domain,
      accuracy: possible > 0 ? earned / possible : null,
      answered: Math.max(recent.length, history),
    };
  });

  const answered = domains.reduce((sum, item) => sum + item.answered, 0);
  const tested = domains.filter((item) => item.accuracy !== null);
  const weakestEntry = [...tested].sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0))[0];
  const weakest = weakestEntry?.domain ?? null;
  const enough = answered >= MIN_ANSWERS && domains.every((item) => item.answered >= MIN_PER_DOMAIN);

  let score: number | null = null;
  let status: ReadinessStatus = "insufficient";
  if (enough) {
    const totalWeight = domains.reduce((sum, item) => sum + DOMAIN_WEIGHTS[item.domain], 0);
    const weighted = domains.reduce(
      (sum, item) => sum + (item.accuracy ?? 0) * DOMAIN_WEIGHTS[item.domain],
      0,
    );
    score = Math.round((weighted / totalWeight) * 1000);
    const allDomainsOk = domains.every((item) => (item.accuracy ?? 0) >= 0.7);
    status = score >= READY_SCORE && allDomainsOk ? "ready" : score >= ALMOST_SCORE ? "almost" : "study";
  }

  return { status, score, answered, domains, weakest, weakestLesson: weakest ? weakestLessonIn(state, weakest) : null };
}

function weakestLessonIn(state: ProgressState, domain: DomainId): string | null {
  const candidates = lessonsForDomain(domain).map((lesson) => {
    const tally = state.lessonStats[lesson.slug];
    const quiz = state.lessons[lesson.slug];
    const correct = (tally?.correct ?? 0) + (quiz?.quizBest ?? 0);
    const total = (tally?.total ?? 0) + (quiz?.quizTotal ?? 0);
    return { slug: lesson.slug, ratio: total > 0 ? correct / total : -1 };
  });
  const untested = candidates.find((item) => item.ratio < 0);
  const lowest = candidates.filter((item) => item.ratio >= 0).sort((a, b) => a.ratio - b.ratio)[0];
  if (lowest && lowest.ratio < 0.7) return lowest.slug;
  return untested?.slug ?? lowest?.slug ?? null;
}
