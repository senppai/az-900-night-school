"use client";

import Link from "next/link";
import { useEffect } from "react";
import { LessonBlocks } from "@/components/lesson-blocks";
import { Quiz } from "@/components/quiz";
import { useProgress } from "@/components/progress-provider";
import { DOMAINS } from "@/content/catalog";
import { getAdjacent } from "@/content/lessons";
import type { Lesson } from "@/content/types";

export function LessonView({ lesson }: { lesson: Lesson }) {
  const { markLessonComplete, saveQuizScore, state } = useProgress();
  const { prev, next } = getAdjacent(lesson.slug);
  const domain = DOMAINS.find((item) => item.id === lesson.domain);
  const completed = state.lessons[lesson.slug]?.completed;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [lesson.slug]);

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-4">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Lesson {String(lesson.order).padStart(2, "0")} · {domain?.title}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          <span className="mr-2">{lesson.emoji}</span>
          {lesson.title}
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">{lesson.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white/6 px-3 py-1 ring-1 ring-white/10">
            {lesson.minutes} min read
          </span>
          {completed ? (
            <span className="rounded-full bg-think/15 px-3 py-1 text-think ring-1 ring-think/30">
              Marked as understood
            </span>
          ) : null}
        </div>
      </header>

      <section className="rounded-2xl bg-card/80 p-5 ring-1 ring-white/10">
        <h2 className="text-sm font-semibold tracking-wide text-primary uppercase">
          You will understand
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-6">
          {lesson.youWillLearn.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-accent">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <aside className="rounded-2xl border-l-4 border-exam bg-exam/10 px-5 py-4">
        <p className="text-xs font-semibold tracking-[0.16em] text-exam uppercase">
          Why this shows up on AZ-900
        </p>
        <p className="mt-1 text-base leading-7">{lesson.examFocus}</p>
      </aside>

      <section className="rounded-2xl bg-white/4 p-5 ring-1 ring-white/10">
        <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Official Microsoft Learn module
        </p>
        <a
          href={lesson.officialModule.url}
          target="_blank"
          rel="noreferrer"
          className="mt-1 block font-semibold text-primary hover:underline"
        >
          {lesson.officialModule.title} ↗
        </a>
        <p className="mt-3 text-xs text-muted-foreground">Units covered in this lesson:</p>
        <ul className="mt-1 flex flex-wrap gap-2 text-xs">
          {lesson.officialModule.units.map((unit) => (
            <li key={unit} className="rounded-full bg-white/6 px-3 py-1 ring-1 ring-white/10">
              {unit}
            </li>
          ))}
        </ul>
      </section>

      <LessonBlocks blocks={lesson.blocks} />

      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white/4 p-4 ring-1 ring-white/10">
        <button
          type="button"
          onClick={() => markLessonComplete(lesson.slug)}
          disabled={completed}
          className="h-9 cursor-pointer rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80 disabled:cursor-default disabled:opacity-60"
        >
          {completed ? "Already marked as understood" : "I get this — mark complete"}
        </button>
        <p className="text-sm text-muted-foreground">
          Progress stays in this browser. No account required.
        </p>
      </div>

      <Quiz
        questions={lesson.quiz}
        title="Mini quiz"
        onFinished={(correct, total) => saveQuizScore(lesson.slug, correct, total)}
      />

      <nav className="flex flex-col gap-3 sm:flex-row">
        {prev ? (
          <Link
            href={`/learn/${prev.slug}`}
            className="flex-1 rounded-lg px-3 py-2 text-sm ring-1 ring-white/15 hover:bg-white/8"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/learn/${next.slug}`}
            className="flex-1 rounded-lg bg-primary px-3 py-2 text-right text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            {next.title} →
          </Link>
        ) : (
          <Link
            href="/practice"
            className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            Take the practice exam →
          </Link>
        )}
      </nav>
    </article>
  );
}
