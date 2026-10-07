import rateLimitModule from "express-rate-limit";

import type { RequestHandler } from "express";
import type { Options } from "express-rate-limit";

const rateLimit = rateLimitModule as unknown as (
  options?: Partial<Options>,
) => RequestHandler;

/**
 * Global API rate limiter
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

/**
 * Authentication rate limiter
 *
 * Prevents brute-force login attempts.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

/**
 * Inquiry rate limiter
 *
 * More restrictive because this endpoint
 * can be accessed publicly.
 */
export const inquiryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
