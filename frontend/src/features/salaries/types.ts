export type Salary = {
  id: string;
  employeeId: string;
  amount: number;
  currency: string;
  effectiveDate: string;
  createdAt: string;
};

export type ListSalariesResponse = {
  data: Salary[];
};

export type CreateSalaryInput = {
  amount: number;
  currency: string;
  effectiveDate: string;
};
