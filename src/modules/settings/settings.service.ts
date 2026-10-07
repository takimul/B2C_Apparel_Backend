import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/appError.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinaryUpload.js";

export const getPublicSettings = async () => {
  let settings = await prisma.siteSettings.findUnique({
    where: {
      id: "default",
    },
    select: {
      id: true,
      siteName: true,
      tagline: true,

      logoUrl: true,

      bannerImageUrl: true,

      email: true,
      phone: true,
      whatsapp: true,
      address: true,

      facebook: true,
      instagram: true,
      linkedin: true,
      youtube: true,

      announcementText: true,
      updatedAt: true,
    },
  });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        id: "default",
      },
      select: {
        id: true,
        siteName: true,
        tagline: true,

        logoUrl: true,

        bannerImageUrl: true,

        email: true,
        phone: true,
        whatsapp: true,
        address: true,

        facebook: true,
        instagram: true,
        linkedin: true,
        youtube: true,

        announcementText: true,
        updatedAt: true,
      },
    });
  }

  return settings;
};

export const getAdminSettings = async () => {
  let settings = await prisma.siteSettings.findUnique({
    where: {
      id: "default",
    },
  });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        id: "default",
      },
    });
  }

  return settings;
};

export const updateSettings = async (data: {
  siteName?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  announcementText?: string;
}) => {
  return prisma.siteSettings.upsert({
    where: {
      id: "default",
    },

    update: data,

    create: {
      id: "default",
      ...data,
    },
  });
};

export const uploadLogo = async (file: Express.Multer.File) => {
  const settings = await getAdminSettings();

  const uploaded = await uploadToCloudinary(
    file.buffer,
    "verigo-essential/settings",
  );

  if (settings.logoPublicId) {
    try {
      await deleteFromCloudinary(settings.logoPublicId);
    } catch (error) {
      console.error("Failed to delete previous logo from Cloudinary:", error);
    }
  }

  return prisma.siteSettings.update({
    where: {
      id: "default",
    },
    data: {
      logoUrl: uploaded.url,
      logoPublicId: uploaded.publicId,
    },
  });
};

export const deleteLogo = async () => {
  const settings = await getAdminSettings();

  if (!settings.logoPublicId) {
    throw new AppError("No logo is currently configured", 404);
  }

  try {
    await deleteFromCloudinary(settings.logoPublicId);
  } catch (error) {
    console.error("Failed to delete logo from Cloudinary:", error);
  }

  return prisma.siteSettings.update({
    where: {
      id: "default",
    },
    data: {
      logoUrl: null,
      logoPublicId: null,
    },
  });
};

export const uploadBannerImage = async (file: Express.Multer.File) => {
  const settings = await getAdminSettings();

  const uploaded = await uploadToCloudinary(
    file.buffer,
    "verigo-essential/settings/banner",
  );

  if (settings.bannerImagePublicId) {
    try {
      await deleteFromCloudinary(settings.bannerImagePublicId);
    } catch (error) {
      console.error(
        "Failed to delete previous banner image from Cloudinary:",
        error,
      );
    }
  }

  return prisma.siteSettings.update({
    where: {
      id: "default",
    },
    data: {
      bannerImageUrl: uploaded.url,
      bannerImagePublicId: uploaded.publicId,
    },
  });
};

export const deleteBannerImage = async () => {
  const settings = await getAdminSettings();

  if (!settings.bannerImagePublicId) {
    throw new AppError("No banner image is currently configured", 404);
  }

  try {
    await deleteFromCloudinary(settings.bannerImagePublicId);
  } catch (error) {
    console.error("Failed to delete banner image from Cloudinary:", error);
  }

  return prisma.siteSettings.update({
    where: {
      id: "default",
    },
    data: {
      bannerImageUrl: null,
      bannerImagePublicId: null,
    },
  });
};
