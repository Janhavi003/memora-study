# Memora

**Turn notes into knowledge.** Memora is an open-source, local-first study workspace for turning notes into flashcards and quizzes, organizing decks, and reviewing concepts.

## Phase 2 — Backend foundation

This phase adds a typed JSON API using Next.js Route Handlers, Zod request validation, consistent error responses, server-side demo storage, a generation-preview endpoint, search, reviews, and calculated summary statistics. The frontend remains available and still uses its Phase 1 mock service; wiring the UI to the API is reserved for the integration phase.

## Technology

- Next.js App Router and React
- TypeScript
- Zod request validation
- Vitest
- Local heuristic generation preview (no cloud LLM or paid API key)

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality commands

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## API quick reference

| Method | Route | Purpose |
|---|---|---|
| GET, POST | `/api/decks` | List/create decks |
| GET, PATCH, DELETE | `/api/decks/:id` | Read/update/delete a deck |
| GET, POST | `/api/decks/:id/cards` | List/create cards |
| PATCH, DELETE | `/api/decks/:id/cards/:cardId` | Update/delete a card |
| POST | `/api/generation` | Validate notes and return heuristic card candidates |
| POST | `/api/reviews` | Record a self-rated review |
| GET | `/api/search?q=...` | Search decks and cards |
| GET | `/api/statistics` | Get counts derived from in-memory data |

Full request shapes and error codes are in [`docs/API_CONTRACTS.md`](docs/API_CONTRACTS.md).

## Important data limitation

The API uses a server-process in-memory store seeded with demo data. Changes may be lost on restart; this is not durable persistence and is not a multi-user deployment design. SQLite and Prisma are planned for Phase 3. The API is not yet connected to the frontend's mock service. The generation endpoint uses lightweight local heuristics, not an LLM, and generated candidates should be reviewed before use.

## Privacy

No study notes are sent to a cloud AI provider by these endpoints. Do not expose this unauthenticated local API directly to the public internet.

## Roadmap

- Phase 3: SQLite/Prisma schema, migrations, seed data, durable repositories.
- Phase 4: generation, quiz, duplicate detection, and spaced-repetition algorithms.
- Phase 5: connect UI to API, end-to-end validation, and release packaging.
