"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Box, CreditCard, Database, Folder, FolderTree, Globe, Network, Server } from "lucide-react";
import { DiagramFrame, Segmented, Tip } from "@/components/diagrams/diagram-frame";
import { cn } from "@/lib/utils";

type Level = "mg" | "sub" | "rg" | "res";
type Assignment = "none" | "policy" | "rbac";

type TreeNode = {
  id: string;
  label: string;
  level: Level;
  icon?: LucideIcon;
  children?: TreeNode[];
};

const TREE: TreeNode = {
  id: "root",
  label: "Tenant root group",
  level: "mg",
  children: [
    {
      id: "mg-prod",
      label: "Production",
      level: "mg",
      children: [
        {
          id: "sub-prod",
          label: "Prod subscription",
          level: "sub",
          children: [
            {
              id: "rg-shop",
              label: "rg-shop-prod",
              level: "rg",
              children: [
                { id: "vm-web", label: "vm-web-01 (VM)", level: "res", icon: Server },
                { id: "vnet-shop", label: "vnet-shop (VNet)", level: "res", icon: Network },
              ],
            },
            {
              id: "rg-hr",
              label: "rg-hr-prod",
              level: "rg",
              children: [{ id: "sql-hr", label: "sql-hr (SQL database)", level: "res", icon: Database }],
            },
          ],
        },
      ],
    },
    {
      id: "mg-sandbox",
      label: "Sandbox",
      level: "mg",
      children: [
        {
          id: "sub-dev",
          label: "Dev/Test subscription",
          level: "sub",
          children: [
            {
              id: "rg-dev",
              label: "rg-dev",
              level: "rg",
              children: [{ id: "app-dev", label: "app-dev (web app)", level: "res", icon: Globe }],
            },
          ],
        },
      ],
    },
  ],
};

const LEVELS: Record<
  Level,
  { name: string; icon: LucideIcon; style: string; what: string; facts: string[] }
> = {
  mg: {
    name: "Management group",
    icon: FolderTree,
    style: "text-think",
    what: "A container for subscriptions (and other management groups). It exists so governance — Azure Policy and RBAC — can be applied to many subscriptions at once.",
    facts: [
      "Every Microsoft Entra tenant has one root management group",
      "Up to six levels of depth below the root (root and subscription levels not counted)",
      "Each management group or subscription has exactly one parent",
      "Holds no resources itself — you never deploy a VM into a management group",
    ],
  },
  sub: {
    name: "Subscription",
    icon: CreditCard,
    style: "text-accent",
    what: "The billing boundary and an access-control boundary. Each subscription gets its own invoice and its own quotas and limits.",
    facts: [
      "Every resource you create is deployed into a subscription",
      "Trusts exactly one Microsoft Entra tenant for identity",
      "Use several subscriptions to split billing, environments, or limits",
      "Belongs to one management group at a time",
    ],
  },
  rg: {
    name: "Resource group",
    icon: Folder,
    style: "text-primary",
    what: "A logical container for resources that share a lifecycle. Delete the group and everything inside it is deleted too.",
    facts: [
      "A resource is in exactly one resource group",
      "Resource groups cannot be nested inside each other",
      "Resources in one group can be in different regions",
      "Not a billing boundary — the subscription is",
    ],
  },
  res: {
    name: "Resource",
    icon: Box,
    style: "text-foreground",
    what: "An instance of a service you create: a VM, a virtual network, a database, a web app.",
    facts: [
      "Lives in exactly one resource group at a time",
      "Can be moved to another resource group or subscription",
      "RBAC can be assigned right down at a single resource",
      "Inherits Policy, RBAC, and locks from every level above it",
    ],
  },
};

function findPath(node: TreeNode, id: string): TreeNode[] | null {
  if (node.id === id) return [node];
  for (const child of node.children ?? []) {
    const path = findPath(child, id);
    if (path) return [node, ...path];
  }
  return null;
}

function collectIds(node: TreeNode): string[] {
  return [node.id, ...(node.children ?? []).flatMap(collectIds)];
}

export function ResourceHierarchyDiagram() {
  const [selectedId, setSelectedId] = useState("sub-prod");
  const [assignment, setAssignment] = useState<Assignment>("none");

  const path = findPath(TREE, selectedId) ?? [TREE];
  const selected = path[path.length - 1];
  const info = LEVELS[selected.level];
  const policyAtResource = assignment === "policy" && selected.level === "res";
  const affected = new Set(assignment === "none" || policyAtResource ? [] : collectIds(selected));
  const inheritedCount = Math.max(affected.size - 1, 0);
  const assignmentName = assignment === "policy" ? "Azure Policy assignment" : "RBAC role assignment";

  return (
    <DiagramFrame
      title="Resource hierarchy explorer"
      hint="Tap any level to see what it is and its limits. Then switch on an assignment to see what inherits it from the scope you picked."
    >
      <Segmented
        label="Show inheritance of"
        options={[
          { value: "none", label: "Just explore" },
          { value: "policy", label: "Azure Policy" },
          { value: "rbac", label: "RBAC role" },
        ]}
        value={assignment}
        onChange={setAssignment}
      />

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="overflow-x-auto rounded-xl bg-black/20 p-2 ring-1 ring-white/8">
          <ul aria-label="Azure resource hierarchy" className="min-w-[16rem]">
            <TreeItem
              node={TREE}
              selectedId={selectedId}
              affected={affected}
              onSelect={setSelectedId}
            />
          </ul>
        </div>

        <div className="space-y-3" aria-live="polite">
          <div className="rounded-xl bg-white/4 p-4 ring-1 ring-white/8">
            <p className={cn("flex items-center gap-2 text-sm font-semibold", info.style)}>
              <info.icon className="size-4" aria-hidden />
              {info.name}
              <span className="font-normal text-muted-foreground">· {selected.label}</span>
            </p>
            <p className="mt-2 text-sm leading-6">{info.what}</p>
            <ul className="mt-3 space-y-1.5 text-sm leading-6 text-muted-foreground">
              {info.facts.map((fact) => (
                <li key={fact} className="flex gap-2">
                  <span className="text-primary">▹</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {assignment !== "none" ? (
            <div className="rounded-xl bg-think/10 p-4 text-sm leading-6 ring-1 ring-think/30">
              {policyAtResource ? (
                <p>
                  Azure Policy is normally assigned at a management group, subscription, or resource
                  group. Pick a higher level — this resource is still covered by any policy assigned
                  above it.
                </p>
              ) : (
                <>
                  <p>
                    <span className="font-semibold text-think">{assignmentName}</span> at{" "}
                    <span className="font-semibold">{selected.label}</span> applies there and is
                    inherited by {inheritedCount} child {inheritedCount === 1 ? "scope" : "scopes"}.
                    Nothing above or beside it is affected.
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    {assignment === "policy"
                      ? "Children cannot opt out of an inherited policy on their own; only an exclusion or exemption on the assignment carves a scope out."
                      : "RBAC is additive: a role inherited from above cannot be removed at a lower scope."}
                  </p>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <Tip>
        Billing → subscription. Delete together → resource group. One policy for many subscriptions
        → management group. Tags are the exception: they do not inherit down by default.
      </Tip>
    </DiagramFrame>
  );
}

function TreeItem({
  node,
  selectedId,
  affected,
  onSelect,
}: {
  node: TreeNode;
  selectedId: string;
  affected: Set<string>;
  onSelect: (id: string) => void;
}) {
  const Icon = node.icon ?? LEVELS[node.level].icon;
  const selected = node.id === selectedId;
  const hit = affected.has(node.id);

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        aria-pressed={selected}
        aria-label={`${LEVELS[node.level].name}: ${node.label}${hit ? (selected ? ", assigned here" : ", inherits the assignment") : ""}`}
        className={cn(
          "my-0.5 flex w-full min-h-9 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm ring-1 ring-transparent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
          hit ? "bg-think/15 ring-think/40" : "hover:bg-white/6",
          selected && "ring-2 ring-primary",
        )}
      >
        <Icon className={cn("size-4 shrink-0", LEVELS[node.level].style)} aria-hidden />
        <span className="min-w-0 flex-1 truncate">{node.label}</span>
        {hit ? (
          <span className="shrink-0 rounded-full bg-think/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-think uppercase">
            {selected ? "Assigned" : "Inherits"}
          </span>
        ) : null}
      </button>
      {node.children ? (
        <ul className="ml-3 border-l border-white/10 pl-2">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              selectedId={selectedId}
              affected={affected}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
