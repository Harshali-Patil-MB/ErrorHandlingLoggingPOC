// src/index.ts

import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./db/data-source";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API working",
  });
});

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error", error);
    process.exit(1);
  }
}

startServer();
