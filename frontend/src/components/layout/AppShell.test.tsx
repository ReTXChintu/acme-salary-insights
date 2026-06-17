import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

    const nav = screen.getByLabelText("Main navigation");
    expect(nav).toHaveTextContent("Dashboard");
    expect(nav).toHaveTextContent("Employees");
    expect(nav).toHaveTextContent("Analytics");
  });

  it("renders branding", () => {
    renderWithProviders(<AppShell />);

    expect(screen.getByText("ACME Salary Insights")).toBeInTheDocument();
  });

  it("renders greeting on the right side of the navbar", () => {
    renderWithProviders(<AppShell />);

    expect(screen.getByText("Hello HR Manager")).toBeInTheDocument();
    expect(screen.getByLabelText("Sidebar")).toContainElement(
      screen.getByText("Dark mode"),
    );
  });

  it("opens mobile navigation drawer from navbar menu button", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }));

    renderWithProviders(<AppShell />);

    fireEvent.click(screen.getByRole("button", { name: "Open navigation menu" }));

    await waitFor(() => {
      expect(screen.getByLabelText("Mobile navigation")).toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", { name: "Close navigation menu" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Dark mode").length).toBeGreaterThan(0);

    vi.restoreAllMocks();
  });
});
