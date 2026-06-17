import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("frontend test setup", () => {
  it("supports jest-dom matchers", () => {
    document.body.innerHTML = "<main>ACME Salary Insights</main>";

    expect(screen.getByText("ACME Salary Insights")).toBeInTheDocument();
  });
});
