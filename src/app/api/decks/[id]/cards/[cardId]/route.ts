import { updateCardSchema } from "@/lib/validation/api-schemas";
import { ok } from "@/lib/server/api-response";
import { notFound, parseBody } from "@/lib/server/http";
import { memoryStore } from "@/lib/server/memory-store";

type Context = { params: Promise<{ id: string; cardId: string }> };

export async function PATCH(request: Request, context: Context) {
  const { id, cardId } = await context.params;
  const parsed = await parseBody(request, updateCardSchema);
  if ("response" in parsed) return parsed.response;
  const card = memoryStore.updateCard(id, cardId, parsed.value);
  return card ? ok(card) : notFound("Card");
}

export async function DELETE(_request: Request, context: Context) {
  const { id, cardId } = await context.params;
  return memoryStore.deleteCard(id, cardId) ? ok({ deleted: true }) : notFound("Card");
}
