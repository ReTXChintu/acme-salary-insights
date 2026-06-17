import type { PrismaClient, Salary } from "../../generated/prisma/client.js";

export type CreateSalaryRecordData = {
  employeeId: string;
  amount: number;
  currency: string;
  effectiveDate: Date;
};

export class SalaryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateSalaryRecordData): Promise<Salary> {
    return this.prisma.salary.create({ data });
  }

  async findCurrentByEmployeeId(employeeId: string): Promise<Salary | null> {
    return this.prisma.salary.findFirst({
      where: { employeeId },
      orderBy: { effectiveDate: "desc" },
    });
  }

  async findHistoryByEmployeeId(employeeId: string): Promise<Salary[]> {
    return this.prisma.salary.findMany({
      where: { employeeId },
      orderBy: { effectiveDate: "desc" },
    });
  }
}
