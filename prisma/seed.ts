import { PrismaClient } from "@prisma/client";
import { initialDecks } from "../src/lib/mock-data";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.deck.count();
  if (existing > 0) {
    console.log(`Seed skipped: database already contains ${existing} deck(s).`);
    return;
  }
  for (const deck of initialDecks) {
    await prisma.deck.create({
      data: {
        id: deck.id, name: deck.name, description: deck.description, subject: deck.subject,
        color: deck.color, updatedAt: new Date(deck.updatedAt),
        lastStudiedAt: deck.lastStudiedAt ? new Date(deck.lastStudiedAt) : null,
        cards: { create: deck.cards.map((card) => ({
          id: card.id, type: card.type, question: card.question, answer: card.answer,
          optionsJson: card.options ? JSON.stringify(card.options) : null, due: card.due,
        })) },
      },
    });
  }
  console.log(`Seeded ${initialDecks.length} demo decks.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => prisma.$disconnect());
