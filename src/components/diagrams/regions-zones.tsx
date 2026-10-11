"use client";

import { useState, type ReactNode } from "react";
import { Check, Landmark, Server, X } from "lucide-react";
import { DiagramFrame, Segmented, Tip } from "@/components/diagrams/diagram-frame";
import { cn } from "@/lib/utils";

type Scenario = "none" | "rack" | "zone" | "region";
type Design = "single" | "avset" | "zones" | "multi";

const SCENARIOS: { value: Scenario; label: string; short: string }[] = [
  { value: "none", label: "Normal day", short: "None" },
  { value: "rack", label: "Server / rack fails", short: "Server / rack" },
  { value: "zone", label: "Datacenter / zone fails", short: "Zone" },
  { value: "region", label: "Whole region fails", short: "Region" },
];

const DESIGNS: { value: Design; label: string; vms: string[]; sla: string; how: string; tip: string }[] = [
  {
    value: "single",
    label: "Single VM",
    vms: ["a-1-1"],
    sla: "99.9% (Premium SSD)",
    how: "One VM on one host. If the host fails, Azure restarts it on healthy hardware — after some downtime.",
    tip: "One VM is a single point of failure. The exam wants at least two VMs for high availability.",
  },
  {
    value: "avset",
    label: "Availability set",
    vms: ["a-1-1", "a-1-2", "a-1-3"],
    sla: "99.95%",
    how: "Two or more VMs spread across fault domains (separate racks with their own power and network) and update domains, inside one datacenter.",
    tip: "Availability sets protect against rack failures and planned maintenance — not against losing the whole datacenter.",
  },
  {
    value: "zones",
    label: "Across availability zones",
    vms: ["a-1-1", "a-2-1", "a-3-1"],
    sla: "99.99%",
    how: "VMs in separate zones of one region. Each zone has independent power, cooling, and networking.",
    tip: "Zones = survive a datacenter failure. Only regions that support availability zones offer this, and a regional disaster still takes all zones.",
  },
  {
    value: "multi",
    label: "Multi-region (region pair)",
    vms: ["a-1-1", "a-2-1", "a-3-1", "b-1", "b-2"],
    sla: "Disaster recovery",
    how: "The workload also runs in (or replicates to) the paired region in the same geography, hundreds of miles away, ready to fail over.",
    tip: "Region pairs = survive a regional disaster. Microsoft rolls out updates to one region of a pair at a time and prioritises recovering one of the pair.",
  },
];

const ZONES = [1, 2, 3];
const RACKS = [1, 2, 3];

function isFailed(slot: string, scenario: Scenario) {
  if (scenario === "rack") return slot === "a-1-1";
  if (scenario === "zone") return slot.startsWith("a-1-");
  if (scenario === "region") return slot.startsWith("a-");
  return false;
}

function survives(design: (typeof DESIGNS)[number], scenario: Scenario) {
  return design.vms.some((slot) => !isFailed(slot, scenario));
}

export function RegionsZonesDiagram() {
  const [scenario, setScenario] = useState<Scenario>("rack");
  const [designId, setDesignId] = useState<Design>("avset");
  const design = DESIGNS.find((item) => item.value === designId) ?? DESIGNS[0];
  const up = survives(design, scenario);
  const running = design.vms.filter((slot) => !isFailed(slot, scenario)).length;

  return (
    <DiagramFrame
      title="Regions and zones: what survives?"
      hint="Pick a design, then break something. Red marks what failed; the result shows whether your app stays up."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Segmented label="Design" options={DESIGNS} value={designId} onChange={setDesignId} />
        <Segmented label="Failure" options={SCENARIOS} value={scenario} onChange={setScenario} />
      </div>

      <div className="space-y-2">
        <Region label="Region A (primary)" failed={scenario === "region"}>
          <div className="grid grid-cols-3 gap-2">
            {ZONES.map((zone) => (
              <div
                key={zone}
                className={cn(
                  "rounded-lg p-1.5 ring-1 transition-colors",
                  scenario === "region" || (scenario === "zone" && zone === 1)
                    ? "bg-trap/15 ring-trap/40"
                    : "bg-black/20 ring-white/8",
                )}
              >
                <p className="mb-1 text-center text-[11px] font-medium text-muted-foreground">
                  Zone {zone}
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {RACKS.map((rack) => (
                    <Slot
                      key={rack}
                      id={`a-${zone}-${rack}`}
                      label={`Zone ${zone}, rack ${rack}`}
                      design={design}
                      scenario={scenario}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Region>

        <p className="text-center text-xs text-muted-foreground">
          ⇅ paired region · same geography · hundreds of miles apart
        </p>

        <Region label="Region B (paired)">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1 rounded-lg bg-black/20 p-1.5 ring-1 ring-white/8">
              <p className="mb-1 text-center text-[11px] font-medium text-muted-foreground">
                Datacenter
              </p>
              <div className="grid grid-cols-3 gap-1">
                {RACKS.map((rack) => (
                  <Slot
                    key={rack}
                    id={`b-${rack}`}
                    label={`Region B, rack ${rack}`}
                    design={design}
                    scenario={scenario}
                  />
                ))}
              </div>
            </div>
            <p className="col-span-2 self-center text-xs leading-5 text-muted-foreground">
              Only the multi-region design uses this region.
            </p>
          </div>
        </Region>
      </div>

      <div
        aria-live="polite"
        className={cn(
          "rounded-xl px-4 py-3 text-sm leading-6 ring-1",
          up ? "bg-think/10 ring-think/30" : "bg-trap/10 ring-trap/30",
        )}
      >
        <p className={cn("flex items-center gap-2 font-semibold", up ? "text-think" : "text-trap")}>
          {up ? <Check className="size-4" aria-hidden /> : <X className="size-4" aria-hidden />}
          {up
            ? `App stays up — ${running} of ${design.vms.length} VMs still running`
            : "App goes down — every VM was in the failed area"}
        </p>
        <p className="mt-1">{design.how}</p>
        <p className="mt-1 text-muted-foreground">SLA: {design.sla}</p>
      </div>

      <div className="overflow-x-auto rounded-xl ring-1 ring-white/8">
        <table className="w-full min-w-[26rem] text-left text-sm">
          <caption className="sr-only">Which design survives which failure</caption>
          <thead className="bg-white/4 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Survives…</th>
              {SCENARIOS.slice(1).map((item) => (
                <th key={item.value} className="px-3 py-2 text-center font-medium">
                  {item.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DESIGNS.map((item) => (
              <tr
                key={item.value}
                className={cn("border-t border-white/8", item.value === designId && "bg-primary/10")}
              >
                <th scope="row" className="px-3 py-2 font-medium">
                  {item.label}
                </th>
                {SCENARIOS.slice(1).map((column) => {
                  const ok = survives(item, column.value);
                  return (
                    <td
                      key={column.value}
                      className={cn(
                        "px-3 py-2 text-center",
                        item.value === designId && column.value === scenario && "ring-2 ring-primary ring-inset",
                      )}
                    >
                      {ok ? (
                        <Check className="mx-auto size-4 text-think" aria-label="Survives" />
                      ) : (
                        <X className="mx-auto size-4 text-trap" aria-label="Goes down" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Tip>{design.tip}</Tip>

      <p className="flex gap-2 rounded-xl bg-white/4 px-4 py-2.5 text-sm leading-6 ring-1 ring-white/8">
        <Landmark className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
        <span>
          <span className="font-semibold">Sovereign regions</span> (Azure Government, Azure in China
          operated by 21Vianet) are separate, isolated instances of Azure for legal and compliance
          needs — not a resiliency option like zones or region pairs.
        </span>
      </p>
    </DiagramFrame>
  );
}

function Region({ label, failed, children }: { label: string; failed?: boolean; children: ReactNode }) {
  return (
    <section
      aria-label={label}
      className={cn(
        "rounded-xl border border-dashed p-2.5 transition-colors",
        failed ? "border-trap/60 bg-trap/10" : "border-white/15",
      )}
    >
      <p
        className={cn(
          "mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase",
          failed ? "text-trap" : "text-muted-foreground",
        )}
      >
        {label}
        {failed ? " · outage" : ""}
      </p>
      {children}
    </section>
  );
}

function Slot({
  id,
  label,
  design,
  scenario,
}: {
  id: string;
  label: string;
  design: (typeof DESIGNS)[number];
  scenario: Scenario;
}) {
  const hasVm = design.vms.includes(id);
  const failed = isFailed(id, scenario);
  const state = hasVm ? (failed ? "VM down" : "VM running") : failed ? "failed, empty" : "empty";

  return (
    <div
      role="img"
      aria-label={`${label}: ${state}`}
      className={cn(
        "relative flex aspect-square items-center justify-center rounded-md ring-1 transition-colors",
        failed ? "bg-trap/20 ring-trap/50" : hasVm ? "bg-primary/15 ring-primary/40" : "bg-white/3 ring-white/8",
      )}
    >
      {hasVm ? (
        <Server className={cn("size-4", failed ? "text-trap/60" : "text-primary")} aria-hidden />
      ) : null}
      {failed && hasVm ? (
        <X className="absolute size-5 text-trap" strokeWidth={3} aria-hidden />
      ) : null}
    </div>
  );
}
