import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as employeeApi from "../../../lib/api/employees";
import { mockEmployee } from "../../../test/mocks/employees";
import { renderWithProviders } from "../../../test/test-utils";
import { EmployeeCreateModal } from "./EmployeeCreateModal";

vi.mock("../../../lib/api/employees", () => ({
  createEmployee: vi.fn(),
  listEmployees: vi.fn(),
  getEmployee: vi.fn(),
  updateEmployee: vi.fn(),
  deleteEmployee: vi.fn(),
}));

describe("EmployeeCreateModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("opens modal", () => {
    renderWithProviders(
      <EmployeeCreateModal open onOpenChange={() => undefined} />,
    );

    expect(
      screen.getByRole("dialog", { name: "Create employee" }),
    ).toBeInTheDocument();
  });

  it("validates form", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <EmployeeCreateModal open onOpenChange={() => undefined} />,
    );

    await user.click(screen.getByRole("button", { name: "Create employee" }));

    expect(await screen.findByText("Employee code is required")).toBeInTheDocument();
    expect(screen.getByText("First name is required")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
  });

  it("creates employee", async () => {
    const user = userEvent.setup();
    vi.mocked(employeeApi.createEmployee).mockResolvedValue(mockEmployee);

    renderWithProviders(
      <EmployeeCreateModal open onOpenChange={() => undefined} />,
    );

    await user.type(screen.getByLabelText("Employee code"), "ACME-010");
    await user.type(screen.getByLabelText("First name"), "New");
    await user.type(screen.getByLabelText("Last name"), "Hire");
    await user.type(screen.getByLabelText("Email"), "new.hire@acme.example");
    await user.selectOptions(screen.getByLabelText("Department"), [
      "department-engineering",
    ]);
    await user.selectOptions(screen.getByLabelText("Country"), ["country-india"]);
    await user.click(screen.getByRole("button", { name: "Create employee" }));

    await waitFor(() => {
      expect(employeeApi.createEmployee).toHaveBeenCalledWith({
        employeeCode: "ACME-010",
        firstName: "New",
        lastName: "Hire",
        email: "new.hire@acme.example",
        departmentId: "department-engineering",
        countryId: "country-india",
      });
    });
  });

  it("closes on success", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    vi.mocked(employeeApi.createEmployee).mockResolvedValue(mockEmployee);

    renderWithProviders(
      <EmployeeCreateModal open onOpenChange={onOpenChange} />,
    );

    await user.type(screen.getByLabelText("Employee code"), "ACME-010");
    await user.type(screen.getByLabelText("First name"), "New");
    await user.type(screen.getByLabelText("Last name"), "Hire");
    await user.type(screen.getByLabelText("Email"), "new.hire@acme.example");
    await user.selectOptions(screen.getByLabelText("Department"), [
      "department-engineering",
    ]);
    await user.selectOptions(screen.getByLabelText("Country"), ["country-india"]);
    await user.click(screen.getByRole("button", { name: "Create employee" }));

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
