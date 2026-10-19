# Memora Study: Windows setup

## Requirements
- Node.js 20 or newer
- npm included with Node.js

## First run

Extract this ZIP into a new project folder, then open PowerShell in the folder that contains `package.json`.

```powershell
node --version
npm --version
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm install
npx prisma validate
npm run db:generate
npx prisma migrate status
```

The default `.env.example` uses a local SQLite database:

```dotenv
DATABASE_URL="file:./dev.db"
```

Prisma resolves this path relative to `prisma/schema.prisma`, so the database file is stored under `prisma`. Keep your own `.env` and database file private. The setup commands above do not delete or reset your database.

To create a missing local SQLite database and apply the existing migration history, run:

```powershell
npm run db:migrate
npx prisma migrate status
```

If Prisma reports drift, asks to reset the database, or says an existing migration is missing, stop and back up your database before proceeding. Do not run `prisma migrate reset` to fix a setup error.

## Verify and run

```powershell
npm run typecheck
npm run test
npm run build
npm run dev
```

Open http://localhost:3000. The root route `/` is the Memora landing page. Use its **Start studying** button to open `/dashboard`. The dashboard is not the default route.

## Later runs

```powershell
cd E:\Projects\memora-study
npm run dev
```

Change the folder path if you extracted the ZIP somewhere else.

## Troubleshooting

- This source ZIP intentionally omits `package-lock.json` because the previous lockfile did not match `package.json`. Run `npm install` once to create a fresh matching lockfile on your machine. Keep the newly generated lockfile for later installs.
- Do not copy `node_modules` from another operating system or project.
- If `npm install` fails, keep the full error output and resolve the dependency issue before running the app.
- Preserve your existing `.env`, SQLite database, and migration history when merging these source files into an existing project. The `db:migrate` command uses `prisma migrate deploy`; it applies existing migrations and does not reset the database.
- Do not approve a Prisma reset prompt if you need to preserve data.

## Visual design

The interface uses Deep Indigo `#2C3E8F`, Soft Cream `#F7F5F0`, Warm White `#FFFFFF`, Fresh Green `#2ECC71`, Sunny Amber `#F5A623`, Coral `#FF6B6B`, Ink `#1F2937`, and Slate `#6B7280`. Dark mode uses charcoal surfaces and adjusted text and accent tokens. Subtle entrance effects and hover transitions respect reduced-motion preferences.
