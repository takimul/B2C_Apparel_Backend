import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/apiResponse.js";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "./category.service.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const category = await createCategory(req.body);

  return sendResponse(res, {
    statusCode: 201,
    message: "Category created successfully",
    data: category,
  });
});

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await getCategories();

  return sendResponse(res, {
    message: "Categories fetched successfully",
    data: categories,
  });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const category = await getCategoryById(req.params.id as string);

  return sendResponse(res, {
    message: "Category fetched successfully",
    data: category,
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const category = await updateCategory(req.params.id as string, req.body);

  return sendResponse(res, {
    message: "Category updated successfully",
    data: category,
  });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await deleteCategory(req.params.id as string);

  return sendResponse(res, {
    message: "Category deleted successfully",
  });
});
