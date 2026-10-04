import type { Response } from "express";

interface ApiResponseOptions<T> {
  statusCode?: number;
  message: string;
  data?: T;
}

export const sendResponse = <T>(
  res: Response,
  { statusCode = 200, message, data }: ApiResponseOptions<T>,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
