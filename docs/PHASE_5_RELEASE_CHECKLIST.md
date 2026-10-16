# Phase 5 — Integration and Release Checklist

This phase is a release-hardening pass over the Phase 4 codebase. Run the checks locally before considering the release complete.

## Environment and database
- [ ] Confirm `.env` points to the intended local SQLite file.
- [ ] Run `npm run db:generate`.
- [ ] Run `npx prisma migrate status`.
- [ ] Run `npx prisma validate`.
- [ ] Confirm `.env`, `dev.db`, and backups are ignored by Git.

## Quality gates
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`

## Manual smoke tests
- [ ] Start with `npm run dev` and open `http://localhost:3000`.
- [ ] Create a deck and confirm it remains after restarting the server.
- [ ] Create a card, reload the deck, and confirm it persists.
- [ ] Submit notes to `/api/generation`; inspect candidates and duplicate flags.
- [ ] Review a card and confirm a review record and deck last-studied timestamp are stored.
- [ ] Verify API validation errors are readable and malformed requests do not crash the app.
- [ ] Check the browser console and terminal for runtime errors.

## Important current limitations
- The Create page still uses `mockService` and the browser preview generator; it is not yet wired to the Prisma-backed generation and save APIs.
- The Prisma review handler currently records a review and sets the card's `due` boolean, but does not persist the full `scheduleReview` interval/ease/repetition state.
- Generation is a local heuristic, not an LLM; candidates should be reviewed before use.

Do not mark Phase 5 fully complete until the integration limitations above are resolved and the smoke tests pass.
