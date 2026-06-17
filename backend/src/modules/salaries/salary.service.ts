import type { Salary } from "../../generated/prisma/client.js";
import { prisma } from "../../shared/prisma.js";
import { EmployeeNotFoundError } from "../employees/employee.errors.js";
import { EmployeeRepository } from "../employees/employee.repository.js";

import {
  InvalidCurrencyError,
  InvalidSalaryAmountError,
} from "./salary.errors.js";
import {
  SalaryRepository,
  type CreateSalaryRecordData,
} from "./salary.repository.js";

export type CreateSalaryData = CreateSalaryRecordData;

export type UpdateSalaryData = {
  amount: number;
  currency: string;
  effectiveDate: Date;
};

const SUPPORTED_CURRENCIES = new Set(["INR", "USD", "GBP", "EUR", "SGD"]);

export class SalaryService {
  private readonly repository: SalaryRepository;
  private readonly employeeRepository: EmployeeRepository;

  constructor(
    repository = new SalaryRepository(prisma),
    employeeRepository = new EmployeeRepository(prisma),
  ) {
    this.repository = repository;
    this.employeeRepository = employeeRepository;
  }

  async createSalary(input: CreateSalaryData): Promise<Salary> {
    if (input.amount < 0) {
      throw new InvalidSalaryAmountError(input.amount);
    }

    if (!SUPPORTED_CURRENCIES.has(input.currency)) {
      throw new InvalidCurrencyError(input.currency);
    }

    const employee = await this.employeeRepository.findActiveById(
      input.employeeId,
    );

    if (!employee) {
      throw new EmployeeNotFoundError(input.employeeId);
    }

    return this.repository.create(input);
  }

  async getCurrentSalary(employeeId: string): Promise<Salary | null> {
    return this.repository.findCurrentByEmployeeId(employeeId);
  }

  async getSalaryHistory(employeeId: string): Promise<Salary[]> {
    return this.repository.findHistoryByEmployeeId(employeeId);
  }

  async updateSalary(
    employeeId: string,
    input: UpdateSalaryData,
  ): Promise<Salary> {
    return this.createSalary({
      employeeId,
      ...input,
    });
  }
}
