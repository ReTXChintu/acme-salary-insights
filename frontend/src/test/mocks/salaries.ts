import type { Salary } from "../../features/salaries/types";

export const mockSalary: Salary = {
  id: "salary-1",
  employeeId: "employee-1",
  amount: 75_000,
  currency: "INR",
  effectiveDate: "2026-01-01T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
};

export const mockSalaryHistory: Salary[] = [
  mockSalary,
  {
    id: "salary-2",
    employeeId: "employee-1",
    amount: 65_000,
    currency: "INR",
    effectiveDate: "2025-06-01T00:00:00.000Z",
    createdAt: "2025-06-01T00:00:00.000Z",
  },
];
