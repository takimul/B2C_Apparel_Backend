import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/apiResponse.js";

import {
  createProduct,
  getProducts,
  getProductBySlug,
  getProductById,
  updateProduct,
  archiveProduct,
} from "./product.service.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const product = await createProduct(req.body);

  return sendResponse(res, {
    statusCode: 201,
    message: "Product created successfully",
    data: product,
  });
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId, status, featured, search } = req.query;

  const products = await getProducts({
    categoryId: typeof categoryId === "string" ? categoryId : undefined,

    status:
      status === "DRAFT" || status === "ACTIVE" || status === "ARCHIVED"
        ? status
        : undefined,

    featured:
      featured === "true" ? true : featured === "false" ? false : undefined,

    search: typeof search === "string" ? search : undefined,
  });

  return sendResponse(res, {
    message: "Products fetched successfully",
    data: products,
  });
});

export const getOneById = asyncHandler(async (req: Request, res: Response) => {
  const product = await getProductById(req.params.id as string);

  return sendResponse(res, {
    message: "Product fetched successfully",
    data: product,
  });
});

export const getOneBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await getProductBySlug(req.params.slug as string);

    return sendResponse(res, {
      message: "Product fetched successfully",
      data: product,
    });
  },
);

export const update = asyncHandler(async (req: Request, res: Response) => {
  const product = await updateProduct(req.params.id as string, req.body);

  return sendResponse(res, {
    message: "Product updated successfully",
    data: product,
  });
});

export const archive = asyncHandler(async (req: Request, res: Response) => {
  await archiveProduct(req.params.id as string);

  return sendResponse(res, {
    message: "Product archived successfully",
  });
});
