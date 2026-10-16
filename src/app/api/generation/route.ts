import { generationSchema } from "@/lib/validation/api-schemas";
import { ok } from "@/lib/server/api-response";
import { parseBody } from "@/lib/server/http";
import { generateCandidates, markDuplicates } from "@/lib/generation-engine";
import { prismaStore } from "@/lib/server/prisma-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = await parseBody(request, generationSchema);
  if ("response" in parsed) return parsed.response;
  const { text, maxCards, types } = parsed.value;
  const generated = generateCandidates(text, maxCards, types);
  const existingDecks = await prismaStore.listDecks();
  const existingCards = existingDecks.flatMap((deck) => deck.cards);
  const candidates = markDuplicates(generated.candidates, existingCards);
  return ok({ ...generated, candidates, duplicateCount: candidates.filter((candidate) => candidate.duplicate).length, engine: "local-heuristic-v1" });
}
