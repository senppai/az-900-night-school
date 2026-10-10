"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useProgress } from "@/components/progress-provider";
import { DOMAINS, SITE } from "@/content/catalog";
import { lessons, lessonsForDomain } from "@/content/lessons";
import { cn } from "@/lib/utils";

export function HomeView() {
  const { state, rank, reset, ready } = useProgress();
  const [query, setQuery] = useState("");

  const completedCount = Object.values(state.lessons).filter((item) => item.completed).length;
  const nextLesson =
    lessons.find((lesson) => !state.lessons[lesson.slug]?.completed) ?? lessons[0];

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return lessons;
    return lessons.filter((lesson) =>
      `${lesson.title} ${lesson.summary} ${lesson.youWillLearn.join(" ")}`
        .toLowerCase()
        .includes(needle),
    );
  }, [query]);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-linear-to-br from-[#123056] via-[#0d1b33] to-[#1a1230] p-6 ring-1 ring-primary/25 sm:p-10">
        <p className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
          Microsoft Azure Fundamentals
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Learn AZ-900 the way a good tutor explains it.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/80">
          Big picture first. Then easy examples, diagrams, exam traps, and a one-sentence
          memory trick. Stay until it actually clicks — not until you have a pile of
          acronyms.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/learn/${nextLesson.slug}`}
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            {completedCount === 0 ? "Start lesson 01" : "Continue studying"}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/practice"
            className="inline-flex h-9 cursor-pointer items-center rounded-lg px-3 text-sm font-medium ring-1 ring-white/15 hover:bg-white/8"
          >
            Practice exam
          </Link>
          <Link
            href="/flashcards"
            className="inline-flex h-9 cursor-pointer items-center rounded-lg px-3 text-sm font-medium hover:bg-white/8"
          >
            Flashcards
          </Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Stat label="Lessons finished" value={ready ? `${completedCount}/${lessons.length}` : "—"} />
          <Stat label="Your rank" value={ready ? `${rank.emoji} ${rank.title}` : "—"} />
          <Stat
            label="Practice best"
            value={
              ready
                ? state.practiceBest === null
                  ? "Not taken"
                  : `${state.practiceBest}%`
                : "—"
            }
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {DOMAINS.map((domain) => {
          const domainLessons = lessonsForDomain(domain.id);
          const done = domainLessons.filter((lesson) => state.lessons[lesson.slug]?.completed).length;
          const percent = Math.round((done / domainLessons.length) * 100);
          return (
            <article key={domain.id} className="rounded-2xl bg-card/80 p-5 ring-1 ring-white/10">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
                Domain {domain.number} · {domain.weight}
              </p>
              <h2 className="mt-2 text-xl font-semibold">{domain.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{domain.blurb}</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {done}/{domainLessons.length} lessons
              </p>
            </article>
          );
        })}
      </section>

      <section className="rounded-2xl bg-card/70 p-4 ring-1 ring-white/10 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">The path</h2>
            <p className="text-sm text-muted-foreground">
              Sixteen lessons covering the official AZ-900 skills measured as of July 20, 2026.
            </p>
          </div>
          <label className="relative block w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search lessons…"
              className="h-9 w-full rounded-lg bg-white/5 pr-3 pl-9 text-sm outline-none ring-1 ring-white/10 placeholder:text-muted-foreground focus:ring-primary/50"
            />
          </label>
        </div>
        <ol className="mt-4 grid gap-3">
          {filtered.map((lesson) => {
            const done = state.lessons[lesson.slug]?.completed;
            const quiz = state.lessons[lesson.slug];
            return (
              <li key={lesson.slug}>
                <Link
                  href={`/learn/${lesson.slug}`}
                  className={cn(
                    "flex flex-col gap-3 rounded-2xl p-4 ring-1 transition-colors sm:flex-row sm:items-center",
                    done
                      ? "bg-think/8 ring-think/25 hover:bg-think/12"
                      : "bg-white/3 ring-white/10 hover:bg-white/6",
                  )}
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-black/20 text-2xl">
                    {lesson.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-primary">
                        {String(lesson.order).padStart(2, "0")}
                      </span>
                      <span className="font-semibold">{lesson.title}</span>
                      {done ? (
                        <span className="rounded-full bg-think/20 px-2 py-0.5 text-[11px] text-think">
                          Understood
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      {lesson.summary}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {lesson.minutes} min
                    {quiz?.quizTotal
                      ? ` · quiz ${quiz.quizBest}/${quiz.quizTotal}`
                      : ""}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
        {filtered.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Nothing matches that search. Try “Arc”, “Bicep”, or “availability zone”.
          </p>
        ) : null}
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/3 px-5 py-4 text-sm ring-1 ring-white/8">
        <p className="text-muted-foreground">
          Official outline:{" "}
          <a
            className="text-primary underline-offset-4 hover:underline"
            href={SITE.officialGuide}
            target="_blank"
            rel="noreferrer"
          >
            AZ-900 study guide on Microsoft Learn
          </a>
        </p>
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
        >
          Reset local progress
        </button>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/20 px-4 py-3 ring-1 ring-white/8">
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
