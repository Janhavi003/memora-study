import { initialDecks } from "../mock-data";
import type { Deck, Flashcard, Rating } from "../types";
import type { CreateCardInput, CreateDeckInput, UpdateCardInput, UpdateDeckInput } from "../validation/api-schemas";

export type ReviewRecord = { id: string; deckId: string; cardId: string; rating: Rating; reviewedAt: string };

let decks: Deck[] = structuredClone(initialDecks);
let reviews: ReviewRecord[] = [];
let idCounter = 1;
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${idCounter++}`;

export const memoryStore = {
  listDecks(): Deck[] { return structuredClone(decks); },
  getDeck(id: string): Deck | undefined { const deck = decks.find((item) => item.id === id); return deck ? structuredClone(deck) : undefined; },
  createDeck(input: CreateDeckInput): Deck {
    const deck: Deck = { id: nextId("deck"), name: input.name, description: input.description ?? "", subject: input.subject ?? "General", color: "sage", cards: [], updatedAt: new Date().toISOString() };
    decks.unshift(deck);
    return structuredClone(deck);
  },
  updateDeck(id: string, input: UpdateDeckInput): Deck | undefined {
    const deck = decks.find((item) => item.id === id);
    if (!deck) return undefined;
    if (input.name !== undefined) deck.name = input.name;
    if (input.description !== undefined) deck.description = input.description;
    if (input.subject !== undefined) deck.subject = input.subject;
    deck.updatedAt = new Date().toISOString();
    return structuredClone(deck);
  },
  deleteDeck(id: string): boolean {
    const exists = decks.some((item) => item.id === id);
    if (!exists) return false;
    decks = decks.filter((item) => item.id !== id);
    reviews = reviews.filter((review) => review.deckId !== id);
    return true;
  },
  createCard(deckId: string, input: CreateCardInput): Flashcard | undefined {
    const deck = decks.find((item) => item.id === deckId);
    if (!deck) return undefined;
    const card: Flashcard = { id: nextId("card"), deckId, type: input.type, question: input.question, answer: input.answer, options: input.options, due: true };
    deck.cards.push(card);
    deck.updatedAt = new Date().toISOString();
    return structuredClone(card);
  },
  updateCard(deckId: string, cardId: string, input: UpdateCardInput): Flashcard | undefined {
    const deck = decks.find((item) => item.id === deckId);
    const card = deck?.cards.find((item) => item.id === cardId);
    if (!deck || !card) return undefined;
    Object.assign(card, input);
    deck.updatedAt = new Date().toISOString();
    return structuredClone(card);
  },
  deleteCard(deckId: string, cardId: string): boolean {
    const deck = decks.find((item) => item.id === deckId);
    if (!deck) return false;
    const before = deck.cards.length;
    deck.cards = deck.cards.filter((item) => item.id !== cardId);
    if (deck.cards.length === before) return false;
    reviews = reviews.filter((review) => review.cardId !== cardId);
    deck.updatedAt = new Date().toISOString();
    return true;
  },
  search(query: string) {
    const q = query.toLocaleLowerCase();
    return decks.flatMap((deck) => {
      const deckMatches = `${deck.name} ${deck.description} ${deck.subject}`.toLocaleLowerCase().includes(q);
      const matchingCards = deck.cards.filter((card) => `${card.question} ${card.answer}`.toLocaleLowerCase().includes(q));
      return [...(deckMatches ? [{ kind: "deck" as const, deckId: deck.id, deckName: deck.name, title: deck.name, excerpt: deck.description }] : []), ...matchingCards.map((card) => ({ kind: "card" as const, deckId: deck.id, deckName: deck.name, cardId: card.id, title: card.question, excerpt: card.answer }))];
    });
  },
  addReview(input: { deckId: string; cardId: string; rating: Rating; reviewedAt?: string }): ReviewRecord | undefined {
    const card = decks.find((deck) => deck.id === input.deckId)?.cards.find((item) => item.id === input.cardId);
    if (!card) return undefined;
    const review: ReviewRecord = { id: nextId("review"), deckId: input.deckId, cardId: input.cardId, rating: input.rating, reviewedAt: input.reviewedAt ?? new Date().toISOString() };
    reviews.push(review);
    card.due = input.rating === "AGAIN" || input.rating === "HARD";
    return structuredClone(review);
  },
  statistics() {
    const allCards = decks.flatMap((deck) => deck.cards);
    const correct = reviews.filter((review) => review.rating === "GOOD" || review.rating === "EASY").length;
    const reviewedToday = reviews.filter((review) => new Date(review.reviewedAt).toDateString() === new Date().toDateString()).length;
    return { totalDecks: decks.length, totalCards: allCards.length, dueCards: allCards.filter((card) => card.due).length, totalReviews: reviews.length, reviewsToday: reviewedToday, accuracy: reviews.length ? Math.round((correct / reviews.length) * 100) : null };
  },
  resetForTests() { decks = structuredClone(initialDecks); reviews = []; idCounter = 1; },
};
