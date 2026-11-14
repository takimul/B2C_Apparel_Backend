import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { uploadImage as uploadImageMiddleware } from "../../middlewares/upload.middleware.js";
import {
  getEmployee,
  removeImage,
  updateEmployee,
  uploadImage,
} from "./employee.controller.js";

const router = Router();

// Public route to view employee/leadership info
router.get("/", getEmployee);

// Admin routes to update profile and photo
router.patch(
  "/",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  updateEmployee,
);

router.post(
  "/image",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  uploadImageMiddleware.single("image"),
  uploadImage,
);

router.delete(
  "/image",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  removeImage,
);

export default router;

