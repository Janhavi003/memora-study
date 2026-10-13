import { ok } from "@/lib/server/api-response";
import { memoryStore } from "@/lib/server/memory-store";

export async function GET() {
  return ok(memoryStore.statistics());
}
