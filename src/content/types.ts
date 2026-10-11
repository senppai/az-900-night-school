export type DomainId = "cloud" | "architecture" | "governance";

export type QuestionKind = "single" | "multi" | "yesno" | "complete" | "match" | "order";

export type QuizQuestion = {
  id: string;
  /** Defaults to "single". */
  kind?: QuestionKind;
  prompt: string;
  /** For "yesno", each option is a statement the learner marks Yes or No. */
  options: string[];
  /** Index of the correct option for "single" and "complete". */
  answer: number;
  /**
   * Correct indexes for "multi"; statements that are true for "yesno"; for "match", the
   * category index of each option; for "order", option indexes in the right sequence
   * (omit it when options are written in the right order).
   */
  answers?: number[];
  /** Targets that "match" options are assigned to. */
  categories?: string[];
  explanation: string;
  trap?: string;
};

export type ExamQuestion = QuizQuestion & {
  domain: DomainId;
  lesson: string;
};

export type OfficialModule = {
  title: string;
  url: string;
  units: string[];
};

export type CheatRow = {
  term: string;
  what: string;
  remember: string;
};

export type LessonBlock =
  | { type: "lead"; emoji?: string; text: string }
  | { type: "heading"; text: string }
  | { type: "p"; text: string }
  | { type: "think"; text: string }
  | { type: "exam"; title?: string; points: string[] }
  | { type: "trap"; text: string }
  | { type: "example"; title: string; body: string; code?: string; caption?: string }
  | { type: "diagram"; title?: string; ascii: string }
  | {
      type: "interactive";
      diagram:
        | "shared-responsibility"
        | "resource-hierarchy"
        | "storage-redundancy"
        | "regions-zones"
        | "hybrid-connectivity";
    }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "cheatsheet"; rows: CheatRow[] }
  | { type: "onesentence"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | {
      type: "compare";
      items: { title: string; subtitle?: string; points: string[] }[];
    }
  | {
      type: "scenario";
      title: string;
      setup: string;
      answer: string;
      why: string;
    };

export type Lesson = {
  slug: string;
  order: number;
  title: string;
  emoji: string;
  domain: DomainId;
  minutes: number;
  summary: string;
  examFocus: string;
  youWillLearn: string[];
  officialModule: OfficialModule;
  blocks: LessonBlock[];
  quiz: QuizQuestion[];
};

export type DomainMeta = {
  id: DomainId;
  number: string;
  title: string;
  weight: string;
  blurb: string;
  accent: string;
};

export type Flashcard = {
  id: string;
  domain: DomainId;
  front: string;
  back: string;
  hint?: string;
};
