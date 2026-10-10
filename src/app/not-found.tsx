import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
      <p className="text-5xl">🌙</p>
      <h1 className="text-3xl font-semibold">That page is not on the path.</h1>
      <p className="text-muted-foreground">
        The AZ-900 trail is sixteen lessons, flashcards, cheat sheets, and a practice exam.
      </p>
      <Link href="/" className="inline-block text-primary hover:underline">
        Back to Night School
      </Link>
    </div>
  );
}
