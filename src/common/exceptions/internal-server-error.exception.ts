/**
 * =============================================================================
 * InternalServerErrorException
 * =============================================================================
 *
 * Thrown when an unexpected server-side or configuration error occurs.
 * Maps to HTTP 500 status code.
 *
 * =============================================================================
 */
export class InternalServerErrorException extends Error {
  public readonly statusCode: number = 500;
  public readonly data?: Record<string, unknown>;

  constructor(
    message: string = "Internal server error",
    data?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "InternalServerErrorException";
    this.data = data;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InternalServerErrorException);
    }
  }
}
