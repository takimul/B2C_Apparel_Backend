import { z } from "zod";

const customizationEnum = z.enum(["YES", "NO", "AVAILABLE_ON_REQUEST"]);

const productStatusEnum = z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]);

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Product name must be at least 2 characters")
      .max(200, "Product name cannot exceed 200 characters"),

    slug: z
      .string()
      .trim()
      .min(2)
      .max(220)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug can only contain lowercase letters, numbers and hyphens",
      ),

    description: z.string().trim().max(5000).optional().nullable(),

    categoryId: z.string().min(1, "Category is required"),

    fabric: z.string().trim().max(200).optional().nullable(),

    gsm: z.number().int().positive().optional().nullable(),

    composition: z.string().trim().max(500).optional().nullable(),

    washingInfo: z.string().trim().max(1000).optional().nullable(),

    sizes: z.array(z.string().trim().min(1)).default([]),

    colors: z.array(z.string().trim().min(1)).default([]),

    moq: z.number().int().positive("MOQ must be greater than 0"),

    customization: customizationEnum.default("AVAILABLE_ON_REQUEST"),

    customFabric: z.boolean().default(false),
    customColor: z.boolean().default(false),
    customPrinting: z.boolean().default(false),
    customEmbroidery: z.boolean().default(false),
    customNeckLabel: z.boolean().default(false),
    customPackaging: z.boolean().default(false),

    isFeatured: z.boolean().default(false),

    status: productStatusEnum.default("DRAFT"),
  }),

  params: z.object({}),
  query: z.object({}),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(200).optional(),

    slug: z
      .string()
      .trim()
      .min(2)
      .max(220)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
      .optional(),

    description: z.string().trim().max(5000).optional().nullable(),

    categoryId: z.string().min(1).optional(),

    fabric: z.string().trim().max(200).optional().nullable(),

    gsm: z.number().int().positive().optional().nullable(),

    composition: z.string().trim().max(500).optional().nullable(),

    washingInfo: z.string().trim().max(1000).optional().nullable(),

    sizes: z.array(z.string().trim().min(1)).optional(),

    colors: z.array(z.string().trim().min(1)).optional(),

    moq: z.number().int().positive().optional(),

    customization: customizationEnum.optional(),

    customFabric: z.boolean().optional(),
    customColor: z.boolean().optional(),
    customPrinting: z.boolean().optional(),
    customEmbroidery: z.boolean().optional(),
    customNeckLabel: z.boolean().optional(),
    customPackaging: z.boolean().optional(),

    isFeatured: z.boolean().optional(),

    status: productStatusEnum.optional(),
  }),

  params: z.object({
    id: z.string().min(1),
  }),

  query: z.object({}),
});

export const productIdSchema = z.object({
  body: z.object({}),

  params: z.object({
    id: z.string().min(1),
  }),

  query: z.object({}),
});

export const productSlugSchema = z.object({
  body: z.object({}),

  params: z.object({
    slug: z.string().min(1),
  }),

  query: z.object({}),
});
