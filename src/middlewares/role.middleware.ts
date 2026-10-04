import type { Request, Response, NextFunction } from "express";

import { AppError } from "../utils/appError.js";

type AdminRole = "ADMIN" | "SUPER_ADMIN";

export const requireRole = (...roles: AdminRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.admin) {
      next(new AppError("Authentication required", 401));

      return;
    }

    if (!roles.includes(req.admin.role)) {
      next(
        new AppError("You do not have permission to perform this action", 403),
      );

      return;
    }

    next();
  };
};
