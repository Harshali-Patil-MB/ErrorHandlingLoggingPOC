/**
 * =============================================================================
 * NotImplementedException
 * =============================================================================
 *
 * Thrown when a feature or method is intentionally not implemented yet.
 * Used to clearly indicate deferred functionality during development.
 *
 * =============================================================================
 */
export class NotImplementedException extends Error {
  public readonly statusCode: number = 501;

  constructor(message: string = "This feature is not implemented yet") {
    super(message);
    this.name = "NotImplementedException";

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotImplementedException);
    }
  }
}
