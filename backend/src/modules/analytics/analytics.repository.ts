import type { PrismaClient } from "../../generated/prisma/client.js";
import { prisma as defaultPrisma } from "../../shared/prisma.js";

import type { CurrentSalarySnapshot } from "./analytics.types.js";

type RawSalarySnapshotRow = {
  employeeId: string;
  departmentId: string;
  countryId: string;
  amount: number | string | bigint;
};

export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

  async getCurrentSalarySnapshots(): Promise<CurrentSalarySnapshot[]> {
    const rows = await this.prisma.$queryRaw<RawSalarySnapshotRow[]>`
      SELECT
        employeeId,
        departmentId,
        countryId,
        amount
      FROM (
        SELECT
          e.id AS employeeId,
          e.departmentId AS departmentId,
          e.countryId AS countryId,
          CAST(s.amount AS REAL) AS amount,
          ROW_NUMBER() OVER (
            PARTITION BY e.id
            ORDER BY s.effectiveDate DESC, s.createdAt DESC
          ) AS rowNum
        FROM Employee e
        INNER JOIN Salary s ON s.employeeId = e.id
        WHERE e.isActive = 1
          AND e.deletedAt IS NULL
      ) AS latest
      WHERE rowNum = 1
    `;

    return rows.map((row) => ({
      employeeId: row.employeeId,
      departmentId: row.departmentId,
      countryId: row.countryId,
      amount: Number(row.amount),
    }));
  }
}
