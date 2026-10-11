"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExamAids } from "@/components/exam-aids";
import { ExamClock, ExamSimulator, useCountdown, type ExamRun } from "@/components/exam-simulator";
import { QuestionCard } from "@/components/question-card";
import { useProgress } from "@/components/progress-provider";
import { DOMAINS, SITE } from "@/content/catalog";
import { LEVELS, type ExamLevel } from "@/content/exam-prep";
import { getLesson, lessons } from "@/content/lessons";
import type { ExamQuestion } from "@/content/types";
import { correctIndexes, describeAnswer, shuffled, withShuffledOptions } from "@/lib/grading";
import type { SavedExamRun, Tally } from "@/lib/progress";
import { cn } from "@/lib/utils";

type Run = ExamRun;

const PASS_PERCENT = 70;

export function ExamPrepView() {
  const [run, setRun] = useState<Run | null>(null);
  const [finished, setFinished] = useState<Run | null>(null);
  const { saveExamResult, recordAnswers } = useProgress();

  function start(level: ExamLevel, lessonFilter: string[] = []) {
    const pool =
      lessonFilter.length > 0
        ? level.questions.filter((question) => lessonFilter.includes(question.lesson))
        : level.questions;
    const ordered = level.fullCoverage ? pool : shuffled(pool);
    setFinished(null);
    setRun({
      level,
      questions: ordered.map(withShuffledOptions),
      index: 0,
      results: {},
      picked: {},
      lessons: lessonFilter,
      deadline: level.timeLimit ? Date.now() + level.timeLimit * 60_000 : null,
    });
    window.scrollTo({ top: 0 });
  }

  function resume(level: ExamLevel, saved: SavedExamRun) {
    const byId = new Map(level.questions.map((question) => [question.id, question]));
    const questions = saved.questionIds
      .map((id) => byId.get(id))
      .filter((question): question is ExamQuestion => Boolean(question))
      .map(withShuffledOptions);
    setFinished(null);
    setRun({
      level,
      questions,
      index: Math.min(saved.index, Math.max(questions.length - 1, 0)),
      results: saved.results,
      picked: {},
      lessons: saved.lessons,
      deadline: null,
    });
    window.scrollTo({ top: 0 });
  }

  function finish(done: Run) {
    if (done.level.examMode) {
      recordAnswers(
        done.questions
          .filter((question) => question.id in done.results)
          .map((question) => ({
            questionId: question.id,
            correct: done.results[question.id],
            source: done.level.id,
            lesson: question.lesson,
            domain: question.domain,
          })),
      );
    }
    saveExamResult(done.level.id, tallyBy(done, (question) => question.lesson));
    setRun(null);
    setFinished(done);
    window.scrollTo({ top: 0 });
  }

  if (run) {
    const props = { run, onChange: setRun, onFinish: finish, onExit: () => setRun(null) };
    return run.level.examMode ? <ExamSimulator {...props} /> : <ExamRunner {...props} />;
  }

  if (finished) {
    return (
      <ExamResults
        run={finished}
        onRetry={() => start(finished.level, finished.lessons)}
        onBack={() => setFinished(null)}
      />
    );
  }

  return (
    <div className="space-y-12">
      <header className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Exam prep</p>
        <h1 className="text-4xl font-semibold tracking-tight">Five levels from vocabulary to the real thing.</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          Every question is tagged to an exam domain and a lesson, so your results point straight at what to
          restudy. Written against the official AZ-900 skills outline as of {SITE.skillsAsOf}.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        {LEVELS.map((level) => (
          <LevelCard key={level.id} level={level} onStart={start} onResume={resume} />
        ))}
      </section>

      <ExamAids />
    </div>
  );
}

function LevelCard({
  level,
  onStart,
  onResume,
}: {
  level: ExamLevel;
  onStart: (level: ExamLevel, lessons?: string[]) => void;
  onResume: (level: ExamLevel, saved: SavedExamRun) => void;
}) {
  const { state } = useProgress();
  const best = state.examBest[level.id];
  const saved = state.examSaved[level.id];
  const [picked, setPicked] = useState<string[]>([]);
  const lessonCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const question of level.questions) {
      counts.set(question.lesson, (counts.get(question.lesson) ?? 0) + 1);
    }
    return counts;
  }, [level.questions]);

  function toggle(slug: string) {
    setPicked((current) =>
      current.includes(slug) ? current.filter((value) => value !== slug) : [...current, slug],
    );
  }

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl bg-card/80 p-5 ring-1 ring-white/10",
        level.fullCoverage && "lg:col-span-2",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Level {level.number} · {level.difficulty}
          </p>
          <h2 className="mt-1 text-2xl font-semibold">{level.name}</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white/6 px-3 py-1 ring-1 ring-white/10">
            {level.questions.length} questions
          </span>
          <span className="rounded-full bg-white/6 px-3 py-1 ring-1 ring-white/10">
            {level.timeLimit ? `${level.timeLimit} min timer` : "Untimed"}
          </span>
          {best !== undefined ? (
            <span className="rounded-full bg-think/15 px-3 py-1 text-think ring-1 ring-think/30">
              Best {best}%
            </span>
          ) : null}
        </div>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{level.blurb}</p>

      {level.fullCoverage ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Drill specific lessons
          </p>
          <div className="flex flex-wrap gap-2">
            {lessons.map((lesson) => (
              <button
                key={lesson.slug}
                type="button"
                onClick={() => toggle(lesson.slug)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs ring-1 transition-colors",
                  picked.includes(lesson.slug)
                    ? "bg-primary/20 text-primary ring-primary/40"
                    : "bg-white/4 ring-white/10 hover:bg-white/8",
                )}
              >
                {lesson.emoji} {lesson.title} · {lessonCounts.get(lesson.slug) ?? 0}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-auto flex flex-wrap gap-2">
        {saved ? (
          <button
            type="button"
            onClick={() => onResume(level, saved)}
            className="h-9 rounded-lg bg-accent px-3 text-sm font-medium text-accent-foreground hover:bg-accent/80"
          >
            Resume · question {Math.min(saved.index + 1, saved.questionIds.length)} of {saved.questionIds.length}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onStart(level)}
          className="h-9 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          {level.fullCoverage ? "Run the whole bank in order" : saved ? "Start over" : "Start"}
        </button>
        {level.fullCoverage ? (
          <button
            type="button"
            disabled={picked.length === 0}
            onClick={() => onStart(level, picked)}
            className="h-9 rounded-lg px-3 text-sm font-medium ring-1 ring-white/15 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {`Drill ${picked.length || "selected"} lesson${picked.length === 1 ? "" : "s"}`}
          </button>
        ) : null}
      </div>
    </article>
  );
}

function ExamRunner({
  run,
  onChange,
  onFinish,
  onExit,
}: {
  run: Run;
  onChange: (run: Run) => void;
  onFinish: (run: Run) => void;
  onExit: () => void;
}) {
  const { saveExamRun, recordAnswers } = useProgress();
  const remaining = useCountdown(run.deadline);
  const question = run.questions[run.index];
  const last = run.index + 1 >= run.questions.length;
  const answered = Object.keys(run.results).length;
  const expired = remaining === 0;

  if (!question) return null;

  function record(correct: boolean, picked: number[]) {
    const next: Run = {
      ...run,
      results: { ...run.results, [question.id]: correct },
      picked: { ...run.picked, [question.id]: picked },
    };
    if (run.level.fullCoverage) {
      saveExamRun(run.level.id, {
        questionIds: run.questions.map((item) => item.id),
        index: run.index + 1,
        results: next.results,
        lessons: run.lessons,
      });
    }
    recordAnswers([
      {
        questionId: question.id,
        correct,
        source: run.level.id,
        lesson: question.lesson,
        domain: question.domain,
      },
    ]);
    onChange(next);
  }

  const lesson = getLesson(question.lesson);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Level {run.level.number} · {run.level.name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Question {run.index + 1} of {run.questions.length} · {answered} answered
          </p>
        </div>
        <div className="flex items-center gap-2">
          {run.deadline ? <ExamClock remaining={remaining} limitMinutes={run.level.timeLimit ?? 0} /> : null}
          <button
            type="button"
            onClick={onExit}
            className="h-9 rounded-lg px-3 text-sm ring-1 ring-white/15 hover:bg-white/8"
          >
            {run.level.fullCoverage ? "Save and exit" : "Quit"}
          </button>
          {answered > 0 ? (
            <button
              type="button"
              onClick={() => onFinish(run)}
              className="h-9 rounded-lg px-3 text-sm ring-1 ring-white/15 hover:bg-white/8"
            >
              Finish now
            </button>
          ) : null}
        </div>
      </header>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(answered / run.questions.length) * 100}%` }}
        />
      </div>

      {expired ? (
        <section className="rounded-2xl bg-card p-6 ring-1 ring-trap/40">
          <h2 className="text-2xl font-semibold">Time is up.</h2>
          <p className="mt-2 text-muted-foreground">
            You answered {answered} of {run.questions.length}. Unanswered questions count as wrong, just like the
            real exam.
          </p>
          <button
            type="button"
            onClick={() => onFinish(run)}
            className="mt-4 h-9 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            See my results
          </button>
        </section>
      ) : (
        <section className="relative z-10 rounded-2xl bg-card p-6 ring-1 ring-white/10">
          <p className="mb-3 text-xs text-muted-foreground">
            {lesson ? `${lesson.emoji} ${lesson.title}` : null}
          </p>
          <QuestionCard
            key={question.id}
            question={question}
            feedback
            onSubmit={record}
            after={
              <button
                type="button"
                onClick={() => (last ? onFinish(run) : onChange({ ...run, index: run.index + 1 }))}
                className="h-9 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
              >
                {last ? "See results" : "Next question"}
              </button>
            }
          />
        </section>
      )}
    </div>
  );
}

function ExamResults({
  run,
  onRetry,
  onBack,
}: {
  run: Run;
  onRetry: () => void;
  onBack: () => void;
}) {
  const counted = scored(run);
  const total = counted.length;
  const correct = counted.filter((question) => run.results[question.id]).length;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  const byDomain = tallyBy(run, (question) => question.domain);
  const byLesson = Object.entries(tallyBy(run, (question) => question.lesson))
    .map(([slug, tally]) => ({ slug, tally, lesson: getLesson(slug) }))
    .sort((a, b) => ratio(a.tally) - ratio(b.tally));
  const weak = byLesson.filter((item) => ratio(item.tally) < PASS_PERCENT / 100);
  const misses = counted.filter((question) => !run.results[question.id]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Level {run.level.number} · {run.level.name} · results
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          {percent >= 85
            ? "Exam-ready on this level."
            : percent >= PASS_PERCENT
              ? "That is a passing-style score."
              : "Not yet — the breakdown shows where to go."}
        </h1>
        <p className="text-lg text-muted-foreground">
          {correct} / {total} correct · {percent}% · aim for {PASS_PERCENT}%+ (roughly the real exam&apos;s 700 /
          1000)
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="h-9 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            Try this level again
          </button>
          <button
            type="button"
            onClick={onBack}
            className="h-9 rounded-lg px-3 text-sm ring-1 ring-white/15 hover:bg-white/8"
          >
            Back to Exam Prep
          </button>
          {misses.some((question) => question.id in run.results) ? (
            <Link
              href="/mistakes"
              className="inline-flex h-9 items-center rounded-lg px-3 text-sm ring-1 ring-trap/40 text-trap hover:bg-trap/10"
            >
              Misses saved to your mistake notebook →
            </Link>
          ) : null}
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">By domain</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {DOMAINS.map((domain) => {
            const tally = byDomain[domain.id];
            if (!tally) return null;
            const value = Math.round(ratio(tally) * 100);
            return (
              <div key={domain.id} className="rounded-2xl bg-card/80 p-4 ring-1 ring-white/10">
                <p className="text-xs text-muted-foreground">
                  Domain {domain.number} · {domain.weight}
                </p>
                <p className="mt-1 font-semibold">{domain.title}</p>
                <p className="mt-2 text-2xl font-semibold">{value}%</p>
                <p className="text-xs text-muted-foreground">
                  {tally.correct} / {tally.total}
                </p>
                <Bar value={value} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">By lesson</h2>
        {weak.length > 0 ? (
          <p className="text-sm text-trap">
            Restudy first: {weak.map((item) => item.lesson?.title ?? item.slug).join(", ")}.
          </p>
        ) : (
          <p className="text-sm text-think">No lesson below {PASS_PERCENT}% on this run.</p>
        )}
        <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
          <table className="w-full text-left text-sm">
            <tbody>
              {byLesson.map(({ slug, tally, lesson }) => {
                const value = Math.round(ratio(tally) * 100);
                const isWeak = value < PASS_PERCENT;
                return (
                  <tr key={slug} className="border-t border-white/8 first:border-t-0">
                    <td className="px-4 py-2.5">
                      {lesson?.emoji} {lesson?.title ?? slug}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {tally.correct} / {tally.total}
                    </td>
                    <td className={cn("px-4 py-2.5 font-semibold", isWeak ? "text-trap" : "text-think")}>
                      {value}%
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {isWeak ? (
                        <Link href={`/learn/${slug}`} className="text-primary hover:underline">
                          Restudy →
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {misses.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
            Review your misses ({misses.length})
          </h2>
          <ol className="space-y-3">
            {misses.map((question) => {
              const picked = run.picked[question.id];
              return (
                <li key={question.id} className="rounded-2xl bg-card/80 p-4 text-sm leading-6 ring-1 ring-white/10">
                  <p className="font-semibold">{question.prompt}</p>
                  <p className="mt-2 text-trap">
                    Your answer:{" "}
                    {picked
                      ? describeAnswer(question, picked)
                      : question.id in run.results
                        ? "Answered in an earlier session"
                        : "Not answered"}
                  </p>
                  <p className="text-think">Correct: {describeAnswer(question, correctIndexes(question))}</p>
                  <p className="mt-2 text-muted-foreground">{question.explanation}</p>
                  {question.trap ? <p className="text-trap/90">Trap: {question.trap}</p> : null}
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}
    </div>
  );
}

function Bar({ value }: { value: number }) {
  return (
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
      <div
        className={cn("h-full rounded-full", value >= PASS_PERCENT ? "bg-think" : "bg-trap")}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

/** Full-coverage runs can stop early, so only answered questions count there. */
function scored(run: Run) {
  return run.level.fullCoverage
    ? run.questions.filter((question) => question.id in run.results)
    : run.questions;
}

function tallyBy(run: Run, key: (question: ExamQuestion) => string): Record<string, Tally> {
  const tallies: Record<string, Tally> = {};
  for (const question of scored(run)) {
    const id = key(question);
    const tally = (tallies[id] ??= { correct: 0, total: 0 });
    tally.total += 1;
    if (run.results[question.id]) tally.correct += 1;
  }
  return tallies;
}

function ratio(tally: Tally) {
  return tally.total ? tally.correct / tally.total : 0;
}