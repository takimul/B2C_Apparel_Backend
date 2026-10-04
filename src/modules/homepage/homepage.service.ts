import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/appError.js";

export const getHomepage = async () => {
  const [bannerProducts, featuredProducts, categories] =
    await prisma.$transaction([
      prisma.homepageBannerProduct.findMany({
        where: {
          isActive: true,
          product: {
            status: "ACTIVE",
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          id: true,
          sortOrder: true,
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              fabric: true,
              gsm: true,
              composition: true,
              moq: true,
              customization: true,
              customFabric: true,
              customColor: true,
              customPrinting: true,
              customEmbroidery: true,
              customNeckLabel: true,
              customPackaging: true,
              images: {
                orderBy: {
                  sortOrder: "asc",
                },
                select: {
                  id: true,
                  url: true,
                  altText: true,
                  sortOrder: true,
                  isPrimary: true,
                },
              },
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      }),

      prisma.product.findMany({
        where: {
          status: "ACTIVE",
          isFeatured: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 12,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          fabric: true,
          gsm: true,
          composition: true,
          moq: true,
          customization: true,
          images: {
            orderBy: {
              sortOrder: "asc",
            },
            select: {
              id: true,
              url: true,
              altText: true,
              sortOrder: true,
              isPrimary: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),

      prisma.category.findMany({
        where: {
          isActive: true,
          parentId: null,
        },
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            name: "asc",
          },
        ],
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          imageUrl: true,
          sortOrder: true,
          children: {
            where: {
              isActive: true,
            },
            orderBy: {
              sortOrder: "asc",
            },
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              imageUrl: true,
              sortOrder: true,
            },
          },
        },
      }),
    ]);

  return {
    bannerProducts,
    featuredProducts,
    categories,
  };
};

export const getBannerProducts = async () => {
  return prisma.homepageBannerProduct.findMany({
    orderBy: {
      sortOrder: "asc",
    },
    select: {
      id: true,
      productId: true,
      sortOrder: true,
      isActive: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          images: {
            orderBy: {
              sortOrder: "asc",
            },
            select: {
              id: true,
              url: true,
              altText: true,
              sortOrder: true,
              isPrimary: true,
            },
          },
        },
      },
    },
  });
};

export const updateBannerProducts = async (productIds: string[]) => {
  const uniqueProductIds = [...new Set(productIds)];

  if (uniqueProductIds.length !== productIds.length) {
    throw new AppError(
      "Duplicate products are not allowed in the homepage banner",
      400,
    );
  }

  if (uniqueProductIds.length === 0) {
    await prisma.homepageBannerProduct.deleteMany();

    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: uniqueProductIds,
      },
    },
    select: {
      id: true,
      status: true,
      name: true,
    },
  });

  if (products.length !== uniqueProductIds.length) {
    const foundIds = new Set(products.map((product) => product.id));

    const missingIds = uniqueProductIds.filter((id) => !foundIds.has(id));

    throw new AppError(`Product(s) not found: ${missingIds.join(", ")}`, 404);
  }

  const inactiveProducts = products.filter(
    (product) => product.status !== "ACTIVE",
  );

  if (inactiveProducts.length > 0) {
    throw new AppError(
      `Only active products can be added to the homepage banner: ${inactiveProducts
        .map((product) => product.name)
        .join(", ")}`,
      400,
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.homepageBannerProduct.deleteMany();

    await tx.homepageBannerProduct.createMany({
      data: uniqueProductIds.map((productId, index) => ({
        productId,
        sortOrder: index,
        isActive: true,
      })),
    });
  });

  return getBannerProducts();
};
