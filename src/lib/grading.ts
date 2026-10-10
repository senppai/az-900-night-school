import type { QuestionKind, QuizQuestion } from "@/content/types";

const byNumber = (a: number, b: number) => a - b;

export function kindOf(question: QuizQuestion): QuestionKind {
  return question.kind ?? "single";
}

export function correctIndexes(question: QuizQuestion): number[] {
  const kind = kindOf(question);
  if (kind === "multi" || kind === "yesno") return [...(question.answers ?? [])].sort(byNumber);
  return [question.answer];
}

/**
 * `picked` holds the chosen option for single/complete, the chosen options for
 * multi, and the statements marked "Yes" for yesno.
 */
export function isCorrect(question: QuizQuestion, picked: number[]): boolean {
  const expected = correctIndexes(question);
  const actual = [...new Set(picked)].sort(byNumber);
  return expected.length === actual.length && expected.every((value, i) => value === actual[i]);
}

export function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Yes/No statement order is kept; every other kind gets its options shuffled. */
export function withShuffledOptions<Q extends QuizQuestion>(question: Q): Q {
  if (kindOf(question) === "yesno") return question;
  const order = shuffled(question.options.map((_, i) => i));
  return {
    ...question,
    options: order.map((i) => question.options[i]),
    answer: order.indexOf(question.answer),
    answers: question.answers?.map((value) => order.indexOf(value)),
  };
}

export function describeAnswer(question: QuizQuestion, picked: number[]): string {
  if (kindOf(question) === "yesno") {
    return question.options
      .map((statement, i) => `${picked.includes(i) ? "Yes" : "No"} — ${statement}`)
      .join(" · ");
  }
  if (picked.length === 0) return "No answer";
  return picked.map((i) => question.options[i]).join(" + ");
}

export function kindLabel(question: QuizQuestion): string | null {
  switch (kindOf(question)) {
    case "multi":
      return `Choose ${correctIndexes(question).length}`;
    case "yesno":
      return "Yes or No for each statement";
    case "complete":
      return "Complete the sentence";
    default:
      return null;
  }
}
