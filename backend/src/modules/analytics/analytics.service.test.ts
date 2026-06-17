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

describe("AnalyticsService.getAverageSalary()", () => {
  beforeEach(async () => {
    const { prepareTestDatabase } = await import("../../test/helpers/db.js");
    await prepareTestDatabase();
  });

  it("calculates average salary", async () => {
    const firstEmployee = await createEmployee({
      employeeCode: "ACME-AVG-01",
      email: "avg.one@acme.example",
    });
    const secondEmployee = await createEmployee({
      employeeCode: "ACME-AVG-02",
      email: "avg.two@acme.example",
    });

    await salaryService.createSalary({
      employeeId: firstEmployee.id,
      amount: 40_000,
      currency: "INR",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });
    await salaryService.createSalary({
      employeeId: secondEmployee.id,
      amount: 80_000,
      currency: "INR",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });

    expect(await analyticsService.getAverageSalary()).toBe(60_000);
  });

  it("ignores employees without salaries", async () => {
    await createEmployee({
      employeeCode: "ACME-AVG-03",
      email: "avg.three@acme.example",
    });
    const paidEmployee = await createEmployee({
      employeeCode: "ACME-AVG-04",
      email: "avg.four@acme.example",
    });

    await salaryService.createSalary({
      employeeId: paidEmployee.id,
      amount: 90_000,
      currency: "INR",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });

    expect(await analyticsService.getAverageSalary()).toBe(90_000);
  });

  it("returns zero when empty", async () => {
    expect(await analyticsService.getAverageSalary()).toBe(0);
  });
});

describe("AnalyticsService.getPayrollByCountry()", () => {
  beforeEach(async () => {
    const { prepareTestDatabase } = await import("../../test/helpers/db.js");
    await prepareTestDatabase();
  });

  it("groups payroll by country", async () => {
    const indiaEmployee = await createEmployee({
      employeeCode: "ACME-CIN-01",
      email: "country.india@acme.example",
      countryId: "country-india",
    });
    const usEmployee = await createEmployee({
      employeeCode: "ACME-CUS-01",
      email: "country.us@acme.example",
      countryId: "country-united-states",
    });

    await salaryService.createSalary({
      employeeId: indiaEmployee.id,
      amount: 50_000,
      currency: "INR",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });
    await salaryService.createSalary({
      employeeId: usEmployee.id,
      amount: 100_000,
      currency: "USD",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });

    const payrollByCountry = await analyticsService.getPayrollByCountry();

    expect(payrollByCountry).toHaveLength(2);
    expect(payrollByCountry.map((entry) => entry.countryId)).toEqual(
      expect.arrayContaining(["country-india", "country-united-states"]),
    );
  });

  it("calculates totals", async () => {
    const firstIndiaEmployee = await createEmployee({
      employeeCode: "ACME-CIN-02",
      email: "country.india.one@acme.example",
      countryId: "country-india",
    });
    const secondIndiaEmployee = await createEmployee({
      employeeCode: "ACME-CIN-03",
      email: "country.india.two@acme.example",
      countryId: "country-india",
    });

    await salaryService.createSalary({
      employeeId: firstIndiaEmployee.id,
      amount: 40_000,
      currency: "INR",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });
    await salaryService.createSalary({
      employeeId: secondIndiaEmployee.id,
      amount: 60_000,
      currency: "INR",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });

    const indiaPayroll = (await analyticsService.getPayrollByCountry()).find(
      (entry) => entry.countryId === "country-india",
    );

    expect(indiaPayroll?.total).toBe(100_000);
  });

  it("sorts descending", async () => {
    const indiaEmployee = await createEmployee({
      employeeCode: "ACME-CIN-04",
      email: "country.india.sort@acme.example",
      countryId: "country-india",
    });
    const usEmployee = await createEmployee({
      employeeCode: "ACME-CUS-02",
      email: "country.us.sort@acme.example",
      countryId: "country-united-states",
    });

    await salaryService.createSalary({
      employeeId: indiaEmployee.id,
      amount: 50_000,
      currency: "INR",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });
    await salaryService.createSalary({
      employeeId: usEmployee.id,
      amount: 120_000,
      currency: "USD",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });

    const payrollByCountry = await analyticsService.getPayrollByCountry();

    expect(payrollByCountry[0]?.countryId).toBe("country-united-states");
    expect(payrollByCountry[1]?.countryId).toBe("country-india");
  });
});

describe("AnalyticsService.getPayrollByDepartment()", () => {
  beforeEach(async () => {
    const { prepareTestDatabase } = await import("../../test/helpers/db.js");
    await prepareTestDatabase();
  });

  it("groups payroll by department", async () => {
    const engineeringEmployee = await createEmployee({
      employeeCode: "ACME-DEP-01",
      email: "dept.engineering@acme.example",
      departmentId: "department-engineering",
    });
    const productEmployee = await createEmployee({
      employeeCode: "ACME-DEP-02",
      email: "dept.product@acme.example",
      departmentId: "department-product",
    });

    await salaryService.createSalary({
      employeeId: engineeringEmployee.id,
      amount: 70_000,
      currency: "INR",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });
    await salaryService.createSalary({
      employeeId: productEmployee.id,
      amount: 90_000,
      currency: "INR",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });

    const payrollByDepartment =
      await analyticsService.getPayrollByDepartment();

    expect(payrollByDepartment).toHaveLength(2);
  });

  it("calculates totals", async () => {
    const firstEngineer = await createEmployee({
      employeeCode: "ACME-DEP-03",
      email: "dept.engineering.one@acme.example",
    });
    const secondEngineer = await createEmployee({
      employeeCode: "ACME-DEP-04",
      email: "dept.engineering.two@acme.example",
    });

    await salaryService.createSalary({
      employeeId: firstEngineer.id,
      amount: 30_000,
      currency: "INR",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });
    await salaryService.createSalary({
      employeeId: secondEngineer.id,
      amount: 50_000,
      currency: "INR",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });

    const engineeringPayroll = (
      await analyticsService.getPayrollByDepartment()
    ).find((entry) => entry.departmentId === "department-engineering");

    expect(engineeringPayroll?.total).toBe(80_000);
  });

  it("sorts descending", async () => {
    const engineeringEmployee = await createEmployee({
      employeeCode: "ACME-DEP-05",
      email: "dept.engineering.sort@acme.example",
    });
    const productEmployee = await createEmployee({
      employeeCode: "ACME-DEP-06",
      email: "dept.product.sort@acme.example",
      departmentId: "department-product",
    });

    await salaryService.createSalary({
      employeeId: engineeringEmployee.id,
      amount: 40_000,
      currency: "INR",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });
    await salaryService.createSalary({
      employeeId: productEmployee.id,
      amount: 110_000,
      currency: "INR",
      effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
    });

    const payrollByDepartment =
      await analyticsService.getPayrollByDepartment();

    expect(payrollByDepartment[0]?.departmentId).toBe("department-product");
  });
});
