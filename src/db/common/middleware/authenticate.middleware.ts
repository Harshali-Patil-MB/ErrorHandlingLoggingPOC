import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatus } from "../constants/http-status.constants";
import { AuthErrorMessages } from "../constants/auth-error-messages.constants";

/**
 * =============================================================================
 * Authentication Middleware
 * =============================================================================
 *
 * Verifies the Bearer JWT in the Authorization header and attaches the decoded
 * payload to req.user. Must run before any route handler that needs the user.
 *
 * USAGE
 *   router.get("/protected", authenticate, handler);
 *
 * EXTENDING
 *   For session-based validation (e.g. invalidating tokens on logout) add a
 *   session repository lookup after the JWT verification block below.
 *
 * =============================================================================
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: AuthErrorMessages.AUTH_TOKEN_REQUIRED,
        error: AuthErrorMessages.UNAUTHORIZED,
      });
      return;
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: AuthErrorMessages.INVALID_AUTH_HEADER_FORMAT,
        error: AuthErrorMessages.UNAUTHORIZED,
      });
      return;
    }

    const token = parts[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    let payload: {
      userId: string;
      email: string;
      roles: string[];
    };

    try {
      payload = jwt.verify(token, secret) as typeof payload;
    } catch {
      res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: AuthErrorMessages.INVALID_TOKEN,
        error: AuthErrorMessages.UNAUTHORIZED,
      });
      return;
    }

    // Attach decoded user to request — available to all downstream handlers
    req.user = {
      userId: payload.userId,
      email: payload.email,
      roles: payload.roles ?? [],
    };

    next();
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: AuthErrorMessages.AUTHENTICATION_ERROR_OCCURRED,
      error: AuthErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};
