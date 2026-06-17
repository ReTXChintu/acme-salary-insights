import { Box, Button, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import {
  markBackendAwake,
  pingBackendHealth,
} from "../../hooks/useBackendWarmup";
import { useWarmupState } from "../../providers/WarmupProvider";

export function BackendWarmupLoader() {
  const { isWarmingUp, completeWarmup } = useWarmupState();
  const [showSlowHint, setShowSlowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isWarmingUp) {
      return;
    }

    const slowHintTimer = window.setTimeout(() => {
      setShowSlowHint(true);
    }, 10_000);

    pingBackendHealth()
      .then(() => {
        markBackendAwake();
        completeWarmup();
      })
      .catch(() => {
        setError("The backend is still waking up. Please retry in a moment.");
      })
      .finally(() => {
        window.clearTimeout(slowHintTimer);
      });

    return () => window.clearTimeout(slowHintTimer);
  }, [completeWarmup, isWarmingUp]);

  if (!isWarmingUp) {
    return null;
  }

  return (
    <Box
      aria-label="Backend warmup loader"
      position="fixed"
      inset="0"
      bg="blackAlpha.700"
      zIndex="modal"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px="6"
    >
      <Stack
        gap="4"
        bg="white"
        _dark={{ bg: "gray.900" }}
        borderRadius="xl"
        p="8"
        maxW="lg"
        textAlign="center"
        boxShadow="xl"
      >
        <Spinner size="lg" />
        <Heading size="md">Waking up the backend…</Heading>
        <Text color="gray.600" _dark={{ color: "gray.300" }}>
          This app runs on Render&apos;s free tier. The server sleeps after
          inactivity, so the first request can take up to 50 seconds. Thanks
          for your patience.
        </Text>
        {showSlowHint ? (
          <Text fontSize="sm" color="gray.500">
            Still connecting — large cold starts can take close to a minute.
          </Text>
        ) : null}
        {error ? (
          <>
            <Text color="red.500" role="alert">
              {error}
            </Text>
            <Button
              onClick={() => {
                setError(null);
                setShowSlowHint(false);
                pingBackendHealth()
                  .then(() => {
                    markBackendAwake();
                    completeWarmup();
                  })
                  .catch(() => {
                    setError(
                      "The backend is still waking up. Please retry in a moment.",
                    );
                  });
              }}
            >
              Retry
            </Button>
          </>
        ) : null}
      </Stack>
    </Box>
  );
}
