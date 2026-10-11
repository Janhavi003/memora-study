# Architecture

## 1. Principles

- Local-first by default; no external AI API in core flows.
- Thin route handlers, reusable services, explicit validation.
- UI can initially use mock services, then swap to API-backed services without redesign.
- Domain logic should be testable without rendering React or starting Next.js.
- Persist facts and events; derive statistics rather than trusting the client.
- Keep generated output editable and communicate heuristic limitations.

## 2. Proposed stack

Next.js App Router + TypeScript; Tailwind CSS and shadcn/ui conventions; Lucide; Zod; optional React Hook Form; Route Handlers; Prisma + SQLite; Vitest and React Testing Library.

## 3. Proposed source layout

```text
src/
  app/
    (public)/page.tsx
    demo/page.tsx
    (app)/dashboard/page.tsx
    (app)/decks/page.tsx
    (app)/decks/new/page.tsx
    (app)/decks/[id]/page.tsx
    (app)/decks/[id]/study/page.tsx
    (app)/decks/[id]/quiz/page.tsx
    (app)/create/page.tsx
    (app)/review/page.tsx
    (app)/statistics/page.tsx
    (app)/settings/page.tsx
    api/
      decks/route.ts
      decks/[id]/route.ts
      cards/route.ts
      cards/[id]/route.ts
      generation/route.ts
      study-sessions/route.ts
      reviews/route.ts
      quizzes/route.ts
      statistics/route.ts
      search/route.ts
  components/
    ui/
    layout/
    decks/
    cards/
    study/
    quiz/
    forms/
  lib/
    validation/
    errors/
    dates/
  services/
    decks/
    cards/
    generation/
    quizzes/
    scheduling/
    statistics/
    search/
    files/
  repositories/
  types/
prisma/
  schema.prisma
  migrations/
  seed.ts
tests/
  unit/
  integration/
  components/
docs/
```

This is a target structure; adapt to Next.js conventions during implementation and document any deviations.

## 4. Request flow

1. Route Handler parses the request and validates it with Zod.
2. Service enforces domain rules and orchestrates the use case.
3. Repository accesses Prisma/SQLite or, during frontend-only development, the mock adapter.
4. Service returns typed domain results.
5. Route Handler maps results to a consistent JSON response and HTTP status.
6. UI handles success, empty, validation, and server-error states.

## 5. Service boundaries

- **Generation:** preprocess text, extract sentences/phrases, generate candidate cards, score quality, deduplicate.
- **File parsing:** allowlist extension/MIME where meaningful, enforce byte limit, decode text safely; never execute file contents.
- **Deck/card:** CRUD and relationship checks.
- **Study:** create session and persist answer/review events.
- **Scheduling:** pure date calculation based on rating and current card state.
- **Quiz:** construct questions from cards and validate submitted answers server-side.
- **Statistics:** aggregate persisted sessions/reviews and document definitions.
- **Preferences:** persist theme, daily target, and relevant options.

## 6. Provider seam for future local models

Define an internal `CardGenerationProvider` interface around input text, settings, and normalized candidate output. The initial implementation is `HeuristicGenerationProvider`. A future optional local-model adapter can implement the same interface. The default path must not try to call a remote service or require a secret.

## 7. Error contract

Use a stable response shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request could not be validated.",
    "details": []
  }
}
```

Do not expose stack traces, SQL, filesystem paths, or sensitive note content in errors. Expected codes include `VALIDATION_ERROR`, `NOT_FOUND`, `CONFLICT`, `PAYLOAD_TOO_LARGE`, `UNSUPPORTED_FILE_TYPE`, `GENERATION_INSUFFICIENT_CONTENT`, and `INTERNAL_ERROR`.

## 8. Privacy and deployment boundary

SQLite is intended for one local user. Do not imply this is automatically suitable for public multi-user hosting. A hosted deployment would need a different tenancy, authentication, isolation, backup, and security review. Core note processing should stay inside the app process.
