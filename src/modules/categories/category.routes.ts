import { Router } from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "./category.controller.js";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from "./category.validation.js";

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

router.delete(
  "/:id",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  validate(categoryIdSchema),
  remove,
);

export default router;
