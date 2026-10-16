# Local Generation Engine

Phase 4 introduces a deterministic, local heuristic generator; it does not call a paid cloud AI service. `src/lib/generation-engine.ts` supports question/answer, definition, cloze, and multiple-choice candidate generation, normalized duplicate detection, and review flags. The generation endpoint returns candidates for review; it does not silently save them to a deck.

## Quality expectations
- Treat generated cards as drafts and review them before saving.
- Exact normalized question/answer duplicates are flagged against existing cards and within the current batch.
- Multiple-choice distractors are heuristic placeholders derived from other terms in the notes. Verify that only one option is correct.
- Text parsing is English-oriented and rule-based; ambiguous notes may produce low-quality cards.

## Spaced repetition
`src/lib/spaced-repetition.ts` provides an SM-2-inspired scheduling helper with AGAIN/HARD/GOOD/EASY ratings. The current persisted Review API still records ratings and updates the `due` flag; adding persistent interval/ease fields requires a Prisma schema migration and is intentionally left for a follow-up database migration rather than modifying an existing database silently.

## API
`POST /api/generation` accepts `{ text, maxCards?, types? }` and returns `candidates`, `warning`, `duplicateCount`, and `engine`.
