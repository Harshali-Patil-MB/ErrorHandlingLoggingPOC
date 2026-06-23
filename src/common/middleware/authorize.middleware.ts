import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../constants/http-status.constants";

import {
  AuthErrorMessages,
  getAccessDeniedMessage,
} from "../constants/auth-error-messages.constants";

/**
 * =============================================================================
 * Authorization Middleware
 * =============================================================================
 *
 * Checks if authenticated user has one of the required roles.
 *
 * Usage:
 *
 * router.get(
 *   "/admin",
 *   authenticate,
 *   requireRole("ADMIN"),
 *   controller.getAdminData
 * );
 *
 * =============================================================================
 */

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: AuthErrorMessages.AUTHENTICATION_REQUIRED,
        error: AuthErrorMessages.UNAUTHORIZED,
      });

      return;
    }

    const hasRequiredRole = roles.includes(req.user.role);

    if (!hasRequiredRole) {
      res.status(HttpStatus.FORBIDDEN).json({
        status: HttpStatus.FORBIDDEN,
        message: getAccessDeniedMessage(roles),
        error: AuthErrorMessages.FORBIDDEN,
      });

      return;
    }

    next();
  };
};
