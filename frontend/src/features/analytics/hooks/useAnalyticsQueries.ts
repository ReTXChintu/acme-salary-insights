import { useQuery } from "@tanstack/react-query";

import {
  getAnalyticsSummary,
  getPayrollByCountry,
  getPayrollByDepartment,
  getSalaryDistribution,
  getTopPaidEmployees,
} from "../../../lib/api/analytics";

export const analyticsKeys = {
  all: ["analytics"] as const,
  summary: () => [...analyticsKeys.all, "summary"] as const,
  payrollByCountry: () => [...analyticsKeys.all, "payroll-by-country"] as const,
  payrollByDepartment: () =>
    [...analyticsKeys.all, "payroll-by-department"] as const,
  topPaid: (limit: number) => [...analyticsKeys.all, "top-paid", limit] as const,
  salaryDistribution: () =>
    [...analyticsKeys.all, "salary-distribution"] as const,
};

export function useAnalyticsSummaryQuery() {
  return useQuery({
    queryKey: analyticsKeys.summary(),
    queryFn: getAnalyticsSummary,
  });
}

export function usePayrollByCountryQuery() {
  return useQuery({
    queryKey: analyticsKeys.payrollByCountry(),
    queryFn: getPayrollByCountry,
  });
}

export function usePayrollByDepartmentQuery() {
  return useQuery({
    queryKey: analyticsKeys.payrollByDepartment(),
    queryFn: getPayrollByDepartment,
  });
}

export function useTopPaidEmployeesQuery(limit = 10) {
  return useQuery({
    queryKey: analyticsKeys.topPaid(limit),
    queryFn: () => getTopPaidEmployees(limit),
  });
}

export function useSalaryDistributionQuery() {
  return useQuery({
    queryKey: analyticsKeys.salaryDistribution(),
    queryFn: getSalaryDistribution,
  });
}
