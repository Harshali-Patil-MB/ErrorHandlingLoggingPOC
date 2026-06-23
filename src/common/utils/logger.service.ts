import { Service } from "typedi";
import { logger } from "./logger";

/**
 * TypeDI-injectable wrapper around the Winston logger singleton.
 * Inject this into services, controllers, and repositories instead of
 * importing the logger directly.
 */
@Service()
export class LoggerService {
  info(message: string, ...args: unknown[]): void {
    logger.info(message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    logger.warn(message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    logger.error(message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    logger.debug(message, ...args);
  }

  http(message: string, ...args: unknown[]): void {
    logger.http(message, ...args);
  }
}
