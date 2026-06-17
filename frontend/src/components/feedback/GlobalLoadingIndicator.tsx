import { Box } from "@chakra-ui/react";
import { useIsFetching } from "@tanstack/react-query";

import { useWarmupState } from "../../providers/WarmupProvider";

export function GlobalLoadingIndicator() {
  const { isWarmingUp } = useWarmupState();
  const fetchingCount = useIsFetching();

  if (isWarmingUp || fetchingCount === 0) {
    return null;
  }

  return (
    <Box
      aria-live="polite"
      aria-label="Loading application data"
      position="fixed"
      top="0"
      left="0"
      right="0"
      height="3px"
      bg="blue.500"
      zIndex="tooltip"
      animation="pulse 1.2s ease-in-out infinite"
    />
  );
}
