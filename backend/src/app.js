import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import apiRoutes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { env } from "./config/env.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: [env.clientUrl, env.adminUrl],
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use("/uploads", express.static(path.join(__dirname, "../..", "uploads")));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Real estate API is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
