import { ZodError, type ZodTypeAny } from "zod";
import { fail, handleRouteError, readJson, validationFailure } from "./api-response";

export async function parseBody<TSchema extends ZodTypeAny>(
  request: Request,
  schema: TSchema,
): Promise<{ value: TSchema["_output"] } | { response: Response }> {
  let body: unknown;
  try { body = await readJson(request); } catch (error) { return { response: handleRouteError(error) }; }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return { response: validationFailure(parsed.error) };
  return { value: parsed.data };
}

export function notFound(resource = "Resource") { return fail("NOT_FOUND", `${resource} was not found.`, 404); }
export function badRequest(message: string) { return fail("BAD_REQUEST", message, 400); }
export function unexpected(error: unknown) {
  if (error instanceof ZodError) return validationFailure(error);
  return handleRouteError(error);
}
