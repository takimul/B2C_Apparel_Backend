import { z } from "zod";

export const updateBannerSchema = z.object({
  body: z.object({
    productIds: z.array(z.string().cuid()).max(10).default([]),
  }),
  params: z.object({}),
  query: z.object({}),
});
