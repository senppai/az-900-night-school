import type { Metadata } from "next";
import { MistakesView } from "@/components/mistakes-view";

export const metadata: Metadata = { title: "Mistake notebook" };

export default function MistakesPage() {
  return <MistakesView />;
}
