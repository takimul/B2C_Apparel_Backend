import { Router } from "express";

import { login, logout, me } from "./auth.controller.js";

import { validate } from "../../middlewares/validate.middleware.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

import { authRateLimiter } from "../../middlewares/rateLimiter.middleware.js";

import { loginSchema } from "./auth.validation.js";

const router = Router();

router.post("/login", authRateLimiter, validate(loginSchema), login);

router.post("/logout", logout);

router.get("/me", requireAuth, me);

export default router;
