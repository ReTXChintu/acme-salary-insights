import type { Router } from "express";
import { Router as createRouter } from "express";

import { createSalaryRoutes } from "../salaries/salary.routes.js";
import {
  createEmployeeSchema,
  employeeIdParamsSchema,
  listEmployeesQuerySchema,
  updateEmployeeSchema,
} from "./employee.schemas.js";
import { EmployeeService } from "./employee.service.js";
import {
  validateBody,
  validateParams,
  validateQuery,
  getValidatedBody,
  getValidatedParams,
  getValidatedQuery,
} from "../../shared/middleware/validate.js";

export function createEmployeeRoutes(
  employeeService = new EmployeeService(),
): Router {
  const router = createRouter();

  router.get(
    "/",
    validateQuery(listEmployeesQuerySchema),
    async (request, response, next) => {
      try {
        const query = getValidatedQuery(request, listEmployeesQuerySchema);

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
        next(error);
      }
    },
  );

  router.use("/:id/salaries", createSalaryRoutes());

  router.get(
    "/:id",
    validateParams(employeeIdParamsSchema),
    async (request, response, next) => {
      try {
        const { id } = getValidatedParams(request, employeeIdParamsSchema);
        const employee = await employeeService.getById(id);

        response.status(200).json(employee);
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    "/",
    validateBody(createEmployeeSchema),
    async (request, response, next) => {
      try {
        const employee = await employeeService.create(
          getValidatedBody(request, createEmployeeSchema),
        );

        response.status(201).json(employee);
      } catch (error) {
        next(error);
      }
    },
  );

  router.patch(
    "/:id",
    validateParams(employeeIdParamsSchema),
    validateBody(updateEmployeeSchema),
    async (request, response, next) => {
      try {
        const { id } = getValidatedParams(request, employeeIdParamsSchema);
        const employee = await employeeService.update(
          id,
          getValidatedBody(request, updateEmployeeSchema),
        );

        response.status(200).json(employee);
      } catch (error) {
        next(error);
      }
    },
  );

  router.delete(
    "/:id",
    validateParams(employeeIdParamsSchema),
    async (request, response, next) => {
      try {
        const { id } = getValidatedParams(request, employeeIdParamsSchema);
        const employee = await employeeService.delete(id);

        response.status(200).json(employee);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}

export const employeeRoutes = createEmployeeRoutes();
