# Spaced Repetition

## Approach

Implement an SM-2-inspired scheduler with four user ratings: `AGAIN`, `HARD`, `GOOD`, and `EASY`. This is an application-specific adaptation, not a claim of exact compatibility with another study product.

## Proposed initial rules

- New card defaults: repetition `0`, ease factor `2.5`, interval `0` days, no last review, due immediately.
- `AGAIN`: reset repetition to `0`, set a short relearning interval (initial proposal: 1 day), and lower ease factor within a defined minimum.
- `HARD`: advance conservatively; use a small interval increase and reduce ease factor slightly.
- `GOOD`: first successful review schedules 1 day; second schedules 6 days; later intervals multiply prior interval by ease factor.
- `EASY`: schedule a longer interval than `GOOD` and increase ease factor modestly.
- Clamp ease factor to a documented minimum (proposed `1.3`) and validate all stored state before calculation.
- Use date arithmetic that is deterministic and testable; inject the clock in tests.

These parameters are initial design decisions and should be validated through tests and usability feedback before release.

## Date and edge-case policy

- Persist timestamps consistently in UTC.
- Define whether intervals are calendar days or fixed 24-hour periods; initial implementation should use calendar-day addition in UTC to avoid daylight-saving ambiguity.
- Reject unknown ratings, negative intervals, non-finite ease factors, and malformed dates.
- Failed reviews must not create negative or zero invalid state.
- New cards should be eligible for study even without a prior `nextReviewAt`.
- Repeated reviews on the same day should each be recorded, even if the next due date remains the same calendar day.
- Keep a review history snapshot so scheduling behavior can be audited.

## Required tests

- Each rating from a new card.
- Each rating after one and several successful reviews.
- Ease-factor minimum.
- Date boundary/month/year rollover.
- Leap day.
- Invalid state and rating.
- UTC consistency and deterministic injected clock.
- Failed review followed by successful relearning.

## Limitations

A simplified scheduler is a learning aid, not medical or scientific advice. The chosen rules will need product testing and clear documentation of the exact implementation.
