export type CurrentSalarySnapshot = {
  employeeId: string;
  departmentId: string;
  countryId: string;
  amount: number;
};

export type PayrollByCountryResult = {
  countryId: string;
  total: number;
};

export type PayrollByDepartmentResult = {
  departmentId: string;
  total: number;
};

export type TopPaidEmployeeResult = {
  employeeId: string;
  amount: number;
};

export type SalaryDistributionBand =
  | "0-50k"
  | "50k-100k"
  | "100k-150k"
  | "150k-200k"
  | "200k+";

export type SalaryDistributionResult = {
  band: SalaryDistributionBand;
  count: number;
};
