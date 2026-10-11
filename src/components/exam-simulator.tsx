"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { QuestionCard } from "@/components/question-card";
import type { ExamLevel } from "@/content/exam-prep";
import type { ExamQuestion } from "@/content/types";
import { cn } from "@/lib/utils";

export type ExamRun = {
  level: ExamLevel;
  questions: ExamQuestion[];
  index: number;
  results: Record<string, boolean>;
  picked: Record<string, number[]>;
  lessons: string[];
  deadline: number | null;
};

/** Milliseconds left, or null before the first tick and for untimed runs. */
export function useCountdown(deadline: number | null) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!deadline) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [deadline]);

  return deadline && now !== null ? Math.max(0, deadline - now) : null;
}

export function formatClock(ms: number) {
  const seconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function ExamClock({ remaining, limitMinutes }: { remaining: number | null; limitMinutes: number }) {
  return (
    <span
      role="timer"
      aria-label="Time remaining"
      className={cn(
        "rounded-lg px-3 py-1.5 font-mono text-sm ring-1",
        remaining !== null && remaining < 5 * 60_000
          ? "bg-trap/15 text-trap ring-trap/40"
          : "bg-white/6 ring-white/10",
      )}
    >
      {formatClock(remaining ?? limitMinutes * 60_000)}
    </span>
  );
}

/** Real-exam flow: navigate freely, change answers, mark for review, then submit once. */
export function ExamSimulator({
  run,
  onChange,
  onFinish,
  onExit,
}: {
  run: ExamRun;
  onChange: (run: ExamRun) => void;
  onFinish: (run: ExamRun) => void;
  onExit: () => void;
}) {
  const remaining = useCountdown(run.deadline);
  const expired = remaining === 0;
  const [marked, setMarked] = useState<string[]>([]);
  const [reviewing, setReviewing] = useState(false);
  const total = run.questions.length;
  const question = run.questions[run.index];
  const answered = run.questions.filter((item) => item.id in run.picked).length;
  const unanswered = run.questions
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !(item.id in run.picked));
  const markedItems = run.questions
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => marked.includes(item.id));

  if (!question) return null;

  const isMarked = marked.includes(question.id);
  const last = run.index + 1 >= total;

  function go(index: number) {
    setReviewing(false);
    onChange({ ...run, index });
    window.scrollTo({ top: 0 });
  }

  function answer(correct: boolean, picked: number[]) {
    onChange({
      ...run,
      results: { ...run.results, [question.id]: correct },
      picked: { ...run.picked, [question.id]: picked },
    });
  }

  function clear() {
    const results = { ...run.results };
    const picked = { ...run.picked };
    delete results[question.id];
    delete picked[question.id];
    onChange({ ...run, results, picked });
  }

  function toggleMark() {
    setMarked((current) =>
      current.includes(question.id) ? current.filter((id) => id !== question.id) : [...current, question.id],
    );
  }

  function openReview() {
    setReviewing(true);
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Level {run.level.number} · {run.level.name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {answered} of {total} answered · {marked.length} marked for review
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {run.deadline ? <ExamClock remaining={remaining} limitMinutes={run.level.timeLimit ?? 0} /> : null}
          {!expired && !reviewing ? (
            <button
              type="button"
              onClick={openReview}
              className="h-9 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
            >
              Review &amp; submit
            </button>
          ) : null}
          <button
            type="button"
            onClick={onExit}
            className="h-9 rounded-lg px-3 text-sm ring-1 ring-white/15 hover:bg-white/8"
          >
            Quit
          </button>
        </div>
      </header>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(answered / total) * 100}%` }}
        />
      </div>

      {expired ? (
        <section className="rounded-2xl bg-card p-6 ring-1 ring-trap/40">
          <h2 className="text-2xl font-semibold">Time is up.</h2>
          <p className="mt-2 text-muted-foreground">
            You answered {answered} of {total}. Unanswered questions count as wrong, just like the real exam.
          </p>
          <button
            type="button"
            onClick={() => onFinish(run)}
            className="mt-4 h-9 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            See my results
          </button>
        </section>
      ) : reviewing ? (
        <section className="space-y-6 rounded-2xl bg-card p-6 ring-1 ring-white/10">
          <div>
            <h2 className="text-2xl font-semibold">Review before you submit</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Jump back to any question to change your answer. Once you submit, the exam is scored and answers
              are final.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <ReviewStat label="Answered" value={`${answered} / ${total}`} />
            <ReviewStat label="Unanswered" value={String(unanswered.length)} warn={unanswered.length > 0} />
            <ReviewStat label="Marked for review" value={String(markedItems.length)} />
          </div>
          <JumpList
            title="Unanswered"
            empty="Every question has an answer."
            items={unanswered.map(({ index }) => index)}
            onJump={go}
            tone="trap"
          />
          <JumpList
            title="Marked for review"
            empty="Nothing marked."
            items={markedItems.map(({ index }) => index)}
            onJump={go}
            tone="accent"
          />
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">All questions</p>
            <QuestionGrid run={run} marked={marked} current={null} onJump={go} />
          </div>
          {unanswered.length > 0 ? (
            <p className="text-sm text-trap">
              {unanswered.length} unanswered question{unanswered.length === 1 ? "" : "s"} will count as wrong.
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setReviewing(false)}
              className="h-9 rounded-lg px-3 text-sm ring-1 ring-white/15 hover:bg-white/8"
            >
              Back to questions
            </button>
            <button
              type="button"
              onClick={() => onFinish(run)}
              className="h-9 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
            >
              Submit exam
            </button>
          </div>
        </section>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_16rem]">
          <section className="relative z-10 rounded-2xl bg-card p-6 ring-1 ring-white/10">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold">
                Question {run.index + 1} <span className="text-muted-foreground">of {total}</span>
              </p>
              <button
                type="button"
                aria-pressed={isMarked}
                onClick={toggleMark}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium ring-1",
                  isMarked ? "bg-accent/20 text-accent ring-accent/50" : "ring-white/15 hover:bg-white/8",
                )}
              >
                <Flag className="size-3.5" />
                {isMarked ? "Marked for review" : "Mark for review"}
              </button>
            </div>
            <QuestionCard
              key={question.id}
              question={question}
              feedback={false}
              editable
              initialPicked={run.picked[question.id]}
              onSubmit={answer}
              onClear={clear}
            />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/8 pt-4">
              <button
                type="button"
                disabled={run.index === 0}
                onClick={() => go(run.index - 1)}
                className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm ring-1 ring-white/15 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
                Previous
              </button>
              <button
                type="button"
                onClick={() => (last ? openReview() : go(run.index + 1))}
                className="inline-flex h-9 items-center gap-1 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
              >
                {last ? "Review answers" : "Next"}
                <ChevronRight className="size-4" />
              </button>
            </div>
          </section>
          <aside className="h-fit space-y-3 rounded-2xl bg-card/80 p-4 ring-1 ring-white/10">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Questions</p>
            <QuestionGrid run={run} marked={marked} current={run.index} onJump={go} />
            <ul className="space-y-1 text-[11px] text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="size-3 rounded bg-primary/30 ring-1 ring-primary/50" /> Answered
              </li>
              <li className="flex items-center gap-2">
                <span className="size-3 rounded bg-white/4 ring-1 ring-white/15" /> Unanswered
              </li>
              <li className="flex items-center gap-2">
                <Flag className="size-3 text-accent" /> Marked for review
              </li>
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
}

function QuestionGrid({
  run,
  marked,
  current,
  onJump,
}: {
  run: ExamRun;
  marked: string[];
  current: number | null;
  onJump: (index: number) => void;
}) {
  return (
    <ol className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 lg:grid-cols-5">
      {run.questions.map((item, index) => {
        const answered = item.id in run.picked;
        const flagged = marked.includes(item.id);
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onJump(index)}
              aria-current={current === index ? "step" : undefined}
              aria-label={`Question ${index + 1}, ${answered ? "answered" : "unanswered"}${flagged ? ", marked for review" : ""}`}
              className={cn(
                "relative grid h-9 w-full place-items-center rounded-lg font-mono text-xs ring-1 transition-colors",
                answered ? "bg-primary/30 ring-primary/50" : "bg-white/4 ring-white/15 hover:bg-white/10",
                current === index && "ring-2 ring-foreground",
              )}
            >
              {index + 1}
              {flagged ? <Flag className="absolute -top-1 -right-1 size-3 fill-accent text-accent" /> : null}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function ReviewStat({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={cn("rounded-xl px-4 py-3 ring-1", warn ? "bg-trap/10 ring-trap/30" : "bg-white/4 ring-white/10")}>
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className={cn("mt-1 text-xl font-semibold", warn && "text-trap")}>{value}</p>
    </div>
  );
}

function JumpList({
  title,
  empty,
  items,
  onJump,
  tone,
}: {
  title: string;
  empty: string;
  items: number[];
  onJump: (index: number) => void;
  tone: "trap" | "accent";
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((index) => (
            <button
              key={index}
              type="button"
              onClick={() => onJump(index)}
              className={cn(
                "h-8 rounded-lg px-3 font-mono text-xs ring-1",
                tone === "trap"
                  ? "bg-trap/10 text-trap ring-trap/30 hover:bg-trap/20"
                  : "bg-accent/10 text-accent ring-accent/30 hover:bg-accent/20",
              )}
            >
              Q{index + 1} →
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
