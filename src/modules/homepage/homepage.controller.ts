import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/apiResponse.js";

import {
  getHomepage,
  getBannerProducts,
  updateBannerProducts,
} from "./homepage.service.js";

export const getHome = asyncHandler(async (_req: Request, res: Response) => {
  const homepage = await getHomepage();

  return sendResponse(res, {
    message: "Homepage data fetched successfully",
    data: homepage,
  });
});

export const getBanner = asyncHandler(async (_req: Request, res: Response) => {
  const banner = await getBannerProducts();

  return sendResponse(res, {
    message: "Homepage banner fetched successfully",
    data: banner,
  });
});

export const updateBanner = asyncHandler(
  async (req: Request, res: Response) => {
    const banner = await updateBannerProducts(req.body.productIds);

    return sendResponse(res, {
      message: "Homepage banner updated successfully",
      data: banner,
    });
  },
);
