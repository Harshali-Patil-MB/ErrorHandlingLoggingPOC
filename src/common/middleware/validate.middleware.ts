import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

import { HttpStatus } from "../constants/http-status.constants";

import { AuthErrorMessages } from "../constants/auth-error-messages.constants";

export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: AuthErrorMessages.VALIDATION_FAILED,
        errors,
        error: AuthErrorMessages.BAD_REQUEST,
      });

      return;
    }

    req.body = value;

    next();
  };
};

export const validateLogin = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: AuthErrorMessages.INVALID_CREDENTIALS,
        error: AuthErrorMessages.UNAUTHORIZED,
      });

      return;
    }

    req.body = value;

    next();
  };
};
