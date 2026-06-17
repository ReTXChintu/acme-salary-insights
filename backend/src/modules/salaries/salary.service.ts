import type { Salary } from "../../generated/prisma/client.js";

export type CreateSalaryData = {
  employeeId: string;
  amount: number;
  currency: string;
  effectiveDate: Date;
};

export class SalaryService {
  async createSalary(_input: CreateSalaryData): Promise<Salary> {
    throw new Error("Not implemented");
  }
}
