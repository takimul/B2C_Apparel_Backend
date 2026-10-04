import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import { getHome, getBanner, updateBanner } from "./homepage.controller.js";

import { updateBannerSchema } from "./homepage.validation.js";

const router = Router();

/**
 * Public homepage
 */
router.get("/", getHome);

/**
 * Public banner
 */
router.get("/banner", getBanner);

/**
 * Admin banner management
 */
router.get(
  "/admin/banner",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  getBanner,
);

router.put(
  "/admin/banner",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  validate(updateBannerSchema),
  updateBanner,
);

export default router;
