import "reflect-metadata";

import express, { Express, Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Container } from "typedi";

dotenv.config();

import { AppDataSource } from "./db/data-source";
import { logger } from "./common/utils/logger";

import {
  errorHandler,
  notFoundHandler,
} from "./common/middleware/error-handler.middleware";

import { AuthRoutes } from "./domains/user/route/auth.routes";
import { DoctorRoutes } from "./domains/doctor/route/doctor.routes";
import { AppointmentRoutes } from "./domains/appointment/route/appointment.routes";

class Application {
  public app: Express;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "5000", 10);

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    const allowedOrigins = (
      process.env.ALLOWED_ORIGINS || "http://localhost:5173"
    ).split(",");

    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`CORS: origin '${origin}' is not allowed`));
          }
        },
        credentials: true,
      }),
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    logger.info("Middleware initialized");
  }

  private initializeRoutes(): void {
    const v1Router = Router();

    v1Router.get("/test", (req, res) => {
      res.status(200).json({
        status: 200,
        message: "API working",
      });
    });

    const authRoutes = Container.get(AuthRoutes);
    const doctorRoutes = Container.get(DoctorRoutes);
    const appointmentRoutes = Container.get(AppointmentRoutes);

    v1Router.use("/auth", authRoutes.getRoutes());
    v1Router.use("/doctors", doctorRoutes.getRoutes());
    v1Router.use("/appointments", appointmentRoutes.getRoutes());

    this.app.use("/api/v1", v1Router);

    logger.info("Routes initialized");
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);

    logger.info("Error handling initialized");
  }

  public async start(): Promise<void> {
    try {
      await AppDataSource.initialize();

      logger.info("Database connected");

      this.app.listen(this.port, () => {
        logger.info(`Server running on port ${this.port}`);
        logger.info(`Test API: http://localhost:${this.port}/api/v1/test`);
      });
    } catch (error) {
      logger.error("Startup error", error);
      process.exit(1);
    }
  }
}

const application = new Application();

application.start();

export default application.app;
