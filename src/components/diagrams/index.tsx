"use client";

import type { LessonBlock } from "@/content/types";
import { HybridConnectivityDiagram } from "@/components/diagrams/hybrid-connectivity";
import { RegionsZonesDiagram } from "@/components/diagrams/regions-zones";
import { ResourceHierarchyDiagram } from "@/components/diagrams/resource-hierarchy";
import { SharedResponsibilityDiagram } from "@/components/diagrams/shared-responsibility";
import { StorageRedundancyDiagram } from "@/components/diagrams/storage-redundancy";

export type InteractiveDiagramId = Extract<LessonBlock, { type: "interactive" }>["diagram"];

export function InteractiveDiagram({ id }: { id: InteractiveDiagramId }) {
  switch (id) {
    case "shared-responsibility":
      return <SharedResponsibilityDiagram />;
    case "resource-hierarchy":
      return <ResourceHierarchyDiagram />;
    case "storage-redundancy":
      return <StorageRedundancyDiagram />;
    case "regions-zones":
      return <RegionsZonesDiagram />;
    case "hybrid-connectivity":
      return <HybridConnectivityDiagram />;
  }
}
