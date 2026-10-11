# Memora

**Turn notes into knowledge.**

Memora is an open-source, local-first study workspace for turning notes into editable flashcards and quizzes, reviewing cards with spaced repetition, and tracking study progress—without requiring a paid cloud AI API.

> **Phase 0 status:** Documentation and project foundation only. The application UI, API, database, and generation engine are not implemented yet.

## Product goals

- Turn pasted notes and supported text files into editable study cards using local text-processing algorithms.
- Organize cards into decks and subjects.
- Study in a distraction-free flashcard room and take quizzes.
- Schedule reviews using an SM-2-inspired scheduler.
- Calculate progress from persisted application records.
- Keep study content on the user's local installation by default.

## Planned features

- Dashboard, deck library, deck details, note-to-deck studio, study room, quiz mode, review queue, statistics, and settings.
- Question/answer, definition, fill-in-the-blank, and multiple-choice cards.
- `.txt`, `.md`, and `.csv` import initially; no uploaded file is executed.
- Light/dark themes, responsive layouts, accessible keyboard interactions, and useful empty/error/loading states.
- SQLite persistence through Prisma for a single-user local installation.

## Technology stack

- Next.js App Router, React, TypeScript
- Tailwind CSS, shadcn/ui conventions, Lucide icons
- Zod validation; React Hook Form where it adds value
- Next.js Route Handlers and modular TypeScript services
- SQLite and Prisma ORM
- Vitest and React Testing Library
- npm, ESLint, Prettier, Git

Exact package versions will be selected and locked in the frontend implementation phase after checking current compatibility. No dependencies or scripts are claimed as implemented in this phase.

## Local generation, not cloud AI

The initial engine is planned to use deterministic local algorithms: preprocessing, sentence segmentation, stop-word filtering, key-phrase extraction, sentence ranking, pattern-based definition extraction, template-generated questions, cloze deletion, distractor selection, and duplicate/quality checks. This is **not an LLM** and will not guarantee high-quality cards. Users will be able to edit or discard generated results. An optional local-model provider may be added later without making it a core dependency.

## Documentation

- [Product specification](docs/PRODUCT_SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [API contracts](docs/API_CONTRACTS.md)
- [Database schema proposal](docs/DATABASE_SCHEMA.md)
- [Generation engine](docs/GENERATION_ENGINE.md)
- [Spaced repetition](docs/SPACED_REPETITION.md)
- [Development workflow](docs/DEVELOPMENT_WORKFLOW.md)

## Planned local setup

The project is in the documentation phase, so there is no runnable application yet. After implementation begins, the intended commands are:

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

These commands are targets, not executable scripts in Phase 0. See the development workflow for the phase plan.

## Privacy and storage

The intended core experience stores study content in a local SQLite database and processes imports locally. No external AI service is required. SQLite is appropriate for a single-user local installation; this architecture is not automatically a secure multi-user hosted deployment. Backups, local filesystem permissions, and device security remain the user's responsibility.

## Limitations and future work

The first generator will rely on heuristics and templates, so it may miss context, generate awkward prompts, or fail on notes without recognizable facts. PDF extraction, optional local language-model support, export/backup tooling, and broader deployment hardening are future candidates.

## Screenshots

Screenshots will be added after the frontend phase.

## License

No license has been selected yet. Before publishing the repository, choose a license (for example, MIT) and add the corresponding `LICENSE` file. Do not imply the project is licensed until that file is present.
