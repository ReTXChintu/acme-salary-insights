import type {
  CurrentSalarySnapshot,
  SalaryDistributionBand,
} from "./analytics.types.js";

export const SALARY_DISTRIBUTION_BANDS: SalaryDistributionBand[] = [
  "0-50k",
  "50k-100k",
  "100k-150k",
  "150k-200k",
  "200k+",
];

export function getSalaryDistributionBand(
  amount: number,
): SalaryDistributionBand {
  if (amount < 50_000) {
    return "0-50k";
  }

  if (amount < 100_000) {
    return "50k-100k";
  }

  if (amount < 150_000) {
    return "100k-150k";
  }

  if (amount < 200_000) {
    return "150k-200k";
  }

  return "200k+";
}

export function aggregatePayrollTotals(
  snapshots: CurrentSalarySnapshot[],
  getGroupKey: (snapshot: CurrentSalarySnapshot) => string,
): Map<string, number> {
  const totals = new Map<string, number>();

  for (const snapshot of snapshots) {
    const groupKey = getGroupKey(snapshot);
    totals.set(groupKey, (totals.get(groupKey) ?? 0) + snapshot.amount);
  }

  return totals;
}

export function sortTotalsDescending(
  totals: Map<string, number>,
): Array<{ key: string; total: number }> {
  return [...totals.entries()]
    .map(([key, total]) => ({ key, total }))
    .sort((left, right) => right.total - left.total);
}
