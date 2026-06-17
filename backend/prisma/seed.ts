import { pathToFileURL } from "node:url";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { faker } from "@faker-js/faker";

import { PrismaClient } from "../src/generated/prisma/client.js";

type SeedCountry = {
  id: string;
  name: string;
  currency: string;
};

type SeedDepartment = {
  id: string;
  name: string;
};

type SeedEmployee = {
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

type SeedSalary = {
  id: string;
  employeeId: string;
  amount: number;
  currency: string;
  effectiveDate: Date;
  createdAt: Date;
};

type SeedData = {
  departments: SeedDepartment[];
  countries: SeedCountry[];
  employees: SeedEmployee[];
  salaries: SeedSalary[];
};

const EMPLOYEE_COUNT = 10_000;
const seedDate = new Date("2026-01-01T00:00:00.000Z");

const departments: SeedDepartment[] = [
  { id: "department-engineering", name: "Engineering" },
  { id: "department-product", name: "Product" },
  { id: "department-hr", name: "HR" },
  { id: "department-finance", name: "Finance" },
  { id: "department-sales", name: "Sales" },
];

const countries: SeedCountry[] = [
  { id: "country-india", name: "India", currency: "INR" },
  { id: "country-united-states", name: "United States", currency: "USD" },
  { id: "country-united-kingdom", name: "United Kingdom", currency: "GBP" },
  { id: "country-germany", name: "Germany", currency: "EUR" },
  { id: "country-singapore", name: "Singapore", currency: "SGD" },
];

export function generateSeedData(): SeedData {
  faker.seed(42);

  const employees: SeedEmployee[] = [];
  const salaries: SeedSalary[] = [];

  for (let index = 0; index < EMPLOYEE_COUNT; index += 1) {
    const sequence = index + 1;
    const department = departments[index % departments.length];
    const country = countries[index % countries.length];
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const employeeId = `employee-${sequence.toString().padStart(5, "0")}`;

    employees.push({
      id: employeeId,
      employeeCode: `ACME-${sequence.toString().padStart(5, "0")}`,
      firstName,
      lastName,
      email: `employee${sequence}@acme.example`,
      departmentId: department.id,
      countryId: country.id,
      isActive: true,
      deletedAt: null,
      createdAt: seedDate,
      updatedAt: seedDate,
    });

    salaries.push({
      id: `salary-${sequence.toString().padStart(5, "0")}`,
      employeeId,
      amount: faker.number.int({ min: 30_000, max: 250_000 }),
      currency: country.currency,
      effectiveDate: seedDate,
      createdAt: seedDate,
    });
  }

  return {
    departments,
    countries,
    employees,
    salaries,
  };
}

const BATCH_SIZE = 500;

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
