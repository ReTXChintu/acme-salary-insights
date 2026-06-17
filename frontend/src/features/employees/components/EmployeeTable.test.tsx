import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { mockEmployee } from "../../../test/mocks/employees";
import { renderWithProviders } from "../../../test/test-utils";
import { EmployeeTable } from "./EmployeeTable";

describe("EmployeeTable", () => {
  it("renders rows", () => {
    renderWithProviders(
      <EmployeeTable
        employees={[mockEmployee]}
        searchValue=""
        onSearchChange={() => undefined}
      />,
    );

    expect(screen.getByText("ACME-001")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane.doe@acme.example")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    renderWithProviders(
      <EmployeeTable
        employees={[]}
        searchValue=""
        onSearchChange={() => undefined}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("No employees found.");
  });

  it("triggers search callback", () => {
    const onSearchChange = vi.fn();

    renderWithProviders(
      <EmployeeTable
        employees={[]}
        searchValue=""
        onSearchChange={onSearchChange}
      />,
    );

    fireEvent.change(screen.getByLabelText("Search employees"), {
      target: { value: "jane" },
    });

    expect(onSearchChange).toHaveBeenCalledWith("jane");
  });
});
