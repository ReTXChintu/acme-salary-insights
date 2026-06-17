import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";

import { BackendWarmupLoader } from "../components/feedback/BackendWarmupLoader";
import { GlobalErrorDisplay } from "../components/feedback/GlobalErrorDisplay";
import { GlobalLoadingIndicator } from "../components/feedback/GlobalLoadingIndicator";
import { hasWarmSessionFlag } from "../hooks/useBackendWarmup";
import { parseApiError } from "../lib/api/parseApiError";
import { ThemeProvider } from "./ThemeProvider";
import { WarmupProvider } from "./WarmupProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  const [globalError, setGlobalError] = useState<string | null>(null);

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
        queryCache: new QueryCache({
          onError: (error) => setGlobalError(parseApiError(error)),
        }),
      }),
    [],
  );

  return (
    <ThemeProvider>
      <ChakraProvider value={defaultSystem}>
        <QueryClientProvider client={queryClient}>
          <WarmupProvider initialWarmingUp={!hasWarmSessionFlag()}>
            <BackendWarmupLoader />
            <GlobalLoadingIndicator />
            {children}
            {globalError ? (
              <GlobalErrorDisplay
                message={globalError}
                onRetry={() => {
                  setGlobalError(null);
                  void queryClient.refetchQueries();
                }}
              />
            ) : null}
          </WarmupProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </ThemeProvider>
  );
}
