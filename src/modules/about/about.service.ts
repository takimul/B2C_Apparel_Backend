import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/appError.js";

import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinaryUpload.js";

const DEFAULT_ABOUT = {
  id: "default",
  title: "About Verigo Essential",
  description: "Premium apparel wholesale and custom manufacturing solutions.",
};

export const getPublicAbout = async () => {
  let about = await prisma.aboutPage.findUnique({
    where: {
      id: "default",
    },
    select: {
      id: true,
      title: true,
      description: true,
      story: true,
      mission: true,
      capabilities: true,
      exportInfo: true,
      whyChooseUs: true,
      imageUrl: true,
      updatedAt: true,
    },
  });

  if (!about) {
    about = await prisma.aboutPage.create({
      data: DEFAULT_ABOUT,
      select: {
        id: true,
        title: true,
        description: true,
        story: true,
        mission: true,
        capabilities: true,
        exportInfo: true,
        whyChooseUs: true,
        imageUrl: true,
        updatedAt: true,
      },
    });
  }

  return about;
};

export const getAdminAbout = async () => {
  let about = await prisma.aboutPage.findUnique({
    where: {
      id: "default",
    },
  });

  if (!about) {
    about = await prisma.aboutPage.create({
      data: DEFAULT_ABOUT,
    });
  }

  return about;
};

export const updateAbout = async (data: {
  title?: string;
  description?: string;
  story?: string | null;
  mission?: string | null;
  capabilities?: string | null;
  exportInfo?: string | null;
  whyChooseUs?: string | null;
}) => {
  return prisma.aboutPage.upsert({
    where: {
      id: "default",
    },

    update: data,

    create: {
      ...DEFAULT_ABOUT,
      ...data,
    },
  });
};

export const uploadAboutImage = async (file: Express.Multer.File) => {
  const about = await getAdminAbout();

  const uploaded = await uploadToCloudinary(
    file.buffer,
    "verigo-essential/about",
  );

  if (about.imagePublicId) {
    try {
      await deleteFromCloudinary(about.imagePublicId);
    } catch (error) {
      console.error(
        "Failed to delete previous about image from Cloudinary:",
        error,
      );
    }
  }

  return prisma.aboutPage.update({
    where: {
      id: "default",
    },
    data: {
      imageUrl: uploaded.url,
      imagePublicId: uploaded.publicId,
    },
  });
};

export const deleteAboutImage = async () => {
  const about = await getAdminAbout();

  if (!about.imagePublicId) {
    throw new AppError("No about page image is currently configured", 404);
  }

  try {
    await deleteFromCloudinary(about.imagePublicId);
  } catch (error) {
    console.error("Failed to delete about image from Cloudinary:", error);
  }

  return prisma.aboutPage.update({
    where: {
      id: "default",
    },
    data: {
      imageUrl: null,
      imagePublicId: null,
    },
  });
};
