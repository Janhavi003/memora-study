import { reviewSchema } from "@/lib/validation/api-schemas";
import { ok } from "@/lib/server/api-response";
import { notFound, parseBody } from "@/lib/server/http";
import { prismaStore } from "@/lib/server/prisma-store";

export async function POST(request: Request) {
  const parsed = await parseBody(request, reviewSchema);
  if ("response" in parsed) return parsed.response;
  const review = await prismaStore.addReview(parsed.value);
  return review ? ok(review, 201) : notFound("Card");
}
