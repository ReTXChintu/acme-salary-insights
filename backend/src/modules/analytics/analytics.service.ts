import { prisma } from "../../shared/prisma.js";

import type { CurrentSalarySnapshot } from "./analytics.types.js";

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
}
