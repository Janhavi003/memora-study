# Memora corrected source release

## Included fixes

- The landing page remains the default route at `/`. The dashboard is available at `/dashboard` from the landing page action.
- The deck collection API is separate from the dynamic deck API, so the collection route does not expect an `id` route parameter.
- Deck listing, the dashboard, review queue, deck details, study sessions, and quiz prompts load saved deck data from the local API instead of relying on the old sample deck store.
- Study ratings are submitted to the local review API and update the saved spaced-repetition schedule.
- Note generation remains local heuristic processing. No cloud AI provider is called.
- Indigo and Cream design tokens, light and dark themes, subtle transitions, entrance motion, hover feedback, and reduced-motion support are included.
- The source ZIP omits `package-lock.json` because the prior lockfile was out of sync with `package.json`. Run `npm install` to generate a fresh lockfile for your machine.
- The migration directory uses `20261018094037_init` to match the existing project migration history described in the setup notes.

## Verification

TypeScript type checking and ESLint passed in the build workspace. Full Prisma validation and production build could not be completed in this environment because the required Prisma and Next.js native binaries could not be downloaded. Run the complete checks on your Windows machine after `npm install`, and do not accept any database reset prompt if you need to keep existing data.
