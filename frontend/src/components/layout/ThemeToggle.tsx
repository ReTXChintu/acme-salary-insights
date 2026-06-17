import { Flex, Switch, Text } from "@chakra-ui/react";

import { useThemeMode } from "../../providers/ThemeProvider";

export function ThemeToggle() {
  const { colorMode, setColorMode } = useThemeMode();
  const isDark = colorMode === "dark";

  return (
    <Flex align="center" justify="space-between" gap="3" w="full">
      <Text fontSize="sm" fontWeight="medium">
        Dark mode
      </Text>
      <Flex align="center" gap="2">
        <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
          {isDark ? "On" : "Off"}
        </Text>
        <Switch.Root
          checked={isDark}
          onCheckedChange={(details) =>
            setColorMode(details.checked ? "dark" : "light")
          }
          aria-label="Toggle dark mode"
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>
      </Flex>
    </Flex>
  );
}
