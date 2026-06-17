import type { Salary } from "../../generated/prisma/client.js";
import { prisma } from "../../shared/prisma.js";
import { EmployeeNotFoundError } from "../employees/employee.errors.js";

import {
  InvalidCurrencyError,
  InvalidSalaryAmountError,
} from "./salary.errors.js";

export type CreateSalaryData = {
  employeeId: string;
  amount: number;
  currency: string;
  effectiveDate: Date;
};

const SUPPORTED_CURRENCIES = new Set(["INR", "USD", "GBP", "EUR", "SGD"]);

export class SalaryService {
  async createSalary(input: CreateSalaryData): Promise<Salary> {
    if (input.amount < 0) {
      throw new InvalidSalaryAmountError(input.amount);
    }

    if (!SUPPORTED_CURRENCIES.has(input.currency)) {
      throw new InvalidCurrencyError(input.currency);
    }

    const employee = await prisma.employee.findFirst({
      where: {
        id: input.employeeId,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!employee) {
      throw new EmployeeNotFoundError(input.employeeId);
    }

    return prisma.salary.create({
      data: {
        employeeId: input.employeeId,
        amount: input.amount,
        currency: input.currency,
        effectiveDate: input.effectiveDate,
      },
    });
  }

  async getCurrentSalary(_employeeId: string): Promise<Salary | null> {
    throw new Error("Not implemented");
  }
}
