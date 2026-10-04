import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/apiResponse.js";

import {
  deleteLogo,
  getAdminSettings,
  getPublicSettings,
  updateSettings,
  uploadLogo,
} from "./settings.service.js";

export const getPublic = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await getPublicSettings();

  return sendResponse(res, {
    message: "Site settings fetched successfully",
    data: settings,
  });
});

export const getAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await getAdminSettings();

  return sendResponse(res, {
    message: "Site settings fetched successfully",
    data: settings,
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const settings = await updateSettings(req.body);

  return sendResponse(res, {
    message: "Site settings updated successfully",
    data: settings,
  });
});

export const uploadLogoController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      return sendResponse(res, {
        statusCode: 400,
        message: "Logo image is required",
      });
    }

    const settings = await uploadLogo(req.file);

    return sendResponse(res, {
      message: "Logo uploaded successfully",
      data: settings,
    });
  },
);

export const removeLogo = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await deleteLogo();

  return sendResponse(res, {
    message: "Logo deleted successfully",
    data: settings,
  });
});
