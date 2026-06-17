import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { app } from "../../app.js";
import {
  prepareTestDatabase,
  TEST_COUNTRIES,
  TEST_DEPARTMENTS,
} from "../../test/helpers/db.js";
import { SalaryService } from "./salary.service.js";

const validEmployeePayload = {
  employeeCode: "ACME-SALARY-01",
  firstName: "Salary",
  lastName: "Employee",
  email: "salary.employee@acme.example",
  departmentId: TEST_DEPARTMENTS[0].id,
  countryId: TEST_COUNTRIES[0].id,
};

const salaryService = new SalaryService();

async function createEmployeeViaApi() {
  return request(app).post("/employees").send(validEmployeePayload);
}

describe("Salary API", () => {
  beforeEach(async () => {
    await prepareTestDatabase();
  });

  describe("GET /employees/:id/salaries", () => {
    it("returns salary history", async () => {
      const createdEmployee = await createEmployeeViaApi();
      const employeeId = createdEmployee.body.id as string;

      await salaryService.createSalary({
        employeeId,
        amount: 70_000,
        currency: "INR",
        effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
      });

      await salaryService.createSalary({
        employeeId,
        amount: 85_000,
        currency: "INR",
        effectiveDate: new Date("2026-06-01T00:00:00.000Z"),
      });

      const response = await request(app).get(`/employees/${employeeId}/salaries`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
    });

    it("returns empty array when no history exists", async () => {
      const createdEmployee = await createEmployeeViaApi();
      const employeeId = createdEmployee.body.id as string;

      const response = await request(app).get(`/employees/${employeeId}/salaries`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it("returns 404 when employee is missing", async () => {
      const response = await request(app).get(
        "/employees/missing-employee-id/salaries",
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toContain("not found");
    });
  });

  describe("POST /employees/:id/salaries", () => {
    it("creates salary record", async () => {
      const createdEmployee = await createEmployeeViaApi();
      const employeeId = createdEmployee.body.id as string;

      const response = await request(app)
        .post(`/employees/${employeeId}/salaries`)
        .send({
          amount: 75_000,
          currency: "INR",
          effectiveDate: "2026-01-01T00:00:00.000Z",
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        employeeId,
        currency: "INR",
      });
      expect(Number(response.body.amount)).toBe(75_000);
    });

    it("validates payload", async () => {
      const createdEmployee = await createEmployeeViaApi();
      const employeeId = createdEmployee.body.id as string;

      const response = await request(app)
        .post(`/employees/${employeeId}/salaries`)
        .send({
          currency: "INR",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Validation failed");
    });

    it("validates currency", async () => {
      const createdEmployee = await createEmployeeViaApi();
      const employeeId = createdEmployee.body.id as string;

      const response = await request(app)
        .post(`/employees/${employeeId}/salaries`)
        .send({
          amount: 75_000,
          currency: "INVALID",
          effectiveDate: "2026-01-01T00:00:00.000Z",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Currency");
    });

    it("returns 404 when employee is missing", async () => {
      const response = await request(app)
        .post("/employees/missing-employee-id/salaries")
        .send({
          amount: 75_000,
          currency: "INR",
          effectiveDate: "2026-01-01T00:00:00.000Z",
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toContain("not found");
    });
  });
});
