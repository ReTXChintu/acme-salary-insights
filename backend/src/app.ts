import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { employeeRoutes } from "./modules/employees/employee.routes.js";
import { analyticsRoutes } from "./modules/analytics/analytics.routes.js";
import { errorHandler } from "./shared/middleware/errorHandler.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/employees", employeeRoutes);
app.use("/analytics", analyticsRoutes);

app.use(errorHandler);
