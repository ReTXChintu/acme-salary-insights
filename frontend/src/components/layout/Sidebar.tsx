import { Box, Heading, Stack, Text } from "@chakra-ui/react";

import { PlaceholderNavLink } from "./AppShell";

const navigationItems = [
  { label: "Dashboard", to: "/" },
  { label: "Employees", to: "/employees" },
  { label: "Analytics", to: "/analytics" },
] as const;

export function Sidebar() {
  return (
    <Box
      as="aside"
      aria-label="Sidebar"
      w="64"
      bg="white"
      borderRightWidth="1px"
      borderColor="gray.200"
      px="4"
      py="6"
    >
      <Heading as="p" size="md" color="blue.700">
        ACME Salary Insights
      </Heading>
      <Text mt="1" fontSize="sm" color="gray.500">
        HR Management
      </Text>

      <Stack as="nav" aria-label="Main navigation" gap="1" mt="8">
        {navigationItems.map((item) => (
          <PlaceholderNavLink key={item.to} to={item.to}>
            {item.label}
          </PlaceholderNavLink>
        ))}
      </Stack>
    </Box>
  );
}
