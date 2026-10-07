import type { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/appError.js";

export const COOKIE_NAME = "verigo_access_token";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const payload = verifyAccessToken(token);

    req.admin = payload;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError("Invalid or expired authentication token", 401));
  }
};
