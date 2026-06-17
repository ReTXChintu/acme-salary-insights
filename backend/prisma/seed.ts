import { pathToFileURL } from "node:url";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { faker } from "@faker-js/faker";

import { PrismaClient } from "../src/generated/prisma/client.js";

import { COUNTRIES, DEPARTMENTS, EMPLOYEE_COUNT } from "./seedConstants";
import { createEmployee, createSalary } from "./seedFactories";
import type { SeedData, SeedEmployee, SeedSalary } from "./seedTypes";

const BATCH_SIZE = 500;

export function generateSeedData(): SeedData {
  faker.seed(42);

  const employees: SeedEmployee[] = [];
  const salaries: SeedSalary[] = [];

  for (let index = 0; index < EMPLOYEE_COUNT; index += 1) {
    const department = DEPARTMENTS[index % DEPARTMENTS.length];
    const country = COUNTRIES[index % COUNTRIES.length];
    const employee = createEmployee(index, department, country);

    employees.push(employee);
    salaries.push(createSalary(index, employee, country));
  }

  return {
    departments: DEPARTMENTS,
    countries: COUNTRIES,
    employees,
    salaries,
  };
}

function createSeedClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL ?? "file:./dev.db";
  const adapter = new PrismaBetterSqlite3({ url: connectionString });

  return new PrismaClient({ adapter });
}

async function createManyBatches<T>(
  items: T[],
  insertBatch: (batch: T[]) => Promise<unknown>,
): Promise<void> {
  for (let index = 0; index < items.length; index += BATCH_SIZE) {
    await insertBatch(items.slice(index, index + BATCH_SIZE));
  }
}

export async function seedDatabase(): Promise<void> {
  const prisma = createSeedClient();
  const seedData = generateSeedData();

  try {
    await prisma.$transaction([
      prisma.salary.deleteMany(),
      prisma.employee.deleteMany(),
      prisma.department.deleteMany(),
      prisma.country.deleteMany(),
    ]);

    await prisma.department.createMany({ data: seedData.departments });
    await prisma.country.createMany({ data: seedData.countries });

    await createManyBatches(seedData.employees, (batch) =>
      prisma.employee.createMany({ data: batch }),
    );

    await createManyBatches(seedData.salaries, (batch) =>
      prisma.salary.createMany({ data: batch }),
    );

    console.log(
      `Seeded ${seedData.departments.length} departments, ${seedData.countries.length} countries, ${seedData.employees.length} employees, and ${seedData.salaries.length} salaries.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

const isMainModule =
  import.meta.url === pathToFileURL(process.argv[1] ?? "").href;

if (isMainModule) {
  await seedDatabase();
}
