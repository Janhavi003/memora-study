# Architecture — Phase 1

- `src/app`: App Router pages and global styles.
- `src/components`: shell and reusable domain UI.
- `src/lib/mock-data.ts`: explicitly demo-only data.
- `src/lib/mock-service.ts`: in-memory deck/card operations.
- `src/lib/generator-preview.ts`: minimal frontend-only preview heuristic.

UI uses a service layer so a future phase can replace the mock adapter with API calls. No Route Handlers, Prisma, SQLite, scheduler, or full generator are included.