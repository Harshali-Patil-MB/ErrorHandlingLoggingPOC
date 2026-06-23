/**
 * =============================================================================
 * UnauthorizedException
 * =============================================================================
 *
 * Thrown when the user is not authenticated or provides invalid credentials.
 * Maps to HTTP 401 status code.
 *
 * =============================================================================
 */
export class UnauthorizedException extends Error {
  public readonly statusCode: number = 401;

  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedException";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedException);
    }
  }
}
