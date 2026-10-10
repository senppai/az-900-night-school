"use client";

import Link from "next/link";
import { useState } from "react";
import { Printer } from "lucide-react";
import { DOMAINS } from "@/content/catalog";
import { QUICK_SHEET } from "@/content/cheatsheet-quick";
import { DETAILED_SHEET } from "@/content/cheatsheet-detailed";
import { lessonsForDomain } from "@/content/lessons";
import { cn } from "@/lib/utils";

type View = "quick" | "detailed";

const VIEWS: { id: View; label: string; blurb: string }[] = [
  {
    id: "quick",
    label: "Quick",
    blurb: "One line per concept, grouped by domain. About two printed pages.",
  },
  {
    id: "detailed",
    label: "Detailed",
    blurb: "Per lesson: what it is, when to use it, what it gets confused with, and the trap.",
  },
];

export function CheatSheetsView() {
  const [view, setView] = useState<View>("quick");
  const active = VIEWS.find((item) => item.id === view) ?? VIEWS[0];

  return (
    <div className="print-sheet space-y-8">
      <header className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Cheat sheets
        </p>
        <h1 className="text-4xl font-semibold tracking-tight print:text-2xl">
          {view === "quick"
            ? "AZ-900 quick sheet"
            : "AZ-900 detailed sheet"}
        </h1>
        <p className="no-print text-lg leading-8 text-muted-foreground">
          Two ways to review. The quick sheet is for the night before; the detailed
          sheet is for spotting the traps. Print either one or save it as a PDF.
        </p>
      </header>

      <div className="no-print flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl bg-card/70 p-1 ring-1 ring-white/8">
          {VIEWS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={cn(
                "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
                view === item.id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{active.blurb}</p>
        <button
          type="button"
          onClick={() => window.print()}
          className="ml-auto inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Printer className="size-4" />
          Print / save as PDF
        </button>
      </div>

      {view === "quick" ? <QuickSheet /> : <DetailedSheet />}
    </div>
  );
}

function QuickSheet() {
  return (
    <div className="space-y-6 print:space-y-3">
      {DOMAINS.map((domain) => (
        <section key={domain.id} className="space-y-3 print:space-y-1.5">
          <h2 className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
            Domain {domain.number} · {domain.title} · {domain.weight}
          </h2>
          <div className="grid gap-3 md:grid-cols-2 print:grid-cols-2 print:gap-2">
            {QUICK_SHEET[domain.id].map((group) => (
              <article
                key={group.group}
                className="print-border print-avoid-break rounded-2xl bg-card/60 p-4 ring-1 ring-white/8 print:rounded-md print:p-2"
              >
                <h3 className="mb-2 text-sm font-semibold print:mb-1 print:text-[9pt]">
                  {group.group}
                </h3>
                <ul className="space-y-1 text-sm print:space-y-0 print:text-[8pt] print:leading-tight">
                  {group.lines.map((line) => (
                    <li key={line.term} className="leading-6 print:leading-snug">
                      <span className="font-semibold text-primary">{line.term}</span>
                      <span className="text-muted-foreground"> — </span>
                      {line.line}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function DetailedSheet() {
  return (
    <div className="space-y-8 print:space-y-4">
      {DOMAINS.map((domain) => (
        <section key={domain.id} className="space-y-4 print:space-y-2">
          <h2 className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
            Domain {domain.number} · {domain.title} · {domain.weight}
          </h2>
          {lessonsForDomain(domain.id).map((lesson) => {
            const rows = DETAILED_SHEET[lesson.slug] ?? [];
            if (rows.length === 0) return null;
            return (
              <article
                key={lesson.slug}
                className="print-border overflow-hidden rounded-2xl ring-1 ring-accent/20 print:rounded-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 bg-accent/10 px-4 py-3 print:bg-transparent print:px-2 print:py-1">
                  <h3 className="font-semibold print:text-[10pt]">
                    {lesson.emoji} {lesson.title}
                  </h3>
                  <Link
                    href={`/learn/${lesson.slug}`}
                    className="no-print text-sm text-primary hover:underline"
                  >
                    Open lesson
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[48rem] table-fixed text-left text-sm print:min-w-0 print:text-[8pt]">
                    <colgroup>
                      <col className="w-[16%]" />
                      <col className="w-[21%]" />
                      <col className="w-[21%]" />
                      <col className="w-[21%]" />
                      <col className="w-[21%]" />
                    </colgroup>
                    <thead className="text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2.5 font-medium print:px-2 print:py-1">Item</th>
                        <th className="px-4 py-2.5 font-medium print:px-2 print:py-1">What it is</th>
                        <th className="px-4 py-2.5 font-medium print:px-2 print:py-1">When to use it</th>
                        <th className="px-4 py-2.5 font-medium print:px-2 print:py-1">Compared with</th>
                        <th className="px-4 py-2.5 font-medium print:px-2 print:py-1">Exam trap</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.item} className="border-t border-white/8 align-top">
                          <td className="px-4 py-3 font-semibold text-primary print:px-2 print:py-1">
                            {row.item}
                          </td>
                          <td className="px-4 py-3 leading-6 print:px-2 print:py-1 print:leading-snug">
                            {row.what}
                          </td>
                          <td className="px-4 py-3 leading-6 print:px-2 print:py-1 print:leading-snug">
                            {row.when}
                          </td>
                          <td className="px-4 py-3 leading-6 text-muted-foreground print:px-2 print:py-1 print:leading-snug">
                            {row.vs}
                          </td>
                          <td className="px-4 py-3 leading-6 text-trap print:px-2 print:py-1 print:leading-snug">
                            {row.trap}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            );
          })}
        </section>
      ))}
    </div>
  );
}
