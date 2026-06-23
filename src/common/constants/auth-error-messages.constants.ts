/**
 * Auth / validation error and label strings.
 * Centralised here so every middleware and service returns identical text.
 */
export const AuthErrorMessages = {
  // Labels used in the "error" field of the response envelope
  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  INTERNAL_SERVER_ERROR: "Internal Server Error",

  // Validation
  VALIDATION_FAILED: "Validation failed",
  INVALID_CREDENTIALS: "Invalid email or password",

  // Authentication
  AUTH_TOKEN_REQUIRED: "Authorization token is required",
  INVALID_AUTH_HEADER_FORMAT: "Authorization header must be: Bearer <token>",
  INVALID_TOKEN: "Invalid or expired token",
  INVALID_ACCESS_TOKEN: "Session is invalid or has been revoked",
  AUTHENTICATION_REQUIRED: "Authentication required",
  AUTHENTICATION_ERROR_OCCURRED: "An authentication error occurred",
} as const;

/** Returns "Access denied. Required role(s): X, Y" */
export const getAccessDeniedMessage = (roles: string[]): string =>
  `Access denied. Required role(s): ${roles.join(", ")}`;

/** Returns "All of the following roles are required: X, Y" */
export const getAllRolesRequiredMessage = (roles: string[]): string =>
  `All of the following roles are required: ${roles.join(", ")}`;
