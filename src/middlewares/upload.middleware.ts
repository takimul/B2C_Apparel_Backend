import multer from "multer";

import { AppError } from "../utils/appError.js";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const fileFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
    return;
  }

  callback(
    new AppError("Only JPEG, PNG, WebP and AVIF images are allowed", 400),
  );
};

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});
