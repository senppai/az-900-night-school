import type { ReactNode } from "react";
import { MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";

export function DiagramFrame({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <figure className="print-avoid-break overflow-hidden rounded-2xl bg-card/70 ring-1 ring-white/8 print:ring-1 print:ring-neutral-300">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-4 py-3 sm:px-5 print:border-neutral-300">
        <span className="text-sm font-semibold text-primary">{title}</span>
        <span className="no-print inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-primary uppercase ring-1 ring-primary/25">
          <MousePointerClick className="size-3.5" aria-hidden />
          Interactive
        </span>
      </figcaption>
      <div className="space-y-4 p-4 sm:p-5">
        <p className="no-print text-sm leading-6 text-muted-foreground">{hint}</p>
        {children}
      </div>
    </figure>
  );
}

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: { value: T; label: string; disabled?: boolean }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  const current = options.find((option) => option.value === value);
  return (
    <div className={className}>
      <div
        role="group"
        aria-label={label}
        className="no-print flex flex-wrap gap-1 rounded-xl bg-black/20 p-1 ring-1 ring-white/8"
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              disabled={option.disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                "min-h-9 flex-1 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:cursor-not-allowed disabled:opacity-40",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-white/8 hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <p className="hidden text-sm font-semibold print:block">
        {label}: {current?.label}
      </p>
    </div>
  );
}

export function Switch({
  label,
  checked,
  onChange,
  disabled,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
}) {
  return (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="no-print flex min-h-9 items-center gap-3 rounded-xl px-2 py-1 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span
          aria-hidden
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 rounded-full ring-1 transition-colors",
            checked ? "bg-primary ring-primary" : "bg-white/10 ring-white/15",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 size-4 rounded-full bg-foreground transition-transform",
              checked ? "translate-x-4.5" : "translate-x-0.5",
            )}
          />
        </span>
        <span>
          <span className="font-medium">{label}</span>
          {description ? (
            <span className="block text-xs text-muted-foreground">{description}</span>
          ) : null}
        </span>
      </button>
      <p className="hidden text-sm font-semibold print:block">
        {label}: {checked ? "on" : "off"}
      </p>
    </>
  );
}

export function Tip({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border-l-4 border-exam bg-exam/10 px-4 py-2.5 text-sm leading-6">
      <span className="font-semibold text-exam">Exam tip · </span>
      {children}
    </p>
  );
}
