import { prisma } from "../../shared/prisma.js";

import {
  aggregatePayrollTotals,
  getSalaryDistributionBand,
  SALARY_DISTRIBUTION_BANDS,
  sortTotalsDescending,
} from "./analytics.helpers.js";
import { AnalyticsRepository } from "./analytics.repository.js";
import type {
  PayrollByCountryResult,
  PayrollByDepartmentResult,
  SalaryDistributionResult,
  TopPaidEmployeeResult,
} from "./analytics.types.js";

export class AnalyticsService {
  private readonly repository: AnalyticsRepository;

  constructor(repository = new AnalyticsRepository(prisma)) {
    this.repository = repository;
  }

  async getTotalPayroll(): Promise<number> {
    const snapshots = await this.repository.getCurrentSalarySnapshots();

    return snapshots.reduce((total, snapshot) => total + snapshot.amount, 0);
  }

  async getAverageSalary(): Promise<number> {
    const snapshots = await this.repository.getCurrentSalarySnapshots();

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
    const snapshots = await this.repository.getCurrentSalarySnapshots();
    const totals = aggregatePayrollTotals(
      snapshots,
      (snapshot) => snapshot.countryId,
    );

    return sortTotalsDescending(totals).map(({ key, total }) => ({
      countryId: key,
      total,
    }));
  }

  async getPayrollByDepartment(): Promise<PayrollByDepartmentResult[]> {
    const snapshots = await this.repository.getCurrentSalarySnapshots();
    const totals = aggregatePayrollTotals(
      snapshots,
      (snapshot) => snapshot.departmentId,
    );

    return sortTotalsDescending(totals).map(({ key, total }) => ({
      departmentId: key,
      total,
    }));
  }

  async getTopPaidEmployees(limit: number): Promise<TopPaidEmployeeResult[]> {
    const snapshots = await this.repository.getCurrentSalarySnapshots();

    return snapshots
      .sort((left, right) => right.amount - left.amount)
      .slice(0, limit)
      .map(({ employeeId, amount }) => ({ employeeId, amount }));
  }

  async getSalaryDistribution(): Promise<SalaryDistributionResult[]> {
    const snapshots = await this.repository.getCurrentSalarySnapshots();
    const counts = new Map(
      SALARY_DISTRIBUTION_BANDS.map((band) => [band, 0]),
    );

    for (const snapshot of snapshots) {
      const band = getSalaryDistributionBand(snapshot.amount);
      counts.set(band, (counts.get(band) ?? 0) + 1);
    }

    return SALARY_DISTRIBUTION_BANDS.map((band) => ({
      band,
      count: counts.get(band) ?? 0,
    }));
  }
}
