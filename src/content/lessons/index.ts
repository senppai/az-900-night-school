import type { DomainId, Lesson } from "../types";
import { lesson as cloudComputing } from "./cloud-computing";
import { lesson as sharedResponsibility } from "./shared-responsibility";
import { lesson as cloudModels } from "./cloud-models";
import { lesson as cloudBenefits } from "./cloud-benefits";
import { lesson as cloudServiceTypes } from "./cloud-service-types";
import { lesson as regionsAndZones } from "./regions-and-zones";
import { lesson as resourceHierarchy } from "./resource-hierarchy";
import { lesson as compute } from "./compute";
import { lesson as networking } from "./networking";
import { lesson as storage } from "./storage";
import { lesson as identity } from "./identity";
import { lesson as security } from "./security";
import { lesson as costManagement } from "./cost-management";
import { lesson as governance } from "./governance";
import { lesson as manageAndDeploy } from "./manage-and-deploy";
import { lesson as monitoring } from "./monitoring";

export const lessons: Lesson[] = [
  cloudComputing,
  sharedResponsibility,
  cloudModels,
  cloudBenefits,
  cloudServiceTypes,
  regionsAndZones,
  resourceHierarchy,
  compute,
  networking,
  storage,
  identity,
  security,
  costManagement,
  governance,
  manageAndDeploy,
  monitoring,
].sort((a, b) => a.order - b.order);

export function getLesson(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function getAdjacent(slug: string) {
  const index = lessons.findIndex((lesson) => lesson.slug === slug);
  return {
    prev: index > 0 ? lessons[index - 1] : undefined,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined,
  };
}

export function lessonsForDomain(domain: DomainId) {
  return lessons.filter((lesson) => lesson.domain === domain);
}

export function allCheatSheets() {
  return lessons.flatMap((lesson) =>
    lesson.blocks
      .filter((block) => block.type === "cheatsheet")
      .map((block) => ({
        slug: lesson.slug,
        title: lesson.title,
        emoji: lesson.emoji,
        domain: lesson.domain,
        rows: block.rows,
      })),
  );
}
