import { faker } from "@faker-js/faker";

import { SEED_DATE } from "./seedConstants";
import type { SeedCountry, SeedDepartment, SeedEmployee, SeedSalary } from "./seedTypes";

function formatSequence(sequence: number) {
  return sequence.toString().padStart(5, "0");
}

export function createEmployee(
  index: number,
  department: SeedDepartment,
  country: SeedCountry,
): SeedEmployee {
  const sequence = index + 1;
  const paddedSequence = formatSequence(sequence);

  return {
    id: `employee-${paddedSequence}`,
    employeeCode: `ACME-${paddedSequence}`,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: `employee${sequence}@acme.example`,
    departmentId: department.id,
    countryId: country.id,
    isActive: true,
    deletedAt: null,
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  };
}

export function createSalary(index: number, employee: SeedEmployee, country: SeedCountry): SeedSalary {
  const sequence = index + 1;

  return {
    id: `salary-${formatSequence(sequence)}`,
    employeeId: employee.id,
    amount: faker.number.int({ min: 30_000, max: 250_000 }),
    currency: country.currency,
    effectiveDate: SEED_DATE,
    createdAt: SEED_DATE,
  };
}
