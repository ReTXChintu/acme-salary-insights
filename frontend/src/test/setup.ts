import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: query.includes("min-width"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

vi.mock("recharts", async (importOriginal) => {
  const original = await importOriginal<typeof import("recharts")>();

  return {
    ...original,
    ResponsiveContainer: ({
      children,
    }: {
      children: React.ReactNode;
    }) =>
      React.createElement(
        "div",
        { style: { width: 400, height: 300 } },
        children,
      ),
  };
});
