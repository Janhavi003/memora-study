import { afterEach, describe, expect, it } from "vitest";
import { memoryStore } from "./memory-store";

afterEach(() => memoryStore.resetForTests());

describe("memoryStore", () => {
  it("creates, updates, and deletes decks", () => {
    const created = memoryStore.createDeck({ name: "Test deck", description: "Notes", subject: "Science" });
    expect(memoryStore.getDeck(created.id)?.name).toBe("Test deck");
    expect(memoryStore.updateDeck(created.id, { name: "Renamed" })?.name).toBe("Renamed");
    expect(memoryStore.deleteDeck(created.id)).toBe(true);
    expect(memoryStore.getDeck(created.id)).toBeUndefined();
  });

  it("creates, updates, deletes, and searches cards", () => {
    const deck = memoryStore.createDeck({ name: "API test", description: "", subject: "General" });
    const card = memoryStore.createCard(deck.id, { type: "QUESTION_ANSWER", question: "What is a cell?", answer: "The basic unit of life." });
    expect(card).toBeDefined();
    expect(memoryStore.search("basic unit").some((item) => item.kind === "card" && item.cardId === card?.id)).toBe(true);
    expect(memoryStore.updateCard(deck.id, card!.id, { answer: "A living unit." })?.answer).toBe("A living unit.");
    expect(memoryStore.deleteCard(deck.id, card!.id)).toBe(true);
  });

  it("records review outcomes and derives statistics from review history", () => {
    const deck = memoryStore.listDecks()[0];
    const card = deck.cards[0];
    const before = memoryStore.statistics();
    const review = memoryStore.addReview({ deckId: deck.id, cardId: card.id, rating: "GOOD", reviewedAt: new Date().toISOString() });
    expect(review).toBeDefined();
    const after = memoryStore.statistics();
    expect(after.totalReviews).toBe(before.totalReviews + 1);
    expect(after.accuracy).not.toBeNull();
  });
});
