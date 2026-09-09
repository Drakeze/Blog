import { NextResponse } from 'next/server';

import { toErrorResponse } from './errors';

/**
 * Uniform API-route helpers. Every route handler is
 * `try { auth → zod.parse → service → apiOk(...) } catch (e) { return apiError(e) }`.
 * `apiError` funnels `AppError` / `ZodError` / anything through `toErrorResponse`
 * so responses never leak internals; 5xx are logged, 4xx are not.
 */
export function apiOk(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function apiError(err: unknown): NextResponse {
  const { status, body } = toErrorResponse(err);
  if (status >= 500) console.error('[api]', err);
  return NextResponse.json(body, { status });
}
