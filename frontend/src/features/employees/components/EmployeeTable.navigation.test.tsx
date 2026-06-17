import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Route, Routes } from "react-router-dom";

import * as employeeApi from "../../../lib/api/employees";
import * as salaryApi from "../../../lib/api/salaries";
import { mockEmployee } from "../../../test/mocks/employees";
import { renderWithProviders } from "../../../test/test-utils";
import { EmployeeDetailPage } from "../pages/EmployeeDetailPage";
import { EmployeesPage } from "../pages/EmployeesPage";

vi.mock("../../../lib/api/employees", () => ({
  createEmployee: vi.fn(),
  listEmployees: vi.fn(),
  getEmployee: vi.fn(),
  updateEmployee: vi.fn(),
  deleteEmployee: vi.fn(),
}));

vi.mock("../../../lib/api/salaries", () => ({
  listSalaries: vi.fn(),
  createSalary: vi.fn(),
}));

function renderEmployeesApp(initialRoute = "/employees") {
  return renderWithProviders(
    <Routes>
      <Route path="/employees" element={<EmployeesPage />} />
      <Route path="/employees/:id" element={<EmployeeDetailPage />} />
    </Routes>,
    { route: initialRoute },
  );
}

describe("Employee detail navigation", () => {
  it("renders View action in employee table", async () => {
    vi.mocked(employeeApi.listEmployees).mockResolvedValue({
      data: [mockEmployee],
      total: 1,
    });

    renderEmployeesApp();

    expect(await screen.findByRole("button", { name: "View" })).toBeInTheDocument();
  });

  it("clicking View navigates to employee detail page", async () => {
    const user = userEvent.setup();
    vi.mocked(employeeApi.listEmployees).mockResolvedValue({
      data: [mockEmployee],
      total: 1,
    });
    vi.mocked(employeeApi.getEmployee).mockResolvedValue(mockEmployee);
    vi.mocked(salaryApi.listSalaries).mockResolvedValue({ data: [] });

    renderEmployeesApp();

    await user.click(await screen.findByRole("button", { name: "View" }));

    expect(await screen.findByText("Employee Details")).toBeInTheDocument();
  });

  it("passes the correct employee id in route", async () => {
    const user = userEvent.setup();
    vi.mocked(employeeApi.listEmployees).mockResolvedValue({
      data: [mockEmployee],
      total: 1,
    });
    vi.mocked(employeeApi.getEmployee).mockImplementation(async (id) => {
      expect(id).toBe(mockEmployee.id);
      return mockEmployee;
    });
    vi.mocked(salaryApi.listSalaries).mockResolvedValue({ data: [] });

    renderEmployeesApp();

    await user.click(await screen.findByRole("button", { name: "View" }));

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(employeeApi.getEmployee).toHaveBeenCalledWith(mockEmployee.id);
  });
});
