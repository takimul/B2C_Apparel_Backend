import { z } from "zod";

const inquiryStatusEnum = z.enum([
  "NEW",
  "CONTACTED",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
]);

export const createInquirySchema = z.object({
  body: z.object({
    productId: z.string().cuid().optional(),
    name: z.string().trim().min(2).max(100),
    companyName: z.string().trim().max(150).optional(),
    email: z.string().trim().email().max(150),
    phone: z.string().trim().min(5).max(30),
    country: z.string().trim().max(100).optional(),
    quantity: z.coerce.number().int().positive().optional(),
    customBranding: z.boolean().default(false),
    message: z.string().trim().max(2000).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const inquiryIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().cuid(),
  }),
  query: z.object({}),
});

export const getInquiriesSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    status: inquiryStatusEnum.optional(),
    productId: z.string().cuid().optional(),
    search: z.string().trim().max(100).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const updateInquirySchema = z.object({
  body: z.object({
    status: inquiryStatusEnum.optional(),
    adminNotes: z.string().trim().max(3000).nullable().optional(),
  }),
  params: z.object({
    id: z.string().cuid(),
  }),
  query: z.object({}),
});
