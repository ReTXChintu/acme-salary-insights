import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { Prisma } from "../../generated/prisma/client.js";
import {
  DuplicateEmailError,
  EmployeeNotFoundError,
  InvalidCountryError,
  InvalidDepartmentError,
} from "../../modules/employees/employee.errors.js";
import {
  InvalidCurrencyError,
  InvalidSalaryAmountError,
} from "../../modules/salaries/salary.errors.js";

type ErrorPayload = {
  error: string;
  code?: string;
  message?: string;
  stack?: string;
};

function logError(error: unknown, request: Request): void {
  const context = `${request.method} ${request.originalUrl}`;

  if (error instanceof Error) {
    console.error(`[${context}] ${error.name}: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    return;
  }

  console.error(`[${context}]`, error);
}

function devErrorDetails(error: Error): Pick<ErrorPayload, "message" | "stack"> {
  return {
    message: error.message,
    stack: error.stack,
  };
}

export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  void next;
  if (error instanceof EmployeeNotFoundError) {
    response.status(404).json({ error: error.message });
    return;
  }

  if (error instanceof DuplicateEmailError) {
    response.status(409).json({ error: error.message });
    return;
  }

  if (
    error instanceof InvalidDepartmentError ||
    error instanceof InvalidCountryError ||
    error instanceof InvalidSalaryAmountError ||
    error instanceof InvalidCurrencyError
  ) {
    response.status(400).json({ error: error.message });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      error: "Validation failed",
      details: error.issues,
    });
    return;
  }

  logError(error, request);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const payload: ErrorPayload = {
      error: "Database request failed",
    };

    if (process.env.NODE_ENV !== "production") {
      payload.code = error.code;
      Object.assign(payload, devErrorDetails(error));
    }

    response.status(500).json(payload);
    return;
  }

  if (
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientInitializationError
  ) {
    const payload: ErrorPayload = {
      error: "Database error",
    };

    if (process.env.NODE_ENV !== "production" && error instanceof Error) {
      Object.assign(payload, devErrorDetails(error));
    }

    response.status(500).json(payload);
    return;
  }

  const payload: ErrorPayload = {
    error: "Internal server error",
  };

  if (process.env.NODE_ENV !== "production" && error instanceof Error) {
    Object.assign(payload, devErrorDetails(error));
  }

  response.status(500).json(payload);
}
