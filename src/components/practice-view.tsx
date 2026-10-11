"use client";

import { useMemo, useState } from "react";
import { Quiz } from "@/components/quiz";
import { useProgress } from "@/components/progress-provider";
import { practiceDomain, practiceExam } from "@/content/practice-exam";

export function PracticeView() {
  const { savePracticeScore, recordAnswers, state } = useProgress();
  const [started, setStarted] = useState(false);
  const questions = useMemo(() => practiceExam, []);

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Practice exam
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{practiceExam.length} questions. Same traps as the real thing.</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          These are written like AZ-900: a company wants X, pick the best service.
          After every answer you get the explanation and the trap Microsoft is fishing
          for. Passing score on the real exam is 700. Treat 80% here as “you are close.”
        </p>
        <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
          <li>▹ {practiceExam.length} questions across all three exam domains</li>
          <li>▹ No timer — understanding first, speed later</li>
          <li>▹ Your best score is saved in this browser</li>
          <li>▹ Want a timed mock or graded levels? Try the Exam Prep tab.</li>
        </ul>
        {state.practiceBest !== null ? (
          <p className="text-sm text-think">Best so far: {state.practiceBest}%</p>
        ) : null}
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="h-10 cursor-pointer rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Start the set
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Practice exam
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Stay calm. Read every option.</h1>
      </header>
      <Quiz
        questions={questions}
        title="AZ-900 style"
        onFinished={(correct, total) => savePracticeScore(correct, total)}
        onAnswer={(question, correct) =>
          recordAnswers([
            { questionId: question.id, correct, source: "practice", domain: practiceDomain(question.id) },
          ])
        }
      />
    </div>
  );
}
