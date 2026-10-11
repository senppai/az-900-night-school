"use client";

import { useState } from "react";
import { QuestionCard } from "@/components/question-card";
import type { QuizQuestion } from "@/content/types";

type QuizProps = {
  questions: QuizQuestion[];
  onFinished: (correct: number, total: number) => void;
  /** Called once per submitted answer. */
  onAnswer?: (question: QuizQuestion, correct: boolean) => void;
  title?: string;
};

export function Quiz({ questions, onFinished, onAnswer, title = "Check yourself" }: QuizProps) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [reported, setReported] = useState(false);
  const [round, setRound] = useState(0);

  const question = questions[index];

  if (!question) return null;

  function next() {
    setIndex((value) => value + 1);
  }

  function finish() {
    if (!reported) {
      setReported(true);
      onFinished(correct, questions.length);
    }
    setDone(true);
  }

  function restart() {
    setIndex(0);
    setCorrect(0);
    setDone(false);
    setReported(false);
    setRound((value) => value + 1);
  }

  if (done) {
    const percent = Math.round((correct / questions.length) * 100);
    return (
      <section className="relative z-10 rounded-2xl bg-card p-6 ring-1 ring-white/10">
        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          {title}
        </p>
        <h3 className="mt-2 text-2xl font-semibold">
          {percent >= 80 ? "You are locking this in." : "Good — now restudy the misses."}
        </h3>
        <p className="mt-2 text-muted-foreground">
          {correct} / {questions.length} · {percent}%
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${percent}%` }}
          />
        </div>
        <button
          type="button"
          onClick={restart}
          className="mt-5 h-9 cursor-pointer rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Try these again
        </button>
      </section>
    );
  }

  const last = index + 1 >= questions.length;

  return (
    <section className="relative z-10 rounded-2xl bg-card p-6 ring-1 ring-white/10">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          {title}
        </p>
        <p className="text-xs text-muted-foreground">
          {index + 1} / {questions.length}
        </p>
      </div>
      <QuestionCard
        key={`${round}-${question.id}`}
        question={question}
        feedback
        onSubmit={(isRight) => {
          if (isRight) setCorrect((value) => value + 1);
          onAnswer?.(question, isRight);
        }}
        after={
          <button
            type="button"
            onClick={last ? finish : next}
            className="h-9 cursor-pointer rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            {last ? "See score" : "Next question"}
          </button>
        }
      />
    </section>
  );
}
