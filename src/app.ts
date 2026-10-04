import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import apiRoutes from "./routes/index.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

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

app.use(cookieParser());

app.use(globalRateLimiter);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Verigo Essential API is running",
    environment: env.NODE_ENV,
  });
});

app.use("/api", apiRoutes);

app.use(errorMiddleware);

export default app;
