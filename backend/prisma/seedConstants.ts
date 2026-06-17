import type { SeedCountry, SeedDepartment } from "./seedTypes";

export const EMPLOYEE_COUNT = 10_000;

export const SEED_DATE = new Date("2026-01-01T00:00:00.000Z");

export const DEPARTMENTS: SeedDepartment[] = [
  { id: "department-engineering", name: "Engineering" },
  { id: "department-product", name: "Product" },
  { id: "department-hr", name: "HR" },
  { id: "department-finance", name: "Finance" },
  { id: "department-sales", name: "Sales" },
];

export const COUNTRIES: SeedCountry[] = [
  { id: "country-india", name: "India", currency: "INR" },
  { id: "country-united-states", name: "United States", currency: "USD" },
  { id: "country-united-kingdom", name: "United Kingdom", currency: "GBP" },
  { id: "country-germany", name: "Germany", currency: "EUR" },
  { id: "country-singapore", name: "Singapore", currency: "SGD" },
];
