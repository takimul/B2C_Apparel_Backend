import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/appError.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinaryUpload.js";

export const uploadProductImage = async (
  productId: string,
  file: Express.Multer.File,
) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },

    include: {
      images: {
        orderBy: {
          sortOrder: "desc",
        },

        take: 1,
      },
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const upload = await uploadToCloudinary(
    file.buffer,
    "verigo-essential/products",
  );

  const lastImage = product.images[0];

  const sortOrder = lastImage ? lastImage.sortOrder + 1 : 0;

  const image = await prisma.productImage.create({
    data: {
      productId,

      url: upload.url,

      publicId: upload.publicId,

      sortOrder,

      isPrimary: product.images.length === 0,
    },
  });

  return image;
};

export const deleteProductImage = async (
  productId: string,
  imageId: string,
) => {
  const image = await prisma.productImage.findFirst({
    where: {
      id: imageId,
      productId,
    },
  });

  if (!image) {
    throw new AppError("Product image not found", 404);
  }

  await deleteFromCloudinary(image.publicId);

  await prisma.productImage.delete({
    where: {
      id: imageId,
    },
  });

  if (image.isPrimary) {
    const nextImage = await prisma.productImage.findFirst({
      where: {
        productId,
      },

      orderBy: {
        sortOrder: "asc",
      },
    });

    if (nextImage) {
      await prisma.productImage.update({
        where: {
          id: nextImage.id,
        },

        data: {
          isPrimary: true,
        },
      });
    }
  }
};
export const setPrimaryProductImage = async (
  productId: string,
  imageId: string,
) => {
  const image = await prisma.productImage.findFirst({
    where: {
      id: imageId,
      productId,
    },
  });

  if (!image) {
    throw new AppError("Product image not found", 404);
  }

  await prisma.$transaction([
    prisma.productImage.updateMany({
      where: {
        productId,
      },

      data: {
        isPrimary: false,
      },
    }),

    prisma.productImage.update({
      where: {
        id: imageId,
      },

      data: {
        isPrimary: true,
      },
    }),
  ]);

  return prisma.productImage.findUnique({
    where: {
      id: imageId,
    },
  });
};
