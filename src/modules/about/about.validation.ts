import { z } from "zod";

export const updateAboutSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(200).optional(),

    description: z.string().trim().min(1).max(2000).optional(),

    story: z.string().trim().max(5000).nullable().optional(),

    mission: z.string().trim().max(5000).nullable().optional(),

    capabilities: z.string().trim().max(5000).nullable().optional(),

    exportInfo: z.string().trim().max(5000).nullable().optional(),

    whyChooseUs: z.string().trim().max(5000).nullable().optional(),
  }),

  params: z.object({}),
  query: z.object({}),
});
