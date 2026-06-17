import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

import { GlobalErrorDisplay } from "./GlobalErrorDisplay";

describe("GlobalErrorDisplay", () => {
  function renderDisplay(props: ComponentProps<typeof GlobalErrorDisplay>) {
    return render(
      <ChakraProvider value={defaultSystem}>
        <GlobalErrorDisplay {...props} />
      </ChakraProvider>,
    );
  }

  it("renders user-friendly message when query fails", () => {
    renderDisplay({ message: "Validation failed" });

    expect(screen.getByRole("alert")).toHaveTextContent("Validation failed");
  });

  it("renders retry action", () => {
    const onRetry = vi.fn();

    renderDisplay({ message: "Network error", onRetry });

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("maps API error payload to visible text", () => {
    renderDisplay({ message: "Employee not found" });

    expect(screen.getByText("Employee not found")).toBeInTheDocument();
  });
});
