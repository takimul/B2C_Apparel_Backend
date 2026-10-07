import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { uploadImage } from "../../middlewares/upload.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import {
  getPublic,
  getAdmin,
  update,
  uploadLogoController,
  removeLogo,
  uploadBannerController,
  removeBanner,
} from "./settings.controller.js";

import { updateSettingsSchema } from "./settings.validation.js";

const router = Router();

/**
 * Public settings
 */
router.get("/", getPublic);

/**
 * Admin settings
 */
router.get(
  "/admin",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  getAdmin,
);

/**
 * Update settings
 */
router.patch(
  "/admin",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  validate(updateSettingsSchema),
  update,
);

/**
 * Upload logo
 */
router.post(
  "/admin/logo",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  uploadImage.single("logo"),
  uploadLogoController,
);

/**
 * Delete logo
 */
router.delete(
  "/admin/logo",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  removeLogo,
);

export default router;

/**
 * Homepage banner
 */
router.post(
  "/admin/banner",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  uploadImage.single("banner"),
  uploadBannerController,
);

router.delete(
  "/admin/banner",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  removeBanner,
);
