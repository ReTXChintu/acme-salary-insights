import type { Employee, Prisma, PrismaClient } from "../../generated/prisma/client.js";

export type CreateEmployeeData = {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  countryId: string;
};

export type UpdateEmployeeData = Partial<CreateEmployeeData>;

export type ListEmployeesParams = {
  departmentId?: string;
  countryId?: string;
  page?: number;
  pageSize?: number;
};

const ACTIVE_EMPLOYEE_FILTER: Prisma.EmployeeWhereInput = {
  isActive: true,
  deletedAt: null,
};

function matchesSearchQuery(employee: Employee, query: string): boolean {
  const normalizedQuery = query.toLowerCase();
  const searchableValues = [
    employee.firstName,
    employee.lastName,
    employee.employeeCode,
  ];

  return searchableValues.some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  );
}

export class EmployeeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateEmployeeData): Promise<Employee> {
    return this.prisma.employee.create({ data });
  }

  async findActiveById(id: string): Promise<Employee | null> {
    return this.prisma.employee.findFirst({
      where: {
        id,
        ...ACTIVE_EMPLOYEE_FILTER,
      },
    });
  }

  async search(query: string): Promise<Employee[]> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return [];
    }

    const activeEmployees = await this.prisma.employee.findMany({
      where: ACTIVE_EMPLOYEE_FILTER,
      orderBy: { createdAt: "asc" },
    });

    return activeEmployees.filter((employee) =>
      matchesSearchQuery(employee, trimmedQuery),
    );
  }

  async list(
    params: ListEmployeesParams,
  ): Promise<{ data: Employee[]; total: number }> {
    const where: Prisma.EmployeeWhereInput = {
      ...ACTIVE_EMPLOYEE_FILTER,
      ...(params.departmentId ? { departmentId: params.departmentId } : {}),
      ...(params.countryId ? { countryId: params.countryId } : {}),
    };

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "asc" },
      }),
      this.prisma.employee.count({ where }),
    ]);

    return { data, total };
  }

  async update(id: string, data: UpdateEmployeeData): Promise<Employee> {
    return this.prisma.employee.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<Employee> {
    return this.prisma.employee.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });
  }
}
