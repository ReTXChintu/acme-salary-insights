export type Employee = {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  countryId: string;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateEmployeeInput = {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  countryId: string;
};

export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;

export type ListEmployeesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  departmentId?: string;
  countryId?: string;
};

export type ListEmployeesResponse = {
  data: Employee[];
  total: number;
};
