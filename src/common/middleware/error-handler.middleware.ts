import { Request, Response, NextFunction } from "express";

import { isHttpException } from "../exceptions";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      status: 400,
      message: "Invalid JSON in request body",
      error: "Bad Request",
    });

    return;
  }

  if (isHttpException(err)) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
      error: err.name,
    });

    return;
  }

  res.status(500).json({
    status: 500,
    message: "An unexpected error occurred",
    error: "Internal Server Error",
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    status: 404,
    message: `Route ${req.method} ${req.path} not found`,
    error: "Not Found",
  });
};
