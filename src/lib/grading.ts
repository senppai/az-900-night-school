import type { QuestionKind, QuizQuestion } from "@/content/types";

const byNumber = (a: number, b: number) => a - b;

export function kindOf(question: QuizQuestion): QuestionKind {
  return question.kind ?? "single";
}

/** Positional kinds compare answers slot by slot instead of as a set. */
function isPositional(kind: QuestionKind) {
  return kind === "match" || kind === "order";
}

/** The `picked` value a fully correct answer would produce. */
export function correctIndexes(question: QuizQuestion): number[] {
  const kind = kindOf(question);
  if (kind === "match") return [...(question.answers ?? [])];
  if (kind === "order") return question.answers ? [...question.answers] : question.options.map((_, i) => i);
  if (kind === "multi" || kind === "yesno") return [...(question.answers ?? [])].sort(byNumber);
  return [question.answer];
}

/**
 * `picked` holds the chosen option for single/complete, the chosen options for
 * multi, the statements marked "Yes" for yesno, the category index per option for
 * match, and option indexes in the learner's sequence for order.
 */
export function isCorrect(question: QuizQuestion, picked: number[]): boolean {
  const expected = correctIndexes(question);
  if (isPositional(kindOf(question))) {
    return expected.length === picked.length && expected.every((value, i) => value === picked[i]);
  }
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

/**
 * Yes/No statement order and match categories are kept; options of every other kind
 * are shuffled. Order questions never start out already solved.
 */
export function withShuffledOptions<Q extends QuizQuestion>(question: Q): Q {
  const kind = kindOf(question);
  if (kind === "yesno") return question;
  const indexes = question.options.map((_, i) => i);
  let order = shuffled(indexes);
  if (kind === "order") {
    const sequence = correctIndexes(question);
    for (let tries = 0; tries < 5 && order.every((value, i) => value === sequence[i]); tries++) {
      order = shuffled(indexes);
    }
  }
  const options = order.map((i) => question.options[i]);
  if (kind === "match") {
    return { ...question, options, answers: order.map((i) => question.answers?.[i] ?? -1) };
  }
  if (kind === "order") {
    return { ...question, options, answers: correctIndexes(question).map((value) => order.indexOf(value)) };
  }
  return {
    ...question,
    options,
    answer: order.indexOf(question.answer),
    answers: question.answers?.map((value) => order.indexOf(value)),
  };
}

export function describeAnswer(question: QuizQuestion, picked: number[]): string {
  const kind = kindOf(question);
  if (kind === "yesno") {
    return question.options
      .map((statement, i) => `${picked.includes(i) ? "Yes" : "No"} — ${statement}`)
      .join(" · ");
  }
  if (picked.length === 0) return "No answer";
  if (kind === "match") {
    return question.options
      .map((item, i) => `${item} → ${question.categories?.[picked[i]] ?? "—"}`)
      .join(" · ");
  }
  if (kind === "order") {
    return picked.map((optionIndex, step) => `${step + 1}. ${question.options[optionIndex]}`).join(" · ");
  }
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
    case "match":
      return "Match each item";
    case "order":
      return "Put in the correct order";
    default:
      return null;
  }
}
