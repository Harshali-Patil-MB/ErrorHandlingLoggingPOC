/**
 * =============================================================================
 * ForbiddenException
 * =============================================================================
 *
 * Thrown when the user is not allowed to perform the action (e.g. resource
 * belongs to another tenant). Maps to HTTP 403 status code.
 *
 * =============================================================================
 */
export class ForbiddenException extends Error {
  public readonly statusCode: number = 403;

  constructor(message: string = "Forbidden") {
    super(message);
    this.name = "ForbiddenException";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ForbiddenException);
    }
  }
}
