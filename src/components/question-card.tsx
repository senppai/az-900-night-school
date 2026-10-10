"use client";

import { useState, type ReactNode } from "react";
import type { QuizQuestion } from "@/content/types";
import { correctIndexes, isCorrect, kindLabel, kindOf } from "@/lib/grading";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

type QuestionCardProps = {
  question: QuizQuestion;
  /** Show the right answer, explanation and trap once the learner submits. */
  feedback: boolean;
  onSubmit: (correct: boolean, picked: number[]) => void;
  /** Rendered under the question after it has been submitted. */
  after?: ReactNode;
};

/** Remount with `key={question.id}` to reset state between questions. */
export function QuestionCard({ question, feedback, onSubmit, after }: QuestionCardProps) {
  const kind = kindOf(question);
  const [selected, setSelected] = useState<number[]>([]);
  const [marks, setMarks] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const required = correctIndexes(question).length;
  const label = kindLabel(question);
  const revealed = submitted && feedback;
  const correctSet = new Set(correctIndexes(question));

  function submit(picked: number[]) {
    if (submitted) return;
    setSubmitted(true);
    onSubmit(isCorrect(question, picked), picked);
  }

  function pickSingle(optionIndex: number) {
    if (submitted) return;
    setSelected([optionIndex]);
    submit([optionIndex]);
  }

  function toggleMulti(optionIndex: number) {
    if (submitted) return;
    setSelected((current) => {
      if (current.includes(optionIndex)) return current.filter((value) => value !== optionIndex);
      if (current.length >= required) return current;
      return [...current, optionIndex];
    });
  }

  function mark(statement: number, value: boolean) {
    if (submitted) return;
    setMarks((current) => ({ ...current, [statement]: value }));
  }

  const yesNoComplete = question.options.every((_, i) => marks[i] !== undefined);
  const yesPicked = question.options.map((_, i) => i).filter((i) => marks[i]);

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
          {!submitted ? (
            <button
              type="button"
              disabled={!yesNoComplete}
              onClick={() => submit(yesPicked)}
              className="mt-1 h-9 w-fit cursor-pointer rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit answers
            </button>
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
          {kind === "multi" && !submitted ? (
            <button
              type="button"
              disabled={selected.length !== required}
              onClick={() => submit(selected)}
              className="mt-1 h-9 w-fit cursor-pointer rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit ({selected.length}/{required} selected)
            </button>
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
