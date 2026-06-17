import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as employeeApi from "../../../lib/api/employees";
import { mockEmployee, mockEmployeeTwo } from "../../../test/mocks/employees";
import { renderWithProviders } from "../../../test/test-utils";
import { EmployeesPage } from "./EmployeesPage";

vi.mock("../../../lib/api/employees", () => ({
  createEmployee: vi.fn(),
  listEmployees: vi.fn(),
  getEmployee: vi.fn(),
  updateEmployee: vi.fn(),
  deleteEmployee: vi.fn(),
}));

function createPagedEmployees(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    ...mockEmployee,
    id: `employee-${index + 1}`,
    employeeCode: `ACME-${String(index + 1).padStart(3, "0")}`,
    firstName: `Employee${index + 1}`,
    lastName: "Paged",
    email: `employee${index + 1}@acme.example`,
  }));
}

describe("EmployeesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(employeeApi.listEmployees).mockResolvedValue({
      data: [mockEmployee, mockEmployeeTwo],
      total: 2,
    });
  });

  it("renders table", async () => {
    renderWithProviders(<EmployeesPage />);

    expect(await screen.findByLabelText("Employees table")).toBeInTheDocument();
    expect(screen.getByText("ACME-001")).toBeInTheDocument();
    expect(screen.getByText("ACME-002")).toBeInTheDocument();
  });

  it("renders filters", () => {
    renderWithProviders(<EmployeesPage />);

    expect(screen.getByLabelText("Department filter")).toBeInTheDocument();
    expect(screen.getByLabelText("Country filter")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument();
  });

  it("search works", async () => {
    vi.mocked(employeeApi.listEmployees).mockResolvedValue({
      data: [mockEmployee],
      total: 1,
    });

    renderWithProviders(<EmployeesPage />);

    fireEvent.change(screen.getByLabelText("Search employees"), {
      target: { value: "jane" },
    });

    await waitFor(() => {
      expect(employeeApi.listEmployees).toHaveBeenCalledWith(
        expect.objectContaining({
          search: "jane",
          page: 1,
          pageSize: 10,
        }),
      );
    });
  });

  it("filtering works", async () => {
    renderWithProviders(<EmployeesPage />);

    fireEvent.change(screen.getByLabelText("Department filter"), {
      target: { value: "department-engineering" },
    });

    await waitFor(() => {
      expect(employeeApi.listEmployees).toHaveBeenCalledWith(
        expect.objectContaining({
          departmentId: "department-engineering",
          page: 1,
          pageSize: 10,
        }),
      );
    });

    fireEvent.change(screen.getByLabelText("Country filter"), {
      target: { value: "country-india" },
    });

    await waitFor(() => {
      expect(employeeApi.listEmployees).toHaveBeenCalledWith(
        expect.objectContaining({
          countryId: "country-india",
          page: 1,
          pageSize: 10,
        }),
      );
    });
  });

  it("pagination works", async () => {
    const user = userEvent.setup();
    vi.mocked(employeeApi.listEmployees).mockImplementation(async (params = {}) => {
      const page = params.page ?? 1;

      if (page === 1) {
        return {
          data: createPagedEmployees(10),
          total: 15,
        };
      }

      return {
        data: createPagedEmployees(5).map((employee, index) => ({
          ...employee,
          id: `employee-page-2-${index + 1}`,
          employeeCode: `ACME-P2-${String(index + 1).padStart(2, "0")}`,
        })),
        total: 15,
      };
    });

    renderWithProviders(<EmployeesPage />);

    expect(await screen.findByText("ACME-001")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Next page"));

    await waitFor(() => {
      expect(employeeApi.listEmployees).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          pageSize: 10,
        }),
      );
    });

    expect(await screen.findByText("ACME-P2-01")).toBeInTheDocument();
  });
});
