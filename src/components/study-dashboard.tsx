"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { CalendarDays, Gauge, RotateCcw, Target } from "lucide-react";
import { useProgress } from "@/components/progress-provider";
import { DOMAINS } from "@/content/catalog";
import { getLesson } from "@/content/lessons";
import { daysBetween, localDateKey, shiftDateKey } from "@/lib/progress";
import {
  ALMOST_SCORE,
  DOMAIN_WEIGHTS,
  estimateReadiness,
  MIN_ANSWERS,
  MIN_PER_DOMAIN,
  PASS_SCORE,
  READY_SCORE,
  type ReadinessStatus,
} from "@/lib/readiness";
import { cn } from "@/lib/utils";

const GOAL_PRESETS = [10, 20, 30, 50];

function subscribeToClock(callback: () => void) {
  const id = window.setInterval(callback, 60_000);
  return () => window.clearInterval(id);
}

/** Today's local YYYY-MM-DD, or null while prerendering and hydrating. */
function useToday() {
  return useSyncExternalStore(
    subscribeToClock,
    () => localDateKey(new Date()),
    () => null,
  );
}

const STATUS: Record<ReadinessStatus, { label: string; className: string }> = {
  insufficient: { label: "Not enough data", className: "bg-white/8 text-muted-foreground ring-white/15" },
  study: { label: "Keep studying", className: "bg-trap/15 text-trap ring-trap/40" },
  almost: { label: "Almost there", className: "bg-exam/15 text-exam ring-exam/40" },
  ready: { label: "Ready to book", className: "bg-think/15 text-think ring-think/40" },
};

export function StudyDashboard() {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      <ReadinessPanel />
      <div className="grid gap-4">
        <ExamCountdown />
        <DailyGoal />
      </div>
    </section>
  );
}

function ReadinessPanel() {
  const { state, ready } = useProgress();
  const readiness = estimateReadiness(state);
  const status = ready ? STATUS[readiness.status] : null;
  const weakestDomain = DOMAINS.find((domain) => domain.id === readiness.weakest);
  const weakestLesson = readiness.weakestLesson ? getLesson(readiness.weakestLesson) : undefined;
  const scorePercent = readiness.score !== null ? readiness.score / 10 : 0;

  return (
    <article className="rounded-2xl bg-card/80 p-5 ring-1 ring-white/10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
            <Gauge className="size-3.5" /> Readiness estimate
          </p>
          <h2 className="mt-1 text-xl font-semibold">Would you pass today?</h2>
        </div>
        {status ? (
          <span className={cn("rounded-full px-3 py-1 text-xs font-semibold ring-1", status.className)}>
            {status.label}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-end gap-2">
        <p className="text-4xl font-semibold">{ready && readiness.score !== null ? readiness.score : "—"}</p>
        <p className="pb-1 text-sm text-muted-foreground">/ 1000 · pass {PASS_SCORE}</p>
      </div>
      <div className="relative mt-3 h-2 rounded-full bg-white/10">
        <div
          className={cn(
            "h-full rounded-full",
            (readiness.score ?? 0) >= PASS_SCORE ? "bg-think" : "bg-trap",
          )}
          style={{ width: `${ready ? scorePercent : 0}%` }}
        />
        <span
          className="absolute -top-1 h-4 w-0.5 rounded bg-foreground/70"
          style={{ left: `${PASS_SCORE / 10}%` }}
          aria-hidden
        />
      </div>

      {ready && readiness.status === "insufficient" ? (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Answer at least {MIN_ANSWERS} questions, with {MIN_PER_DOMAIN}+ in every domain, to unlock a score. So far:{" "}
          {Math.min(readiness.answered, MIN_ANSWERS)}/{MIN_ANSWERS}.
        </p>
      ) : null}

      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {readiness.domains.map((item) => {
          const domain = DOMAINS.find((entry) => entry.id === item.domain);
          const percent = item.accuracy !== null ? Math.round(item.accuracy * 100) : null;
          return (
            <li key={item.domain} className="rounded-xl bg-white/4 p-3 ring-1 ring-white/8">
              <p className="text-[11px] text-muted-foreground">
                Domain {domain?.number} · weight {DOMAIN_WEIGHTS[item.domain]}%
              </p>
              <p className="mt-0.5 text-sm font-semibold">{domain?.title}</p>
              <p className="mt-1 text-xl font-semibold">{ready && percent !== null ? `${percent}%` : "—"}</p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className={cn("h-full rounded-full", (percent ?? 0) >= 70 ? "bg-think" : "bg-trap")}
                  style={{ width: `${ready ? (percent ?? 0) : 0}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">{ready ? item.answered : 0} answered</p>
            </li>
          );
        })}
      </ul>

      {ready && weakestDomain ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-exam/10 px-4 py-3 text-sm">
          <p>
            Weakest area: <span className="font-semibold text-exam">{weakestDomain.title}</span>
            {weakestLesson ? ` — start with ${weakestLesson.title}.` : "."}
          </p>
          <div className="flex gap-2">
            {weakestLesson ? (
              <Link href={`/learn/${weakestLesson.slug}`} className="text-xs font-medium text-primary hover:underline">
                Restudy →
              </Link>
            ) : null}
            <Link href="/exam-prep" className="text-xs font-medium text-primary hover:underline">
              Drill in Exam Prep →
            </Link>
          </div>
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        An estimate, not a prediction. It uses your latest answers in each domain (Exam Prep and the practice exam
        count more than lesson quizzes), weighted by the official domain split. Microsoft scales real scores, so
        treat {ALMOST_SCORE}–{READY_SCORE - 1} as borderline; &quot;Ready to book&quot; needs {READY_SCORE}+ with
        every domain at 70% or better.
      </p>
    </article>
  );
}

function ExamCountdown() {
  const { state, ready, setExamDate } = useProgress();
  const today = useToday();
  const days = ready && today && state.examDate ? daysBetween(today, state.examDate) : null;

  return (
    <article className="rounded-2xl bg-card/80 p-5 ring-1 ring-white/10">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
        <CalendarDays className="size-3.5" /> Exam date
      </p>
      <p className="mt-2 text-2xl font-semibold">
        {days === null
          ? ready && !state.examDate
            ? "Not booked yet"
            : "—"
          : days > 1
            ? `${days} days to go`
            : days === 1
              ? "Tomorrow!"
              : days === 0
                ? "Exam day — you've got this."
                : "Date has passed"}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="date"
          aria-label="Exam date"
          value={ready ? (state.examDate ?? "") : ""}
          min={today ?? undefined}
          onChange={(event) => setExamDate(event.target.value || null)}
          className="h-9 rounded-lg bg-white/6 px-3 text-sm ring-1 ring-white/10 outline-none scheme-dark focus:ring-primary/60"
        />
        {ready && state.examDate ? (
          <button
            type="button"
            onClick={() => setExamDate(null)}
            className="h-9 rounded-lg px-3 text-xs text-muted-foreground ring-1 ring-white/10 hover:bg-white/8"
          >
            Clear
          </button>
        ) : null}
      </div>
      {days !== null && days >= 0 && days <= 7 ? (
        <p className="mt-2 text-xs text-exam">Final week: follow the seven-day plan in Exam Prep.</p>
      ) : null}
    </article>
  );
}

function DailyGoal() {
  const { state, ready, setDailyGoal } = useProgress();
  const today = useToday();
  const goal = state.dailyGoal;
  const done = ready && today ? (state.daily[today] ?? 0) : 0;
  const percent = Math.min(100, Math.round((done / goal) * 100));
  const week = today ? Array.from({ length: 7 }, (_, i) => shiftDateKey(today, i - 6)) : [];
  const mistakes = ready ? Object.keys(state.mistakes).length : 0;

  return (
    <article className="rounded-2xl bg-card/80 p-5 ring-1 ring-white/10">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
        <Target className="size-3.5" /> Today&apos;s goal
      </p>
      <p className="mt-2 text-2xl font-semibold">
        {ready && today ? `${done} / ${goal}` : "—"}
        <span className="ml-2 text-sm font-normal text-muted-foreground">questions</span>
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn("h-full rounded-full", percent >= 100 ? "bg-think" : "bg-primary")}
          style={{ width: `${percent}%` }}
        />
      </div>
      {ready && today ? (
        <div className="mt-3 flex h-10 items-end gap-1" aria-label="Questions answered in the last 7 days">
          {week.map((key) => {
            const count = state.daily[key] ?? 0;
            return (
              <span
                key={key}
                title={`${key}: ${count}`}
                className={cn("flex-1 rounded-sm", count >= goal ? "bg-think/70" : "bg-primary/40")}
                style={{ height: `${Math.max(8, Math.min(100, (count / goal) * 100))}%`, opacity: count ? 1 : 0.3 }}
              />
            );
          })}
        </div>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-muted-foreground">Daily target:</span>
        {GOAL_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            aria-pressed={goal === preset}
            onClick={() => setDailyGoal(preset)}
            className={cn(
              "h-7 rounded-full px-2.5 ring-1",
              ready && goal === preset
                ? "bg-primary/20 text-primary ring-primary/40"
                : "ring-white/10 hover:bg-white/8",
            )}
          >
            {preset}
          </button>
        ))}
      </div>
      {mistakes > 0 ? (
        <Link
          href="/mistakes"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-trap hover:underline"
        >
          <RotateCcw className="size-3.5" />
          Retry {mistakes} open mistake{mistakes === 1 ? "" : "s"} →
        </Link>
      ) : null}
    </article>
  );
}
