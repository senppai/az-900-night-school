"use client";

import { useState, type ReactNode } from "react";
import { ArrowDown, Check, Eye, EyeOff, HardDrive, RefreshCw, X } from "lucide-react";
import { DiagramFrame, Segmented, Switch, Tip } from "@/components/diagrams/diagram-frame";
import { cn } from "@/lib/utils";

type Option = "LRS" | "ZRS" | "GRS" | "GZRS";
type Outcome = "yes" | "failover" | "no";

const OPTIONS: {
  value: Option;
  label: string;
  name: string;
  geo: boolean;
  primary: [number, number, number];
  durability: string;
  tip: string;
}[] = [
  {
    value: "LRS",
    label: "LRS",
    name: "Locally redundant storage",
    geo: false,
    primary: [3, 0, 0],
    durability: "11 nines",
    tip: "Cheapest option: three synchronous copies in one datacenter. Survives a drive, server, or rack failure — but a fire or flood in that datacenter can take every copy.",
  },
  {
    value: "ZRS",
    label: "ZRS",
    name: "Zone-redundant storage",
    geo: false,
    primary: [1, 1, 1],
    durability: "12 nines",
    tip: "Synchronous copies across availability zones. Still readable and writable if a zone fails, and data stays in one region (handy for data residency). No protection if the whole region goes down.",
  },
  {
    value: "GRS",
    label: "GRS",
    name: "Geo-redundant storage",
    geo: true,
    primary: [3, 0, 0],
    durability: "16 nines",
    tip: "LRS in the primary region plus an asynchronous copy to the paired secondary region, stored there with LRS. The secondary is not readable until a failover — unless you choose RA-GRS.",
  },
  {
    value: "GZRS",
    label: "GZRS",
    name: "Geo-zone-redundant storage",
    geo: true,
    primary: [1, 1, 1],
    durability: "16 nines",
    tip: "ZRS in the primary region plus an asynchronous LRS copy in the secondary region. Survives a zone failure without failover and a region failure with failover. RA-GZRS adds read access to the secondary.",
  },
];

const SCENARIOS: { label: string; outcome: (option: Option, readAccess: boolean) => Outcome }[] = [
  { label: "Drive, server, or rack failure", outcome: () => "yes" },
  {
    label: "A whole datacenter or zone goes down",
    outcome: (option) => (option === "LRS" ? "no" : option === "GRS" ? "failover" : "yes"),
  },
  {
    label: "The whole primary region goes down",
    outcome: (option) => (option === "GRS" || option === "GZRS" ? "failover" : "no"),
  },
  {
    label: "Read data during a primary-region outage, without waiting for failover",
    outcome: (option, readAccess) =>
      (option === "GRS" || option === "GZRS") && readAccess ? "yes" : "no",
  },
];

const OUTCOME: Record<Outcome, { label: string; icon: typeof Check; style: string }> = {
  yes: { label: "Yes", icon: Check, style: "text-think bg-think/15 ring-think/35" },
  failover: {
    label: "Data safe; needs failover to write",
    icon: RefreshCw,
    style: "text-accent bg-accent/15 ring-accent/35",
  },
  no: { label: "No", icon: X, style: "text-trap bg-trap/15 ring-trap/35" },
};

export function StorageRedundancyDiagram() {
  const [option, setOption] = useState<Option>("LRS");
  const [readAccess, setReadAccess] = useState(false);
  const current = OPTIONS.find((item) => item.value === option) ?? OPTIONS[0];
  const ra = current.geo && readAccess;
  const name = ra ? `RA-${current.value}` : current.value;

  return (
    <DiagramFrame
      title="Storage redundancy: where do the copies live?"
      hint="Pick a redundancy option, then try the read-access (RA-) switch on the geo options. The checklist shows which failures your data survives."
    >
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          label="Redundancy option"
          options={OPTIONS}
          value={option}
          onChange={setOption}
          className="min-w-[16rem] flex-1"
        />
        <Switch
          label="RA- (read access to secondary)"
          description={current.geo ? undefined : "Only exists for GRS and GZRS"}
          checked={ra}
          disabled={!current.geo}
          onChange={setReadAccess}
        />
      </div>

      <p className="text-sm" aria-live="polite">
        <span className="font-mono text-base font-semibold text-primary">{name}</span>{" "}
        <span className="text-muted-foreground">
          · {ra ? "Read-access " : ""}
          {current.name.toLowerCase()} · {current.geo ? 6 : 3} copies · durability{" "}
          {current.durability}
        </span>
      </p>

      <div className="space-y-2">
        <Region label="Primary region">
          <div className="grid grid-cols-3 gap-2">
            {current.primary.map((copies, zone) => (
              <Datacenter
                key={zone}
                label={`Zone ${zone + 1}`}
                copies={copies}
                note={copies === 3 ? "one datacenter" : undefined}
              />
            ))}
          </div>
        </Region>

        <div
          className={cn(
            "flex items-center justify-center gap-2 py-1 text-xs transition-opacity",
            current.geo ? "text-muted-foreground" : "opacity-30",
          )}
        >
          <ArrowDown className="size-4" aria-hidden />
          {current.geo
            ? "Asynchronous copy, hundreds of miles away"
            : "No copy leaves the primary region"}
        </div>

        <Region label="Secondary (paired) region" dimmed={!current.geo}>
          <div className="grid grid-cols-3 gap-2">
            <Datacenter label="Datacenter" copies={current.geo ? 3 : 0} note="LRS" />
            <div
              className={cn(
                "col-span-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs leading-5 ring-1",
                !current.geo
                  ? "text-muted-foreground ring-white/8"
                  : ra
                    ? "bg-think/10 text-think ring-think/30"
                    : "bg-white/4 text-muted-foreground ring-white/10",
              )}
            >
              {ra ? (
                <Eye className="size-4 shrink-0" aria-hidden />
              ) : (
                <EyeOff className="size-4 shrink-0" aria-hidden />
              )}
              {!current.geo
                ? "Not used by this option"
                : ra
                  ? "Readable at any time through the -secondary endpoint"
                  : "Not readable until you fail over"}
            </div>
          </div>
        </Region>
      </div>

      <div className="rounded-xl bg-white/4 p-3 ring-1 ring-white/8">
        <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Does {name} survive?
        </p>
        <ul className="space-y-1.5">
          {SCENARIOS.map((scenario) => {
            const outcome = OUTCOME[scenario.outcome(option, readAccess)];
            return (
              <li
                key={scenario.label}
                className="flex flex-col gap-1 rounded-lg px-2 py-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
              >
                <span className="text-sm">{scenario.label}</span>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 sm:self-auto",
                    outcome.style,
                  )}
                >
                  <outcome.icon className="size-3.5" aria-hidden />
                  {outcome.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <Tip>{current.tip}</Tip>
    </DiagramFrame>
  );
}

function Region({
  label,
  dimmed,
  children,
}: {
  label: string;
  dimmed?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={label}
      className={cn(
        "rounded-xl border border-dashed border-white/15 p-2.5 transition-opacity",
        dimmed && "opacity-40",
      )}
    >
      <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </section>
  );
}

function Datacenter({ label, copies, note }: { label: string; copies: number; note?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg px-2 py-2 ring-1 transition-colors",
        copies > 0 ? "bg-primary/10 ring-primary/35" : "bg-black/20 ring-white/8",
      )}
    >
      <p className="text-xs font-medium">{label}</p>
      <div
        className="mt-1.5 flex min-h-5 flex-wrap gap-1"
        aria-label={`${copies} ${copies === 1 ? "copy" : "copies"}`}
        role="img"
      >
        {Array.from({ length: copies }, (_, index) => (
          <HardDrive key={index} className="size-4 text-primary" aria-hidden />
        ))}
      </div>
      {note && copies > 0 ? <p className="mt-1 text-[10px] text-muted-foreground">{note}</p> : null}
    </div>
  );
}
