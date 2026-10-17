# Phase 5 Integration and Release Checklist

## Apply database changes

After installing dependencies, run `npx prisma migrate dev --name phase5_review_schedule` and `npm run db:generate`. This adds persistent repetition count, interval, ease factor, and due date fields to cards.

## Functional smoke tests

- [ ] Create a deck using the database-backed API.
- [ ] Open Create, paste notes with several complete sentences, and generate candidates.
- [ ] Exclude a candidate and confirm it is not saved.
- [ ] Save approved candidates and confirm they appear after a browser refresh.
- [ ] Generate similar notes and confirm duplicates are flagged against saved cards.
- [ ] Submit AGAIN, HARD, GOOD, and EASY ratings; confirm review history and the card schedule are persisted.
- [ ] Restart the development server and confirm decks/cards remain available.

## Automated checks

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`

## Notes

The local generator is heuristic-based. Review candidate wording and multiple-choice options before saving. No paid cloud AI service is used.
