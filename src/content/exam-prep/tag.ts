import { getLesson } from "../lessons";
import type { ExamQuestion } from "../types";

export type DraftQuestion = Omit<ExamQuestion, "id" | "domain">;

export function tag(prefix: string, drafts: DraftQuestion[]): ExamQuestion[] {
  return drafts.map((draft, index) => {
    const lesson = getLesson(draft.lesson);
    if (!lesson) throw new Error(`Unknown lesson "${draft.lesson}" in ${prefix}`);
    return { ...draft, id: `${prefix}-${index + 1}`, domain: lesson.domain };
  });
}
