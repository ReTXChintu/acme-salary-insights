import type { NextFunction, Request, Response, Router } from "express";
import { Router as createRouter } from "express";

import { AnalyticsService } from "./analytics.service.js";
import { getReferenceLabelMaps } from "./analytics.reference.js";

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

  return router;
}

export const analyticsRoutes = createAnalyticsRoutes();
