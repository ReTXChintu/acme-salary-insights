import { describe, expect, it } from "vitest";

import { generateSeedData } from "./seed";

describe("seed data generation", () => {
  it("creates 10000 employees", () => {
    const seedData = generateSeedData();

    expect(seedData.employees).toHaveLength(10_000);
  });

  it("creates unique employee emails", () => {
    const seedData = generateSeedData();
    const emails = seedData.employees.map((employee) => employee.email);

    expect(new Set(emails).size).toBe(10_000);
  });

  it("creates unique employee codes", () => {
    const seedData = generateSeedData();
    const employeeCodes = seedData.employees.map((employee) => employee.employeeCode);

    expect(new Set(employeeCodes).size).toBe(10_000);
  });

  it("assigns employees to departments", () => {
    const seedData = generateSeedData();
    const departmentIds = new Set(seedData.departments.map((department) => department.id));

    expect(seedData.departments).toHaveLength(5);
    expect(seedData.employees.every((employee) => departmentIds.has(employee.departmentId))).toBe(true);
  });

  it("assigns employees to countries", () => {
    const seedData = generateSeedData();
    const countryIds = new Set(seedData.countries.map((country) => country.id));

    expect(seedData.countries).toHaveLength(5);
    expect(seedData.employees.every((employee) => countryIds.has(employee.countryId))).toBe(true);
  });

  it("creates one salary record for each employee", () => {
    const seedData = generateSeedData();
    const employeeIds = new Set(seedData.employees.map((employee) => employee.id));

    expect(seedData.salaries).toHaveLength(10_000);
    expect(seedData.salaries.every((salary) => employeeIds.has(salary.employeeId))).toBe(true);
  });
});
