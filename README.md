# Memora

**Turn notes into knowledge.** Memora is a local-first study workspace for turning notes into flashcards, reviewing decks, and practicing recall.

## Start here

The default route `/` is the landing page. The dashboard is available at `/dashboard` after clicking **Start studying**. The landing page is intentionally preserved.

## Windows setup

See [SETUP_WINDOWS.md](SETUP_WINDOWS.md) for safe setup instructions, including local SQLite configuration and migration safety.

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm install
npm run db:generate
npx prisma migrate status
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```powershell
npm run typecheck
npm run test
npm run lint
npm run build
```

## Technology

- Next.js App Router and React
- TypeScript and Tailwind CSS
- Prisma with a local SQLite database
- Vitest
- Local heuristic generation preview, without a cloud AI provider or paid AI API key

## Data safety

The source ZIP excludes `.env`, local databases, `node_modules`, and build output. Preserve your own `.env`, SQLite database, and existing migration history. Do not run `prisma migrate reset` as a routine troubleshooting step. If Prisma asks to reset a database containing important data, stop and back it up first.

## UI

Deep Indigo and Soft Cream are the primary colors, supported by Fresh Green, Sunny Amber, and Coral accents. Light and dark themes are supported. Motion is intentionally subtle and respects reduced-motion settings.
