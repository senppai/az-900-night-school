import type { ExamQuestion } from "../types";
import { level1 } from "./level-1";
import { level2 } from "./level-2";
import { level3 } from "./level-3";
import { level4 } from "./level-4";
import { level5 } from "./level-5";

export type LevelId = "l1" | "l2" | "l3" | "l4" | "l5";

export type ExamLevel = {
  id: LevelId;
  number: number;
  name: string;
  difficulty: string;
  blurb: string;
  questions: ExamQuestion[];
  /** Minutes on the clock; undefined means untimed. */
  timeLimit?: number;
  /** Hide explanations until the end, like the real exam. */
  examMode?: boolean;
  /** Offer lesson filtering and save progress mid-run. */
  fullCoverage?: boolean;
};

export const LEVELS: ExamLevel[] = [
  {
    id: "l1",
    number: 1,
    name: "Recall",
    difficulty: "Easy",
    blurb: "Definitions and \"which service is…\" questions. Make sure the vocabulary is solid.",
    questions: level1,
  },
  {
    id: "l2",
    number: 2,
    name: "Understand",
    difficulty: "Medium",
    blurb: "Comparisons: choose between two services that sound alike.",
    questions: level2,
  },
  {
    id: "l3",
    number: 3,
    name: "Full coverage",
    difficulty: "Mixed",
    blurb:
      "Every lesson, every official unit, every question format. Run it all in order or drill the lessons you pick. Progress saves as you go.",
    questions: level3,
    fullCoverage: true,
  },
  {
    id: "l4",
    number: 4,
    name: "Apply",
    difficulty: "Hard",
    blurb: "Scenarios with traps and close distractors — the questions that separate 650 from 800.",
    questions: level4,
  },
  {
    id: "l5",
    number: 5,
    name: "Realistic mock",
    difficulty: "Exam",
    blurb:
      "45 questions in the official domain split, real exam formats, 45 minutes on the clock. No hints until you finish.",
    questions: level5,
    timeLimit: 45,
    examMode: true,
  },
];

export function getLevel(id: LevelId) {
  return LEVELS.find((level) => level.id === id);
}
