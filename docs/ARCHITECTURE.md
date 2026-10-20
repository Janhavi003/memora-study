# Architecture - Phase 2

Memora remains a Next.js App Router application. API Route Handlers provide the HTTP boundary, Zod schemas define input contracts, a small response layer standardizes success/error envelopes, and `memoryStore` owns server-side demo data operations. The generation endpoint calls the existing local heuristic preview service; it does not call a cloud model.

```text
HTTP request
  -> App Router route handler
  -> Zod schema / parseBody
  -> memoryStore or local preview service
  -> { data } or { error: { code, message, details? } }
```

The store is intentionally replaceable by a repository backed by SQLite/Prisma in Phase 3. No database, cloud API, or API key is required for this phase. The browser frontend continues using the Phase 1 mock service until the integration phase.

## Route map

- `/api/decks` and `/api/decks/:id`
- `/api/decks/:id/cards` and `/api/decks/:id/cards/:cardId`
- `/api/generation`
- `/api/reviews`
- `/api/search`
- `/api/statistics`

## Limitations

The current store is process memory only. It is suitable for contract development and local demos, not durable storage or multi-user production. Review ratings toggle the due flag only; a proper spaced-repetition interval algorithm belongs to Phase 4. Authentication and authorization are intentionally absent for this single-user local-first project.

## Persistence (Phase 3)
API handlers use `src/lib/server/prisma-store.ts`, backed by the singleton Prisma client and SQLite. The in-memory store remains only as a Phase 2 reference/test fixture.
