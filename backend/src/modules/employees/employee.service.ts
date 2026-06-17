import type { Employee } from "../../generated/prisma/client.js";
import { prisma } from "../../shared/prisma.js";

import { EmployeeNotFoundError } from "./employee.errors.js";
import {
  EmployeeRepository,
  type CreateEmployeeData,
  type ListEmployeesParams,
  type UpdateEmployeeData,
} from "./employee.repository.js";
import {
  validateCountry,
  validateDepartment,
  validateUniqueEmail,
} from "./employee.validation.js";

export type { CreateEmployeeData, ListEmployeesParams, UpdateEmployeeData };

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
  private readonly repository: EmployeeRepository;

  constructor(repository = new EmployeeRepository(prisma)) {
    this.repository = repository;
  }

  async create(input: CreateEmployeeData): Promise<Employee> {
    const data = trimEmployeeData(input);

    await validateDepartment(prisma, data.departmentId);
    await validateCountry(prisma, data.countryId);
    await validateUniqueEmail(prisma, data.email);

    return this.repository.create(data);
  }

  async getById(id: string): Promise<Employee> {
    const employee = await this.repository.findActiveById(id);

    if (!employee) {
      throw new EmployeeNotFoundError(id);
    }

    return employee;
  }

  async search(query: string): Promise<Employee[]> {
    return this.repository.search(query);
  }

  async list(
    params: ListEmployeesParams = {},
  ): Promise<{ data: Employee[]; total: number }> {
    return this.repository.list(params);
  }

  async update(id: string, input: UpdateEmployeeData): Promise<Employee> {
    await this.getById(id);

    const data = trimPartialEmployeeData(input);

    if (data.departmentId) {
      await validateDepartment(prisma, data.departmentId);
    }

    if (data.countryId) {
      await validateCountry(prisma, data.countryId);
    }

    if (data.email) {
      await validateUniqueEmail(prisma, data.email, id);
    }

    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<Employee> {
    await this.getById(id);

    return this.repository.softDelete(id);
  }
}

function trimPartialEmployeeData(input: UpdateEmployeeData): UpdateEmployeeData {
  const data: UpdateEmployeeData = { ...input };

  if (data.employeeCode !== undefined) {
    data.employeeCode = data.employeeCode.trim();
  }

  if (data.firstName !== undefined) {
    data.firstName = data.firstName.trim();
  }

  if (data.lastName !== undefined) {
    data.lastName = data.lastName.trim();
  }

  if (data.email !== undefined) {
    data.email = data.email.trim();
  }

  return data;
}
