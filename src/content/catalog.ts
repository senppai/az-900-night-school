import type { DomainMeta } from "./types";

export const SITE = {
  name: "Night School",
  exam: "AZ-900",
  fullName: "AZ-900 Night School",
  tagline: "Understand Azure Fundamentals the easy way — then pass the exam.",
  officialGuide:
    "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900",
  officialExam:
    "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
  skillsAsOf: "July 20, 2026",
};

export const DOMAINS: DomainMeta[] = [
  {
    id: "cloud",
    number: "01",
    title: "Cloud concepts",
    weight: "25–30%",
    blurb:
      "What the cloud even is, who is responsible for what, and why companies move there.",
    accent: "sky",
  },
  {
    id: "architecture",
    number: "02",
    title: "Azure architecture & services",
    weight: "35–40%",
    blurb:
      "The biggest exam slice: regions, compute, networking, storage, and identity.",
    accent: "azure",
  },
  {
    id: "governance",
    number: "03",
    title: "Management & governance",
    weight: "30–35%",
    blurb:
      "Money, policy, locks, the portal, CLI, ARM, and how you watch Azure stay healthy.",
    accent: "gold",
  },
];
