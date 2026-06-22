/**
 * =============================================================================
 * BadRequestException
 * =============================================================================
 *
 * Thrown when a request contains invalid data or violates business rules.
 * Maps to HTTP 400 status code.
 *
 * =============================================================================
 */
export class BadRequestException extends Error {
  public readonly statusCode: number = 400;
  public readonly data?: Record<string, unknown>;

  constructor(message: string = "Bad request", data?: Record<string, unknown>) {
    super(message);
    this.name = "BadRequestException";
    this.data = data;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadRequestException);
    }
  }
}
