import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const schema = readFileSync(resolve("prisma/schema.prisma"), "utf8");

function modelBlock(modelName: string) {
  const match = schema.match(new RegExp(`model ${modelName} \\{([\\s\\S]*?)\\n\\}`));

  if (!match) {
    return "";
  }

  return match[1];
}

describe("Prisma schema", () => {
  it("defines Country with its fields and employees relationship", () => {
    const country = modelBlock("Country");

    expect(country).toContain("id");
    expect(country).toContain("name");
    expect(country).toContain("currency");
    expect(country).toContain("employees Employee[]");
  });

  it("defines Department with its fields and employees relationship", () => {
    const department = modelBlock("Department");

    expect(department).toContain("id");
    expect(department).toContain("name");
    expect(department).toContain("employees Employee[]");
  });

  it("defines Employee with required fields and relationships", () => {
    const employee = modelBlock("Employee");

    expect(employee).toContain("id");
    expect(employee).toContain("employeeCode");
    expect(employee).toContain("firstName");
    expect(employee).toContain("lastName");
    expect(employee).toContain("email");
    expect(employee).toContain("departmentId");
    expect(employee).toContain("countryId");
    expect(employee).toContain("isActive");
    expect(employee).toContain("deletedAt");
    expect(employee).toContain("createdAt");
    expect(employee).toContain("updatedAt");
    expect(employee).toContain("department Department");
    expect(employee).toContain("country Country");
    expect(employee).toContain("salaries Salary[]");
  });

  it("defines Salary with required fields and employee relationship", () => {
    const salary = modelBlock("Salary");

    expect(salary).toContain("id");
    expect(salary).toContain("employeeId");
    expect(salary).toContain("amount");
    expect(salary).toContain("currency");
    expect(salary).toContain("effectiveDate");
    expect(salary).toContain("createdAt");
    expect(salary).toContain("employee Employee");
  });
});
