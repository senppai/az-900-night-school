"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import { useProgress } from "@/components/progress-provider";
import { lessons } from "@/content/lessons";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Path" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/practice", label: "Practice exam" },
  { href: "/exam-prep", label: "Exam prep" },
  { href: "/mistakes", label: "Mistakes" },
  { href: "/cheatsheets", label: "Cheat sheets" },
];

function NavBadge({ href }: { href: string }) {
  const { state, ready } = useProgress();
  const count = Object.keys(state.mistakes).length;
  if (href !== "/mistakes" || !ready || count === 0) return null;
  return (
    <span className="ml-1.5 rounded-full bg-trap/20 px-1.5 py-0.5 text-[10px] font-semibold text-trap">
      {count}
    </span>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, rank, ready } = useProgress();
  const done = Object.values(state.lessons).filter((item) => item.completed).length;

  return (
    <div className="night-grid min-h-full">
      <header className="no-print sticky top-0 z-40 border-b border-white/8 bg-[#0b1220]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <MobileNav pathname={pathname} />
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-lg ring-1 ring-primary/30">
              🌙
            </span>
            <span className="leading-tight">
              <span className="block text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
                AZ-900
              </span>
              <span className="block text-sm font-semibold tracking-tight">
                Night School
              </span>
            </span>
          </Link>
          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  {item.label}
                  <NavBadge href={item.href} />
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/8 sm:flex lg:hidden xl:flex">
              <Sparkles className="size-3.5 text-accent" />
              <span className="text-xs font-medium">
                {ready ? `${state.xp} XP · ${rank.emoji} ${rank.title}` : "…"}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {done}/{lessons.length} lessons
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-6 lg:py-8">
        <aside className="no-print hidden w-64 shrink-0 lg:block">
          <LessonRail pathname={pathname} onNavigate={() => undefined} />
        </aside>
        <main className="relative z-0 min-w-0 flex-1 pb-16">{children}</main>
      </div>
    </div>
  );
}

function LessonRail({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  const { state } = useProgress();
  return (
    <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl bg-card/70 p-3 ring-1 ring-white/8">
      <p className="px-2 pb-2 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
        Study path
      </p>
      <ol className="space-y-1">
        {lessons.map((lesson) => {
          const active = pathname === `/learn/${lesson.slug}`;
          const completed = state.lessons[lesson.slug]?.completed;
          return (
            <li key={lesson.slug}>
              <Link
                href={`/learn/${lesson.slug}`}
                onClick={onNavigate}
                className={cn(
                  "flex items-start gap-2 rounded-xl px-2 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/15 text-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <span className="mt-0.5 w-5 text-center text-xs">
                  {completed ? "✓" : lesson.emoji}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{lesson.title}</span>
                  <span className="block text-[11px] opacity-70">
                    {String(lesson.order).padStart(2, "0")} · {lesson.minutes} min
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="grid size-8 place-items-center rounded-lg text-foreground hover:bg-white/8"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </button>
      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col gap-4 overflow-y-auto bg-[#0b1220] p-4 shadow-2xl ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Night School</p>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg hover:bg-white/8"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="grid gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    pathname === item.href ? "bg-primary/15 text-primary" : "hover:bg-white/5",
                  )}
                >
                  {item.label}
                  <NavBadge href={item.href} />
                </Link>
              ))}
            </div>
            <LessonRail pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
