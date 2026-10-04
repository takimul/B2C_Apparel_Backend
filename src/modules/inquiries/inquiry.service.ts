import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/appError.js";

interface CreateInquiryInput {
  productId?: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  country?: string;
  quantity?: number;
  customBranding?: boolean;
  message?: string;
}

interface GetInquiriesInput {
  status?: "NEW" | "CONTACTED" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  productId?: string;
  search?: string;
  page: number;
  limit: number;
}

interface UpdateInquiryInput {
  status?: "NEW" | "CONTACTED" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  adminNotes?: string | null;
}

export const createInquiry = async (data: CreateInquiryInput) => {
  let product = null;

  if (data.productId) {
    product = await prisma.product.findUnique({
      where: {
        id: data.productId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        moq: true,
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.status !== "ACTIVE") {
      throw new AppError(
        "Inquiries can only be submitted for active products",
        400,
      );
    }

    if (data.quantity !== undefined && data.quantity < product.moq) {
      throw new AppError(
        `Minimum order quantity for this product is ${product.moq}`,
        400,
      );
    }
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      productId: data.productId,
      name: data.name,
      companyName: data.companyName,
      email: data.email.toLowerCase(),
      phone: data.phone,
      country: data.country,
      quantity: data.quantity,
      customBranding: data.customBranding ?? false,
      message: data.message,
    },
    select: {
      id: true,
      productId: true,
      name: true,
      companyName: true,
      email: true,
      phone: true,
      country: true,
      quantity: true,
      customBranding: true,
      message: true,
      status: true,
      createdAt: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          moq: true,
        },
      },
    },
  });

  return inquiry;
};

export const getInquiries = async ({
  status,
  productId,
  search,
  page,
  limit,
}: GetInquiriesInput) => {
  const skip = (page - 1) * limit;

  const where = {
    ...(status ? { status } : {}),
    ...(productId ? { productId } : {}),
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              companyName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              phone: {
                contains: search,
              },
            },
          ],
        }
      : {}),
  };

  const [inquiries, total] = await prisma.$transaction([
    prisma.inquiry.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        companyName: true,
        email: true,
        phone: true,
        country: true,
        quantity: true,
        customBranding: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),

    prisma.inquiry.count({
      where,
    }),
  ]);

  return {
    items: inquiries,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getInquiryById = async (id: string) => {
  const inquiry = await prisma.inquiry.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      productId: true,
      name: true,
      companyName: true,
      email: true,
      phone: true,
      country: true,
      quantity: true,
      customBranding: true,
      message: true,
      status: true,
      adminNotes: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          moq: true,
          status: true,
          images: {
            orderBy: {
              sortOrder: "asc",
            },
            select: {
              id: true,
              url: true,
              altText: true,
              isPrimary: true,
            },
          },
        },
      },
    },
  });

  if (!inquiry) {
    throw new AppError("Inquiry not found", 404);
  }

  return inquiry;
};

export const updateInquiry = async (id: string, data: UpdateInquiryInput) => {
  const existing = await prisma.inquiry.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw new AppError("Inquiry not found", 404);
  }

  return prisma.inquiry.update({
    where: {
      id,
    },
    data: {
      ...(data.status !== undefined
        ? {
            status: data.status,
          }
        : {}),
      ...(data.adminNotes !== undefined
        ? {
            adminNotes: data.adminNotes,
          }
        : {}),
    },
    select: {
      id: true,
      productId: true,
      name: true,
      companyName: true,
      email: true,
      phone: true,
      country: true,
      quantity: true,
      customBranding: true,
      message: true,
      status: true,
      adminNotes: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
};
