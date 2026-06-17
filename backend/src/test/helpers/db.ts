import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { prisma } from "../../shared/prisma.js";

const backendRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

export const TEST_DATABASE_PATH = path.join(backendRoot, "test.db");

export const TEST_DATABASE_URL = `file:${TEST_DATABASE_PATH}`;

export const TEST_DEPARTMENTS = [
  { id: "department-engineering", name: "Engineering" },
  { id: "department-product", name: "Product" },
  { id: "department-hr", name: "HR" },
  { id: "department-finance", name: "Finance" },
  { id: "department-sales", name: "Sales" },
] as const;

export const TEST_COUNTRIES = [
  { id: "country-india", name: "India", currency: "INR" },
  { id: "country-united-states", name: "United States", currency: "USD" },
  { id: "country-united-kingdom", name: "United Kingdom", currency: "GBP" },
  { id: "country-germany", name: "Germany", currency: "EUR" },
  { id: "country-singapore", name: "Singapore", currency: "SGD" },
] as const;

let isDatabaseInitialized = false;

export function initializeTestDatabase(): void {
  if (isDatabaseInitialized) {
    return;
  }

  process.env.DATABASE_URL = TEST_DATABASE_URL;

  execSync("npx prisma migrate deploy", {
    cwd: backendRoot,
    env: {
      ...process.env,
      DATABASE_URL: TEST_DATABASE_URL,
    },
    stdio: "pipe",
  });

  isDatabaseInitialized = true;
}

export async function resetTestDatabase(): Promise<void> {
  await prisma.$transaction([
    prisma.salary.deleteMany(),
    prisma.employee.deleteMany(),
    prisma.department.deleteMany(),
    prisma.country.deleteMany(),
  ]);
}

export async function seedTestReferenceData(): Promise<void> {
  await prisma.department.createMany({
    data: [...TEST_DEPARTMENTS],
  });

  await prisma.country.createMany({
    data: [...TEST_COUNTRIES],
  });
}

export async function prepareTestDatabase(): Promise<void> {
  initializeTestDatabase();
  await resetTestDatabase();
  await seedTestReferenceData();
}
