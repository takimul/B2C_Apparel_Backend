import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/apiResponse.js";
import { AppError } from "../../utils/appError.js";

import {
  uploadProductImage,
  deleteProductImage,
  setPrimaryProductImage,
} from "./product-image.service.js";

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError("Image file is required", 400);
  }

  const image = await uploadProductImage(req.params.id as string, req.file);

  return sendResponse(res, {
    statusCode: 201,
    message: "Product image uploaded successfully",
    data: image,
  });
});

export const removeImage = asyncHandler(async (req: Request, res: Response) => {
  await deleteProductImage(
    req.params.id as string,
    req.params.imageId as string,
  );

  return sendResponse(res, {
    message: "Product image deleted successfully",
  });
});

export const setPrimary = asyncHandler(async (req: Request, res: Response) => {
  const image = await setPrimaryProductImage(
    req.params.id as string,
    req.params.imageId as string,
  );

  return sendResponse(res, {
    message: "Primary image updated successfully",
    data: image,
  });
});
