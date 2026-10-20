# Memora

## About the Project

Memora is a local-first study workspace designed to help learners turn notes into flashcards, organize study decks, practice active recall, and build consistent review habits. It combines a calm Indigo and Cream interface with local SQLite persistence, so study content can be managed without depending on a cloud AI service.

## Live Demo

**Live demo:** 

## Features

- Landing page as the default entry point, with the dashboard available separately.
- Create, browse, search, rename, duplicate, and delete study decks.
- Turn pasted notes into editable flashcard suggestions using local heuristic processing.
- Review generated card suggestions and approve the cards you want to keep.
- Study flashcards one at a time by revealing answers and recording self-assessments.
- Practice with multiple-choice quizzes.
- Save decks, cards, and review activity locally with SQLite and Prisma.
- Use spaced-repetition scheduling to support future reviews.
- Track study statistics and manage preferences.
- Switch between light and dark themes.
- Responsive layouts, smooth transitions, subtle animations, accessible focus states, and reduced-motion support.
- No cloud AI provider or paid AI API key required for the local generation preview.

## Technologies Used

- **Next.js 15** with the App Router
- **React 19** and **TypeScript**
- **Tailwind CSS** for styling
- **Prisma ORM** with **SQLite** for local persistence
- **Vitest** and Testing Library for tests
- **Zod** for request validation
- **Lucide React** for icons
- **next-themes** for theme handling

## What I Learned

- Structuring a full-stack application with Next.js App Router pages and API routes.
- Designing typed request validation and separating server-side data access from UI components.
- Modeling decks, flashcards, reviews, and study activity with Prisma and SQLite.
- Working with database migrations while protecting existing local data.
- Building active-recall and spaced-repetition study workflows.
- Creating reusable UI components, theme tokens, responsive layouts, and accessible interaction states.
- Writing automated tests and using type checking, linting, and production builds to catch regressions.
- Handling local-first functionality without relying on a hosted AI service.

## Future Enhancements

- Deploy a public demo with secure production configuration.
- Add account-based authentication and optional encrypted synchronization across devices.
- Support importing notes and documents from more file formats.
- Improve local card generation with configurable extraction rules and better duplicate detection.
- Add richer study analytics, learning streaks, and configurable review goals.
- Add keyboard shortcuts and more accessibility testing.
- Expand quiz types and provide explanations for answers.
- Add end-to-end tests for the complete deck creation and study workflows.
