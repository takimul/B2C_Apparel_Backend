import { Router } from "express";

import {
  create,
  getAll,
  getOneById,
  getOneBySlug,
  update,
  archive,
} from "./product.controller.js";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  productSlugSchema,
} from "./product.validation.js";

import {
  uploadImage,
  removeImage,
  setPrimary,
} from "./product-image.controller.js";

import { uploadImage as uploadImageMiddleware } from "../../middlewares/upload.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.get("/", getAll);

router.get("/slug/:slug", validate(productSlugSchema), getOneBySlug);

router.post(
  "/:id/images",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  uploadImageMiddleware.single("image"),
  uploadImage,
);

router.delete(
  "/:id/images/:imageId",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  removeImage,
);

router.patch(
  "/:id/images/:imageId/primary",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  setPrimary,
);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/:id",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  validate(productIdSchema),
  getOneById,
);

router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  validate(createProductSchema),
  create,
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  validate(updateProductSchema),
  update,
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  validate(productIdSchema),
  archive,
);

export default router;
