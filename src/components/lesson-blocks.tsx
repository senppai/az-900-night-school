import { InteractiveDiagram } from "@/components/diagrams";
import type { LessonBlock } from "@/content/types";
import { cn } from "@/lib/utils";

export function LessonBlocks({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => (
        <Block key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "lead":
      return (
        <p className="rounded-2xl bg-primary/10 p-5 text-lg leading-8 text-foreground ring-1 ring-primary/25">
          {block.emoji ? <span className="mr-2">{block.emoji}</span> : null}
          {block.text}
        </p>
      );
    case "heading":
      return (
        <h2 className="pt-4 text-2xl font-semibold tracking-tight text-foreground">
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p className="text-[17px] leading-8 text-foreground/90">{block.text}</p>
      );
    case "think":
      return (
        <aside className="rounded-2xl border-l-4 border-think bg-think/10 px-5 py-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-think uppercase">
            Think
          </p>
          <p className="mt-1 text-base leading-7 text-foreground">{block.text}</p>
        </aside>
      );
    case "exam":
      return (
        <aside className="rounded-2xl border-l-4 border-exam bg-exam/10 px-5 py-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-exam uppercase">
            {block.title ?? "AZ-900 exam point"}
          </p>
          <ul className="mt-2 space-y-1.5 text-base leading-7">
            {block.points.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="text-exam">★</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </aside>
      );
    case "trap":
      return (
        <aside className="rounded-2xl border-l-4 border-trap bg-trap/10 px-5 py-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-trap uppercase">
            Exam trap
          </p>
          <p className="mt-1 text-base leading-7">{block.text}</p>
        </aside>
      );
    case "example":
      return (
        <figure className="print-avoid-break overflow-hidden rounded-2xl bg-[#071018] ring-1 ring-sky-400/20 print:bg-transparent print:ring-neutral-300">
          <figcaption className="border-b border-white/8 px-5 py-3 text-sm font-semibold text-sky-200 print:border-neutral-300 print:text-primary">
            Example · {block.title}
          </figcaption>
          <div className="space-y-3 px-5 py-4">
            <p className="text-base leading-7 text-foreground/90">{block.body}</p>
            {block.code ? (
              <pre className="overflow-x-auto rounded-xl bg-black/40 p-4 font-mono text-[13px] leading-6 text-sky-100 print:bg-transparent print:text-foreground print:ring-1 print:ring-neutral-300">
                {block.code}
              </pre>
            ) : null}
            {block.caption ? (
              <p className="text-sm text-muted-foreground">{block.caption}</p>
            ) : null}
          </div>
        </figure>
      );
    case "diagram":
      return (
        <figure className="print-avoid-break overflow-hidden rounded-2xl bg-[#071018] ring-1 ring-primary/20 print:bg-transparent print:ring-neutral-300">
          {block.title ? (
            <figcaption className="border-b border-white/8 px-5 py-3 text-sm font-semibold text-primary print:border-neutral-300">
              {block.title}
            </figcaption>
          ) : null}
          <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-5 text-sky-100/90 sm:text-[13px] sm:leading-6 print:text-foreground">
            {block.ascii}
          </pre>
        </figure>
      );
    case "interactive":
      return <InteractiveDiagram id={block.diagram} />;
    case "table":
      return (
        <div className="overflow-x-auto rounded-2xl ring-1 ring-white/10">
          {block.caption ? (
            <p className="bg-white/4 px-4 py-2 text-sm font-medium">{block.caption}</p>
          ) : null}
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="bg-white/6 text-muted-foreground">
              <tr>
                {block.headers.map((header) => (
                  <th key={header} className="px-4 py-2.5 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-white/8">
                  {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3 align-top leading-6">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "cheatsheet":
      return (
        <div className="overflow-hidden rounded-2xl ring-1 ring-accent/25">
          <p className="bg-accent/15 px-4 py-2.5 text-sm font-semibold text-accent">
            🔥 AZ-900 cheat sheet
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Term</th>
                  <th className="px-4 py-2.5 font-medium">What is it?</th>
                  <th className="px-4 py-2.5 font-medium">Remember</th>
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row.term} className="border-t border-white/8">
                    <td className="px-4 py-3 font-semibold text-primary">{row.term}</td>
                    <td className="px-4 py-3 leading-6">{row.what}</td>
                    <td className="px-4 py-3 leading-6 text-accent">{row.remember}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case "onesentence":
      return (
        <blockquote className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 p-6 text-lg leading-8 font-medium ring-1 ring-primary/20">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            One sentence to remember
          </p>
          <p className="mt-2">{block.text}</p>
        </blockquote>
      );
    case "list":
      return block.ordered ? (
        <ol className="list-decimal space-y-2 pl-6 text-[17px] leading-8">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-2 text-[17px] leading-8">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-primary">▹</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="space-y-3">
          {block.items.map((item, index) => (
            <li
              key={item.title}
              className="rounded-2xl bg-white/4 p-4 ring-1 ring-white/8"
            >
              <p className="text-sm font-semibold text-primary">
                {index + 1}. {item.title}
              </p>
              <p className="mt-1 text-base leading-7">{item.text}</p>
            </li>
          ))}
        </ol>
      );
    case "compare":
      return (
        <div
          className={cn(
            "grid gap-3",
            block.items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3",
          )}
        >
          {block.items.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl bg-card/80 p-4 ring-1 ring-white/10"
            >
              <h3 className="text-base font-semibold">{item.title}</h3>
              {item.subtitle ? (
                <p className="mt-1 font-mono text-xs text-primary">{item.subtitle}</p>
              ) : null}
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                {item.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      );
    case "scenario":
      return (
        <article className="rounded-2xl bg-card p-5 ring-1 ring-white/10">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Exam-style scene · {block.title}
          </p>
          <p className="mt-2 text-base leading-7">{block.setup}</p>
          <p className="mt-4 text-sm">
            <span className="font-semibold text-think">Pick: </span>
            {block.answer}
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{block.why}</p>
        </article>
      );
  }
}
