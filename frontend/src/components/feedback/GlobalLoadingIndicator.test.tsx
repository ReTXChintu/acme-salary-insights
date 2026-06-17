import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider, useIsFetching } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WarmupProvider } from "../../providers/WarmupProvider";
import { GlobalLoadingIndicator } from "./GlobalLoadingIndicator";

function FetchingProbe() {
  useIsFetching();
  return null;
}

describe("GlobalLoadingIndicator", () => {
  it("renders when React Query reports global fetching activity", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    queryClient.fetchQuery({
      queryKey: ["loading-indicator"],
      queryFn: () => new Promise(() => {}),
    });

    render(
      <ChakraProvider value={defaultSystem}>
        <QueryClientProvider client={queryClient}>
          <WarmupProvider initialWarmingUp={false}>
            <FetchingProbe />
            <GlobalLoadingIndicator />
          </WarmupProvider>
        </QueryClientProvider>
      </ChakraProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByLabelText("Loading application data"),
      ).toBeInTheDocument();
    });
  });

  it("hides when all queries settle", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await queryClient.fetchQuery({
      queryKey: ["loading-indicator-complete"],
      queryFn: async () => "done",
    });

    render(
      <ChakraProvider value={defaultSystem}>
        <QueryClientProvider client={queryClient}>
          <WarmupProvider initialWarmingUp={false}>
            <GlobalLoadingIndicator />
          </WarmupProvider>
        </QueryClientProvider>
      </ChakraProvider>,
    );

    expect(
      screen.queryByLabelText("Loading application data"),
    ).not.toBeInTheDocument();
  });

  it("does not show during backend warmup overlay", () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    queryClient.fetchQuery({
      queryKey: ["loading-indicator-warmup"],
      queryFn: () => new Promise(() => {}),
    });

    render(
      <ChakraProvider value={defaultSystem}>
        <QueryClientProvider client={queryClient}>
          <WarmupProvider initialWarmingUp>
            <FetchingProbe />
            <GlobalLoadingIndicator />
          </WarmupProvider>
        </QueryClientProvider>
      </ChakraProvider>,
    );

    expect(
      screen.queryByLabelText("Loading application data"),
    ).not.toBeInTheDocument();
  });
});
