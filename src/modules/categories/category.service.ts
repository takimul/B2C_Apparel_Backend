import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/appError.js";

interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string | null;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

const getDescendantIds = async (categoryId: string): Promise<string[]> => {
  const children = await prisma.category.findMany({
    where: {
      parentId: categoryId,
    },
    select: {
      id: true,
    },
  });

  const ids: string[] = [];

  for (const child of children) {
    ids.push(child.id);

    const descendants = await getDescendantIds(child.id);

    ids.push(...descendants);
  }

  return ids;
};

export const createCategory = async (data: CreateCategoryInput) => {
  const existingSlug = await prisma.category.findUnique({
    where: {
      slug: data.slug,
    },
  });

  if (existingSlug) {
    throw new AppError("A category with this slug already exists", 409);
  }

  if (data.parentId) {
    const parent = await prisma.category.findUnique({
      where: {
        id: data.parentId,
      },
    });

    if (!parent) {
      throw new AppError("Parent category not found", 404);
    }
  }

  return prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      imageUrl: data.imageUrl,
      parentId: data.parentId,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    },

    include: {
      parent: true,
    },
  });
};

export const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        name: "asc",
      },
    ],

    include: {
      parent: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      _count: {
        select: {
          products: true,
          children: true,
        },
      },
    },
  });
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },

    include: {
      parent: true,

      children: {
        orderBy: {
          sortOrder: "asc",
        },
      },

      products: {
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

export const updateCategory = async (id: string, data: UpdateCategoryInput) => {
  const existing = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw new AppError("Category not found", 404);
  }

  if (data.slug && data.slug !== existing.slug) {
    const slugExists = await prisma.category.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (slugExists) {
      throw new AppError("A category with this slug already exists", 409);
    }
  }

  if (data.parentId) {
    if (data.parentId === id) {
      throw new AppError("A category cannot be its own parent", 400);
    }

    const parent = await prisma.category.findUnique({
      where: {
        id: data.parentId,
      },
    });

    if (!parent) {
      throw new AppError("Parent category not found", 404);
    }

    const descendantIds = await getDescendantIds(id);

    if (descendantIds.includes(data.parentId)) {
      throw new AppError("Cannot assign a child category as its parent", 400);
    }
  }

  return prisma.category.update({
    where: {
      id,
    },

    data,

    include: {
      parent: true,
    },
  });
};

export const deleteCategory = async (
  id: string,
  options?: { reassignToId?: string; cascade?: boolean },
) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          products: true,
          children: true,
        },
      },
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // Handle reassignment if a target category ID is supplied
  if (options?.reassignToId) {
    if (options.reassignToId === id) {
      throw new AppError("Cannot reassign items to the category being deleted", 400);
    }

    const targetCategory = await prisma.category.findUnique({
      where: { id: options.reassignToId },
    });

    if (!targetCategory) {
      throw new AppError("Target category for reassignment not found", 404);
    }

    // Move products in this category to the target category
    await prisma.product.updateMany({
      where: { categoryId: id },
      data: { categoryId: options.reassignToId },
    });

    // Move direct child subcategories to the target category
    await prisma.category.updateMany({
      where: { parentId: id },
      data: { parentId: options.reassignToId },
    });
  } else if (options?.cascade) {
    // Collect all descendant category IDs
    const descendantIds = await getDescendantIds(id);
    const allTargetIds = [id, ...descendantIds];

    // Force delete all products in this category and all descendants
    await prisma.product.deleteMany({
      where: { categoryId: { in: allTargetIds } },
    });

    // Force delete descendant categories
    if (descendantIds.length > 0) {
      await prisma.category.deleteMany({
        where: { id: { in: descendantIds } },
      });
    }
  } else {
    // If not reassigning and not cascading, check if category has products or subcategories
    if (category._count.products > 0) {
      throw new AppError(
        `Cannot delete "${category.name}" because it contains ${category._count.products} product(s). Please move products first or select a category to reassign them to.`,
        409,
      );
    }

    if (category._count.children > 0) {
      throw new AppError(
        `Cannot delete "${category.name}" because it contains ${category._count.children} subcategory(ies). Please move or delete subcategories first.`,
        409,
      );
    }
  }

  await prisma.category.delete({
    where: {
      id,
    },
  });
};
