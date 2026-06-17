import { beforeEach, describe, expect, it } from "vitest";

import {
  DuplicateEmailError,
  InvalidCountryError,
  InvalidDepartmentError,
} from "./employee.errors.js";
import { EmployeeService } from "./employee.service.js";

const employeeService = new EmployeeService();

const validEmployeeInput = {
  employeeCode: "ACME-00001",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@acme.example",
  departmentId: "department-engineering",
  countryId: "country-india",
};

describe("EmployeeService.create()", () => {
  beforeEach(async () => {
    const { prepareTestDatabase } = await import("../../test/helpers/db.js");
    await prepareTestDatabase();
  });

  it("creates employee with valid data", async () => {
    const employee = await employeeService.create(validEmployeeInput);

    expect(employee).toMatchObject({
      employeeCode: validEmployeeInput.employeeCode,
      firstName: validEmployeeInput.firstName,
      lastName: validEmployeeInput.lastName,
      email: validEmployeeInput.email,
      departmentId: validEmployeeInput.departmentId,
      countryId: validEmployeeInput.countryId,
      isActive: true,
      deletedAt: null,
    });
    expect(employee.id).toBeTruthy();
  });

  it("rejects duplicate email", async () => {
    await employeeService.create(validEmployeeInput);

    await expect(
      employeeService.create({
        ...validEmployeeInput,
        employeeCode: "ACME-00002",
      }),
    ).rejects.toThrow(DuplicateEmailError);
  });

  it("rejects invalid department", async () => {
    await expect(
      employeeService.create({
        ...validEmployeeInput,
        departmentId: "missing-department",
      }),
    ).rejects.toThrow(InvalidDepartmentError);
  });

  it("rejects invalid country", async () => {
    await expect(
      employeeService.create({
        ...validEmployeeInput,
        countryId: "missing-country",
      }),
    ).rejects.toThrow(InvalidCountryError);
  });

  it("trims whitespace", async () => {
    const employee = await employeeService.create({
      ...validEmployeeInput,
      employeeCode: "  ACME-00003  ",
      firstName: "  Jane  ",
      lastName: "  Doe  ",
      email: "  jane.trim@acme.example  ",
    });

    expect(employee).toMatchObject({
      employeeCode: "ACME-00003",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.trim@acme.example",
    });
  });
});
