import { describe, expect, it } from "vitest";
import { createCardSchema, createDeckSchema, generationSchema, reviewSchema, updateDeckSchema } from "./api-schemas";

describe("API request schemas", () => {
  it("trims deck names and supplies optional defaults", () => {
    expect(createDeckSchema.parse({ name: "  Biology  " })).toMatchObject({ name: "Biology", description: "", subject: "General" });
  });

  it("rejects blank deck names", () => {
    expect(createDeckSchema.safeParse({ name: "   " }).success).toBe(false);
  });

  it("rejects empty patch objects", () => {
    expect(updateDeckSchema.safeParse({}).success).toBe(false);
  });

  it("requires usable card question and answer", () => {
    expect(createCardSchema.safeParse({ question: " ", answer: "Answer" }).success).toBe(false);
    expect(createCardSchema.safeParse({ question: "Question", answer: "Answer" }).success).toBe(true);
  });

  it("enforces generation text length and limits", () => {
    expect(generationSchema.safeParse({ text: "short" }).success).toBe(false);
    expect(generationSchema.safeParse({ text: "A sufficiently long block of study notes with more than thirty-five characters." }).success).toBe(true);
    expect(generationSchema.safeParse({ text: "A sufficiently long block of study notes with more than thirty-five characters.", maxCards: 100 }).success).toBe(false);
  });

  it("accepts only supported review ratings and ISO dates", () => {
    expect(reviewSchema.safeParse({ deckId: "d", cardId: "c", rating: "GOOD" }).success).toBe(true);
    expect(reviewSchema.safeParse({ deckId: "d", cardId: "c", rating: "PERFECT" }).success).toBe(false);
    expect(reviewSchema.safeParse({ deckId: "d", cardId: "c", rating: "GOOD", reviewedAt: "yesterday" }).success).toBe(false);
  });
});
