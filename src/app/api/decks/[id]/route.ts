import { updateDeckSchema } from "@/lib/validation/api-schemas";
import { ok } from "@/lib/server/api-response";
import { notFound, parseBody } from "@/lib/server/http";
import { prismaStore } from "@/lib/server/prisma-store";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  const deck = await prismaStore.getDeck(id);
  return deck ? ok(deck) : notFound("Deck");
}

export async function PATCH(request: Request, context: Context) {
  const { id } = await context.params;
  const parsed = await parseBody(request, updateDeckSchema);
  if ("response" in parsed) return parsed.response;
  const deck = await prismaStore.updateDeck(id, parsed.value);
  return deck ? ok(deck) : notFound("Deck");
}

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;
  return await prismaStore.deleteDeck(id) ? ok({ deleted: true }) : notFound("Deck");
}
