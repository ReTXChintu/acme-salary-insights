import type { Employee, PrismaClient } from "../../generated/prisma/client.js";
import { prisma } from "../../shared/prisma.js";

import {
  DuplicateEmailError,
  InvalidCountryError,
  InvalidDepartmentError,
} from "./employee.errors.js";

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

    const department = await this.db.department.findUnique({
      where: { id: data.departmentId },
    });

    if (!department) {
      throw new InvalidDepartmentError(data.departmentId);
    }

    const country = await this.db.country.findUnique({
      where: { id: data.countryId },
    });

    if (!country) {
      throw new InvalidCountryError(data.countryId);
    }

    const existingEmployee = await this.db.employee.findUnique({
      where: { email: data.email },
    });

    if (existingEmployee) {
      throw new DuplicateEmailError(data.email);
    }

    return this.db.employee.create({ data });
  }
}
