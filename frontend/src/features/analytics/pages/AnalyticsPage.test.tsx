import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../test/test-utils";
import { AnalyticsPage } from "./AnalyticsPage";

vi.mock("../hooks/useAnalyticsQueries", () => ({
  useAnalyticsSummaryQuery: vi.fn(),
  usePayrollByCountryQuery: vi.fn(),
  usePayrollByDepartmentQuery: vi.fn(),
  useTopPaidEmployeesQuery: vi.fn(),
  useSalaryDistributionQuery: vi.fn(),
}));

import {
  usePayrollByCountryQuery,
  usePayrollByDepartmentQuery,
  useSalaryDistributionQuery,
  useTopPaidEmployeesQuery,
} from "../hooks/useAnalyticsQueries";

describe("AnalyticsPage", () => {
  it("renders salary distribution bands with counts", async () => {
    vi.mocked(useSalaryDistributionQuery).mockReturnValue({
      data: {
        data: [
          { band: "0-50k", count: 2 },
          { band: "50k-100k", count: 1 },
          { band: "100k-150k", count: 0 },
          { band: "150k-200k", count: 0 },
          { band: "200k+", count: 0 },
        ],
      },
      isLoading: false,
      isError: false,
    } as never);
    vi.mocked(usePayrollByCountryQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);
    vi.mocked(usePayrollByDepartmentQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);
    vi.mocked(useTopPaidEmployeesQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);

    renderWithProviders(<AnalyticsPage />);

    expect(await screen.findByLabelText("Salary distribution")).toBeInTheDocument();
    expect(screen.getByLabelText("Salary distribution chart")).toBeInTheDocument();
  });

  it("renders full payroll by country breakdown", async () => {
    vi.mocked(useSalaryDistributionQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);
    vi.mocked(usePayrollByCountryQuery).mockReturnValue({
      data: {
        data: [{ countryId: "country-india", countryName: "India", total: 120_000 }],
      },
      isLoading: false,
    } as never);
    vi.mocked(usePayrollByDepartmentQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);
    vi.mocked(useTopPaidEmployeesQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);

    renderWithProviders(<AnalyticsPage />);

    expect(await screen.findByLabelText("Payroll by country")).toBeInTheDocument();
    expect(screen.getByLabelText("Payroll by country chart")).toBeInTheDocument();
  });

  it("renders full payroll by department breakdown", async () => {
    vi.mocked(useSalaryDistributionQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);
    vi.mocked(usePayrollByCountryQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);
    vi.mocked(usePayrollByDepartmentQuery).mockReturnValue({
      data: {
        data: [
          {
            departmentId: "department-engineering",
            departmentName: "Engineering",
            total: 90_000,
          },
        ],
      },
      isLoading: false,
    } as never);
    vi.mocked(useTopPaidEmployeesQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);

    renderWithProviders(<AnalyticsPage />);

    expect(await screen.findByLabelText("Payroll by department")).toBeInTheDocument();
    expect(screen.getByLabelText("Payroll by department chart")).toBeInTheDocument();
  });

  it("renders configurable top paid employees list", async () => {
    vi.mocked(useSalaryDistributionQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);
    vi.mocked(usePayrollByCountryQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);
    vi.mocked(usePayrollByDepartmentQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);
    vi.mocked(useTopPaidEmployeesQuery).mockReturnValue({
      data: {
        data: [
          {
            employeeId: "employee-1",
            employeeCode: "ACME-TOP-01",
            firstName: "Jane",
            lastName: "Doe",
            amount: 150_000,
          },
        ],
      },
      isLoading: false,
    } as never);

    renderWithProviders(<AnalyticsPage />);

    expect(await screen.findByLabelText("Top paid employees")).toBeInTheDocument();
    expect(screen.getByText("ACME-TOP-01")).toBeInTheDocument();
  });

  it("renders country comparison table with payroll share", async () => {
    vi.mocked(useSalaryDistributionQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);
    vi.mocked(usePayrollByCountryQuery).mockReturnValue({
      data: {
        data: [
          { countryId: "c1", countryName: "India", total: 75_000 },
          { countryId: "c2", countryName: "USA", total: 25_000 },
        ],
      },
      isLoading: false,
    } as never);
    vi.mocked(usePayrollByDepartmentQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);
    vi.mocked(useTopPaidEmployeesQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);

    renderWithProviders(<AnalyticsPage />);

    expect(await screen.findByLabelText("Country comparison")).toBeInTheDocument();
    expect(screen.getByText("75.0%")).toBeInTheDocument();
    expect(screen.getByText("25.0%")).toBeInTheDocument();
  });

  it("shows loading and error states", async () => {
    vi.mocked(useSalaryDistributionQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as never);
    vi.mocked(usePayrollByCountryQuery).mockReturnValue({ data: undefined, isLoading: true } as never);
    vi.mocked(usePayrollByDepartmentQuery).mockReturnValue({ data: undefined, isLoading: true } as never);
    vi.mocked(useTopPaidEmployeesQuery).mockReturnValue({ data: undefined, isLoading: true } as never);

    const { unmount } = renderWithProviders(<AnalyticsPage />);
    expect(screen.getByText("Loading analytics...")).toBeInTheDocument();
    unmount();

    vi.mocked(useSalaryDistributionQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Analytics unavailable"),
    } as never);
    vi.mocked(usePayrollByCountryQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);
    vi.mocked(usePayrollByDepartmentQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);
    vi.mocked(useTopPaidEmployeesQuery).mockReturnValue({ data: { data: [] }, isLoading: false } as never);

    renderWithProviders(<AnalyticsPage />);
    expect(await screen.findByText("Analytics unavailable")).toBeInTheDocument();
  });
});
