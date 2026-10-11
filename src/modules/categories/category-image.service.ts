import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/appError.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinaryUpload.js";

export const uploadCategoryImage = async (
  categoryId: string,
  file: Express.Multer.File,
) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const upload = await uploadToCloudinary(
    file.buffer,
    "verigo-essential/categories",
  );

  try {
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { imageUrl: upload.url },
      include: { parent: true },
    });

    // Remove the old Cloudinary image after the new one is saved.
    if (category.imageUrl) {
      const oldPublicId = extractCloudinaryPublicId(category.imageUrl);

      if (oldPublicId) {
        try {
          await deleteFromCloudinary(oldPublicId);
        } catch (error) {
          // Keep the successful replacement even if old-image cleanup fails.
          console.error("Failed to delete previous category image:", error);
        }
      }
    }

    return updatedCategory;
  } catch (error) {
    // Avoid leaving the newly uploaded image behind if the DB update fails.
    try {
      await deleteFromCloudinary(upload.publicId);
    } catch (cleanupError) {
      console.error(
        "Failed to clean up uploaded category image:",
        cleanupError,
      );
    }

    throw error;
  }
};

export const deleteCategoryImage = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  if (!category.imageUrl) {
    throw new AppError("This category has no image", 404);
  }

  const publicId = extractCloudinaryPublicId(category.imageUrl);

  // Clear the database first so the category remains usable if Cloudinary
  // is temporarily unavailable.
  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: { imageUrl: null },
    include: { parent: true },
  });

  if (publicId) {
    try {
      await deleteFromCloudinary(publicId);
    } catch (error) {
      console.error("Failed to delete category image from Cloudinary:", error);
    }
  }

  return updatedCategory;
};

/**
 * Extracts the public ID from a Cloudinary delivery URL.
 * Example:
 * https://res.cloudinary.com/cloud/image/upload/v123/verigo-essential/categories/example.jpg
 * -> verigo-essential/categories/example
 */
function extractCloudinaryPublicId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const marker = "/image/upload/";
    const index = parsed.pathname.indexOf(marker);

    if (index === -1) return null;

    let path = parsed.pathname.slice(index + marker.length);
    path = path.replace(/^v\d+\//, "");

    // Remove the file extension, preserving folders in the public ID.
    return path.replace(/\.[^/.]+$/, "") || null;
  } catch {
    return null;
  }
}
