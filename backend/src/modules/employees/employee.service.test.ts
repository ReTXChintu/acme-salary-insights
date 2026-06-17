import { beforeEach, describe, expect, it } from "vitest";

import {
  TEST_COUNTRIES,
  TEST_DEPARTMENTS,
} from "../../test/helpers/db.js";

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

async function createTestEmployee(
  overrides: Partial<typeof validEmployeeInput> = {},
) {
  return employeeService.create({
    ...validEmployeeInput,
    ...overrides,
  });
}

describe("EmployeeService.getById()", () => {
  beforeEach(async () => {
    const { prepareTestDatabase } = await import("../../test/helpers/db.js");
    await prepareTestDatabase();
  });

  it("returns employee by id", async () => {
    const createdEmployee = await createTestEmployee();

    const employee = await employeeService.getById(createdEmployee.id);

    expect(employee).toMatchObject({
      id: createdEmployee.id,
      email: createdEmployee.email,
    });
  });

  it("throws not found when missing", async () => {
    const { EmployeeNotFoundError } = await import("./employee.errors.js");

    await expect(
      employeeService.getById("missing-employee-id"),
    ).rejects.toThrow(EmployeeNotFoundError);
  });
});

describe("EmployeeService.search()", () => {
  beforeEach(async () => {
    const { prepareTestDatabase } = await import("../../test/helpers/db.js");
    await prepareTestDatabase();

    await createTestEmployee({
      employeeCode: "ACME-SEARCH-01",
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.johnson@acme.example",
    });

    await createTestEmployee({
      employeeCode: "ACME-SEARCH-02",
      firstName: "Robert",
      lastName: "Smith",
      email: "robert.smith@acme.example",
    });
  });

  it("searches by first name", async () => {
    const results = await employeeService.search("Alice");

    expect(results).toHaveLength(1);
    expect(results[0]?.firstName).toBe("Alice");
  });

  it("searches by last name", async () => {
    const results = await employeeService.search("Smith");

    expect(results).toHaveLength(1);
    expect(results[0]?.lastName).toBe("Smith");
  });

  it("searches by employee code", async () => {
    const results = await employeeService.search("ACME-SEARCH-02");

    expect(results).toHaveLength(1);
    expect(results[0]?.employeeCode).toBe("ACME-SEARCH-02");
  });

  it("supports partial search", async () => {
    const results = await employeeService.search("SEARCH-0");

    expect(results).toHaveLength(2);
  });

  it("is case insensitive", async () => {
    const results = await employeeService.search("alice");

    expect(results).toHaveLength(1);
    expect(results[0]?.firstName).toBe("Alice");
  });

  it("returns empty results when no matches are found", async () => {
    const results = await employeeService.search("missing-person");

    expect(results).toEqual([]);
  });
});

describe("EmployeeService.list()", () => {
  beforeEach(async () => {
    const { prepareTestDatabase } = await import("../../test/helpers/db.js");
    await prepareTestDatabase();

    await createTestEmployee({
      employeeCode: "ACME-LIST-01",
      firstName: "Engineering",
      lastName: "One",
      email: "engineering.one@acme.example",
      departmentId: TEST_DEPARTMENTS[0].id,
      countryId: TEST_COUNTRIES[0].id,
    });

    await createTestEmployee({
      employeeCode: "ACME-LIST-02",
      firstName: "Product",
      lastName: "Two",
      email: "product.two@acme.example",
      departmentId: TEST_DEPARTMENTS[1].id,
      countryId: TEST_COUNTRIES[1].id,
    });

    await createTestEmployee({
      employeeCode: "ACME-LIST-03",
      firstName: "Finance",
      lastName: "Three",
      email: "finance.three@acme.example",
      departmentId: TEST_DEPARTMENTS[3].id,
      countryId: TEST_COUNTRIES[0].id,
    });
  });

  it("filters by department", async () => {
    const result = await employeeService.list({
      departmentId: TEST_DEPARTMENTS[0].id,
    });

    expect(result.total).toBe(1);
    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.departmentId).toBe(TEST_DEPARTMENTS[0].id);
  });

  it("filters by country", async () => {
    const result = await employeeService.list({
      countryId: TEST_COUNTRIES[0].id,
    });

    expect(result.total).toBe(2);
    expect(result.data.every((employee) => employee.countryId === TEST_COUNTRIES[0].id)).toBe(
      true,
    );
  });

  it("supports combined filters", async () => {
    const result = await employeeService.list({
      departmentId: TEST_DEPARTMENTS[3].id,
      countryId: TEST_COUNTRIES[0].id,
    });

    expect(result.total).toBe(1);
    expect(result.data[0]?.employeeCode).toBe("ACME-LIST-03");
  });

  it("supports pagination", async () => {
    const firstPage = await employeeService.list({ page: 1, pageSize: 2 });
    const secondPage = await employeeService.list({ page: 2, pageSize: 2 });

    expect(firstPage.data).toHaveLength(2);
    expect(secondPage.data).toHaveLength(1);
    expect(firstPage.data[0]?.id).not.toBe(secondPage.data[0]?.id);
  });

  it("returns total count", async () => {
    const result = await employeeService.list({ page: 1, pageSize: 1 });

    expect(result.total).toBe(3);
    expect(result.data).toHaveLength(1);
  });
});
