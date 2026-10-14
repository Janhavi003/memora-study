import { ok } from "@/lib/server/api-response";
import { prismaStore } from "@/lib/server/prisma-store";

export async function GET() {
  return ok(await prismaStore.statistics());
}
