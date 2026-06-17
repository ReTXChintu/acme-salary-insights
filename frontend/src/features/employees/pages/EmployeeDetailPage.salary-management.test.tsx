import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Route, Routes } from "react-router-dom";

import * as employeeApi from "../../../lib/api/employees";
import * as salaryApi from "../../../lib/api/salaries";
import { mockEmployee } from "../../../test/mocks/employees";
import { mockSalary } from "../../../test/mocks/salaries";
import { renderWithProviders } from "../../../test/test-utils";
import { EmployeeDetailPage } from "./EmployeeDetailPage";

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

function renderPage(route = "/employees/employee-1") {
  return renderWithProviders(
    <Routes>
      <Route path="/employees/:id" element={<EmployeeDetailPage />} />
    </Routes>,
    { route },
  );
}

describe("Employee detail salary management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(employeeApi.getEmployee).mockResolvedValue(mockEmployee);
    vi.mocked(salaryApi.listSalaries).mockResolvedValue({
      data: [mockSalary],
    });
  });

  it("shows add salary button", async () => {
    renderPage();

    expect(
      await screen.findByRole("button", { name: "Add salary" }),
    ).toBeInTheDocument();
  });

  it("opens add salary modal", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole("button", { name: "Add salary" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Add salary")).toBeInTheDocument();
  });

  it("creates salary record", async () => {
    const user = userEvent.setup();
    vi.mocked(salaryApi.createSalary).mockResolvedValue({
      ...mockSalary,
      id: "salary-new",
      amount: 95_000,
    });

    renderPage();

    await user.click(await screen.findByRole("button", { name: "Add salary" }));
    await user.clear(screen.getByLabelText("Amount"));
    await user.type(screen.getByLabelText("Amount"), "95000");
    await user.click(screen.getByRole("button", { name: "Save salary" }));

    await waitFor(() => {
      expect(salaryApi.createSalary).toHaveBeenCalledWith(
        mockEmployee.id,
        expect.objectContaining({
          amount: 95_000,
          currency: "INR",
        }),
      );
    });
  });

  it("refreshes salary history after create", async () => {
    const user = userEvent.setup();
    vi.mocked(salaryApi.createSalary).mockResolvedValue({
      ...mockSalary,
      id: "salary-new",
      amount: 95_000,
      effectiveDate: "2026-12-01T00:00:00.000Z",
    });
    vi.mocked(salaryApi.listSalaries)
      .mockResolvedValueOnce({ data: [mockSalary] })
      .mockResolvedValueOnce({
        data: [
          {
            ...mockSalary,
            id: "salary-new",
            amount: 95_000,
            effectiveDate: "2026-12-01T00:00:00.000Z",
          },
          mockSalary,
        ],
      });

    renderPage();

    await user.click(await screen.findByRole("button", { name: "Add salary" }));
    await user.clear(screen.getByLabelText("Amount"));
    await user.type(screen.getByLabelText("Amount"), "95000");
    await user.click(screen.getByRole("button", { name: "Save salary" }));

    await waitFor(() => {
      expect(salaryApi.listSalaries).toHaveBeenCalledTimes(2);
    });
  });

  it("updates current salary display", async () => {
    const user = userEvent.setup();
    vi.mocked(salaryApi.createSalary).mockResolvedValue({
      ...mockSalary,
      id: "salary-new",
      amount: 95_000,
      effectiveDate: "2026-12-01T00:00:00.000Z",
    });
    vi.mocked(salaryApi.listSalaries)
      .mockResolvedValueOnce({ data: [mockSalary] })
      .mockResolvedValueOnce({
        data: [
          {
            ...mockSalary,
            id: "salary-new",
            amount: 95_000,
            effectiveDate: "2026-12-01T00:00:00.000Z",
          },
        ],
      });

    renderPage();

    expect(await screen.findByLabelText("Current salary")).toHaveTextContent(
      "75,000 INR",
    );

    await user.click(await screen.findByRole("button", { name: "Add salary" }));
    await user.clear(screen.getByLabelText("Amount"));
    await user.type(screen.getByLabelText("Amount"), "95000");
    await user.click(screen.getByRole("button", { name: "Save salary" }));

    expect(await screen.findByLabelText("Current salary")).toHaveTextContent(
      "95,000 INR",
    );
  });
});
