# Database Schema Proposal

SQLite + Prisma is planned for a single-user local installation. This is a proposal, not an applied migration.

## Entities

### Deck
- `id` string primary key
- `name` required, trimmed
- `description` optional
- `subject` optional
- `createdAt`, `updatedAt`
- Relations to cards and study sessions

### Card
- `id`, `deckId` foreign key
- `type`: `QUESTION_ANSWER`, `DEFINITION`, `CLOZE`, `MULTIPLE_CHOICE`
- `question`, `answer` text
- `optionsJson` nullable for multiple-choice options and metadata (or normalized child table if query needs justify it)
- `createdAt`, `updatedAt`
- Scheduling state: `repetition`, `easeFactor`, `intervalDays`, `nextReviewAt`, `lastReviewedAt`
- Indexes on `deckId`, `nextReviewAt`, and potentially `(deckId, type)`

### StudySession
- `id`, optional `deckId`, `mode`, `startedAt`, `completedAt`, `durationSeconds`
- Relations to session answers/reviews
- Index on `startedAt`

### Review
- `id`, `cardId`, optional `sessionId`, `rating`, `reviewedAt`
- Snapshot fields: `previousIntervalDays`, `nextIntervalDays`, `previousEaseFactor`, `nextEaseFactor`, `wasCorrect`
- Indexes on `(cardId, reviewedAt)` and `reviewedAt`

### QuizAttempt
- `id`, `deckId`, `startedAt`, `completedAt`, `score`, `questionCount`
- Store submitted answers and grading details in a related `QuizAnswer` model or validated JSON column. Prefer normalized `QuizQuestion`/`QuizAnswer` tables if queries and review are important.
- Indexes on `deckId`, `startedAt`

### Preference
- Single-user settings record (for example `id = "local"`), theme, dailyGoal, timezone, updatedAt

### GenerationRecord (optional)
- Metadata only: generator version, input character count, candidate count, createdAt. Avoid storing raw source notes unless the user explicitly opts in.

## Relationship and deletion policy

- Deck deletion should be explicit and transactional. Decide whether cards cascade-delete and ensure the UI confirms the effect.
- Card deletion should preserve historical review records only if they remain meaningful; otherwise document cascade behavior. Recommended: keep review history only if card identity can remain referenced, or soft-delete cards if historical integrity is required.
- A deck with historical quiz/session records should not accidentally erase all learning history. Define a transaction and deletion policy before migration.
- SQLite foreign keys must be enabled and tested.

## Prisma design notes

- Use enums only where supported by the selected Prisma/SQLite version; otherwise validate string fields at service boundaries.
- Store timestamps in a consistent UTC representation.
- Use transactions for saving a batch of approved cards, deck duplication, and destructive multi-record operations.
- Add migrations and a deterministic seed script. Seed/demo content must be explicitly identified as demo data.
- Do not commit a user's real local database file.
