import type { NextFunction, Request, Response, Router } from "express";
import { Router as createRouter } from "express";
import { ZodError } from "zod";

import { EmployeeNotFoundError } from "../employees/employee.errors.js";
import { EmployeeService } from "../employees/employee.service.js";
import { employeeIdParamsSchema } from "../employees/employee.schemas.js";

import {
  InvalidCurrencyError,
  InvalidSalaryAmountError,
} from "./salary.errors.js";
import { createSalarySchema } from "./salary.schemas.js";
import { SalaryService } from "./salary.service.js";

function handleSalaryError(
  error: unknown,
  _request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (error instanceof EmployeeNotFoundError) {
    response.status(404).json({ error: error.message });
    return;
  }

  if (
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

  next(error);
}

export function createSalaryRoutes(
  salaryService = new SalaryService(),
  employeeService = new EmployeeService(),
): Router {
  const router = createRouter({ mergeParams: true });

  router.get("/", async (request, response, next) => {
    try {
      const { id } = employeeIdParamsSchema.parse(request.params);

      await employeeService.getById(id);

      const history = await salaryService.getSalaryHistory(id);

      response.status(200).json({ data: history });
    } catch (error) {
      handleSalaryError(error, request, response, next);
    }
  });

  router.post("/", async (request, response, next) => {
    try {
      const { id } = employeeIdParamsSchema.parse(request.params);
      const input = createSalarySchema.parse(request.body);
      const salary = await salaryService.createSalary({
        employeeId: id,
        ...input,
      });

      response.status(201).json(salary);
    } catch (error) {
      handleSalaryError(error, request, response, next);
    }
  });

  return router;
}

export const salaryRoutes = createSalaryRoutes();
