import type { Request, Response } from "express";

import { prisma } from "../../config/prisma.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/apiResponse.js";
import { AppError } from "../../utils/appError.js";

import { loginAdmin } from "./auth.service.js";

const COOKIE_NAME = "verigo_access_token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? ("none" as const)
      : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await loginAdmin({
    email,
    password,
  });

  res.cookie(COOKIE_NAME, result.token, cookieOptions);

  return sendResponse(res, {
    statusCode: 200,
    message: "Login successful",
    data: {
      admin: result.admin,
    },
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);

  return sendResponse(res, {
    statusCode: 200,
    message: "Logout successful",
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.admin) {
    throw new AppError("Authentication required", 401);
  }

  const admin = await prisma.admin.findUnique({
    where: {
      id: req.admin.adminId,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!admin || !admin.isActive) {
    throw new AppError("Admin account not found", 401);
  }

  return sendResponse(res, {
    message: "Authenticated admin",
    data: {
      admin,
    },
  });
});
