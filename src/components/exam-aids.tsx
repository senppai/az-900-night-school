"use client";

import Link from "next/link";
import { useState } from "react";
import { useProgress } from "@/components/progress-provider";
import {
  CONFUSING_SETS,
  EXAM_DAY_FACTS,
  EXAM_DAY_TIPS,
  SEVEN_DAY_PLAN,
  SLA_PRESETS,
} from "@/content/exam-aids";
import { getLesson } from "@/content/lessons";
import { weakLessons } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function ExamAids() {
  return (
    <div className="space-y-12">
      <ConfusingPairs />
      <SlaCalculator />
      <ExamDayGuide />
      <ReviewPlan />
    </div>
  );
}

function SectionTitle({ eyebrow, title, blurb }: { eyebrow: string; title: string; blurb: string }) {
  return (
    <header className="max-w-3xl space-y-2">
      <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="text-sm leading-6 text-muted-foreground">{blurb}</p>
    </header>
  );
}

function ConfusingPairs() {
  return (
    <section className="space-y-4">
      <SectionTitle
        eyebrow="Confusing pairs"
        title="The look-alikes Microsoft uses as distractors."
        blurb="Each card names the services, the one job each does, and the phrase in the question that gives the answer away."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {CONFUSING_SETS.map((set) => (
          <article key={set.title} className="rounded-2xl bg-card/80 p-4 ring-1 ring-white/10">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{set.title}</h3>
              <Link href={`/learn/${set.lesson}`} className="shrink-0 text-xs text-primary hover:underline">
                Lesson →
              </Link>
            </div>
            <dl className="mt-3 space-y-2 text-sm">
              {set.items.map((item) => (
                <div key={item.name} className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                  <dt className="font-medium text-primary">{item.name}</dt>
                  <dd className="leading-6 text-foreground/90">{item.job}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 rounded-xl bg-exam/10 px-3 py-2 text-sm leading-6 text-exam">{set.tell}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

type SlaRow = { id: number; name: string; sla: string };

const MINUTES_PER_MONTH = 30.44 * 24 * 60;

function SlaCalculator() {
  const [rows, setRows] = useState<SlaRow[]>([
    { id: 1, name: "App Service (Basic tier or higher)", sla: "99.95" },
    { id: 2, name: "Azure SQL Database", sla: "99.99" },
  ]);
  const [nextId, setNextId] = useState(3);
  const [twoRegions, setTwoRegions] = useState(false);

  const values = rows.map((row) => Number(row.sla));
  const valid = rows.length > 0 && values.every((value) => value > 0 && value <= 100);
  const single = valid ? values.reduce((product, value) => product * (value / 100), 1) : 0;
  const composite = twoRegions ? 1 - (1 - single) ** 2 : single;
  const downtimeMinutes = (1 - composite) * MINUTES_PER_MONTH;

  function add(name: string, sla: number | string) {
    setRows((current) => [...current, { id: nextId, name, sla: String(sla) }]);
    setNextId((value) => value + 1);
  }

  function update(id: number, patch: Partial<SlaRow>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  return (
    <section className="space-y-4">
      <SectionTitle
        eyebrow="SLA calculator"
        title="Composite SLA: multiply, then feel the drop."
        blurb="When an app needs every service to be up, its SLA is the product of their SLAs — always lower than the weakest one. Deploying the whole stack in two regions raises it again: 1 − (1 − SLA)². Preset values are typical published SLAs; always check the current Azure SLA page for exact terms."
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-3 rounded-2xl bg-card/80 p-4 ring-1 ring-white/10">
          {rows.map((row) => (
            <div key={row.id} className="flex flex-wrap items-center gap-2">
              <input
                value={row.name}
                onChange={(event) => update(row.id, { name: event.target.value })}
                aria-label="Service name"
                className="h-9 min-w-0 flex-1 rounded-lg bg-white/6 px-3 text-sm ring-1 ring-white/10 outline-none focus:ring-primary/60"
              />
              <div className="flex items-center gap-1">
                <input
                  value={row.sla}
                  onChange={(event) => update(row.id, { sla: event.target.value })}
                  inputMode="decimal"
                  aria-label={`SLA for ${row.name}`}
                  className="h-9 w-24 rounded-lg bg-white/6 px-3 text-right font-mono text-sm ring-1 ring-white/10 outline-none focus:ring-primary/60"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <button
                type="button"
                onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
                aria-label={`Remove ${row.name}`}
                className="grid size-9 place-items-center rounded-lg text-muted-foreground ring-1 ring-white/10 hover:bg-white/8"
              >
                ×
              </button>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 pt-1">
            {SLA_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => add(preset.name, preset.sla)}
                className="rounded-full bg-white/4 px-3 py-1 text-xs ring-1 ring-white/10 hover:bg-white/8"
              >
                + {preset.name} · {preset.sla}%
              </button>
            ))}
            <button
              type="button"
              onClick={() => add("Custom service", "99.9")}
              className="rounded-full bg-white/4 px-3 py-1 text-xs ring-1 ring-white/10 hover:bg-white/8"
            >
              + Custom
            </button>
          </div>
          <label className="flex items-center gap-2 pt-2 text-sm">
            <input
              type="checkbox"
              checked={twoRegions}
              onChange={(event) => setTwoRegions(event.target.checked)}
              className="size-4 accent-primary"
            />
            Run the whole stack active-active in two regions
          </label>
        </div>
        <div className="rounded-2xl bg-primary/10 p-5 ring-1 ring-primary/30">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Composite SLA</p>
          <p className="mt-2 font-mono text-4xl font-semibold">
            {valid ? `${(composite * 100).toFixed(6).replace(/0+$/, "").replace(/\.$/, "")}%` : "—"}
          </p>
          {valid ? (
            <>
              <p className="mt-3 text-sm text-muted-foreground">
                Allowed downtime ≈ {formatDuration(downtimeMinutes)} per month,{" "}
                {formatDuration(downtimeMinutes * 12)} per year.
              </p>
              <p className="mt-3 font-mono text-xs leading-5 text-muted-foreground">
                {values.map((value) => Number((value / 100).toFixed(8)).toString()).join(" × ")}
                {twoRegions ? " → 1 − (1 − x)²" : ""}
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm text-trap">Enter SLAs between 0 and 100.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes.toFixed(1)} min`;
  const hours = minutes / 60;
  if (hours < 48) return `${hours.toFixed(1)} h`;
  return `${(hours / 24).toFixed(1)} days`;
}

function ExamDayGuide() {
  return (
    <section className="space-y-4">
      <SectionTitle
        eyebrow="Exam-day guide"
        title="Know the format so nothing surprises you."
        blurb="Details come from the official certification page and exam policies. Microsoft updates these occasionally — check the exam page before you book."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <dl className="divide-y divide-white/8 overflow-hidden rounded-2xl bg-card/80 ring-1 ring-white/10">
          {EXAM_DAY_FACTS.map((fact) => (
            <div key={fact.label} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[9rem_1fr]">
              <dt className="font-semibold text-primary">{fact.label}</dt>
              <dd className="leading-6">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className="rounded-2xl bg-card/80 p-4 ring-1 ring-white/10">
          <h3 className="font-semibold">Tactics that earn points</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            {EXAM_DAY_TIPS.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="text-accent">✦</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ReviewPlan() {
  const { state, ready } = useProgress();
  const weak = weakLessons(state)
    .map((slug) => getLesson(slug))
    .filter((lesson): lesson is NonNullable<typeof lesson> => lesson !== undefined)
    .sort((a, b) => a.order - b.order);
  const hasData = Object.keys(state.lessonStats).length > 0 || Object.keys(state.lessons).length > 0;

  return (
    <section className="space-y-4">
      <SectionTitle
        eyebrow="Final review"
        title="Seven days to exam day."
        blurb="A one-week plan that walks every domain, then spends the last two days on traps and a timed mock. Your weak-area list updates from your quiz and Exam Prep results."
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <ol className="space-y-2">
          {SEVEN_DAY_PLAN.map((day) => (
            <li key={day.day} className="flex gap-4 rounded-2xl bg-card/80 p-4 ring-1 ring-white/10">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 font-semibold text-primary">
                {day.day}
              </span>
              <div className="min-w-0 text-sm leading-6">
                <p className="font-semibold">{day.focus}</p>
                <p className="text-muted-foreground">{day.task}</p>
                {day.lessons.length > 0 ? (
                  <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    {day.lessons.map((slug) => {
                      const lesson = getLesson(slug);
                      return (
                        <Link key={slug} href={`/learn/${slug}`} className="text-xs text-primary hover:underline">
                          {lesson?.emoji} {lesson?.title}
                        </Link>
                      );
                    })}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        <aside
          className={cn(
            "h-fit rounded-2xl p-4 ring-1",
            weak.length > 0 ? "bg-trap/10 ring-trap/30" : "bg-card/80 ring-white/10",
          )}
        >
          <h3 className="font-semibold">Your weak areas</h3>
          {!ready || !hasData ? (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Take a lesson quiz or any Exam Prep level and lessons under 70% will appear here.
            </p>
          ) : weak.length === 0 ? (
            <p className="mt-2 text-sm leading-6 text-think">Nothing under 70% so far. Keep testing yourself.</p>
          ) : (
            <ul className="mt-2 space-y-1.5 text-sm">
              {weak.map((lesson) => {
                const tally = state.lessonStats[lesson.slug];
                return (
                  <li key={lesson.slug} className="flex items-center justify-between gap-2">
                    <Link href={`/learn/${lesson.slug}`} className="text-primary hover:underline">
                      {lesson.emoji} {lesson.title}
                    </Link>
                    {tally ? (
                      <span className="text-xs text-muted-foreground">
                        {Math.round((tally.correct / tally.total) * 100)}%
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      </div>
    </section>
  );
}
