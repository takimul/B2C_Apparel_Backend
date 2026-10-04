import type { RequestHandler } from "express";
import type { ZodType } from "zod";

interface ValidationData {
  body: unknown;
  params: unknown;
  query: unknown;
}

export const validate = (schema: ZodType): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      next(result.error);
      return;
    }

    const data = result.data as ValidationData;

    req.body = data.body;

    next();
  };
};
