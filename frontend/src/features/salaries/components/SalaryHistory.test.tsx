import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockSalaryHistory } from "../../../test/mocks/salaries";
import { renderWithProviders } from "../../../test/test-utils";
import { SalaryHistory } from "./SalaryHistory";

describe("SalaryHistory", () => {
  it("renders salary history", () => {
    renderWithProviders(<SalaryHistory salaries={mockSalaryHistory} />);

    expect(screen.getByLabelText("Salary history")).toBeInTheDocument();
    expect(screen.getByText("75,000 INR")).toBeInTheDocument();
    expect(screen.getByText("65,000 INR")).toBeInTheDocument();
  });

  it("renders effective dates", () => {
    renderWithProviders(<SalaryHistory salaries={mockSalaryHistory} />);

    expect(screen.getByText("1/1/2026")).toBeInTheDocument();
    expect(screen.getByText("6/1/2025")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    renderWithProviders(<SalaryHistory salaries={[]} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "No salary history available.",
    );
  });
});
