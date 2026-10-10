import type { Metadata } from "next";
import { CheatSheetsView } from "@/components/cheatsheets-view";

export const metadata: Metadata = { title: "Cheat sheets" };

export default function CheatSheetsPage() {
  return <CheatSheetsView />;
}
