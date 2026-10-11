import { Router } from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
  uploadImage as uploadCategoryImage,
  removeImage as removeCategoryImage,
} from "./category.controller.js";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from "./category.validation.js";
import { uploadImage } from "../../middlewares/upload.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.get("/", getAll);

router.get("/:id", validate(categoryIdSchema), getOne);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  validate(createCategorySchema),
  create,
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  validate(updateCategorySchema),
  update,
);

router.post(
  "/:id/image",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  uploadImage.single("image"),
  uploadCategoryImage,
);

router.delete(
  "/:id/image",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  removeCategoryImage,
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  validate(categoryIdSchema),
  remove,
);

export default router;
