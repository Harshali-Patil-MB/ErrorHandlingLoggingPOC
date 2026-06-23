/**
 * =============================================================================
 * ConflictException
 * =============================================================================
 *
 * Thrown when a request conflicts with the current state of the resource
 * (e.g., unique constraint violation, concurrent modification).
 * Maps to HTTP 409 status code.
 *
 * =============================================================================
 */
export class ConflictException extends Error {
  public readonly statusCode: number = 409;

  constructor(message: string = "Resource conflict") {
    super(message);
    this.name = "ConflictException";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConflictException);
    }
  }
}
