"use client";

import { useState } from "react";
import { DiagramFrame, Segmented, Tip } from "@/components/diagrams/diagram-frame";
import { cn } from "@/lib/utils";

type Model = "onprem" | "iaas" | "paas" | "saas";
type Owner = "customer" | "shared" | "microsoft";

const MODELS: { value: Model; label: string; tip: string }[] = [
  {
    value: "onprem",
    label: "On-premises",
    tip: "In your own datacenter you own every layer, from the building to the data. Every move to the cloud hands layers to Microsoft.",
  },
  {
    value: "iaas",
    label: "IaaS",
    tip: "Microsoft takes the physical hosts, network, and datacenter. You still patch the operating system and secure the network controls and apps on your VM.",
  },
  {
    value: "paas",
    label: "PaaS",
    tip: "Microsoft runs the operating system. Network controls, applications, and identity infrastructure become shared. You never patch the OS on PaaS.",
  },
  {
    value: "saas",
    label: "SaaS",
    tip: "Microsoft runs the application too. Even in SaaS, you still own your data, devices, and accounts and identities.",
  },
];

type Group = "always-customer" | "varies" | "physical";

const LAYERS: { name: string; group: Group; owners: Record<Model, Owner> }[] = [
  {
    name: "Information and data",
    group: "always-customer",
    owners: { onprem: "customer", iaas: "customer", paas: "customer", saas: "customer" },
  },
  {
    name: "Devices (mobile and PCs)",
    group: "always-customer",
    owners: { onprem: "customer", iaas: "customer", paas: "customer", saas: "customer" },
  },
  {
    name: "Accounts and identities",
    group: "always-customer",
    owners: { onprem: "customer", iaas: "customer", paas: "customer", saas: "customer" },
  },
  {
    name: "Identity and directory infrastructure",
    group: "varies",
    owners: { onprem: "customer", iaas: "customer", paas: "shared", saas: "shared" },
  },
  {
    name: "Applications",
    group: "varies",
    owners: { onprem: "customer", iaas: "customer", paas: "shared", saas: "microsoft" },
  },
  {
    name: "Network controls",
    group: "varies",
    owners: { onprem: "customer", iaas: "customer", paas: "shared", saas: "microsoft" },
  },
  {
    name: "Operating system",
    group: "varies",
    owners: { onprem: "customer", iaas: "customer", paas: "microsoft", saas: "microsoft" },
  },
  {
    name: "Physical hosts",
    group: "physical",
    owners: { onprem: "customer", iaas: "microsoft", paas: "microsoft", saas: "microsoft" },
  },
  {
    name: "Physical network",
    group: "physical",
    owners: { onprem: "customer", iaas: "microsoft", paas: "microsoft", saas: "microsoft" },
  },
  {
    name: "Physical datacenter",
    group: "physical",
    owners: { onprem: "customer", iaas: "microsoft", paas: "microsoft", saas: "microsoft" },
  },
];

const GROUPS: { id: Group; label: string }[] = [
  { id: "always-customer", label: "Always the customer — in every model" },
  { id: "varies", label: "Moves with the service type" },
  { id: "physical", label: "Physical — Microsoft in every cloud model" },
];

const OWNER_LABEL: Record<Owner, string> = {
  customer: "Customer",
  shared: "Shared",
  microsoft: "Microsoft",
};

const OWNER_STYLE: Record<Owner, string> = {
  customer: "bg-accent/15 text-accent ring-accent/35",
  shared: "bg-think/15 text-think ring-think/35",
  microsoft: "bg-primary/15 text-primary ring-primary/35",
};

export function SharedResponsibilityDiagram() {
  const [model, setModel] = useState<Model>("iaas");
  const current = MODELS.find((item) => item.value === model) ?? MODELS[0];
  const counts = LAYERS.reduce(
    (total, layer) => ({ ...total, [layer.owners[model]]: total[layer.owners[model]] + 1 }),
    { customer: 0, shared: 0, microsoft: 0 } as Record<Owner, number>,
  );

  return (
    <DiagramFrame
      title="Shared responsibility: slide the line"
      hint="Pick a deployment model and watch each layer change owner. Based on Microsoft's shared responsibility chart."
    >
      <Segmented
        label="Deployment model"
        options={MODELS}
        value={model}
        onChange={setModel}
        className="no-print"
      />

      <div className="no-print flex flex-wrap gap-2 text-xs" aria-live="polite">
        {(Object.keys(OWNER_LABEL) as Owner[]).map((owner) => (
          <span key={owner} className={cn("rounded-full px-2.5 py-1 font-medium ring-1", OWNER_STYLE[owner])}>
            {OWNER_LABEL[owner]}: {counts[owner]} of {LAYERS.length}
          </span>
        ))}
      </div>

      <div className="no-print space-y-3">
        {GROUPS.map((group) => (
          <section key={group.id} aria-label={group.label}>
            <p
              className={cn(
                "mb-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase",
                group.id === "always-customer"
                  ? "text-accent"
                  : group.id === "physical"
                    ? "text-primary"
                    : "text-muted-foreground",
              )}
            >
              {group.label}
            </p>
            <ul
              className={cn(
                "space-y-1.5 rounded-xl p-1.5",
                group.id === "always-customer" && "border border-dashed border-accent/45",
                group.id === "physical" && "ring-1 ring-primary/30",
                group.id === "varies" && "bg-white/3",
              )}
            >
              {LAYERS.filter((layer) => layer.group === group.id).map((layer) => {
                const owner = layer.owners[model];
                return (
                  <li
                    key={layer.name}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg px-3 py-2 ring-1 transition-colors duration-300",
                      OWNER_STYLE[owner],
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">{layer.name}</span>
                    <span className="shrink-0 text-xs font-semibold tracking-wide uppercase">
                      {OWNER_LABEL[owner]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <table className="hidden w-full text-left text-xs print:table">
        <thead>
          <tr>
            <th className="py-1 pr-2">Layer</th>
            {MODELS.map((item) => (
              <th key={item.value} className="py-1 pr-2">
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {LAYERS.map((layer) => (
            <tr key={layer.name} className="border-t">
              <td className="py-1 pr-2 font-medium">{layer.name}</td>
              {MODELS.map((item) => (
                <td key={item.value} className="py-1 pr-2">
                  {OWNER_LABEL[layer.owners[item.value]]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="no-print">
        <Tip>
          <span className="font-semibold">{current.label}:</span> {current.tip}
        </Tip>
      </div>
    </DiagramFrame>
  );
}
