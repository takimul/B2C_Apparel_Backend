import type { Request, Response } from "express";
import {
  getStorefrontContent,
  updateStorefrontContent,
} from "./content.service.js";

export const getContent = async (_req: Request, res: Response) => {
  const data = await getStorefrontContent();

  res.status(200).json({
    success: true,
    message: "Storefront content retrieved successfully",
    data,
  });
};

export const updateContent = async (req: Request, res: Response) => {
  const body = req.body || {};
  let updates: Record<string, string> = {};

  if (body.key && typeof body.value === "string") {
    updates[body.key] = body.value;
  } else if (body.content && typeof body.content === "object") {
    updates = body.content;
  } else if (typeof body === "object" && !Array.isArray(body)) {
    updates = body;
  }

  const data = await updateStorefrontContent(updates);

  res.status(200).json({
    success: true,
    message: "Storefront content updated successfully",
    data,
  });
};

