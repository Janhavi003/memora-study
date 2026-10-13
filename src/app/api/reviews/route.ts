import { reviewSchema } from "@/lib/validation/api-schemas";
import { ok } from "@/lib/server/api-response";
import { notFound, parseBody } from "@/lib/server/http";
import { memoryStore } from "@/lib/server/memory-store";

export async function POST(request: Request) {
  const parsed = await parseBody(request, reviewSchema);
  if ("response" in parsed) return parsed.response;
  const review = memoryStore.addReview(parsed.value);
  return review ? ok(review, 201) : notFound("Card");
}
