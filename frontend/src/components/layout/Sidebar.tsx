import { Box, Heading, Stack, Text, type BoxProps } from "@chakra-ui/react";

import { PlaceholderNavLink } from "./AppShell";
import { navigationItems } from "./navigation";
import { ThemeToggle } from "./ThemeToggle";

type SidebarProps = BoxProps;

export function Sidebar(props: SidebarProps) {
  return (
    <Box
      as="aside"
      aria-label="Sidebar"
      display={{ base: "none", md: "flex" }}
      flexDirection="column"
      h="100vh"
      maxH="100vh"
      overflow="hidden"
      flexShrink={0}
      w="64"
      bg="white"
      _dark={{ bg: "gray.900", borderColor: "gray.700" }}
      borderRightWidth="1px"
      borderColor="gray.200"
      px="4"
      py="6"
      {...props}
    >
      <Box flexShrink={0}>
        <Heading as="p" size="md" color="blue.700" _dark={{ color: "blue.300" }}>
          ACME Salary Insights
        </Heading>
        <Text mt="1" fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }}>
          HR Management
        </Text>
      </Box>

      <Stack
        as="nav"
        aria-label="Main navigation"
        gap="1"
        mt="8"
        flex="1"
        minH="0"
        overflowY="auto"
      >
        {navigationItems.map((item) => (
          <PlaceholderNavLink key={item.to} to={item.to}>
            {item.label}
          </PlaceholderNavLink>
        ))}
      </Stack>

      <Box
        flexShrink={0}
        mt="auto"
        pt="4"
        borderTopWidth="1px"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.700" }}
      >
        <ThemeToggle />
      </Box>
    </Box>
  );
}
