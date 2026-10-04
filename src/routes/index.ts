import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import categoryRoutes from "../modules/categories/category.routes.js";
import productRoutes from "../modules/products/product.routes.js";
import inquiryRoutes from "../modules/inquiries/inquiry.routes.js";
import homepageRoutes from "../modules/homepage/homepage.routes.js";
import settingsRoutes from "../modules/settings/settings.routes.js";

const router = Router();

router.use("/admin/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/homepage", homepageRoutes);
router.use("/settings", settingsRoutes);

export default router;
