import type { Router } from "express";
import { Router as createRouter } from "express";

import { employeeIdParamsSchema } from "../employees/employee.schemas.js";
import { EmployeeService } from "../employees/employee.service.js";
import {
  validateBody,
  validateParams,
  getValidatedBody,
  getValidatedParams,
} from "../../shared/middleware/validate.js";

import { createSalarySchema } from "./salary.schemas.js";
import { SalaryService } from "./salary.service.js";

export function createSalaryRoutes(
  salaryService = new SalaryService(),
  employeeService = new EmployeeService(),
): Router {
  const router = createRouter({ mergeParams: true });

  router.get(
    "/",
    validateParams(employeeIdParamsSchema),
    async (request, response, next) => {
      try {
        const { id } = getValidatedParams(request, employeeIdParamsSchema);

        await employeeService.getById(id);

        const history = await salaryService.getSalaryHistory(id);

        response.status(200).json({ data: history });
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    "/",
    validateParams(employeeIdParamsSchema),
    validateBody(createSalarySchema),
    async (request, response, next) => {
      try {
        const { id } = getValidatedParams(request, employeeIdParamsSchema);
        const salary = await salaryService.createSalary({
          employeeId: id,
          ...getValidatedBody(request, createSalarySchema),
        });

        response.status(201).json(salary);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}

export const salaryRoutes = createSalaryRoutes();
