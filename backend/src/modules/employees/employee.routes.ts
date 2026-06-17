import type { NextFunction, Request, Response, Router } from "express";
import { Router as createRouter } from "express";
import { ZodError } from "zod";

import {
  DuplicateEmailError,
  EmployeeNotFoundError,
  InvalidCountryError,
  InvalidDepartmentError,
} from "./employee.errors.js";
import {
  createEmployeeSchema,
  employeeIdParamsSchema,
  listEmployeesQuerySchema,
  updateEmployeeSchema,
} from "./employee.schemas.js";
import { EmployeeService } from "./employee.service.js";

function handleEmployeeError(
  error: unknown,
  _request: Request,
  response: Response,
  next: NextFunction,
): void {
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
    error instanceof InvalidCountryError
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

export function createEmployeeRoutes(
  employeeService = new EmployeeService(),
): Router {
  const router = createRouter();

  router.get("/", async (request, response, next) => {
    try {
      const query = listEmployeesQuerySchema.parse(request.query);

      if (query.search) {
        const data = await employeeService.search(query.search);

        response.status(200).json({
          data,
          total: data.length,
        });
        return;
      }

      const result = await employeeService.list({
        departmentId: query.departmentId,
        countryId: query.countryId,
        page: query.page,
        pageSize: query.pageSize,
      });

      response.status(200).json(result);
    } catch (error) {
      handleEmployeeError(error, request, response, next);
    }
  });

  router.get("/:id", async (request, response, next) => {
    try {
      const { id } = employeeIdParamsSchema.parse(request.params);
      const employee = await employeeService.getById(id);

      response.status(200).json(employee);
    } catch (error) {
      handleEmployeeError(error, request, response, next);
    }
  });

  router.post("/", async (request, response, next) => {
    try {
      const input = createEmployeeSchema.parse(request.body);
      const employee = await employeeService.create(input);

      response.status(201).json(employee);
    } catch (error) {
      handleEmployeeError(error, request, response, next);
    }
  });

  router.patch("/:id", async (request, response, next) => {
    try {
      const { id } = employeeIdParamsSchema.parse(request.params);
      const input = updateEmployeeSchema.parse(request.body);
      const employee = await employeeService.update(id, input);

      response.status(200).json(employee);
    } catch (error) {
      handleEmployeeError(error, request, response, next);
    }
  });

  router.delete("/:id", async (request, response, next) => {
    try {
      const { id } = employeeIdParamsSchema.parse(request.params);
      const employee = await employeeService.delete(id);

      response.status(200).json(employee);
    } catch (error) {
      handleEmployeeError(error, request, response, next);
    }
  });

  return router;
}

export const employeeRoutes = createEmployeeRoutes();
