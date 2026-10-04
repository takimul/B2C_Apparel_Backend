import { z } from "zod";

const optionalUrl = z.string().trim().url().optional().or(z.literal(""));

export const updateSettingsSchema = z.object({
  body: z.object({
    siteName: z.string().trim().min(1).max(100).optional(),

    tagline: z.string().trim().max(200).optional(),

    email: z.string().trim().email().max(150).optional(),

    phone: z.string().trim().max(30).optional(),

    whatsapp: z.string().trim().max(30).optional(),

    address: z.string().trim().max(500).optional(),

    facebook: optionalUrl,

    instagram: optionalUrl,

    linkedin: optionalUrl,

    youtube: optionalUrl,

    announcementText: z.string().trim().max(500).optional(),
  }),

  params: z.object({}),
  query: z.object({}),
});

export const settingsIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.literal("default"),
  }),
  query: z.object({}),
});
