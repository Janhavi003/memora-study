
import type { Rating } from "./types";

export type ReviewState = {
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
};

export type ReviewSchedule = ReviewState & {
  dueAt: Date;
  due: boolean;
};

/** A small SM-2-inspired scheduler. AGAIN resets progress; HARD, GOOD and EASY increase intervals. */
export function scheduleReview(
  state: ReviewState,
  rating: Rating,
  reviewedAt = new Date(),
): ReviewSchedule {
  let repetitions = Math.max(0, state.repetitions);
  let intervalDays = Math.max(0, state.intervalDays);
  let easeFactor = Math.min(
    3.5,
    Math.max(1.3, state.easeFactor || 2.5),
  );

  if (rating === "AGAIN") {
    repetitions = 0;
    intervalDays = 0;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else {
    repetitions += 1;

    if (rating === "HARD") {
      intervalDays =
        repetitions <= 1
          ? 1
          : Math.max(1, Math.round(Math.max(1, intervalDays) * 1.2));

      easeFactor = Math.max(1.3, easeFactor - 0.15);
    } else if (rating === "GOOD") {
      intervalDays =
        repetitions === 1
          ? 1
          : repetitions === 2
            ? 3
            : Math.max(
                1,
                Math.round(Math.max(1, intervalDays) * easeFactor),
              );
    } else {
      intervalDays =
        repetitions === 1
          ? 2
          : repetitions === 2
            ? 5
            : Math.max(
                2,
                Math.ceil(
                  Math.max(1, intervalDays) * (easeFactor + 0.3),
                ),
              );

      easeFactor = Math.min(3.5, easeFactor + 0.15);
    }
  }

  const dueAt = new Date(reviewedAt);
  dueAt.setDate(dueAt.getDate() + intervalDays);

  return {
    repetitions,
    intervalDays,
    easeFactor,
    dueAt,
    due: rating === "AGAIN" || rating === "HARD",
  };
}
