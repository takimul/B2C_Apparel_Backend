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
  getAdminProducts,
} from "./product.service.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const product = await createProduct(req.body);

  return sendResponse(res, {
    statusCode: 201,
    message: "Product created successfully",
    data: product,
  });
});

export const getAdminAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAdminProducts({
    status: req.query.status as "DRAFT" | "ACTIVE" | "ARCHIVED" | undefined,

    categoryId: req.query.categoryId as string | undefined,

    featured:
      req.query.featured !== undefined
        ? req.query.featured === "true"
        : undefined,

    search: req.query.search as string | undefined,

    page: Number(req.query.page ?? 1),
    limit: Number(req.query.limit ?? 20),
  });

  return sendResponse(res, {
    message: "Admin products fetched successfully",
    data: result,
  });
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId, featured, search, page, limit } = req.query;

  const products = await getProducts({
    categoryId: typeof categoryId === "string" ? categoryId : undefined,

    featured:
      featured === "true" ? true : featured === "false" ? false : undefined,

    search: typeof search === "string" ? search : undefined,

    page: typeof page === "string" ? Number(page) : 1,

    limit: typeof limit === "string" ? Number(limit) : 20,
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
