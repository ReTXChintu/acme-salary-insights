import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../test/test-utils";
import { DashboardPage } from "./DashboardPage";

vi.mock("../../analytics/hooks/useAnalyticsQueries", () => ({
  useAnalyticsSummaryQuery: vi.fn(),
}));

import { useAnalyticsSummaryQuery } from "../../analytics/hooks/useAnalyticsQueries";

const baseSummary = {
  totalPayroll: 250_000,
  averageSalary: 50_000,
  employeesWithSalary: 5,
  totalEmployees: 10_000,
  countryCount: 5,
  departmentCount: 5,
};

describe("DashboardPage summary", () => {
  it("renders total payroll metric", async () => {
    vi.mocked(useAnalyticsSummaryQuery).mockReturnValue({
      data: baseSummary,
      isLoading: false,
      isError: false,
    } as never);

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByLabelText("Total payroll")).toHaveTextContent(
      "2,50,000 INR",
    );
  });

  it("renders average salary metric", async () => {
    vi.mocked(useAnalyticsSummaryQuery).mockReturnValue({
      data: baseSummary,
      isLoading: false,
      isError: false,
    } as never);

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByLabelText("Average salary")).toHaveTextContent(
      "50,000 INR",
    );
  });

  it("renders total employees metric", async () => {
    vi.mocked(useAnalyticsSummaryQuery).mockReturnValue({
      data: baseSummary,
      isLoading: false,
      isError: false,
    } as never);

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByLabelText("Total employees")).toHaveTextContent(
      "10,000",
    );
  });

  it("renders country and department counts", async () => {
    vi.mocked(useAnalyticsSummaryQuery).mockReturnValue({
      data: baseSummary,
      isLoading: false,
      isError: false,
    } as never);

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByLabelText("Countries")).toHaveTextContent("5");
    expect(screen.getByLabelText("Departments")).toHaveTextContent("5");
  });

  it("shows loading state while queries are pending", () => {
    vi.mocked(useAnalyticsSummaryQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as never);

    renderWithProviders(<DashboardPage />);

    expect(screen.getByText("Loading dashboard metrics...")).toBeInTheDocument();
  });
});
