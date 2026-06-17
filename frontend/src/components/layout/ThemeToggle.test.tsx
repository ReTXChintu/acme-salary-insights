import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";

import { ThemeProvider } from "../../providers/ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "light";
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  });

  it("renders dark mode switch in sidebar context", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      </ChakraProvider>,
    );

    expect(screen.getByText("Dark mode")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Toggle dark mode" })).toBeInTheDocument();
  });

  it("toggles between light and dark modes", async () => {
    const user = userEvent.setup();

    render(
      <ChakraProvider value={defaultSystem}>
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      </ChakraProvider>,
    );

    await user.click(screen.getByRole("checkbox", { name: "Toggle dark mode" }));

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(screen.getByText("On")).toBeInTheDocument();
  });

  it("persists preference to localStorage", async () => {
    const user = userEvent.setup();

    render(
      <ChakraProvider value={defaultSystem}>
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      </ChakraProvider>,
    );

    await user.click(screen.getByRole("checkbox", { name: "Toggle dark mode" }));

    expect(localStorage.getItem("acme-theme")).toBe("dark");
  });

  it("respects saved preference on first visit when present", () => {
    localStorage.setItem("acme-theme", "dark");

    render(
      <ChakraProvider value={defaultSystem}>
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      </ChakraProvider>,
    );

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
