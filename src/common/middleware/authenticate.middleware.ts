import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { HttpStatus } from "../constants/http-status.constants";
import { AuthErrorMessages } from "../constants/auth-error-messages.constants";

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
      id: number;
      publicId: string;
      email: string;
      role: string;
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

    req.user = {
      id: payload.id,
      publicId: payload.publicId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: AuthErrorMessages.AUTHENTICATION_ERROR_OCCURRED,
      error: AuthErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};
