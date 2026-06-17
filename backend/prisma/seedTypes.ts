export type SeedCountry = {
  id: string;
  name: string;
  currency: string;
};

export type SeedDepartment = {
  id: string;
  name: string;
};

export type SeedEmployee = {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  countryId: string;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SeedSalary = {
  id: string;
  employeeId: string;
  amount: number;
  currency: string;
  effectiveDate: Date;
  createdAt: Date;
};

export type SeedData = {
  departments: SeedDepartment[];
  countries: SeedCountry[];
  employees: SeedEmployee[];
  salaries: SeedSalary[];
};
