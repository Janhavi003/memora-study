# Database Schema (Phase 3)

Memora now uses a local SQLite database through Prisma. Models: `Deck`, `Card`, `Review`, `StudySession`, `QuizAttempt`, `Preference`, and `GenerationRecord`. Deck deletion cascades to cards/reviews/sessions; card deletion cascades to its reviews. Card options are JSON-encoded in a SQLite text column for broad SQLite compatibility.

## First run

1. Copy `.env.example` to `.env`.
2. Run `npm install` (the postinstall script generates Prisma Client).
3. Run `npm run db:migrate` to create the local database and migration.
4. Run `npm run db:seed` to add the demo decks. Seeding skips if the database already contains decks.

The SQLite file is local and excluded from Git. API routes now use Prisma persistence. The frontend pages still use their existing mock service in this phase; wiring client pages to the API is a later integration step.
