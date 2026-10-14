import { searchSchema } from "@/lib/validation/api-schemas";
import { fail, ok } from "@/lib/server/api-response";
import { prismaStore } from "@/lib/server/prisma-store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = searchSchema.safeParse({ q: url.searchParams.get("q") ?? "" });
  if (!parsed.success) return fail("VALIDATION_ERROR", "A search query is required.", 400, parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })));
  return ok(await prismaStore.search(parsed.data.q));
}
