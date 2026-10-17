import { describe, expect, it } from "vitest";
import { scheduleReview } from "./spaced-repetition";

describe("spaced repetition scheduler", () => {
  const start = new Date("2026-01-01T12:00:00.000Z");
  it("resets interval on AGAIN", () => {
    const result = scheduleReview({ repetitions: 4, intervalDays: 12, easeFactor: 2.5 }, "AGAIN", start);
    expect(result.repetitions).toBe(0);
    expect(result.intervalDays).toBe(0);
    expect(result.due).toBe(true);
  });
  it("increases the interval for GOOD and EASY", () => {
    const state = { repetitions: 2, intervalDays: 3, easeFactor: 2.5 };
    expect(scheduleReview(state, "GOOD", start).intervalDays).toBeGreaterThan(3);
    expect(scheduleReview(state, "EASY", start).intervalDays).toBeGreaterThan(scheduleReview(state, "GOOD", start).intervalDays);
  });
  it("returns a due date based on the interval", () => {
    const result = scheduleReview({ repetitions: 0, intervalDays: 0, easeFactor: 2.5 }, "GOOD", start);
    expect(result.dueAt.toISOString()).toBe("2026-01-02T12:00:00.000Z");
  });
});
