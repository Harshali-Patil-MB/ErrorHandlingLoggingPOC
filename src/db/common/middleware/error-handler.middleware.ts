import { Request, Response, NextFunction } from "express";
import { isHttpException } from "../exceptions";
import { logger } from "../utils/logger";

/**
 * =============================================================================
 * Global Error Handler Middleware
 * =============================================================================
 *
 * Catches all errors thrown in the application and formats them consistently.
 * Handles: CustomError (legacy), HTTP exceptions (NotFoundException, etc.), and
 * unknown errors. Must be registered as the last middleware in the application.
 *
 * =============================================================================
 */

const HTTP_STATUS_TEXT: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  501: "Not Implemented",
  503: "Service Unavailable",
};

/**
 * Global error handler — must have exactly 4 parameters so Express identifies it
 * as an error-handling middleware.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error("Error occurred", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle JSON parse errors from Express body parser
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      status: 400,
      message: "Invalid JSON in request body",
      error: "Bad Request",
    });
    return;
  }

  // Handle typed HTTP exceptions (NotFoundException, BadRequestException, etc.)
  if (isHttpException(err)) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
      error: HTTP_STATUS_TEXT[err.statusCode] ?? "Error",
    });
    return;
  }

  // Unhandled / unexpected errors — never leak internal details to the client
  res.status(500).json({
    status: 500,
    message: "An unexpected error occurred",
    error: "Internal Server Error",
  });
};

/**
 * 404 handler — catches requests to undefined routes.
 * Terminal middleware: does not call next().
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    status: 404,
    message: `Route ${req.method} ${req.path} not found`,
    error: "Not Found",
  });
};
