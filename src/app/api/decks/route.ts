import { createDeckSchema } from "@/lib/validation/api-schemas";
import { ok } from "@/lib/server/api-response";
import { parseBody } from "@/lib/server/http";
import { memoryStore } from "@/lib/server/memory-store";

export const runtime = "nodejs";

export async function GET() {
  return ok(memoryStore.listDecks());
}

export async function POST(request: Request) {
  const parsed = await parseBody(request, createDeckSchema);
  if ("response" in parsed) return parsed.response;
  return ok(memoryStore.createDeck(parsed.value), 201);
}
