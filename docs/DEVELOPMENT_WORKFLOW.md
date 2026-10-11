# Development Workflow

## Branch plan

Keep `main` stable. Implement one phase at a time and keep every phase ZIP as a complete snapshot.

| Phase | Branch | Scope |
|---|---|---|
| 0 | `docs/project-spec` | Product, architecture, design, API and workflow documentation |
| 1 | `feature/frontend` | Full responsive frontend with realistic mock services |
| 2 | `feature/backend` | Route handlers, validation, services, API tests |
| 3 | `feature/database` | Prisma, SQLite, migrations, seed, persistence |
| 4 | `feature/generation-engine` | Generator, quiz logic, scheduler, statistics algorithms |
| 5 | `feature/integration-testing` | Real integration, regression tests, release validation |

The dependency order may be adjusted if necessary, but keep frontend-first development as the default and document deviations.

## Initial Git setup

```bash
git init
git branch -M main
git switch -c docs/project-spec
git status
```

After creating a GitHub repository named `memora-study`, connect it using the URL copied from GitHub:

```bash
git remote add origin <MY_GITHUB_REPO_URL>
git add README.md docs .gitignore package.json
git diff --cached
git commit -m "docs: define Memora product foundation"
git push -u origin docs/project-spec
```

Do not use a guessed remote URL. If `origin` already exists, inspect it with `git remote -v` rather than adding a duplicate.

## Phase-to-phase routine

1. Start from the last validated project snapshot.
2. Switch to the intended feature branch.
3. Review `git status` before editing.
4. Make focused changes and tests.
5. Run the scripts that actually exist in `package.json`.
6. Inspect `git diff` and `git diff --cached`.
7. Confirm `.env`, API keys, local SQLite data, `node_modules`, `.next`, and temporary artifacts are excluded.
8. Commit and push the feature branch.
9. Merge into `main` only after review and checks.
10. Create a ZIP from the complete project state, excluding dependencies, build output, secrets, and unnecessary caches.

## Merge after validation

```bash
git switch main
git pull --ff-only origin main
git merge --no-ff docs/project-spec
git push origin main
```

Repeat with the relevant feature branch after its acceptance checks pass. Resolve conflicts deliberately; do not blindly overwrite files.

## Commands

Phase 0 is documentation-only and does not yet define a runnable Next.js app. Once scripts are implemented, intended commands are:

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

Prisma commands will be added when the schema and scripts exist, likely including client generation, migrations, and seed execution. Always inspect `package.json` and follow the exact scripts committed for that phase.

## Windows notes

Use PowerShell or the VS Code integrated terminal. Git and npm commands above work in current Windows environments with Node.js and Git installed. Replace placeholder repository URL with the exact URL copied from GitHub.

## Secret hygiene

Before every commit:
- Run `git status --short`.
- Check staged files with `git diff --cached --name-only`.
- Ensure `.env*` (except a deliberately safe `.env.example`), database files, credentials, and tokens are ignored.
- Never commit `node_modules/`, `.next/`, coverage output, or build artifacts.
