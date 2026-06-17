import type { Employee, PrismaClient } from "../../generated/prisma/client.js";
import { prisma } from "../../shared/prisma.js";

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
}
