import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import {
  DuplicateEmailError,
  EmployeeNotFoundError,
} from "../../modules/employees/employee.errors.js";

function createTestApp() {
  const app = express();

  app.get("/not-found", () => {
    throw new EmployeeNotFoundError("employee-1");
  });

  app.get("/conflict", () => {
    throw new DuplicateEmailError("duplicate@acme.example");
  });

  app.get("/validation", () => {
    z.object({ name: z.string() }).parse({});
  });

  app.get("/unknown", () => {
    throw new Error("Unexpected failure");
  });

  return app;
}

describe("errorHandler middleware", () => {
  it("maps domain not-found errors to 404 JSON", async () => {
    const { errorHandler } = await import("./errorHandler.js");
    const app = createTestApp();
    app.use(errorHandler);

    const response = await request(app).get("/not-found");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Employee with id "employee-1" not found',
    });
  });

  it("maps duplicate errors to 409", async () => {
    const { errorHandler } = await import("./errorHandler.js");
    const app = createTestApp();
    app.use(errorHandler);

    const response = await request(app).get("/conflict");

    expect(response.status).toBe(409);
    expect(response.body.error).toContain("already exists");
  });

  it("maps validation errors to 400 with details", async () => {
    const { errorHandler } = await import("./errorHandler.js");
    const app = createTestApp();
    app.use(errorHandler);

    const response = await request(app).get("/validation");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");
    expect(response.body.details).toBeDefined();
  });

  it("maps unknown errors to 500 with generic message", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const { errorHandler } = await import("./errorHandler.js");
    const app = createTestApp();
    app.use(errorHandler);

    const response = await request(app).get("/unknown");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal server error");
    expect(response.body.message).toBe("Unexpected failure");
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it("does not leak stack traces in production mode", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.spyOn(console, "error").mockImplementation(() => {});

    const { errorHandler } = await import("./errorHandler.js");
    const app = createTestApp();
    app.use(errorHandler);

    const response = await request(app).get("/unknown");

    expect(response.body.stack).toBeUndefined();
    expect(response.body.message).toBeUndefined();

    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });
});
