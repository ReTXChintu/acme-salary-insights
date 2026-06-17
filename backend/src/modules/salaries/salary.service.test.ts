import { beforeEach, describe, expect, it } from "vitest";

import { EmployeeService } from "../employees/employee.service.js";

import {
  InvalidCurrencyError,
  InvalidSalaryAmountError,
} from "./salary.errors.js";
import { SalaryService } from "./salary.service.js";

const employeeService = new EmployeeService();
const salaryService = new SalaryService();

const validEmployeeInput = {
  employeeCode: "ACME-00001",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@acme.example",
  departmentId: "department-engineering",
  countryId: "country-india",
};

const effectiveDate = new Date("2026-01-01T00:00:00.000Z");

async function createTestEmployee() {
  return employeeService.create(validEmployeeInput);
}

describe("SalaryService.createSalary()", () => {
  beforeEach(async () => {
    const { prepareTestDatabase } = await import("../../test/helpers/db.js");
    await prepareTestDatabase();
  });

  it("creates salary record", async () => {
    const employee = await createTestEmployee();

    const salary = await salaryService.createSalary({
      employeeId: employee.id,
      amount: 75_000,
      currency: "INR",
      effectiveDate,
    });

    expect(salary.id).toBeTruthy();
    expect(Number(salary.amount)).toBe(75_000);
  });

  it("links salary to employee", async () => {
    const employee = await createTestEmployee();

    const salary = await salaryService.createSalary({
      employeeId: employee.id,
      amount: 80_000,
      currency: "INR",
      effectiveDate,
    });

    expect(salary.employeeId).toBe(employee.id);
  });

  it("stores effective date", async () => {
    const employee = await createTestEmployee();

    const salary = await salaryService.createSalary({
      employeeId: employee.id,
      amount: 90_000,
      currency: "INR",
      effectiveDate,
    });

    expect(salary.effectiveDate).toEqual(effectiveDate);
  });

  it("rejects negative salary", async () => {
    const employee = await createTestEmployee();

    await expect(
      salaryService.createSalary({
        employeeId: employee.id,
        amount: -1,
        currency: "INR",
        effectiveDate,
      }),
    ).rejects.toThrow(InvalidSalaryAmountError);
  });

  it("rejects invalid currency", async () => {
    const employee = await createTestEmployee();

    await expect(
      salaryService.createSalary({
        employeeId: employee.id,
        amount: 75_000,
        currency: "INVALID",
        effectiveDate,
      }),
    ).rejects.toThrow(InvalidCurrencyError);
  });
});
