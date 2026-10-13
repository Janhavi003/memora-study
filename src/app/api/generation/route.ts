import { generationSchema } from "@/lib/validation/api-schemas";
import { ok } from "@/lib/server/api-response";
import { parseBody } from "@/lib/server/http";
import { previewGenerate } from "@/lib/generator-preview";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = await parseBody(request, generationSchema);
  if ("response" in parsed) return parsed.response;
  const { text, maxCards, types } = parsed.value;
  return ok(previewGenerate(text, maxCards, types));
}
