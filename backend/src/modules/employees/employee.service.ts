import type { Employee, PrismaClient } from "../../generated/prisma/client.js";
import { prisma } from "../../shared/prisma.js";

import { EmployeeNotFoundError } from "./employee.errors.js";
import {
  validateCountry,
  validateDepartment,
  validateUniqueEmail,
} from "./employee.validation.js";

export type CreateEmployeeData = {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  countryId: string;
};

function matchesSearchQuery(employee: Employee, query: string): boolean {
  const normalizedQuery = query.toLowerCase();
  const searchableValues = [
    employee.firstName,
    employee.lastName,
    employee.employeeCode,
  ];

  return searchableValues.some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  );
}

function trimEmployeeData(data: CreateEmployeeData): CreateEmployeeData {
  return {
    ...data,
    employeeCode: data.employeeCode.trim(),
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
  };
}

export class EmployeeService {
  constructor(private readonly db: PrismaClient = prisma) {}

  async create(input: CreateEmployeeData): Promise<Employee> {
    const data = trimEmployeeData(input);

    await validateDepartment(this.db, data.departmentId);
    await validateCountry(this.db, data.countryId);
    await validateUniqueEmail(this.db, data.email);

    return this.db.employee.create({ data });
  }

  async getById(id: string): Promise<Employee> {
    const employee = await this.db.employee.findFirst({
      where: {
        id,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!employee) {
      throw new EmployeeNotFoundError(id);
    }

    return employee;
  }

  async search(query: string): Promise<Employee[]> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return [];
    }

    const activeEmployees = await this.db.employee.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: { createdAt: "asc" },
    });

    return activeEmployees.filter((employee) =>
      matchesSearchQuery(employee, trimmedQuery),
    );
  }
}
