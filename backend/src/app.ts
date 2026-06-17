import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { employeeRoutes } from "./modules/employees/employee.routes.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/employees", employeeRoutes);
