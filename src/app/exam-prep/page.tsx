import type { Metadata } from "next";
import { ExamPrepView } from "@/components/exam-prep-view";

export const metadata: Metadata = { title: "Exam prep" };

export default function ExamPrepPage() {
  return <ExamPrepView />;
}
