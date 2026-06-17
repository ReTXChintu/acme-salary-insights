import { prisma } from "../../shared/prisma.js";

import type {
  CurrentSalarySnapshot,
  PayrollByCountryResult,
  PayrollByDepartmentResult,
  SalaryDistributionBand,
  SalaryDistributionResult,
  TopPaidEmployeeResult,
} from "./analytics.types.js";

async function getCurrentSalarySnapshots(): Promise<CurrentSalarySnapshot[]> {
  const employees = await prisma.employee.findMany({
    where: {
      isActive: true,
      deletedAt: null,
    },
    include: {
      salaries: {
        orderBy: { effectiveDate: "desc" },
        take: 1,
      },
    },
  });

  return employees
    .filter((employee) => employee.salaries.length > 0)
    .map((employee) => ({
      employeeId: employee.id,
      departmentId: employee.departmentId,
      countryId: employee.countryId,
      amount: Number(employee.salaries[0]?.amount ?? 0),
    }));
}

export class AnalyticsService {
  async getTotalPayroll(): Promise<number> {
    const snapshots = await getCurrentSalarySnapshots();

    return snapshots.reduce((total, snapshot) => total + snapshot.amount, 0);
  }

  async getAverageSalary(): Promise<number> {
    const snapshots = await getCurrentSalarySnapshots();

    if (snapshots.length === 0) {
      return 0;
    }

    const total = snapshots.reduce(
      (sum, snapshot) => sum + snapshot.amount,
      0,
    );

    return total / snapshots.length;
  }

  async getPayrollByCountry(): Promise<PayrollByCountryResult[]> {
    const snapshots = await getCurrentSalarySnapshots();
    const totals = new Map<string, number>();

    for (const snapshot of snapshots) {
      totals.set(
        snapshot.countryId,
        (totals.get(snapshot.countryId) ?? 0) + snapshot.amount,
      );
    }

    return [...totals.entries()]
      .map(([countryId, total]) => ({ countryId, total }))
      .sort((left, right) => right.total - left.total);
  }

  async getPayrollByDepartment(): Promise<PayrollByDepartmentResult[]> {
    const snapshots = await getCurrentSalarySnapshots();
    const totals = new Map<string, number>();

    for (const snapshot of snapshots) {
      totals.set(
        snapshot.departmentId,
        (totals.get(snapshot.departmentId) ?? 0) + snapshot.amount,
      );
    }

    return [...totals.entries()]
      .map(([departmentId, total]) => ({ departmentId, total }))
      .sort((left, right) => right.total - left.total);
  }

  async getTopPaidEmployees(limit: number): Promise<TopPaidEmployeeResult[]> {
    const snapshots = await getCurrentSalarySnapshots();

    return snapshots
      .sort((left, right) => right.amount - left.amount)
      .slice(0, limit)
      .map(({ employeeId, amount }) => ({ employeeId, amount }));
  }

  async getSalaryDistribution(): Promise<SalaryDistributionResult[]> {
    throw new Error("Not implemented");
  }
}
