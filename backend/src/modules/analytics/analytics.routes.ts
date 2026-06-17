import type { Router } from "express";
import { Router as createRouter } from "express";

import { prisma } from "../../shared/prisma.js";
import { validateQuery, getValidatedQuery } from "../../shared/middleware/validate.js";

import { getReferenceLabelMaps } from "./analytics.reference.js";
import { topPaidQuerySchema } from "./analytics.schemas.js";
import { AnalyticsService } from "./analytics.service.js";

export function createAnalyticsRoutes(
  analyticsService = new AnalyticsService(),
): Router {
  const router = createRouter();

  router.get("/summary", async (_request, response, next) => {
    try {
      const summary = await analyticsService.getSummary();
      response.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  });

  router.get("/payroll-by-country", async (_request, response, next) => {
    try {
      const [payrollByCountry, labels] = await Promise.all([
        analyticsService.getPayrollByCountry(),
        getReferenceLabelMaps(),
      ]);

      response.status(200).json({
        data: payrollByCountry.map((entry) => ({
          ...entry,
          countryName:
            labels.countries.get(entry.countryId) ?? entry.countryId,
        })),
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/payroll-by-department", async (_request, response, next) => {
    try {
      const [payrollByDepartment, labels] = await Promise.all([
        analyticsService.getPayrollByDepartment(),
        getReferenceLabelMaps(),
      ]);

      response.status(200).json({
        data: payrollByDepartment.map((entry) => ({
          ...entry,
          departmentName:
            labels.departments.get(entry.departmentId) ?? entry.departmentId,
        })),
      });
    } catch (error) {
      next(error);
    }
  });

  router.get(
    "/top-paid",
    validateQuery(topPaidQuerySchema),
    async (request, response, next) => {
      try {
        const { limit } = getValidatedQuery(request, topPaidQuerySchema);
        const topPaid = await analyticsService.getTopPaidEmployees(limit);
        const employees = await prisma.employee.findMany({
          where: {
            id: { in: topPaid.map((entry) => entry.employeeId) },
          },
          select: {
            id: true,
            employeeCode: true,
            firstName: true,
            lastName: true,
          },
        });
        const employeeMap = new Map(
          employees.map((employee) => [employee.id, employee]),
        );

        response.status(200).json({
          data: topPaid.map((entry) => {
            const employee = employeeMap.get(entry.employeeId);

            return {
              ...entry,
              employeeCode: employee?.employeeCode,
              firstName: employee?.firstName,
              lastName: employee?.lastName,
            };
          }),
        });
      } catch (error) {
        next(error);
      }
    },
  );

  router.get("/salary-distribution", async (_request, response, next) => {
    try {
      const distribution = await analyticsService.getSalaryDistribution();

      response.status(200).json({ data: distribution });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

export const analyticsRoutes = createAnalyticsRoutes();
