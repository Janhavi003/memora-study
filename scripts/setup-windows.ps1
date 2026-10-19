$ErrorActionPreference = 'Stop'

if (-not (Test-Path 'package.json')) {
  throw 'Run this script from the Memora project root, where package.json is located.'
}

if (-not (Test-Path '.env')) {
  Copy-Item '.env.example' '.env'
  Write-Host 'Created .env from .env.example.'
} else {
  Write-Host 'Keeping existing .env unchanged.'
}

Write-Host 'Installing project dependencies...'
npm install
if ($LASTEXITCODE -ne 0) { throw 'npm install failed. Fix the reported dependency error before continuing.' }

Write-Host 'Validating Prisma configuration...'
npx prisma validate
if ($LASTEXITCODE -ne 0) { throw 'Prisma validation failed. Check DATABASE_URL in .env.' }

Write-Host 'Generating Prisma Client...'
npm run db:generate
if ($LASTEXITCODE -ne 0) { throw 'Prisma Client generation failed.' }

Write-Host 'Applying existing migrations without resetting the database...'
npm run db:migrate
if ($LASTEXITCODE -ne 0) {
  Write-Warning 'Migration deployment failed. Do not reset the database. Back it up and review the migration output.'
  exit $LASTEXITCODE
}

Write-Host 'Setup finished. Run npm run dev to open the landing page at http://localhost:3000.'
