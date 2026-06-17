import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { app } from "../../app.js";
import {
  prepareTestDatabase,
  TEST_COUNTRIES,
  TEST_DEPARTMENTS,
} from "../../test/helpers/db.js";
import { SalaryService } from "../salaries/salary.service.js";

const salaryService = new SalaryService();

async function createEmployeeWithSalary(
  overrides: {
    employeeCode?: string;
    email?: string;
    amount?: number;
  } = {},
) {
  const employeeResponse = await request(app)
    .post("/employees")
    .send({
      employeeCode: overrides.employeeCode ?? "ACME-AN-API-01",
      firstName: "Analytics",
      lastName: "Api",
      email: overrides.email ?? "analytics.api@acme.example",
      departmentId: TEST_DEPARTMENTS[0].id,
      countryId: TEST_COUNTRIES[0].id,
    });

  await salaryService.createSalary({
    employeeId: employeeResponse.body.id,
    amount: overrides.amount ?? 50_000,
    currency: "INR",
    effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
  });

  return employeeResponse.body.id as string;
}

describe("Analytics API", () => {
  beforeEach(async () => {
    await prepareTestDatabase();
  });

  describe("GET /analytics/summary", () => {
    it("returns 200", async () => {
      await createEmployeeWithSalary();

      const response = await request(app).get("/analytics/summary");

      expect(response.status).toBe(200);
    });

    it("includes totalPayroll, averageSalary, employeesWithSalary, and workforce counts", async () => {
      await createEmployeeWithSalary({ amount: 40_000 });
      await createEmployeeWithSalary({
        employeeCode: "ACME-AN-API-02",
        email: "analytics.api.two@acme.example",
        amount: 80_000,
      });

      const response = await request(app).get("/analytics/summary");

      expect(response.body).toMatchObject({
        totalPayroll: 120_000,
        averageSalary: 60_000,
        employeesWithSalary: 2,
        totalEmployees: 2,
        countryCount: 1,
        departmentCount: 1,
      });
    });

    it("returns zero values when database has no salaried employees", async () => {
      const response = await request(app).get("/analytics/summary");

      expect(response.body).toMatchObject({
        totalPayroll: 0,
        averageSalary: 0,
        employeesWithSalary: 0,
        totalEmployees: 0,
        countryCount: 0,
        departmentCount: 0,
      });
    });
  });
});
