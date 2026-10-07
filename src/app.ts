import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import apiRoutes from "./routes/index.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";

const app = express();

// Required when deployed behind a reverse proxy
if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// HTTP request logging
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

// Request body limits
app.use(
  express.json({
    limit: "2mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  }),
);

// Cookies
app.use(cookieParser());

// Global rate limit
app.use(globalRateLimiter);

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Verigo Essential API is running",
    environment: env.NODE_ENV,
  });
});

// API routes
app.use("/api", apiRoutes);

// 404 handler
app.use(notFoundMiddleware);

// Global error handler — MUST be last
app.use(errorMiddleware);

export default app;
