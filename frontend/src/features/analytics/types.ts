export type AnalyticsSummary = {
  totalPayroll: number;
  averageSalary: number;
  employeesWithSalary: number;
  totalEmployees: number;
  countryCount: number;
  departmentCount: number;
};

export type PayrollByCountryEntry = {
  countryId: string;
  countryName: string;
  total: number;
};

export type PayrollByDepartmentEntry = {
  departmentId: string;
  departmentName: string;
  total: number;
};

export type TopPaidEmployeeEntry = {
  employeeId: string;
  amount: number;
  employeeCode?: string;
  firstName?: string;
  lastName?: string;
};

export type SalaryDistributionEntry = {
  band: string;
  count: number;
};

export type AnalyticsListResponse<T> = {
  data: T[];
};
