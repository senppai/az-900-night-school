"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { QuizQuestion } from "@/content/types";
import { correctIndexes, isCorrect, kindLabel, kindOf } from "@/lib/grading";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

const SUBMIT_CLASS =
  "mt-1 h-9 w-fit cursor-pointer rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50";

type QuestionCardProps = {
  question: QuizQuestion;
  /** Show the right answer, explanation and trap once the learner submits. */
  feedback: boolean;
  onSubmit: (correct: boolean, picked: number[]) => void;
  /** Rendered under the question after it has been submitted. */
  after?: ReactNode;
  /** A previous answer to pre-fill, in the same shape `onSubmit` reports. */
  initialPicked?: number[];
  /**
   * Exam mode: the answer never locks. `onSubmit` fires whenever the answer is complete
   * and `onClear` when a change makes it incomplete. Use with `feedback={false}`.
   */
  editable?: boolean;
  onClear?: () => void;
};

function initialMarks(question: QuizQuestion, picked?: number[]): Record<number, boolean> {
  if (!picked || kindOf(question) !== "yesno") return {};
  return Object.fromEntries(question.options.map((_, i) => [i, picked.includes(i)]));
}

function initialAssign(question: QuizQuestion, picked?: number[]): Record<number, number> {
  if (!picked || kindOf(question) !== "match") return {};
  return Object.fromEntries(picked.flatMap((category, i) => (category >= 0 ? [[i, category]] : [])));
}

function initialSequence(question: QuizQuestion, picked?: number[]): number[] {
  if (picked && kindOf(question) === "order" && picked.length === question.options.length) return picked;
  return question.options.map((_, i) => i);
}

/** Remount with `key={question.id}` to reset state between questions. */
export function QuestionCard({
  question,
  feedback,
  onSubmit,
  after,
  initialPicked,
  editable = false,
  onClear,
}: QuestionCardProps) {
  const kind = kindOf(question);
  const choiceKind = kind === "single" || kind === "complete" || kind === "multi";
  const [selected, setSelected] = useState<number[]>(() => (choiceKind ? (initialPicked ?? []) : []));
  const [marks, setMarks] = useState(() => initialMarks(question, initialPicked));
  const [assign, setAssign] = useState(() => initialAssign(question, initialPicked));
  const [sequence, setSequence] = useState(() => initialSequence(question, initialPicked));
  const [orderSaved, setOrderSaved] = useState(initialPicked !== undefined);
  const [submitted, setSubmitted] = useState(false);
  const required = correctIndexes(question).length;
  const label = kindLabel(question);
  const revealed = submitted && feedback;
  const expected = correctIndexes(question);
  const correctSet = new Set(expected);
  const locked = submitted && !editable;

  function submit(picked: number[]) {
    if (locked) return;
    if (!editable) setSubmitted(true);
    onSubmit(isCorrect(question, picked), picked);
  }

  function emitDraft(picked: number[] | null) {
    if (!editable) return;
    if (picked) onSubmit(isCorrect(question, picked), picked);
    else onClear?.();
  }

  function pickSingle(optionIndex: number) {
    if (locked) return;
    setSelected([optionIndex]);
    submit([optionIndex]);
  }

  function toggleMulti(optionIndex: number) {
    if (locked) return;
    let next = selected;
    if (selected.includes(optionIndex)) next = selected.filter((value) => value !== optionIndex);
    else if (selected.length < required) next = [...selected, optionIndex];
    if (next === selected) return;
    setSelected(next);
    emitDraft(next.length === required ? next : null);
  }

  function mark(statement: number, value: boolean) {
    if (locked) return;
    const next = { ...marks, [statement]: value };
    setMarks(next);
    const complete = question.options.every((_, i) => next[i] !== undefined);
    emitDraft(complete ? question.options.map((_, i) => i).filter((i) => next[i]) : null);
  }

  function assignCategory(item: number, category: number) {
    if (locked) return;
    const next = { ...assign, [item]: category };
    setAssign(next);
    const complete = question.options.every((_, i) => next[i] !== undefined);
    emitDraft(complete ? question.options.map((_, i) => next[i]) : null);
  }

  function move(position: number, delta: -1 | 1) {
    if (locked) return;
    const target = position + delta;
    if (target < 0 || target >= sequence.length) return;
    const next = [...sequence];
    [next[position], next[target]] = [next[target], next[position]];
    setSequence(next);
    if (editable) {
      setOrderSaved(true);
      emitDraft(next);
    }
  }

  const yesNoComplete = question.options.every((_, i) => marks[i] !== undefined);
  const yesPicked = question.options.map((_, i) => i).filter((i) => marks[i]);
  const matchComplete = question.options.every((_, i) => assign[i] !== undefined);
  const matchPicked = question.options.map((_, i) => assign[i] ?? -1);

  return (
    <div>
      {label ? (
        <p className="mb-2 inline-block rounded-full bg-exam/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-exam uppercase">
          {label}
        </p>
      ) : null}
      <h3 className="text-xl leading-8 font-semibold">{question.prompt}</h3>

      {kind === "yesno" ? (
        <div className="mt-4 grid gap-2">
          {question.options.map((statement, i) => {
            const truth = correctSet.has(i);
            const picked = marks[i];
            const right = picked === truth;
            return (
              <div
                key={statement}
                className={cn(
                  "flex flex-col gap-3 rounded-xl px-4 py-3 text-sm leading-6 ring-1 sm:flex-row sm:items-center sm:justify-between",
                  !revealed && "bg-white/4 ring-white/10",
                  revealed && right && "bg-think/15 ring-think/50",
                  revealed && !right && "bg-trap/15 ring-trap/50",
                )}
              >
                <span>{statement}</span>
                <span className="flex shrink-0 gap-2">
                  {[true, false].map((value) => (
                    <button
                      key={String(value)}
                      type="button"
                      aria-pressed={picked === value}
                      onClick={() => mark(i, value)}
                      className={cn(
                        "h-8 w-14 cursor-pointer rounded-lg text-xs font-semibold ring-1",
                        picked === value
                          ? "bg-primary text-primary-foreground ring-primary"
                          : "bg-white/4 ring-white/15 hover:bg-white/10",
                      )}
                    >
                      {value ? "Yes" : "No"}
                    </button>
                  ))}
                  {revealed ? (
                    <span className="self-center text-xs text-muted-foreground">
                      Answer: {truth ? "Yes" : "No"}
                    </span>
                  ) : null}
                </span>
              </div>
            );
          })}
          {!submitted && !editable ? (
            <button
              type="button"
              disabled={!yesNoComplete}
              onClick={() => submit(yesPicked)}
              className={SUBMIT_CLASS}
            >
              Submit answers
            </button>
          ) : null}
        </div>
      ) : kind === "match" ? (
        <div className="mt-4 grid gap-2">
          {question.options.map((item, i) => {
            const picked = assign[i];
            const truth = expected[i];
            const right = picked === truth;
            return (
              <div
                key={item}
                className={cn(
                  "flex flex-col gap-3 rounded-xl px-4 py-3 text-sm leading-6 ring-1",
                  !revealed && "bg-white/4 ring-white/10",
                  revealed && right && "bg-think/15 ring-think/50",
                  revealed && !right && "bg-trap/15 ring-trap/50",
                )}
              >
                <span className="font-medium">{item}</span>
                <span role="group" aria-label={`Match for ${item}`} className="flex flex-wrap gap-2">
                  {(question.categories ?? []).map((category, categoryIndex) => (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={picked === categoryIndex}
                      onClick={() => assignCategory(i, categoryIndex)}
                      className={cn(
                        "min-h-8 cursor-pointer rounded-lg px-3 py-1 text-left text-xs font-semibold ring-1",
                        picked === categoryIndex
                          ? "bg-primary text-primary-foreground ring-primary"
                          : "bg-white/4 ring-white/15 hover:bg-white/10",
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </span>
                {revealed && !right ? (
                  <span className="text-xs text-muted-foreground">
                    Answer: {question.categories?.[truth]}
                  </span>
                ) : null}
              </div>
            );
          })}
          {!submitted && !editable ? (
            <button
              type="button"
              disabled={!matchComplete}
              onClick={() => submit(matchPicked)}
              className={SUBMIT_CLASS}
            >
              Submit matches
            </button>
          ) : null}
        </div>
      ) : kind === "order" ? (
        <div className="mt-4 grid gap-2">
          <ol className="grid gap-2">
            {sequence.map((optionIndex, position) => {
              const right = expected[position] === optionIndex;
              return (
                <li
                  key={question.options[optionIndex]}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm leading-6 ring-1",
                    !revealed && "bg-white/4 ring-white/10",
                    revealed && right && "bg-think/15 ring-think/50",
                    revealed && !right && "bg-trap/15 ring-trap/50",
                  )}
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-black/20 font-mono text-xs text-primary">
                    {position + 1}
                  </span>
                  <span className="min-w-0 flex-1">{question.options[optionIndex]}</span>
                  {locked ? null : (
                    <span className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        disabled={position === 0}
                        onClick={() => move(position, -1)}
                        aria-label={`Move "${question.options[optionIndex]}" up`}
                        className="grid size-8 cursor-pointer place-items-center rounded-lg ring-1 ring-white/15 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ChevronUp className="size-4" />
                      </button>
                      <button
                        type="button"
                        disabled={position === sequence.length - 1}
                        onClick={() => move(position, 1)}
                        aria-label={`Move "${question.options[optionIndex]}" down`}
                        className="grid size-8 cursor-pointer place-items-center rounded-lg ring-1 ring-white/15 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ChevronDown className="size-4" />
                      </button>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          {!submitted && !editable ? (
            <button type="button" onClick={() => submit(sequence)} className={SUBMIT_CLASS}>
              Submit order
            </button>
          ) : null}
          {editable && !orderSaved ? (
            <button
              type="button"
              onClick={() => {
                setOrderSaved(true);
                emitDraft(sequence);
              }}
              className={SUBMIT_CLASS}
            >
              Keep this order
            </button>
          ) : null}
          {revealed && !isCorrect(question, sequence) ? (
            <p className="text-xs leading-5 text-muted-foreground">
              Correct order: {expected.map((optionIndex) => question.options[optionIndex]).join(" → ")}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 grid gap-2">
          {question.options.map((option, optionIndex) => {
            const isAnswer = correctSet.has(optionIndex);
            const isPicked = selected.includes(optionIndex);
            return (
              <button
                key={option}
                type="button"
                aria-pressed={isPicked}
                onClick={() => (kind === "multi" ? toggleMulti(optionIndex) : pickSingle(optionIndex))}
                className={cn(
                  "relative z-10 cursor-pointer rounded-xl px-4 py-3 text-left text-sm leading-6 ring-1 transition-colors",
                  !revealed && !isPicked && "bg-white/4 ring-white/10 hover:bg-white/10",
                  !revealed && isPicked && "bg-primary/15 ring-primary/50",
                  revealed && isAnswer && "bg-think/15 ring-think/50",
                  revealed && isPicked && !isAnswer && "bg-trap/15 ring-trap/50",
                  revealed && !isAnswer && !isPicked && "opacity-60",
                )}
              >
                <span className="mr-2 font-mono text-xs text-primary">
                  {kind === "multi" ? (isPicked ? "☑" : "☐") : LETTERS[optionIndex]}
                </span>
                {option}
              </button>
            );
          })}
          {kind === "multi" && !submitted && !editable ? (
            <button
              type="button"
              disabled={selected.length !== required}
              onClick={() => submit(selected)}
              className={SUBMIT_CLASS}
            >
              Submit ({selected.length}/{required} selected)
            </button>
          ) : null}
          {kind === "multi" && editable ? (
            <p className="text-xs text-muted-foreground">
              {selected.length}/{required} selected
            </p>
          ) : null}
        </div>
      )}

      {revealed ? (
        <div className="mt-4 space-y-2 rounded-xl bg-white/4 p-4 text-sm leading-6">
          <p>{question.explanation}</p>
          {question.trap ? <p className="text-trap">Trap: {question.trap}</p> : null}
        </div>
      ) : null}
      {submitted && after ? <div className="mt-3">{after}</div> : null}
    </div>
  );
}
