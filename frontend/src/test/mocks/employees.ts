import type { Employee } from "../../features/employees/types";

export const mockEmployee: Employee = {
  id: "employee-1",
  employeeCode: "ACME-001",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@acme.example",
  departmentId: "department-engineering",
  countryId: "country-india",
  isActive: true,
  deletedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

export const mockEmployeeTwo: Employee = {
  id: "employee-2",
  employeeCode: "ACME-002",
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@acme.example",
  departmentId: "department-product",
  countryId: "country-united-states",
  isActive: true,
  deletedAt: null,
  createdAt: "2026-01-02T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
};
