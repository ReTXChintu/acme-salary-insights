import { Box, Flex, Heading } from "@chakra-ui/react";

import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <Box
      as="header"
      aria-label="Navbar"
      bg="white"
      _dark={{ bg: "gray.900", borderColor: "gray.700" }}
      borderBottomWidth="1px"
      borderColor="gray.200"
      px="6"
      py="4"
    >
      <Flex justify="space-between" align="center" gap="4">
        <Heading as="p" size="md">
          Hello HR Manager
        </Heading>
        <ThemeToggle />
      </Flex>
    </Box>
  );
}
