/**
 * =============================================================================
 * NotFoundException
 * =============================================================================
 *
 * Thrown when a requested resource cannot be found.
 * Maps to HTTP 404 status code.
 *
 * =============================================================================
 */
export class NotFoundException extends Error {
  public readonly statusCode: number = 404;

  constructor(message: string = "Resource not found") {
    super(message);
    this.name = "NotFoundException";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundException);
    }
  }
}
