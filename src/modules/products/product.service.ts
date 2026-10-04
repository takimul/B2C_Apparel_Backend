import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/appError.js";

interface CreateProductInput {
  name: string;
  slug: string;
  description?: string | null;

  categoryId: string;

  fabric?: string | null;
  gsm?: number | null;
  composition?: string | null;
  washingInfo?: string | null;

  sizes: string[];
  colors: string[];

  moq: number;

  customization: "YES" | "NO" | "AVAILABLE_ON_REQUEST";

  customFabric: boolean;
  customColor: boolean;
  customPrinting: boolean;
  customEmbroidery: boolean;
  customNeckLabel: boolean;
  customPackaging: boolean;

  isFeatured: boolean;

  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
}

interface UpdateProductInput {
  name?: string;
  slug?: string;
  description?: string | null;

  categoryId?: string;

  fabric?: string | null;
  gsm?: number | null;
  composition?: string | null;
  washingInfo?: string | null;

  sizes?: string[];
  colors?: string[];

  moq?: number;

  customization?: "YES" | "NO" | "AVAILABLE_ON_REQUEST";

  customFabric?: boolean;
  customColor?: boolean;
  customPrinting?: boolean;
  customEmbroidery?: boolean;
  customNeckLabel?: boolean;
  customPackaging?: boolean;

  isFeatured?: boolean;

  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
}

// add

export const createProduct = async (data: CreateProductInput) => {
  const existingSlug = await prisma.product.findUnique({
    where: {
      slug: data.slug,
    },
  });

  if (existingSlug) {
    throw new AppError("A product with this slug already exists", 409);
  }

  const category = await prisma.category.findUnique({
    where: {
      id: data.categoryId,
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,

      categoryId: data.categoryId,

      fabric: data.fabric,
      gsm: data.gsm,
      composition: data.composition,
      washingInfo: data.washingInfo,

      sizes: data.sizes,
      colors: data.colors,

      moq: data.moq,

      customization: data.customization,

      customFabric: data.customFabric,
      customColor: data.customColor,
      customPrinting: data.customPrinting,
      customEmbroidery: data.customEmbroidery,
      customNeckLabel: data.customNeckLabel,
      customPackaging: data.customPackaging,

      isFeatured: data.isFeatured,

      status: data.status,
    },

    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
};

// get

interface GetProductsOptions {
  categoryId?: string;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
  featured?: boolean;
  search?: string;
}

export const getProducts = async (options: GetProductsOptions = {}) => {
  const { categoryId, status, featured, search } = options;

  return prisma.product.findMany({
    where: {
      ...(categoryId
        ? {
            categoryId,
          }
        : {}),

      ...(status
        ? {
            status,
          }
        : {}),

      ...(featured !== undefined
        ? {
            isFeatured: featured,
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
};

//by id

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: {
      slug,
    },

    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!product || product.status !== "ACTIVE") {
    throw new AppError("Product not found", 404);
  }

  return product;
};

//for admin

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },

    include: {
      category: true,

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },

      _count: {
        select: {
          inquiries: true,
        },
      },
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

//update

export const updateProduct = async (id: string, data: UpdateProductInput) => {
  const existing = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw new AppError("Product not found", 404);
  }

  if (data.slug && data.slug !== existing.slug) {
    const slugExists = await prisma.product.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (slugExists) {
      throw new AppError("A product with this slug already exists", 409);
    }
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }
  }

  return prisma.product.update({
    where: {
      id,
    },

    data,

    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
};

//delete

export const archiveProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return prisma.product.update({
    where: {
      id,
    },

    data: {
      status: "ARCHIVED",
    },
  });
};
