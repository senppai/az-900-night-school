"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { QuestionCard } from "@/components/question-card";
import { useProgress } from "@/components/progress-provider";
import { DOMAINS } from "@/content/catalog";
import { getLesson, lessons } from "@/content/lessons";
import type { QuizQuestion } from "@/content/types";
import { correctIndexes, describeAnswer, kindLabel, shuffled, withShuffledOptions } from "@/lib/grading";
import { MASTERY_STREAK } from "@/lib/progress";
import { openMistakes, type OpenMistake } from "@/lib/question-bank";
import { cn } from "@/lib/utils";

type RetryRun = {
  questions: QuizQuestion[];
  meta: Record<string, { source: string; lesson?: string }>;
  index: number;
  results: Record<string, boolean>;
};

const UNTAGGED = "untagged";

export function MistakesView() {
  const { state, ready } = useProgress();
  const [run, setRun] = useState<RetryRun | null>(null);
  const open = useMemo(() => openMistakes(state.mistakes), [state.mistakes]);

  const groups = useMemo(() => {
    const bySlug = new Map<string, OpenMistake[]>();
    for (const item of open) {
      const key = item.lesson ?? UNTAGGED;
      bySlug.set(key, [...(bySlug.get(key) ?? []), item]);
    }
    const ordered = lessons
      .filter((lesson) => bySlug.has(lesson.slug))
      .map((lesson) => ({ key: lesson.slug, lesson, items: bySlug.get(lesson.slug) ?? [] }));
    const untagged = bySlug.get(UNTAGGED);
    return untagged ? [...ordered, { key: UNTAGGED, lesson: undefined, items: untagged }] : ordered;
  }, [open]);

  function start(items: OpenMistake[]) {
    if (items.length === 0) return;
    setRun({
      questions: shuffled(items).map((item) => withShuffledOptions(item.entry.question)),
      meta: Object.fromEntries(items.map((item) => [item.id, { source: item.mistake.source, lesson: item.lesson }])),
      index: 0,
      results: {},
    });
    window.scrollTo({ top: 0 });
  }

  if (run) {
    return (
      <RetryRunner
        run={run}
        onChange={setRun}
        onExit={() => setRun(null)}
        onAgain={(ids) => start(open.filter((item) => ids.includes(item.id)))}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Mistake notebook</p>
        <h1 className="text-4xl font-semibold tracking-tight">Every question you missed, in one place.</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          Wrong answers from lesson quizzes, the practice exam and every Exam Prep level land here. Retry them
          with shuffled options — answer one correctly {MASTERY_STREAK} times in a row and it leaves the notebook.
        </p>
      </header>

      {!ready ? (
        <p className="text-sm text-muted-foreground">Loading your notebook…</p>
      ) : open.length === 0 ? (
        <section className="rounded-2xl bg-card/80 p-6 ring-1 ring-white/10">
          <CheckCircle2 className="size-8 text-think" />
          <h2 className="mt-3 text-2xl font-semibold">Nothing to fix right now.</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Either you have not missed anything yet, or you have mastered every miss. Test yourself and anything
            you get wrong will show up here.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/exam-prep"
              className="inline-flex h-9 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
            >
              Go to Exam Prep
            </Link>
            <Link
              href="/practice"
              className="inline-flex h-9 items-center rounded-lg px-3 text-sm ring-1 ring-white/15 hover:bg-white/8"
            >
              Practice exam
            </Link>
          </div>
        </section>
      ) : (
        <>
          <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-trap/10 p-5 ring-1 ring-trap/30">
            <div>
              <p className="text-3xl font-semibold">{open.length}</p>
              <p className="text-sm text-muted-foreground">
                open mistake{open.length === 1 ? "" : "s"} across {groups.length} topic
                {groups.length === 1 ? "" : "s"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => start(open)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
            >
              <RotateCcw className="size-4" />
              Retry my mistakes
            </button>
          </section>

          <div className="space-y-6">
            {groups.map((group) => {
              const domain = DOMAINS.find((item) => item.id === group.lesson?.domain);
              return (
                <section key={group.key} className="space-y-3">
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
                        {domain ? `Domain ${domain.number} · ${domain.title}` : "No lesson tag"}
                      </p>
                      <h2 className="text-xl font-semibold">
                        {group.lesson ? `${group.lesson.emoji} ${group.lesson.title}` : "Practice exam"}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">{group.items.length}</span>
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      {group.lesson ? (
                        <Link
                          href={`/learn/${group.lesson.slug}`}
                          className="inline-flex h-8 items-center rounded-lg px-3 text-xs ring-1 ring-white/15 hover:bg-white/8"
                        >
                          Restudy lesson
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => start(group.items)}
                        className="inline-flex h-8 items-center rounded-lg bg-primary/15 px-3 text-xs font-medium text-primary ring-1 ring-primary/40 hover:bg-primary/25"
                      >
                        Retry these
                      </button>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <MistakeItem key={item.id} item={item} />
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function MistakeItem({ item }: { item: OpenMistake }) {
  const { question } = item.entry;
  const label = kindLabel(question);
  return (
    <li className="rounded-2xl bg-card/80 p-4 text-sm leading-6 ring-1 ring-white/8">
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="rounded-full bg-trap/15 px-2 py-0.5 font-semibold text-trap">
          Missed {item.mistake.count}×
        </span>
        {item.mistake.streak > 0 ? (
          <span className="rounded-full bg-think/15 px-2 py-0.5 font-semibold text-think">
            {item.mistake.streak}/{MASTERY_STREAK} toward mastery
          </span>
        ) : null}
        {label ? <span className="rounded-full bg-exam/15 px-2 py-0.5 text-exam">{label}</span> : null}
        <span className="text-muted-foreground">{item.entry.sourceLabel}</span>
      </div>
      <p className="mt-2 font-medium">{question.prompt}</p>
      {question.trap ? <p className="mt-1 text-trap/90">Trap: {question.trap}</p> : null}
      <details className="mt-2 text-muted-foreground">
        <summary className="cursor-pointer text-xs text-primary">Show the answer</summary>
        <p className="mt-2 text-think">{describeAnswer(question, correctIndexes(question))}</p>
        <p className="mt-1">{question.explanation}</p>
      </details>
    </li>
  );
}

function RetryRunner({
  run,
  onChange,
  onExit,
  onAgain,
}: {
  run: RetryRun;
  onChange: (run: RetryRun) => void;
  onExit: () => void;
  onAgain: (ids: string[]) => void;
}) {
  const { state, recordAnswers } = useProgress();
  const question = run.questions[run.index];
  const done = run.index >= run.questions.length;
  const ids = run.questions.map((item) => item.id);
  const stillOpen = ids.filter((id) => id in state.mistakes);

  if (done) {
    const cleared = ids.length - stillOpen.length;
    const right = Object.values(run.results).filter(Boolean).length;
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Retry round finished</p>
        <h1 className="text-4xl font-semibold tracking-tight">
          {right} / {ids.length} right this round.
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">
          {cleared > 0 ? `${cleared} mastered and cleared. ` : ""}
          {stillOpen.length > 0
            ? `${stillOpen.length} still open — each needs ${MASTERY_STREAK} correct answers in a row.`
            : "Your notebook is clear for this set."}
        </p>
        <div className="flex flex-wrap gap-2">
          {stillOpen.length > 0 ? (
            <button
              type="button"
              onClick={() => onAgain(stillOpen)}
              className="h-9 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
            >
              Retry the {stillOpen.length} still open
            </button>
          ) : null}
          <button
            type="button"
            onClick={onExit}
            className="h-9 rounded-lg px-3 text-sm ring-1 ring-white/15 hover:bg-white/8"
          >
            Back to the notebook
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const meta = run.meta[question.id];
  const lesson = meta?.lesson ? getLesson(meta.lesson) : undefined;
  const answered = question.id in run.results;
  const mistake = state.mistakes[question.id];

  function record(correct: boolean) {
    recordAnswers([{ questionId: question.id, correct, source: meta?.source ?? "retry", retry: true }]);
    onChange({ ...run, results: { ...run.results, [question.id]: correct } });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Retry my mistakes</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Question {run.index + 1} of {run.questions.length}
          </p>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="h-9 rounded-lg px-3 text-sm ring-1 ring-white/15 hover:bg-white/8"
        >
          Stop
        </button>
      </header>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(Object.keys(run.results).length / run.questions.length) * 100}%` }}
        />
      </div>
      <section className="relative z-10 rounded-2xl bg-card p-6 ring-1 ring-white/10">
        <p className="mb-3 text-xs text-muted-foreground">
          {lesson ? `${lesson.emoji} ${lesson.title}` : "Practice exam"}
        </p>
        <QuestionCard
          key={question.id}
          question={question}
          feedback
          onSubmit={(correct) => record(correct)}
          after={
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onChange({ ...run, index: run.index + 1 })}
                className="h-9 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
              >
                {run.index + 1 >= run.questions.length ? "See round summary" : "Next mistake"}
              </button>
              {answered ? (
                <p
                  className={cn(
                    "text-sm",
                    !run.results[question.id] ? "text-trap" : mistake ? "text-exam" : "text-think",
                  )}
                >
                  {!run.results[question.id]
                    ? "Streak reset — it stays in your notebook."
                    : mistake
                      ? `${mistake.streak}/${MASTERY_STREAK} in a row. Get it right once more to clear it.`
                      : "Mastered — cleared from your notebook."}
                </p>
              ) : null}
            </div>
          }
        />
      </section>
    </div>
  );
}
