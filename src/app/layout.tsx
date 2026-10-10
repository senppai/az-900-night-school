import type { Metadata } from "next";
import { IBM_Plex_Mono, Outfit } from "next/font/google";
import { ProgressProvider } from "@/components/progress-provider";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "AZ-900 Night School",
    template: "%s · AZ-900 Night School",
  },
  description:
    "A dark, friendly study den for Microsoft Azure Fundamentals. Plain-language lessons, exam traps, flashcards, and a practice exam.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${outfit.variable} ${plexMono.variable} antialiased`}
    >
      <body className="min-h-full font-sans">
        <ProgressProvider>
          <AppShell>{children}</AppShell>
        </ProgressProvider>
      </body>
    </html>
  );
}
