import { createCardSchema } from "@/lib/validation/api-schemas";
import { ok } from "@/lib/server/api-response";
import { notFound, parseBody } from "@/lib/server/http";
import { memoryStore } from "@/lib/server/memory-store";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  const deck = memoryStore.getDeck(id);
  return deck ? ok(deck.cards) : notFound("Deck");
}

export async function POST(request: Request, context: Context) {
  const { id } = await context.params;
  const parsed = await parseBody(request, createCardSchema);
  if ("response" in parsed) return parsed.response;
  const card = memoryStore.createCard(id, parsed.value);
  return card ? ok(card, 201) : notFound("Deck");
}
