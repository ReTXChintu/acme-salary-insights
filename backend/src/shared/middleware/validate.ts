import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny, z } from "zod";

declare module "express-serve-static-core" {
  interface Request {
    validatedBody?: unknown;
    validatedQuery?: unknown;
    validatedParams?: unknown;
  }
}

function validate(source: "body" | "query" | "params", schema: ZodTypeAny) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(request[source]);

      if (source === "body") {
        request.validatedBody = parsed;
        request.body = parsed;
      } else if (source === "query") {
        request.validatedQuery = parsed;
      } else {
        request.validatedParams = parsed;
        request.params = parsed as Request["params"];
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export const validateBody = (schema: ZodTypeAny) => validate("body", schema);
export const validateQuery = (schema: ZodTypeAny) => validate("query", schema);
export const validateParams = (schema: ZodTypeAny) => validate("params", schema);

export function getValidatedQuery<T extends ZodTypeAny>(
  request: Request,
  schema: T,
): z.infer<T> {
  void schema;
  return request.validatedQuery as z.infer<T>;
}

export function getValidatedBody<T extends ZodTypeAny>(
  request: Request,
  schema: T,
): z.infer<T> {
  void schema;
  return (request.validatedBody ?? request.body) as z.infer<T>;
}

export function getValidatedParams<T extends ZodTypeAny>(
  request: Request,
  schema: T,
): z.infer<T> {
  void schema;
  return (request.validatedParams ?? request.params) as z.infer<T>;
}
