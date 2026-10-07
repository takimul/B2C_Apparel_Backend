import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { uploadImage as uploadImageMiddleware } from "../../middlewares/upload.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import {
  getPublic,
  getAdmin,
  update,
  uploadImage,
  removeImage,
} from "./about.controller.js";

import { updateAboutSchema } from "./about.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.get("/", getPublic);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  getAdmin,
);

router.patch(
  "/admin",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  validate(updateAboutSchema),
  update,
);

router.post(
  "/admin/image",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  uploadImageMiddleware.single("image"),
  uploadImage,
);

router.delete(
  "/admin/image",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  removeImage,
);

export default router;
