import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../test/test-utils";
import { EmployeeFilters } from "./EmployeeFilters";

describe("EmployeeFilters", () => {
  it("department filter", () => {
    const onDepartmentChange = vi.fn();

    renderWithProviders(
      <EmployeeFilters
        onDepartmentChange={onDepartmentChange}
        onCountryChange={() => undefined}
        onClear={() => undefined}
      />,
    );

    fireEvent.change(screen.getByLabelText("Department filter"), {
      target: { value: "department-engineering" },
    });

    expect(onDepartmentChange).toHaveBeenCalledWith("department-engineering");
  });

  it("country filter", () => {
    const onCountryChange = vi.fn();

    renderWithProviders(
      <EmployeeFilters
        onDepartmentChange={() => undefined}
        onCountryChange={onCountryChange}
        onClear={() => undefined}
      />,
    );

    fireEvent.change(screen.getByLabelText("Country filter"), {
      target: { value: "country-india" },
    });

    expect(onCountryChange).toHaveBeenCalledWith("country-india");
  });

  it("clear filters", () => {
    const onClear = vi.fn();

    renderWithProviders(
      <EmployeeFilters
        departmentId="department-engineering"
        countryId="country-india"
        onDepartmentChange={() => undefined}
        onCountryChange={() => undefined}
        onClear={onClear}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
