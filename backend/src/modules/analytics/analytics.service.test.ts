import { beforeEach, describe, expect, it } from "vitest";

import { EmployeeService } from "../employees/employee.service.js";
import { SalaryService } from "../salaries/salary.service.js";

import { AnalyticsService } from "./analytics.service.js";

const employeeService = new EmployeeService();
const salaryService = new SalaryService();
const analyticsService = new AnalyticsService();

const baseEmployee = {
  employeeCode: "ACME-AN-01",
  firstName: "Analytics",
  lastName: "One",
  email: "analytics.one@acme.example",
  departmentId: "department-engineering",
  countryId: "country-india",
};

async function createEmployee(
  overrides: Partial<typeof baseEmployee> = {},
) {
  return employeeService.create({
    ...baseEmployee,
    ...overrides,
  });
}

describe("AnalyticsService.getTotalPayroll()", () => {
  beforeEach(async () => {
    const { prepareTestDatabase } = await import("../../test/helpers/db.js");
    await prepareTestDatabase();
  });

  it("calculates payroll", async () => {
    const firstEmployee = await createEmployee({
      employeeCode: "ACME-AN-01",
      email: "analytics.one@acme.example",
    });
    const secondEmployee = await createEmployee({
      employeeCode: "ACME-AN-02",
      email: "analytics.two@acme.example",
      departmentId: "department-product",
    });

    await salaryService.createSalary({
      employeeId: firstEmployee.id,
      amount: 50_000,
      currency: "INR",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });
    await salaryService.createSalary({
      employeeId: secondEmployee.id,
      amount: 80_000,
      currency: "INR",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });

    const totalPayroll = await analyticsService.getTotalPayroll();

    expect(totalPayroll).toBe(130_000);
  });

  it("ignores employees without salaries", async () => {
    await createEmployee({
      employeeCode: "ACME-AN-03",
      email: "analytics.three@acme.example",
    });
    const paidEmployee = await createEmployee({
      employeeCode: "ACME-AN-04",
      email: "analytics.four@acme.example",
    });

    await salaryService.createSalary({
      employeeId: paidEmployee.id,
      amount: 60_000,
      currency: "INR",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });

    const totalPayroll = await analyticsService.getTotalPayroll();

    expect(totalPayroll).toBe(60_000);
  });

  it("returns zero when empty", async () => {
    const totalPayroll = await analyticsService.getTotalPayroll();

    expect(totalPayroll).toBe(0);
  });
});
