import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("analytics API client", () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockReset();
    vi.stubEnv("VITE_API_URL", "http://localhost:3000");
  });

  it("builds correct URLs for each analytics endpoint", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const analytics = await import("./analytics");

    await analytics.getAnalyticsSummary();
    expect(mockFetch.mock.calls[0]?.[0]).toBe(
      "http://localhost:3000/analytics/summary",
    );

    await analytics.getPayrollByCountry();
    expect(mockFetch.mock.calls[1]?.[0]).toBe(
      "http://localhost:3000/analytics/payroll-by-country",
    );

    await analytics.getPayrollByDepartment();
    expect(mockFetch.mock.calls[2]?.[0]).toBe(
      "http://localhost:3000/analytics/payroll-by-department",
    );

    await analytics.getTopPaidEmployees(5);
    expect(mockFetch.mock.calls[3]?.[0]).toBe(
      "http://localhost:3000/analytics/top-paid?limit=5",
    );

    await analytics.getSalaryDistribution();
    expect(mockFetch.mock.calls[4]?.[0]).toBe(
      "http://localhost:3000/analytics/salary-distribution",
    );
  });

  it("parses summary, breakdown, top-paid, and distribution responses", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          totalPayroll: 100_000,
          averageSalary: 50_000,
          employeesWithSalary: 2,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ countryId: "country-india", countryName: "India", total: 100_000 }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              departmentId: "department-engineering",
              departmentName: "Engineering",
              total: 100_000,
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              employeeId: "employee-1",
              amount: 90_000,
              employeeCode: "ACME-001",
              firstName: "Jane",
              lastName: "Doe",
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ band: "0-50k", count: 1 }],
        }),
      });

    const analytics = await import("./analytics");

    await expect(analytics.getAnalyticsSummary()).resolves.toMatchObject({
      totalPayroll: 100_000,
      averageSalary: 50_000,
      employeesWithSalary: 2,
    });

    await expect(analytics.getPayrollByCountry()).resolves.toMatchObject({
      data: [{ countryName: "India", total: 100_000 }],
    });

    await expect(analytics.getPayrollByDepartment()).resolves.toMatchObject({
      data: [{ departmentName: "Engineering", total: 100_000 }],
    });

    await expect(analytics.getTopPaidEmployees()).resolves.toMatchObject({
      data: [{ employeeCode: "ACME-001", amount: 90_000 }],
    });

    await expect(analytics.getSalaryDistribution()).resolves.toMatchObject({
      data: [{ band: "0-50k", count: 1 }],
    });
  });

  it("surfaces API error messages from failed responses", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: "Validation failed" }),
    });

    const analytics = await import("./analytics");

    await expect(analytics.getAnalyticsSummary()).rejects.toThrow(
      "Validation failed",
    );
  });
});
