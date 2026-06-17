export const DEPARTMENTS = [
  { id: "department-engineering", name: "Engineering" },
  { id: "department-product", name: "Product" },
  { id: "department-hr", name: "HR" },
  { id: "department-finance", name: "Finance" },
  { id: "department-sales", name: "Sales" },
] as const;

export const COUNTRIES = [
  { id: "country-india", name: "India", currency: "INR" },
  { id: "country-united-states", name: "United States", currency: "USD" },
  { id: "country-united-kingdom", name: "United Kingdom", currency: "GBP" },
  { id: "country-germany", name: "Germany", currency: "EUR" },
  { id: "country-singapore", name: "Singapore", currency: "SGD" },
] as const;

export function getDepartmentName(id: string): string {
  return DEPARTMENTS.find((department) => department.id === id)?.name ?? id;
}

export function getCountryName(id: string): string {
  return COUNTRIES.find((country) => country.id === id)?.name ?? id;
}
