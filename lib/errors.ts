import { ZodError } from 'zod';

/**
 * Consistent backend error handling. Route handlers throw `AppError` (or an
 * `Errors.*` helper); the outer `catch` funnels everything through
 * `toErrorResponse` so responses never leak internals.
 *
 * Adopted from `Creator Store/lib/utils/errors.ts` — kept flat at `lib/errors.ts`
 * to match this repo's flat `lib/`.
 */

export type ErrorCode =
  'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL';

export class AppError extends Error {
  status: number;
  code: ErrorCode;
  details?: unknown;

  constructor(message: string, status = 500, code: ErrorCode = 'INTERNAL', details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const Errors = {
  badRequest: (msg = 'Bad request', details?: unknown) =>
    new AppError(msg, 400, 'BAD_REQUEST', details),
  unauthorized: (msg = 'Unauthorized') => new AppError(msg, 401, 'UNAUTHORIZED'),
  forbidden: (msg = 'Forbidden') => new AppError(msg, 403, 'FORBIDDEN'),
  notFound: (msg = 'Not found') => new AppError(msg, 404, 'NOT_FOUND'),
  conflict: (msg = 'Conflict', details?: unknown) => new AppError(msg, 409, 'CONFLICT', details),
  internal: (msg = 'Internal server error', details?: unknown) =>
    new AppError(msg, 500, 'INTERNAL', details),
};

export function toErrorResponse(err: unknown): {
  status: number;
  body: { success: false; error: ErrorCode; message: string; details?: unknown };
} {
  if (err instanceof AppError) {
    return {
      status: err.status,
      body: {
        success: false,
        error: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    };
  }

  if (err instanceof ZodError) {
    return {
      status: 400,
      body: {
        success: false,
        error: 'BAD_REQUEST',
        message: 'Validation failed',
        details: err.issues,
      },
    };
  }

  return {
    status: 500,
    body: { success: false, error: 'INTERNAL', message: 'Internal server error' },
  };
}
