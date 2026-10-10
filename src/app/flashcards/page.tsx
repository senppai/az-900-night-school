import type { Metadata } from "next";
import { FlashView } from "@/components/flash-view";

export const metadata: Metadata = { title: "Flashcards" };

export default function FlashcardsPage() {
  return <FlashView />;
}
