import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as employeeApi from "../../../lib/api/employees";
import { mockEmployee } from "../../../test/mocks/employees";
import { renderWithProviders } from "../../../test/test-utils";
import { EmployeeUpdateModal } from "./EmployeeUpdateModal";

vi.mock("../../../lib/api/employees", () => ({
  createEmployee: vi.fn(),
  listEmployees: vi.fn(),
  getEmployee: vi.fn(),
  updateEmployee: vi.fn(),
  deleteEmployee: vi.fn(),
}));

describe("EmployeeUpdateModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("opens modal", () => {
    renderWithProviders(
      <EmployeeUpdateModal
        employee={mockEmployee}
        open
        onOpenChange={() => undefined}
      />,
    );

    expect(
      screen.getByRole("dialog", { name: "Update employee" }),
    ).toBeInTheDocument();
  });

  it("pre-fills employee data", () => {
    renderWithProviders(
      <EmployeeUpdateModal
        employee={mockEmployee}
        open
        onOpenChange={() => undefined}
      />,
    );

    expect(screen.getByLabelText("Employee code")).toHaveValue("ACME-001");
    expect(screen.getByLabelText("First name")).toHaveValue("Jane");
    expect(screen.getByLabelText("Last name")).toHaveValue("Doe");
    expect(screen.getByLabelText("Email")).toHaveValue("jane.doe@acme.example");
    expect(screen.getByLabelText("Department")).toHaveValue(
      "department-engineering",
    );
    expect(screen.getByLabelText("Country")).toHaveValue("country-india");
  });

  it("updates employee", async () => {
    const user = userEvent.setup();
    vi.mocked(employeeApi.updateEmployee).mockResolvedValue({
      ...mockEmployee,
      firstName: "Janet",
    });

    renderWithProviders(
      <EmployeeUpdateModal
        employee={mockEmployee}
        open
        onOpenChange={() => undefined}
      />,
    );

    await user.clear(screen.getByLabelText("First name"));
    await user.type(screen.getByLabelText("First name"), "Janet");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(employeeApi.updateEmployee).toHaveBeenCalledWith(mockEmployee.id, {
        employeeCode: "ACME-001",
        firstName: "Janet",
        lastName: "Doe",
        email: "jane.doe@acme.example",
        departmentId: "department-engineering",
        countryId: "country-india",
      });
    });
  });

  it("closes on success", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    vi.mocked(employeeApi.updateEmployee).mockResolvedValue(mockEmployee);

    renderWithProviders(
      <EmployeeUpdateModal
        employee={mockEmployee}
        open
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
