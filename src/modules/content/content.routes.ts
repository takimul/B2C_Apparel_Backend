import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { getContent, updateContent } from "./content.controller.js";

const router = Router();

router.get("/", getContent);
router.patch("/", requireAuth, requireRole("SUPER_ADMIN"), updateContent);

export default router;

