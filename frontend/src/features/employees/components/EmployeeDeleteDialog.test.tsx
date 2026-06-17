import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as employeeApi from "../../../lib/api/employees";
import { mockEmployee } from "../../../test/mocks/employees";
import { renderWithProviders } from "../../../test/test-utils";
import { EmployeeDeleteDialog } from "./EmployeeDeleteDialog";

vi.mock("../../../lib/api/employees", () => ({
  createEmployee: vi.fn(),
  listEmployees: vi.fn(),
  getEmployee: vi.fn(),
  updateEmployee: vi.fn(),
  deleteEmployee: vi.fn(),
}));

describe("EmployeeDeleteDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("confirmation dialog", () => {
    renderWithProviders(
      <EmployeeDeleteDialog
        employee={mockEmployee}
        open
        onOpenChange={() => undefined}
      />,
    );

    expect(
      screen.getByRole("alertdialog", { name: "Delete employee" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete Jane Doe?"),
    ).toBeInTheDocument();
  });

  it("delete employee", async () => {
    const user = userEvent.setup();
    vi.mocked(employeeApi.deleteEmployee).mockResolvedValue(mockEmployee);

    renderWithProviders(
      <EmployeeDeleteDialog
        employee={mockEmployee}
        open
        onOpenChange={() => undefined}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete employee" }));

    await waitFor(() => {
      expect(employeeApi.deleteEmployee).toHaveBeenCalledWith(mockEmployee.id);
    });
  });

  it("refresh list", async () => {
    const user = userEvent.setup();
    const invalidateQueries = vi.fn().mockResolvedValue(undefined);
    vi.mocked(employeeApi.deleteEmployee).mockResolvedValue(mockEmployee);

    const { queryClient } = renderWithProviders(
      <EmployeeDeleteDialog
        employee={mockEmployee}
        open
        onOpenChange={() => undefined}
      />,
    );

    queryClient.invalidateQueries = invalidateQueries;

    await user.click(screen.getByRole("button", { name: "Delete employee" }));

    await waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: ["employees", "list"],
      });
    });
  });
});
