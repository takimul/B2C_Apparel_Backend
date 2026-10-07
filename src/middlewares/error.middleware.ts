// import type { ErrorRequestHandler } from "express";
// import { ZodError } from "zod";
// import { Prisma } from "../generated/prisma/client.js";
// import { AppError } from "../utils/appError.js";

// export const errorMiddleware: ErrorRequestHandler = (
//   error,
//   _req,
//   res,
//   _next,
// ) => {
//   console.error(error);

//   if (error instanceof ZodError) {
//     return res.status(400).json({
//       success: false,
//       message: "Validation failed",
//       errors: error.flatten(),
//     });
//   }

//   if (error instanceof Prisma.PrismaClientKnownRequestError) {
//     return res.status(400).json({
//       success: false,
//       message: "Database request failed",
//       code: error.code,
//     });
//   }

//   if (error instanceof AppError) {
//     return res.status(error.statusCode).json({
//       success: false,
//       message: error.message,
//     });
//   }

//   return res.status(500).json({
//     success: false,
//     message:
//       process.env.NODE_ENV === "production"
//         ? "Internal server error"
//         : error instanceof Error
//           ? error.message
//           : "Internal server error",
//   });
// };

import type { ErrorRequestHandler } from "express";
// import { Prisma } from "../generated/prisma/index.js";
import { Prisma } from "../generated/prisma/client.js";
import { ZodError } from "zod";
import multer from "multer";
import { AppError } from "../utils/appError.js";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  console.error(error);

  // -----------------------------
  // AppError
  // -----------------------------
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // -----------------------------
  // Zod validation error
  // -----------------------------
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // -----------------------------
  // Multer errors
  // -----------------------------
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size must not exceed 5MB",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // -----------------------------
  // Prisma errors
  // -----------------------------
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return res.status(409).json({
          success: false,
          message: "A record with this value already exists",
        });

      case "P2025":
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });

      case "P2003":
        return res.status(400).json({
          success: false,
          message:
            "This record cannot be modified because it is referenced by another record",
        });

      default:
        return res.status(400).json({
          success: false,
          message: "Database operation failed",
        });
    }
  }

  // -----------------------------
  // Unknown error
  // -----------------------------
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
