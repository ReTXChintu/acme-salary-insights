import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../../test/test-utils";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders sidebar", () => {
    renderWithProviders(<AppShell />);

    expect(screen.getByLabelText("Sidebar")).toBeInTheDocument();
  });

  it("renders navbar", () => {
    renderWithProviders(<AppShell />);

    expect(screen.getByLabelText("Navbar")).toBeInTheDocument();
  });

  it("renders navigation items", () => {
    renderWithProviders(<AppShell />);

    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Employees" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Analytics" })).toBeInTheDocument();
  });

  it("renders branding", () => {
    renderWithProviders(<AppShell />);

    expect(screen.getByText("ACME Salary Insights")).toBeInTheDocument();
  });
});
