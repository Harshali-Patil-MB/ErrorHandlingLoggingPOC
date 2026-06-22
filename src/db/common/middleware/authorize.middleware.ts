import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../constants/http-status.constants";
import {
  AuthErrorMessages,
  getAccessDeniedMessage,
  getAllRolesRequiredMessage,
} from "../constants/auth-error-messages.constants";

/**
 * =============================================================================
 * Authorization Middleware
 * =============================================================================
 *
 * Checks if authenticated user has required role(s).
 * Returns 403 if user doesn't have required permissions.
 *
 * Must be used after authenticate middleware.
 *
 * =============================================================================
 */

/**
 * Middleware factory to check if user has at least one of the required roles.
 *
 * @param roles - One or more role names; user must have at least one
 * @returns Express middleware function
 *
 * @example
 * User must have at least ONE of the specified roles
 * router.post('/reports', authenticate, requireRole('ADMIN', 'MANAGER'), handler);
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

    const userRoles = req.user.roles || [];
    const hasRequiredRole = roles.some((role) => userRoles.includes(role));

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

/**
 * Middleware factory to check if user has ALL specified roles.
 *
 * @param roles - All roles that the user must have
 * @returns Express middleware function
 *
 * @example
 * User must have ALL specified roles
 * router.post('/audit-log', authenticate, requireAllRoles('ADMIN', 'AUDITOR'), handler);
 */
export const requireAllRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: AuthErrorMessages.AUTHENTICATION_REQUIRED,
        error: AuthErrorMessages.UNAUTHORIZED,
      });
      return;
    }

    const userRoles = req.user.roles || [];
    const hasAllRoles = roles.every((role) => userRoles.includes(role));

    if (!hasAllRoles) {
      res.status(HttpStatus.FORBIDDEN).json({
        status: HttpStatus.FORBIDDEN,
        message: getAllRolesRequiredMessage(roles),
        error: AuthErrorMessages.FORBIDDEN,
      });
      return;
    }

    next();
  };
};
