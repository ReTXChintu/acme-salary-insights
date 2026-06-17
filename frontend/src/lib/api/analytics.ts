import type {
  AnalyticsListResponse,
  AnalyticsSummary,
  PayrollByCountryEntry,
  PayrollByDepartmentEntry,
  SalaryDistributionEntry,
  TopPaidEmployeeEntry,
} from "../../features/analytics/types";

import { parseApiError } from "./parseApiError";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(parseApiError(errorBody?.error ?? `Request failed with ${response.status}`));
  }

  return response.json() as Promise<T>;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const response = await fetch(`${API_URL}/analytics/summary`);
  return parseJson<AnalyticsSummary>(response);
}

export async function getPayrollByCountry(): Promise<
  AnalyticsListResponse<PayrollByCountryEntry>
> {
  const response = await fetch(`${API_URL}/analytics/payroll-by-country`);
  return parseJson<AnalyticsListResponse<PayrollByCountryEntry>>(response);
}

export async function getPayrollByDepartment(): Promise<
  AnalyticsListResponse<PayrollByDepartmentEntry>
> {
  const response = await fetch(`${API_URL}/analytics/payroll-by-department`);
  return parseJson<AnalyticsListResponse<PayrollByDepartmentEntry>>(response);
}

export async function getTopPaidEmployees(
  limit = 10,
): Promise<AnalyticsListResponse<TopPaidEmployeeEntry>> {
  const url = new URL(`${API_URL}/analytics/top-paid`);
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url.toString());
  return parseJson<AnalyticsListResponse<TopPaidEmployeeEntry>>(response);
}

export async function getSalaryDistribution(): Promise<
  AnalyticsListResponse<SalaryDistributionEntry>
> {
  const response = await fetch(`${API_URL}/analytics/salary-distribution`);
  return parseJson<AnalyticsListResponse<SalaryDistributionEntry>>(response);
}
