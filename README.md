# AZ-900 Night School

A dark, friendly study site for **Microsoft Azure Fundamentals (AZ-900)**. Lessons are written the way a good tutor talks: big picture first, then easy examples, diagrams, exam traps, and a one-sentence memory trick.

Aligned to the official skills measured as of July 20, 2026:

1. Describe cloud concepts (25–30%)
2. Describe Azure architecture and services (35–40%)
3. Describe Azure management and governance (30–35%)

## Run it locally

```bash
npm install
npm run build
npm start
```

Open [http://localhost:43147](http://localhost:43147).

For a live reload while editing:

```bash
npm run dev
```

Progress, quiz scores, and flashcard history stay in your browser (`localStorage`). Nothing is uploaded.

## Deploy

The site is a static export (`out/` after `npm run build`). Publish that folder to any static host.

```bash
npm run build
npx netlify-cli deploy --allow-anonymous --dir=out --prod --no-build
```

Then open the claim URL the CLI prints and sign in to Netlify so the site stays yours.

## What’s inside

- **16 lessons** covering the full AZ-900 outline
- A **mini quiz** at the end of every lesson
- **90 flashcards**
- A **40-question practice exam** in Microsoft-style wording
- A **cheat-sheet dump** of every memory table

Official Microsoft pages:

- [AZ-900 certification](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/)
- [Study guide / skills measured](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)
