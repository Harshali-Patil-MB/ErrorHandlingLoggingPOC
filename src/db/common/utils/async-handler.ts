import { Request, Response, NextFunction } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

/**
 * Wraps an async route handler and forwards any thrown error to next().
 * Eliminates the need for try/catch in every controller method.
 *
 * Usage:
 *   router.get('/', asyncHandler(controller.getAll.bind(controller)));
 */
export const asyncHandler =
  (fn: AsyncRequestHandler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
