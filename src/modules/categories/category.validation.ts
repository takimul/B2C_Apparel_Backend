import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(100, "Category name cannot exceed 100 characters"),

    slug: z
      .string()
      .trim()
      .min(2, "Slug must be at least 2 characters")
      .max(120, "Slug cannot exceed 120 characters")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug can only contain lowercase letters, numbers and hyphens",
      ),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),

    imageUrl: z.string().url("Invalid image URL").optional().nullable(),

    parentId: z.string().min(1).optional().nullable(),

    sortOrder: z.number().int().min(0).optional(),

    isActive: z.boolean().optional(),
  }),

  params: z.object({}),
  query: z.object({}),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),

    slug: z
      .string()
      .trim()
      .min(2)
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
      .optional(),

    description: z.string().trim().max(500).optional().nullable(),

    imageUrl: z.string().url("Invalid image URL").optional().nullable(),

    parentId: z.string().min(1).optional().nullable(),

    sortOrder: z.number().int().min(0).optional(),

    isActive: z.boolean().optional(),
  }),

  params: z.object({
    id: z.string().min(1),
  }),

  query: z.object({}),
});

export const categoryIdSchema = z.object({
  body: z.object({}),

  params: z.object({
    id: z.string().min(1),
  }),

  query: z.object({}),
});
