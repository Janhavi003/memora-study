# Memora

**Turn notes into knowledge.**

Phase 1 delivers the responsive frontend with mock services. It does not yet include a real API, SQLite database, durable persistence, or the full generation engine.

## Features
- Editorial ivory, forest-green, charcoal, and sage visual system.
- Responsive navigation and light/dark theme toggle.
- Landing page and demo.
- Dashboard with clearly labeled sample metrics.
- Deck library: search, subject filters, create, rename, duplicate, delete.
- Deck details and card list.
- Note-to-deck studio: paste/import `.txt`, `.md`, `.csv`; edit candidates; approve/remove; mock save-to-deck.
- Focus study room: flip cards, keyboard shortcuts, navigation, self-assessment, completion summary.
- Quiz mode, review queue, statistics, settings.
- Vitest coverage for generation preview and mock-service operations.

## Stack
Next.js App Router, React, TypeScript, Tailwind CSS, Lucide, Zod, next-themes, Vitest, Testing Library.

## Run
Requires Node.js LTS and npm.
```bash
npm install
npm run dev
```
Open the URL printed in the terminal.

## Checks
```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Scope and limitations
Mock data is not durable and resets when the app reloads. The note studio uses a simple local preview heuristic, not an LLM and not the final generation engine. There is no cloud AI integration. Dashboard metrics are sample data. No API or database exists in this phase. The original Phase 0 documentation is retained and updated to identify this phase's boundaries.
