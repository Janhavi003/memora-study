import { z } from "zod";

export const cardTypeSchema = z.enum(["QUESTION_ANSWER", "DEFINITION", "CLOZE", "MULTIPLE_CHOICE"]);
export const ratingSchema = z.enum(["AGAIN", "HARD", "GOOD", "EASY"]);

export const createDeckSchema = z.object({
  name: z.string().trim().min(1, "Deck name is required").max(100),
  description: z.string().trim().max(1000).optional().default(""),
  subject: z.string().trim().max(80).optional().default("General"),
});

export const updateDeckSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(1000).optional(),
  subject: z.string().trim().max(80).optional(),
}).refine((value) => Object.keys(value).length > 0, "Provide at least one field to update");

export const createCardSchema = z.object({
  type: cardTypeSchema.default("QUESTION_ANSWER"),
  question: z.string().trim().min(1).max(2000),
  answer: z.string().trim().min(1).max(5000),
  options: z.array(z.string().trim().min(1).max(500)).max(10).optional(),
});

export const updateCardSchema = z.object({
  question: z.string().trim().min(1).max(2000).optional(),
  answer: z.string().trim().min(1).max(5000).optional(),
  type: cardTypeSchema.optional(),
  options: z.array(z.string().trim().min(1).max(500)).max(10).optional(),
}).refine((value) => Object.keys(value).length > 0, "Provide at least one field to update");

export const generationSchema = z.object({
  text: z.string().trim().min(35, "Add at least 35 characters of notes").max(50_000, "Notes must be 50,000 characters or fewer"),
  maxCards: z.number().int().min(1).max(30).default(10),
  types: z.array(cardTypeSchema).max(4).default(["QUESTION_ANSWER"]),
});

export const reviewSchema = z.object({
  deckId: z.string().min(1),
  cardId: z.string().min(1),
  rating: ratingSchema,
  reviewedAt: z.string().datetime().optional(),
});

export const searchSchema = z.object({
  q: z.string().trim().min(1).max(100),
});

export type CreateDeckInput = z.infer<typeof createDeckSchema>;
export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
