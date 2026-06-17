import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { WarmupProvider } from "../../providers/WarmupProvider";
import { BackendWarmupLoader } from "./BackendWarmupLoader";

vi.mock("../../hooks/useBackendWarmup", async () => {
  const actual = await vi.importActual("../../hooks/useBackendWarmup");
  return {
    ...actual,
    pingBackendHealth: vi.fn(),
  };
});

import { pingBackendHealth } from "../../hooks/useBackendWarmup";

describe("BackendWarmupLoader", () => {
  beforeEach(() => {
    vi.mocked(pingBackendHealth).mockReset();
  });

  it("shows full-screen loader on initial app load", () => {
    vi.mocked(pingBackendHealth).mockReturnValue(new Promise(() => {}));

    render(
      <ChakraProvider value={defaultSystem}>
        <WarmupProvider initialWarmingUp>
          <BackendWarmupLoader />
        </WarmupProvider>
      </ChakraProvider>,
    );

    expect(screen.getByLabelText("Backend warmup loader")).toBeInTheDocument();
    expect(screen.getByText("Waking up the backend…")).toBeInTheDocument();
  });

  it("explains Render free tier cold start behavior", () => {
    vi.mocked(pingBackendHealth).mockReturnValue(new Promise(() => {}));

    render(
      <ChakraProvider value={defaultSystem}>
        <WarmupProvider initialWarmingUp>
          <BackendWarmupLoader />
        </WarmupProvider>
      </ChakraProvider>,
    );

    expect(screen.getByText(/Render's free tier/i)).toBeInTheDocument();
    expect(screen.getByText(/50 seconds/i)).toBeInTheDocument();
  });

  it("calls health endpoint and dismisses loader after success", async () => {
    vi.mocked(pingBackendHealth).mockResolvedValue(undefined);

    render(
      <ChakraProvider value={defaultSystem}>
        <WarmupProvider initialWarmingUp>
          <BackendWarmupLoader />
        </WarmupProvider>
      </ChakraProvider>,
    );

    await waitFor(() => {
      expect(pingBackendHealth).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.queryByLabelText("Backend warmup loader"),
      ).not.toBeInTheDocument();
    });
  });

  it("shows retry button if warmup times out", async () => {
    vi.mocked(pingBackendHealth).mockRejectedValue(new Error("timeout"));

    render(
      <ChakraProvider value={defaultSystem}>
        <WarmupProvider initialWarmingUp>
          <BackendWarmupLoader />
        </WarmupProvider>
      </ChakraProvider>,
    );

    expect(await screen.findByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
