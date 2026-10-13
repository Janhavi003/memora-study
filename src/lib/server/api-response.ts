import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function fail(code: string, message: string, status: number, details?: unknown) {
  return NextResponse.json({ error: { code, message, ...(details === undefined ? {} : { details }) } }, { status });
}

export function validationFailure(error: ZodError) {
  return fail("VALIDATION_ERROR", "The request contains invalid fields.", 400, error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })));
}

export async function readJson(request: Request): Promise<unknown> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > 1_000_000) throw new RangeError("Request body must be 1 MB or smaller.");
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    throw new SyntaxError("Request body could not be read.");
  }
  if (new TextEncoder().encode(raw).byteLength > 1_000_000) throw new RangeError("Request body must be 1 MB or smaller.");
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new SyntaxError("Request body must be valid JSON.");
  }
}

export function handleRouteError(error: unknown) {
  if (error instanceof RangeError) return fail("REQUEST_TOO_LARGE", error.message, 413);
  if (error instanceof SyntaxError) return fail("INVALID_JSON", error.message, 400);
  return fail("INTERNAL_ERROR", "An unexpected server error occurred.", 500);
}
