# Memora Study: Windows setup

## Requirements
- Node.js 20 or newer
- npm included with Node.js

## First run
Run PowerShell in the extracted project folder, the folder containing `package.json`.

```powershell
node --version
npm --version
Copy-Item .env.example .env
npm install
npx prisma validate
npm run db:migrate
npm run typecheck
npm run test
npm run build
npm run dev
```

If `.env` already exists, do not overwrite it. Confirm it contains:

```dotenv
DATABASE_URL="file:./dev.db"
```

Prisma resolves this relative SQLite URL from the Prisma schema location. The migration command creates the local database and the initial migration. Do not run `prisma migrate reset` for normal setup.

After `npm run dev`, open http://localhost:3000.

## Later runs
```powershell
cd E:\Projects\memora-study-corrected
npm run dev
```

If you extracted the ZIP into a different folder, change the `cd` path accordingly.

## Notes
- This package intentionally omits `package-lock.json` because the lockfile in the earlier release did not match `package.json`. `npm install` creates a fresh matching lockfile. Once generated, keep that lockfile with the project.
- Do not copy `node_modules` from another project.
- Keep `.env` and your SQLite database private. Do not commit them.
- If the build fails, copy the complete error output before changing database files or migrations.
