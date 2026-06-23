import winston from "winston";

const logLevel = process.env.LOG_LEVEL || "info";

const devFormat = winston.format.printf(
  ({ timestamp, level, message, stack, ...meta }) => {
    const metaContent =
      meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
    const stackContent = stack ? `\n${stack}` : "";

    return `${timestamp as string} ${level}: ${message}${metaContent}${stackContent}`;
  },
);

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    process.env.NODE_ENV === "production"
      ? new winston.transports.Console({ format: winston.format.json() })
      : new winston.transports.Console({
          format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.colorize(),
            winston.format.timestamp(),
            devFormat,
          ),
        }),
  ],
});
