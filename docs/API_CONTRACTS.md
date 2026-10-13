# API Contracts — Phase 2

All JSON success responses use `{ "data": ... }`. Errors use `{ "error": { "code": string, "message": string, "details"?: unknown } }`.

## Decks

- `GET /api/decks` — returns the current deck list.
- `POST /api/decks` — body `{ name, description?, subject? }`; creates a deck (201).
- `GET /api/decks/:id` — returns one deck; 404 if missing.
- `PATCH /api/decks/:id` — body may contain `name`, `description`, and/or `subject`; empty patches are rejected.
- `DELETE /api/decks/:id` — deletes the deck and its in-memory review history.

## Cards

- `GET /api/decks/:id/cards` — lists cards in a deck.
- `POST /api/decks/:id/cards` — body `{ type?, question, answer, options? }`; creates a due card (201).
- `PATCH /api/decks/:id/cards/:cardId` — updates `question`, `answer`, `type`, and/or `options`.
- `DELETE /api/decks/:id/cards/:cardId` — deletes a card.

## Generation, reviews, search, statistics

- `POST /api/generation` — body `{ text, maxCards?, types? }`; validates notes (35–50,000 characters) and returns the existing heuristic preview. It does not save cards automatically.
- `POST /api/reviews` — body `{ deckId, cardId, rating, reviewedAt? }`; records `AGAIN | HARD | GOOD | EASY`, then updates the card's due flag. Scheduling intervals are deferred to Phase 4.
- `GET /api/search?q=...` — searches deck metadata and card question/answer text.
- `GET /api/statistics` — returns counts derived from the current in-memory data and review history. Accuracy is the percentage of review ratings marked `GOOD` or `EASY`; it is `null` when there are no reviews.

## Validation and errors

Zod validates request bodies and query parameters. Invalid JSON returns `400 INVALID_JSON`; invalid fields return `400 VALIDATION_ERROR`; missing resources return `404 NOT_FOUND`. Request limits are enforced on note length, card text, names, and collection sizes. Unexpected failures return a generic `500 INTERNAL_ERROR` without leaking internals.

## Current limitation

This phase intentionally uses a server-process in-memory store seeded from demo data. Mutations can disappear on restart and may not be shared across multiple server instances. SQLite/Prisma persistence is Phase 3. The frontend still uses its own mock service; wiring it to these endpoints is part of integration work, not claimed complete here.
