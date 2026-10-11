# Memora — Product Specification

## 1. Summary

Memora is a local-first learning workspace that transforms study notes into editable flashcards and quizzes, supports scheduled review, and reports progress from real stored activity.

**Tagline:** Turn notes into knowledge.  
**Repository:** `memora-study`

## 2. Goals

1. Make note-to-card creation faster without requiring a paid AI API.
2. Make study sessions focused, accessible, and keyboard-friendly.
3. Support a complete loop: capture → generate → edit → organize → study → review → measure.
4. Persist content locally and document privacy boundaries honestly.
5. Provide a maintainable, tested portfolio-quality codebase.

## 3. Non-goals for the initial release

- Cloud accounts, shared decks, collaboration, or hosted multi-tenant service.
- Dependence on a paid cloud LLM.
- Claiming generated cards are pedagogically perfect.
- Executing uploaded documents or macros.
- PDF import unless added and tested in a later implementation phase.

## 4. Personas and core jobs

- **Student:** turn lecture notes into a useful deck and revise before an exam.
- **Self-directed learner:** organize concepts into decks and keep a review habit.
- **Portfolio reviewer:** inspect clear architecture, meaningful tests, documentation, accessibility, and realistic limitations.

## 5. Core workflows

### Note-to-deck
1. Paste notes or select a supported text file (`.txt`, `.md`, `.csv`).
2. Select a target deck/subject or create a deck.
3. Choose a card count and supported card types.
4. Run the local text-processing engine.
5. Inspect candidates, including duplicate/quality indicators.
6. Edit or delete candidates and approve the remaining cards.
7. Save approved cards into a deck.

If input is empty, too short, or lacks extractable statements, show a helpful explanation and do not fabricate content.

### Study
1. Select a deck or due-review queue.
2. See one card at a time.
3. Reveal the answer and self-assess.
4. Navigate with controls or supported keyboard shortcuts.
5. Persist review outcomes and scheduler updates.
6. Show a summary based on recorded activity.

### Quiz
1. Generate questions from saved cards.
2. Choose among viable multiple-choice, true/false, and short-answer formats.
3. Do not reveal answers before submission.
4. Score against known card data and show explanations only when available.
5. Allow retry of incorrect answers.

### Deck management
Create, rename, describe, categorize, search, filter, duplicate, and delete decks. Show actual card and due counts, plus last-studied timestamps when known. Destructive actions require confirmation.

## 6. Functional requirements

- **FR-01:** Create, list, read, update, duplicate, and delete decks.
- **FR-02:** Create, list, update, and delete cards.
- **FR-03:** Generate local candidate cards from supplied text.
- **FR-04:** Support Q&A, definition, cloze, and multiple-choice card formats.
- **FR-05:** Detect exact/normalized duplicates and flag likely duplicates.
- **FR-06:** Validate generation settings and imported file type/size.
- **FR-07:** Run study sessions with reveal, navigation, progress, and self-assessment.
- **FR-08:** Persist review events and calculate next review dates.
- **FR-09:** Generate quizzes from saved cards with non-identical distractors.
- **FR-10:** Calculate statistics from stored records, never client-supplied totals.
- **FR-11:** Search decks and cards.
- **FR-12:** Provide preferences including theme and daily goal.
- **FR-13:** Provide responsive, accessible UI states and keyboard support.
- **FR-14:** Keep core workflows usable without an external AI key or service.

## 7. Quality requirements

- TypeScript strictness where practical; modular services and validated API boundaries.
- Keyboard navigation, visible focus, semantic labels, and accessible contrast.
- Input size limits and validation for file uploads and API payloads.
- Clear empty, loading, error, and success states.
- Tests for algorithms, validation, persistence, and critical UI interactions.
- Reproducible setup through documented commands and lockfile.
- No secrets, local database files, build output, or dependencies committed.

## 8. Metrics and definitions

- **Total decks/cards:** current persisted records.
- **Cards reviewed:** count of recorded review events, with UI clarifying whether this is lifetime or period-specific.
- **Accuracy:** successful graded responses divided by all graded responses in the stated period; ungraded events are excluded.
- **Streak:** consecutive calendar days with at least one persisted study/review event, evaluated in the configured local timezone. The precise timezone policy must be implemented and tested.
- **Due cards:** cards whose next-review timestamp is at or before the current time, plus never-reviewed cards when the selected queue includes new cards.
- **Daily goal:** user preference compared with the number of review events recorded today.

## 9. Acceptance criteria

- App starts locally without a cloud AI key.
- Users can generate, edit, save, and study cards.
- Deck and card changes survive application restarts.
- Quiz answers are not revealed before submission.
- Scheduler and statistics use persisted records.
- Unsupported/empty inputs produce understandable messages.
- Uploaded files are validated and never executed.
- Tests and production build are run and reported truthfully.
- Documentation describes actual implementation, not aspirational features as completed.
