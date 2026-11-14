import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/apiResponse.js";
import {
  deleteEmployeeImage,
  getEmployeeProfile,
  updateEmployeeProfile,
  uploadEmployeeImage,
} from "./employee.service.js";

export const getEmployee = asyncHandler(
  async (_req: Request, res: Response) => {
    const employee = await getEmployeeProfile();
    return sendResponse(res, {
      message: "Employee profile fetched successfully",
      data: employee,
    });
  },
);

export const updateEmployee = asyncHandler(
  async (req: Request, res: Response) => {
    const employee = await updateEmployeeProfile(req.body);
    return sendResponse(res, {
      message: "Employee profile updated successfully",
      data: employee,
    });
  },
);

export const uploadImage = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      return sendResponse(res, {
        statusCode: 400,
        message: "Employee image is required",
      });
    }

    const employee = await uploadEmployeeImage(req.file);
    return sendResponse(res, {
      message: "Employee image uploaded successfully",
      data: employee,
    });
  },
);

export const removeImage = asyncHandler(
  async (_req: Request, res: Response) => {
    const employee = await deleteEmployeeImage();
    return sendResponse(res, {
      message: "Employee image deleted successfully",
      data: employee,
    });
  },
);

