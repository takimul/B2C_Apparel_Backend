import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/apiResponse.js";

import {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiry,
} from "./inquiry.service.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const inquiry = await createInquiry(req.body);

  return sendResponse(res, {
    statusCode: 201,
    message: "Inquiry submitted successfully",
    data: inquiry,
  });
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await getInquiries({
    status: req.query.status as
      | "NEW"
      | "CONTACTED"
      | "PROCESSING"
      | "COMPLETED"
      | "CANCELLED"
      | undefined,

    productId: req.query.productId as string | undefined,
    search: req.query.search as string | undefined,
    page: Number(req.query.page ?? 1),
    limit: Number(req.query.limit ?? 20),
  });

  return sendResponse(res, {
    message: "Inquiries fetched successfully",
    data: result,
  });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const inquiry = await getInquiryById(req.params.id as string);

  return sendResponse(res, {
    message: "Inquiry fetched successfully",
    data: inquiry,
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const inquiry = await updateInquiry(req.params.id as string, req.body);

  return sendResponse(res, {
    message: "Inquiry updated successfully",
    data: inquiry,
  });
});
