import { Router } from "express";

import { inquiryRateLimiter } from "../../middlewares/rateLimiter.middleware.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import { create, getAll, getOne, update } from "./inquiry.controller.js";

import {
  createInquirySchema,
  getInquiriesSchema,
  inquiryIdSchema,
  updateInquirySchema,
} from "./inquiry.validation.js";

const router = Router();

/**
 * Public
 * Submit wholesale inquiry
 */
router.post("/", inquiryRateLimiter, validate(createInquirySchema), create);

/**
 * Admin
 * Get inquiries
 */
router.get(
  "/",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  validate(getInquiriesSchema),
  getAll,
);

/**
 * Admin
 * Get single inquiry
 */
router.get(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  validate(inquiryIdSchema),
  getOne,
);

/**
 * Admin
 * Update inquiry
 */
router.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  validate(updateInquirySchema),
  update,
);

export default router;
