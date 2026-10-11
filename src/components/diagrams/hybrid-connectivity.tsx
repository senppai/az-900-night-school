"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Building2, Cable, Cloud, Laptop, Lock, Network } from "lucide-react";
import { DiagramFrame, Segmented, Tip } from "@/components/diagrams/diagram-frame";
import { cn } from "@/lib/utils";

type Path = "s2s" | "p2s" | "expressroute";

const PATHS: {
  value: Path;
  label: string;
  source: { icon: LucideIcon; label: string; detail: string };
  middle: { icon: LucideIcon; label: string; detail: string; private: boolean };
  target: string;
  facts: { term: string; text: string }[];
  tip: string;
}[] = [
  {
    value: "s2s",
    label: "VPN · site-to-site",
    source: { icon: Building2, label: "Office network", detail: "On-premises VPN device" },
    middle: { icon: Cloud, label: "Public internet", detail: "Encrypted IPsec/IKE tunnel", private: false },
    target: "VPN gateway in the VNet",
    facts: [
      { term: "Path", text: "Over the public internet, inside an encrypted tunnel" },
      { term: "Connects", text: "A whole on-premises network to an Azure virtual network" },
      { term: "Performance", text: "Depends on the internet link and the gateway SKU" },
      { term: "Cost & setup", text: "Lower cost, quick to set up" },
    ],
    tip: "“Encrypted connection over the internet between the office and Azure” → VPN Gateway, site-to-site.",
  },
  {
    value: "p2s",
    label: "VPN · point-to-site",
    source: { icon: Laptop, label: "One device", detail: "A remote worker's laptop" },
    middle: { icon: Cloud, label: "Public internet", detail: "Encrypted tunnel from the device", private: false },
    target: "VPN gateway in the VNet",
    facts: [
      { term: "Path", text: "Over the public internet, inside an encrypted tunnel" },
      { term: "Connects", text: "Individual computers, from anywhere, to an Azure virtual network" },
      { term: "Needs", text: "No VPN device on-premises — the client runs on the device" },
      { term: "Cost & setup", text: "Lower cost, quick to set up" },
    ],
    tip: "“A few employees working from home need to reach the VNet” → point-to-site VPN.",
  },
  {
    value: "expressroute",
    label: "ExpressRoute",
    source: { icon: Building2, label: "Office / datacenter", detail: "Your edge routers" },
    middle: {
      icon: Cable,
      label: "Connectivity provider",
      detail: "Private circuit — never the public internet",
      private: true,
    },
    target: "Microsoft edge → Azure and Microsoft 365",
    facts: [
      { term: "Path", text: "Private connection through a connectivity provider, not the public internet" },
      { term: "Performance", text: "More reliable, faster, consistent latency — up to 100 Gbps with ExpressRoute Direct" },
      { term: "Reaches", text: "Azure services and Microsoft cloud services such as Microsoft 365" },
      { term: "Watch out", text: "Private is not the same as encrypted — traffic is not encrypted by default" },
    ],
    tip: "“Must not travel over the public internet” or “predictable, high-bandwidth link” → ExpressRoute.",
  },
];

export function HybridConnectivityDiagram() {
  const [pathId, setPathId] = useState<Path>("s2s");
  const path = PATHS.find((item) => item.value === pathId) ?? PATHS[0];

  return (
    <DiagramFrame
      title="How the traffic reaches Azure"
      hint="Switch between the three hybrid options and follow the path the traffic takes."
    >
      <Segmented label="Connection" options={PATHS} value={pathId} onChange={setPathId} />

      <ol
        aria-label={`${path.label} traffic path`}
        className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center"
      >
        <Hop icon={path.source.icon} label={path.source.label} detail={path.source.detail} />
        <Connector private={path.middle.private} />
        <li
          className={cn(
            "flex-1 rounded-xl px-3 py-3 ring-1 transition-colors",
            path.middle.private
              ? "bg-think/10 ring-think/40"
              : "border border-dashed border-accent/50 bg-accent/5 ring-transparent",
          )}
        >
          <p
            className={cn(
              "flex items-center gap-2 text-sm font-semibold",
              path.middle.private ? "text-think" : "text-accent",
            )}
          >
            <path.middle.icon className="size-4" aria-hidden />
            {path.middle.label}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            {path.middle.private ? null : <Lock className="size-3.5 text-accent" aria-hidden />}
            {path.middle.detail}
          </p>
        </li>
        <Connector private={path.middle.private} />
        <Hop icon={Network} label="Azure" detail={path.target} />
      </ol>

      <dl className="grid gap-2 sm:grid-cols-2" aria-live="polite">
        {path.facts.map((fact) => (
          <div key={fact.term} className="rounded-xl bg-white/4 px-3 py-2 ring-1 ring-white/8">
            <dt className="text-xs font-semibold tracking-wide text-primary uppercase">{fact.term}</dt>
            <dd className="mt-0.5 text-sm leading-6">{fact.text}</dd>
          </div>
        ))}
      </dl>

      <Tip>{path.tip}</Tip>
    </DiagramFrame>
  );
}

function Hop({ icon: Icon, label, detail }: { icon: LucideIcon; label: string; detail: string }) {
  return (
    <li className="flex-1 rounded-xl bg-primary/10 px-3 py-3 ring-1 ring-primary/30">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-primary" aria-hidden />
        {label}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </li>
  );
}

function Connector({ private: isPrivate }: { private: boolean }) {
  return (
    <li aria-hidden className="flex h-10 items-center justify-center sm:h-auto">
      <svg viewBox="0 0 40 12" className="h-3 w-10 rotate-90 sm:rotate-0">
        <line
          x1="0"
          y1="6"
          x2="32"
          y2="6"
          strokeWidth="2"
          className={isPrivate ? "stroke-think" : "stroke-accent"}
          strokeDasharray={isPrivate ? undefined : "4 3"}
        />
        <path d="M30 1 L39 6 L30 11 Z" className={isPrivate ? "fill-think" : "fill-accent"} />
      </svg>
    </li>
  );
}
