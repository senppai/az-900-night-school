"use client";

import { useMemo, useState } from "react";
import { useProgress } from "@/components/progress-provider";
import { flashcards } from "@/content/flashcards";
import { DOMAINS } from "@/content/catalog";
import type { DomainId } from "@/content/types";
import { cn } from "@/lib/utils";

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function FlashView() {
  const { markFlashSeen, state } = useProgress();
  const [domain, setDomain] = useState<DomainId | "all">("all");
  const [order, setOrder] = useState(() => flashcards.map((card) => card.id));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const pool = useMemo(() => {
    const allowed = new Set(
      flashcards
        .filter((card) => domain === "all" || card.domain === domain)
        .map((card) => card.id),
    );
    return order.filter((id) => allowed.has(id));
  }, [domain, order]);

  const card = flashcards.find((item) => item.id === pool[index]) ?? flashcards[0];

  function reshuffle() {
    setOrder(shuffle(flashcards.map((item) => item.id)));
    setIndex(0);
    setFlipped(false);
  }

  function next() {
    markFlashSeen(card.id);
    setFlipped(false);
    setIndex((value) => (value + 1) % Math.max(pool.length, 1));
  }

  function prev() {
    setFlipped(false);
    setIndex((value) => (value - 1 + pool.length) % Math.max(pool.length, 1));
  }

  function setFilter(nextDomain: DomainId | "all") {
    setDomain(nextDomain);
    setIndex(0);
    setFlipped(false);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Flashcards
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Flip until the names stick.</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          Front is the term. Back is the exam memory. {state.flashSeen.length} of{" "}
          {flashcards.length} seen at least once.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <FilterChip active={domain === "all"} onClick={() => setFilter("all")}>
          All
        </FilterChip>
        {DOMAINS.map((item) => (
          <FilterChip
            key={item.id}
            active={domain === item.id}
            onClick={() => setFilter(item.id)}
          >
            {item.title}
          </FilterChip>
        ))}
        <button
          type="button"
          onClick={reshuffle}
          className="rounded-full bg-white/4 px-3 py-1 text-xs font-medium ring-1 ring-white/10 hover:bg-white/8"
        >
          Shuffle
        </button>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        className="block min-h-[320px] w-full cursor-pointer rounded-3xl bg-card p-8 text-left ring-1 ring-primary/25 transition-colors hover:ring-primary/50"
        data-flashcard="true"
      >
        {flipped ? (
          <>
            <p className="text-xs tracking-[0.16em] text-accent uppercase">Remember</p>
            <p className="mt-6 text-xl leading-8">{card.back}</p>
            <p className="mt-10 text-sm text-muted-foreground">Click to flip back</p>
          </>
        ) : (
          <>
            <p className="text-xs tracking-[0.16em] text-primary uppercase">Term</p>
            <p className="mt-6 text-3xl font-semibold leading-tight">{card.front}</p>
            {card.hint ? (
              <p className="mt-6 text-sm text-muted-foreground">Hint: {card.hint}</p>
            ) : null}
            <p className="mt-10 text-sm text-muted-foreground">Click to flip</p>
          </>
        )}
      </button>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={prev}
          className="h-9 cursor-pointer rounded-lg bg-white/5 px-3 text-sm font-medium ring-1 ring-white/10 hover:bg-white/10"
        >
          Previous
        </button>
        <p className="text-sm text-muted-foreground">
          {Math.min(index + 1, pool.length)} / {pool.length}
        </p>
        <button
          type="button"
          onClick={next}
          className="h-9 cursor-pointer rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Got it — next
        </button>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full px-3 py-1 text-xs font-medium ring-1",
        active ? "bg-primary/20 text-primary ring-primary/40" : "bg-white/4 ring-white/10 hover:bg-white/8",
      )}
    >
      {children}
    </button>
  );
}
