// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";

// import { env } from "./config/env.js";
// import { globalRateLimiter } from "./middlewares/rateLimiter.middleware.js";
// import { errorMiddleware } from "./middlewares/error.middleware.js";
// import apiRoutes from "./routes/index.js";
// import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";

// const app = express();

// // Required when deployed behind a reverse proxy
// if (env.NODE_ENV === "production") {
//   app.set("trust proxy", 1);
// }

// // Security headers
// app.use(helmet());

// // CORS
// app.use(
//   cors({
//     origin: env.CLIENT_URL,
//     credentials: true,
//     methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );

// // HTTP request logging
// app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

// // Request body limits
// app.use(
//   express.json({
//     limit: "2mb",
//   }),
// );

// app.use(
//   express.urlencoded({
//     extended: true,
//     limit: "2mb",
//   }),
// );

// // Cookies
// app.use(cookieParser());

// // Global rate limit
// app.use(globalRateLimiter);

// // Health check
// app.get("/health", (_req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Verigo Essential API is running",
//     environment: env.NODE_ENV,
//   });
// });

// // API routes
// app.use("/api", apiRoutes);

// // 404 handler
// app.use(notFoundMiddleware);

// // Global error handler — MUST be last
// app.use(errorMiddleware);

// export default app;

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmetModule from "helmet";

import type { RequestHandler } from "express";
import type { HelmetOptions } from "helmet";

import { env } from "./config/env.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.middleware.js";
import routes from "./routes/index.js";

// Fix Helmet + TypeScript/NodeNext compatibility on Vercel
const helmet = helmetModule as unknown as (
  options?: HelmetOptions,
) => RequestHandler;

const app = express();

/**
 * Disable ETag to avoid unnecessary 304 responses
 * for API requests.
 */
app.set("etag", false);

/**
 * Required when deployed behind Vercel/reverse proxy.
 */
if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

/**
 * Hide Express fingerprint.
 */
app.disable("x-powered-by");

/**
 * Security headers
 */
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

/**
 * CORS
 *
 * CLIENT_URL should contain your frontend URL in production.
 *
 * Example:
 * CLIENT_URL=https://your-frontend.vercel.app
 */
const allowedOrigins = [
  env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001",
].filter((value): value is string => Boolean(value));

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header
      // such as Postman/server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },

    credentials: true,
  }),
);

/**
 * Request body limits
 */
app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

/**
 * Cookies
 */
app.use(cookieParser());

/**
 * Global rate limiter
 */
app.use(globalRateLimiter);

/**
 * Root health/info endpoint
 */
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Verigo Essential API",
  });
});

/**
 * Health check
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Verigo Essential API is running",
    environment: env.NODE_ENV,
  });
});

/**
 * Dashboard/API responses should not be cached.
 */
app.use("/api", (_req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );

  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  next();
});

/**
 * API routes
 */
app.use("/api", routes);

/**
 * 404 handler
 */
app.use(notFoundMiddleware);

/**
 * Global error handler
 * MUST remain last.
 */
app.use(errorMiddleware);

export default app;
