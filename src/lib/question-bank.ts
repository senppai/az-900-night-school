import { LEVELS } from "@/content/exam-prep";
import { lessons } from "@/content/lessons";
import { practiceDomain, practiceExam } from "@/content/practice-exam";
import type { DomainId, QuizQuestion } from "@/content/types";
import type { Mistake } from "@/lib/progress";

export type BankEntry = {
  question: QuizQuestion;
  domain: DomainId;
  /** Practice-exam questions have no lesson tag. */
  lesson?: string;
  sourceLabel: string;
};

let bank: Map<string, BankEntry> | null = null;

export function questionBank(): Map<string, BankEntry> {
  if (bank) return bank;
  const entries = new Map<string, BankEntry>();
  for (const lesson of lessons) {
    for (const question of lesson.quiz) {
      entries.set(question.id, {
        question,
        domain: lesson.domain,
        lesson: lesson.slug,
        sourceLabel: "Lesson quiz",
      });
    }
  }
  for (const question of practiceExam) {
    entries.set(question.id, { question, domain: practiceDomain(question.id), sourceLabel: "Practice exam" });
  }
  for (const level of LEVELS) {
    for (const question of level.questions) {
      entries.set(question.id, {
        question,
        domain: question.domain,
        lesson: question.lesson,
        sourceLabel: `Exam Prep level ${level.number}`,
      });
    }
  }
  bank = entries;
  return entries;
}

export function findQuestion(id: string): BankEntry | undefined {
  return questionBank().get(id);
}

export type OpenMistake = { id: string; mistake: Mistake; entry: BankEntry; lesson?: string };

/** Newest first; ids that no longer exist in any bank are skipped. */
export function openMistakes(mistakes: Record<string, Mistake>): OpenMistake[] {
  return Object.entries(mistakes)
    .flatMap(([id, mistake]) => {
      const entry = findQuestion(id);
      return entry ? [{ id, mistake, entry, lesson: mistake.lesson ?? entry.lesson }] : [];
    })
    .sort((a, b) => b.mistake.last - a.mistake.last);
}
