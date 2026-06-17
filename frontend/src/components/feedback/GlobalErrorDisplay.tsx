import { Alert, Box, Button } from "@chakra-ui/react";

type GlobalErrorDisplayProps = {
  message: string;
  onRetry?: () => void;
};

export function GlobalErrorDisplay({
  message,
  onRetry,
}: GlobalErrorDisplayProps) {
  return (
    <Box position="fixed" bottom="4" right="4" zIndex="tooltip" maxW="md">
      <Alert.Root status="error" role="alert">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Request failed</Alert.Title>
          <Alert.Description>{message}</Alert.Description>
          {onRetry ? (
            <Button size="sm" mt="3" onClick={onRetry}>
              Retry
            </Button>
          ) : null}
        </Alert.Content>
      </Alert.Root>
    </Box>
  );
}
