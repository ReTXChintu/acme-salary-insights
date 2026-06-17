import type { PrismaClient } from "../../generated/prisma/client.js";

import {
  DuplicateEmailError,
  InvalidCountryError,
  InvalidDepartmentError,
} from "./employee.errors.js";

export async function validateDepartment(
  prisma: PrismaClient,
  departmentId: string,
): Promise<void> {
  const department = await prisma.department.findUnique({
    where: { id: departmentId },
  });

  if (!department) {
    throw new InvalidDepartmentError(departmentId);
  }
}

export async function validateCountry(
  prisma: PrismaClient,
  countryId: string,
): Promise<void> {
  const country = await prisma.country.findUnique({
    where: { id: countryId },
  });

  if (!country) {
    throw new InvalidCountryError(countryId);
  }
}

export async function validateUniqueEmail(
  prisma: PrismaClient,
  email: string,
  excludeEmployeeId?: string,
): Promise<void> {
  const existingEmployee = await prisma.employee.findUnique({
    where: { email },
  });

  if (existingEmployee && existingEmployee.id !== excludeEmployeeId) {
    throw new DuplicateEmailError(email);
  }
}
