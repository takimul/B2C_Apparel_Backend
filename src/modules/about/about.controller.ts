import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/apiResponse.js";

import {
  deleteAboutImage,
  getAdminAbout,
  getPublicAbout,
  updateAbout,
  uploadAboutImage,
} from "./about.service.js";

export const getPublic = asyncHandler(async (_req: Request, res: Response) => {
  const about = await getPublicAbout();

  return sendResponse(res, {
    message: "About information fetched successfully",
    data: about,
  });
});

export const getAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const about = await getAdminAbout();

  return sendResponse(res, {
    message: "About information fetched successfully",
    data: about,
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const about = await updateAbout(req.body);

  return sendResponse(res, {
    message: "About information updated successfully",
    data: about,
  });
});

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return sendResponse(res, {
      statusCode: 400,
      message: "About page image is required",
    });
  }

  const about = await uploadAboutImage(req.file);

  return sendResponse(res, {
    message: "About page image uploaded successfully",
    data: about,
  });
});

export const removeImage = asyncHandler(
  async (_req: Request, res: Response) => {
    const about = await deleteAboutImage();

    return sendResponse(res, {
      message: "About page image deleted successfully",
      data: about,
    });
  },
);
