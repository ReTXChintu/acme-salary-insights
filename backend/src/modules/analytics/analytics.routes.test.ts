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

  describe("GET /analytics/payroll-by-country", () => {
    it("returns grouped totals sorted descending", async () => {
      await createEmployeeWithSalary({
        amount: 50_000,
        employeeCode: "ACME-CIN-01",
        email: "country.one@acme.example",
      });

      const usEmployee = await request(app)
        .post("/employees")
        .send({
          employeeCode: "ACME-CUS-01",
          firstName: "United",
          lastName: "States",
          email: "country.us@acme.example",
          departmentId: TEST_DEPARTMENTS[0].id,
          countryId: TEST_COUNTRIES[1].id,
        });

      await salaryService.createSalary({
        employeeId: usEmployee.body.id,
        amount: 120_000,
        currency: "USD",
        effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
      });

      const response = await request(app).get("/analytics/payroll-by-country");

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toMatchObject({
        countryId: TEST_COUNTRIES[1].id,
        countryName: TEST_COUNTRIES[1].name,
        total: 120_000,
      });
      expect(response.body.data[1].total).toBe(50_000);
    });
  });

  describe("GET /analytics/payroll-by-department", () => {
    it("returns grouped totals sorted descending with labels", async () => {
      await createEmployeeWithSalary({
        amount: 70_000,
        employeeCode: "ACME-DEP-01",
        email: "dept.one@acme.example",
      });

      const productEmployee = await request(app)
        .post("/employees")
        .send({
          employeeCode: "ACME-DEP-02",
          firstName: "Product",
          lastName: "Member",
          email: "dept.product@acme.example",
          departmentId: TEST_DEPARTMENTS[1].id,
          countryId: TEST_COUNTRIES[0].id,
        });

      await salaryService.createSalary({
        employeeId: productEmployee.body.id,
        amount: 90_000,
        currency: "INR",
        effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
      });

      const response = await request(app).get(
        "/analytics/payroll-by-department",
      );

      expect(response.status).toBe(200);
      expect(response.body.data[0]).toMatchObject({
        departmentId: TEST_DEPARTMENTS[1].id,
        departmentName: TEST_DEPARTMENTS[1].name,
        total: 90_000,
      });
    });
  });

  describe("GET /analytics/top-paid", () => {
    it("returns top N employees with amounts", async () => {
      await createEmployeeWithSalary({
        amount: 40_000,
        employeeCode: "ACME-TOP-01",
        email: "top.one@acme.example",
      });
      await createEmployeeWithSalary({
        amount: 90_000,
        employeeCode: "ACME-TOP-02",
        email: "top.two@acme.example",
      });
      await createEmployeeWithSalary({
        amount: 70_000,
        employeeCode: "ACME-TOP-03",
        email: "top.three@acme.example",
      });

      const response = await request(app).get("/analytics/top-paid?limit=2");

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].amount).toBe(90_000);
    });

    it("respects limit query param", async () => {
      await createEmployeeWithSalary({
        amount: 50_000,
        employeeCode: "ACME-TOP-L1",
        email: "top.limit.one@acme.example",
      });

      const response = await request(app).get("/analytics/top-paid?limit=1");

      expect(response.body.data).toHaveLength(1);
    });

    it("rejects invalid limit with 400", async () => {
      const response = await request(app).get("/analytics/top-paid?limit=0");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Validation failed");
    });
  });

  describe("GET /analytics/salary-distribution", () => {
    it("returns all five salary bands with counts", async () => {
      await createEmployeeWithSalary({
        amount: 25_000,
        employeeCode: "ACME-DIST-01",
        email: "dist.one@acme.example",
      });
      await createEmployeeWithSalary({
        amount: 75_000,
        employeeCode: "ACME-DIST-02",
        email: "dist.two@acme.example",
      });

      const response = await request(app).get("/analytics/salary-distribution");

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(5);
      expect(response.body.data.find((entry: { band: string }) => entry.band === "0-50k")?.count).toBe(1);
      expect(response.body.data.find((entry: { band: string }) => entry.band === "50k-100k")?.count).toBe(1);
    });

    it("returns zero counts for every band when empty", async () => {
      const response = await request(app).get("/analytics/salary-distribution");

      expect(response.status).toBe(200);
      expect(response.body.data.every((entry: { count: number }) => entry.count === 0)).toBe(true);
      expect(response.body.data).toHaveLength(5);
    });
  });
});
