import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Route, Routes } from "react-router-dom";

import * as employeeApi from "../../../lib/api/employees";
import * as salaryApi from "../../../lib/api/salaries";
import { mockEmployee } from "../../../test/mocks/employees";
import { mockSalary } from "../../../test/mocks/salaries";
import { renderWithProviders } from "../../../test/test-utils";
import { EmployeeDetailPage } from "./EmployeeDetailPage";

vi.mock("../../../lib/api/employees", () => ({
  getEmployee: vi.fn(),
}));

vi.mock("../../../lib/api/salaries", () => ({
  listSalaries: vi.fn(),
}));

function renderPage(route = "/employees/employee-1") {
  return renderWithProviders(
    <Routes>
      <Route path="/employees/:id" element={<EmployeeDetailPage />} />
    </Routes>,
    { route },
  );
}

describe("EmployeeDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(employeeApi.getEmployee).mockResolvedValue(mockEmployee);
    vi.mocked(salaryApi.listSalaries).mockResolvedValue({
      data: [mockSalary],
    });
  });

  it("renders employee information", async () => {
    renderPage();

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane.doe@acme.example")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("India")).toBeInTheDocument();
  });

  it("renders current salary", async () => {
    renderPage();

    expect(await screen.findByLabelText("Current salary")).toHaveTextContent(
      "75,000 INR",
    );
  });

  it("renders loading state", () => {
    vi.mocked(employeeApi.getEmployee).mockReturnValue(new Promise(() => {}));
    vi.mocked(salaryApi.listSalaries).mockReturnValue(new Promise(() => {}));

    renderPage();

    expect(screen.getByText("Loading employee details...")).toBeInTheDocument();
  });

  it("renders error state", async () => {
    vi.mocked(employeeApi.getEmployee).mockRejectedValue(
      new Error("Employee not found"),
    );

    renderPage();

    expect(await screen.findByText("Employee not found")).toBeInTheDocument();
  });
});
