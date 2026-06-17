import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { app } from "../../app.js";
import {
  prepareTestDatabase,
  TEST_COUNTRIES,
  TEST_DEPARTMENTS,
} from "../../test/helpers/db.js";

const validEmployeePayload = {
  employeeCode: "ACME-API-01",
  firstName: "Api",
  lastName: "Employee",
  email: "api.employee@acme.example",
  departmentId: TEST_DEPARTMENTS[0].id,
  countryId: TEST_COUNTRIES[0].id,
};

async function createEmployeeViaApi(
  overrides: Partial<typeof validEmployeePayload> = {},
) {
  const response = await request(app)
    .post("/employees")
    .send({
      ...validEmployeePayload,
      ...overrides,
    });

  return response;
}

describe("Employee API", () => {
  beforeEach(async () => {
    await prepareTestDatabase();
  });

  describe("POST /employees", () => {
    it("creates an employee", async () => {
      const response = await createEmployeeViaApi();

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        employeeCode: validEmployeePayload.employeeCode,
        firstName: validEmployeePayload.firstName,
        lastName: validEmployeePayload.lastName,
        email: validEmployeePayload.email,
        departmentId: validEmployeePayload.departmentId,
        countryId: validEmployeePayload.countryId,
        isActive: true,
      });
    });

    it("returns 409 for duplicate email", async () => {
      await createEmployeeViaApi();

      const response = await createEmployeeViaApi({
        employeeCode: "ACME-API-02",
      });

      expect(response.status).toBe(409);
      expect(response.body.error).toContain("already exists");
    });

    it("returns 400 for invalid department", async () => {
      const response = await createEmployeeViaApi({
        departmentId: "missing-department",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Department");
    });

    it("returns 400 for invalid request body", async () => {
      const response = await request(app).post("/employees").send({
        firstName: "Missing Fields",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Validation failed");
    });
  });

  describe("GET /employees/:id", () => {
    it("returns an employee by id", async () => {
      const createdResponse = await createEmployeeViaApi();
      const employeeId = createdResponse.body.id as string;

      const response = await request(app).get(`/employees/${employeeId}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: employeeId,
        email: validEmployeePayload.email,
      });
    });

    it("returns 404 when employee is missing", async () => {
      const response = await request(app).get("/employees/missing-employee-id");

      expect(response.status).toBe(404);
      expect(response.body.error).toContain("not found");
    });
  });

  describe("GET /employees", () => {
    beforeEach(async () => {
      await createEmployeeViaApi({
        employeeCode: "ACME-API-LIST-01",
        firstName: "Alice",
        lastName: "Lister",
        email: "alice.lister@acme.example",
        departmentId: TEST_DEPARTMENTS[0].id,
        countryId: TEST_COUNTRIES[0].id,
      });

      await createEmployeeViaApi({
        employeeCode: "ACME-API-LIST-02",
        firstName: "Bob",
        lastName: "Lister",
        email: "bob.lister@acme.example",
        departmentId: TEST_DEPARTMENTS[1].id,
        countryId: TEST_COUNTRIES[1].id,
      });
    });

    it("lists employees with pagination metadata", async () => {
      const response = await request(app)
        .get("/employees")
        .query({ page: 1, pageSize: 1 });

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(2);
      expect(response.body.data).toHaveLength(1);
    });

    it("filters employees by department", async () => {
      const response = await request(app)
        .get("/employees")
        .query({ departmentId: TEST_DEPARTMENTS[0].id });

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.data[0]?.departmentId).toBe(TEST_DEPARTMENTS[0].id);
    });

    it("searches employees by query", async () => {
      const response = await request(app)
        .get("/employees")
        .query({ search: "alice" });

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.data[0]?.firstName).toBe("Alice");
    });
  });

  describe("PATCH /employees/:id", () => {
    it("updates an employee", async () => {
      const createdResponse = await createEmployeeViaApi();
      const employeeId = createdResponse.body.id as string;

      const response = await request(app)
        .patch(`/employees/${employeeId}`)
        .send({ firstName: "Updated" });

      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe("Updated");
    });

    it("returns 409 for duplicate email", async () => {
      const firstResponse = await createEmployeeViaApi({
        employeeCode: "ACME-API-PATCH-01",
        email: "first.patch@acme.example",
      });

      const secondResponse = await createEmployeeViaApi({
        employeeCode: "ACME-API-PATCH-02",
        email: "second.patch@acme.example",
      });

      const response = await request(app)
        .patch(`/employees/${secondResponse.body.id}`)
        .send({ email: firstResponse.body.email });

      expect(response.status).toBe(409);
    });

    it("returns 404 when employee is missing", async () => {
      const response = await request(app)
        .patch("/employees/missing-employee-id")
        .send({ firstName: "Missing" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /employees/:id", () => {
    it("soft deletes an employee", async () => {
      const createdResponse = await createEmployeeViaApi();
      const employeeId = createdResponse.body.id as string;

      const deleteResponse = await request(app).delete(
        `/employees/${employeeId}`,
      );

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.isActive).toBe(false);
      expect(deleteResponse.body.deletedAt).toBeTruthy();

      const listResponse = await request(app).get("/employees");

      expect(
        listResponse.body.data.some(
          (employee: { id: string }) => employee.id === employeeId,
        ),
      ).toBe(false);
    });

    it("returns 404 when employee is missing", async () => {
      const response = await request(app).delete(
        "/employees/missing-employee-id",
      );

      expect(response.status).toBe(404);
    });
  });
});
