import type { NextFunction, Request, Response, Router } from "express";
import { Router as createRouter } from "express";

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

  return router;
}

export const analyticsRoutes = createAnalyticsRoutes();
